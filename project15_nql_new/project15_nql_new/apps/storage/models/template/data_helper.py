from apps.storage.docs.data import DataContent, DataFieldContainer, DataFieldTableRow, DataFieldTable
from apps.storage.models.file import FileUsage, DataContentFile, DataContentImage, ImageUsage
from apps.storage.models.data import DataMeta, DataMetaFieldEnum
from mgedata.errors.models import MGEError
from django.db import transaction
from django.utils.translation import gettext as _

from apps.storage.models.template.rollback_helper import RollBackHelper
from django.conf import settings
from apps.storage.utils.encrypt import Prpcrypt


class DataHelper(object):

    def __init__(self, template):
        self._template = template
        self.file_path_list = []
        self.image_path_list = []
        self.image_usage_list = []
        self.file_usage_list = []

    # template Template 对象 因存在循环引用所以无法显示的申明
    @RollBackHelper.rollback_task
    def add_data(self, meta_dict: dict, content_dict: dict, upload_username: str,
                 importing=False, check_uploaded_files=False) -> DataMeta:

        data_meta = self._create_data_meta(meta_dict=meta_dict, upload_username=upload_username)
        data_meta.check_source()
        self._create_data_content(data_meta=data_meta, content_dict=content_dict)

        if check_uploaded_files is True:
            self._do_check_files()

        self._append_file_usage_list(data_meta=data_meta)
        with transaction.atomic():
            FileUsage.objects.bulk_create(self.file_usage_list)
            ImageUsage.objects.bulk_create(self.image_usage_list)
            if not importing:
                data_meta.importing = False
                data_meta.save()
        return data_meta

    @RollBackHelper.rollback_task
    def modify_data(self, meta: DataMeta, meta_dict: dict, content_dict: dict, only_content) -> DataMeta:
        if not only_content:
            self._enrich_data_meta(data_meta=meta, meta_dict=meta_dict)

        old_content_id = meta.dc_id
        meta.dc_id = RollBackHelper.generate_object_id_for(DataContent.__class__)
        old_containers = [x.pk for x in DataFieldContainer.objects(_meta_id=meta.id).only('pk')]
        old_tables = [x.pk for x in DataFieldTable.objects(_meta_id=meta.id).only('pk')]
        old_table_rows = [x.pk for x in DataFieldTableRow.objects(_meta_id=meta.id).only('pk')]

        self._create_data_content(data_meta=meta, content_dict=content_dict)
        self._do_check_files()
        self._append_file_usage_list(data_meta=meta)

        with transaction.atomic():
            FileUsage.objects.filter(meta=meta).delete()
            ImageUsage.objects.filter(meta=meta).delete()
            FileUsage.objects.bulk_create(self.file_usage_list)
            ImageUsage.objects.bulk_create(self.image_usage_list)
            meta.save()
        DataFieldContainer.objects(pk__in=old_containers).delete()
        DataFieldTable.objects(pk__in=old_tables).delete()
        DataFieldTableRow.objects(pk__in=old_table_rows).delete()
        DataContent.objects(pk=old_content_id).delete()
        return meta

    def _create_data_meta(self, meta_dict: dict, upload_username: str) -> DataMeta:
        """
        创建数据元数据的方法，流程为先创建包含基本信息的meta，然后DataMetaFieldEnum中含有的字段将meta信息填充
        public : 是否公开到服务器上，若为False则存为私有空间，只有用户自身可以查看（目前实现不严格，若知道数据id可以直接通过api访问
                且不同步到ES，public后同步到ES搜索。
        :param meta_dict: 输入的元数据字典
        :param upload_username: 上传用户名
        :return: DataMeta
        """
        public = meta_dict.get('public', True)
        meta_instance = DataMeta(template=self._template, category_id=self._template.category_id,
                                 user_id=upload_username, is_public=public,
                                 importing=True)
        self._enrich_data_meta(data_meta=meta_instance, meta_dict=meta_dict)
        meta_instance.dc_id = RollBackHelper.generate_object_id_for(DataContent.__class__)  # 为数据生成oid
        meta_instance.save()  # 暂时保存元数据
        RollBackHelper.set_data_meta_id(meta_instance.id)
        return meta_instance

    @staticmethod
    def _enrich_data_meta(data_meta: DataMeta, meta_dict: dict):
        for data_meta_field in DataMetaFieldEnum.reader_iterator():
            field_value = data_meta_field.get_value_from_dict(meta_dict)
            data_meta.__setattr__(data_meta_field.field_raw_name, field_value)

    def _create_data_content(self, data_meta, content_dict):
        data_content = DataContent(pk=data_meta.dc_id, _tid=self._template.id, _meta_id=data_meta.id)

        # 加密
        template_title = data_meta.template.title
        data_meta_institution = str(hash(data_meta.institution))
        if hasattr(settings, 'ENCRYPTED_TEMPLATES') and template_title in settings.ENCRYPTED_TEMPLATES:
            encrypted_or_not = Prpcrypt(key=data_meta_institution)
        else:
            encrypted_or_not = False

        for field in self._template.fields:
            v = self._add_field(field_meta=field, value=content_dict.get(field.field_name),
                                parent_oid=data_meta.dc_id, data_meta_id=data_meta.id,
                                encrypted_or_not=encrypted_or_not)
            if v is None:
                continue
            data_content[field.field_name] = v

        RollBackHelper.set_data_content_id(oid=data_content.id)
        data_content.save()

    def _do_check_files(self):
        files_in_store = [x.file.name for x in DataContentFile.objects.filter(file__in=self.file_path_list)]
        images_in_store = [x.file.name for x in DataContentImage.objects.filter(file__in=self.image_path_list)]
        diff = (set(self.file_path_list) | set(self.image_path_list)) - (set(files_in_store) | set(images_in_store))
        if len(diff) > 0:
            raise MGEError.UPLOADED_FILE_NOT_FOUND(
                _('Cannot find file "%(file)s"') % {'file': ', '.join(str(x) for x in diff)})
        return

    def _append_file_usage_list(self, data_meta: DataMeta):
        if self.image_path_list:
            for image in DataContentImage.objects.filter(file__in=self.image_path_list):
                self.image_usage_list.append(ImageUsage(meta=data_meta, file=image))

        if self.file_path_list:
            for file in DataContentFile.objects.filter(file__in=self.file_path_list):
                self.file_usage_list.append(FileUsage(meta=data_meta, file=file))

        return

    # field_meta: TemplateField 因为存在循环引用无法显示的申明
    def _add_field(self, field_meta, value, parent_oid, data_meta_id, encrypted_or_not,
                   element_num=None, make_root_owner=False, root_owner_id=None):
        """
        添加某个字段的数据
        :param field_meta: 字段元数据
        :param value: 字段的值
        :param parent_oid: 父字段（容器、表格行等）的oid
        :return: None
        """

        def _get_field_type():
            return field_meta.field_type

        if value is None:
            if field_meta.required and (field_meta.parent_field is None or (
                    field_meta.parent_field is not None and not field_meta.parent_field.field_type.is_generator)):
                raise MGEError.BAD_DATA(_('field "%(field_name)s" is missing') % {'field_name': field_meta.field_name})

            else:
                return
        if _get_field_type().is_container or _get_field_type().is_generator:
            return self._add_container(field_meta=field_meta, value=value, parent_oid=parent_oid,
                                       data_meta_id=data_meta_id, element_num=element_num,
                                       make_root_owner=make_root_owner, root_owner_id=root_owner_id,
                                       encrypted_or_not=encrypted_or_not)
        elif _get_field_type().is_table:
            return self._add_table(field_meta=field_meta, value=value, parent_oid=parent_oid, data_meta_id=data_meta_id,
                                   element_num=element_num, root_owner_id=root_owner_id,
                                   encrypted_or_not=encrypted_or_not)
        elif _get_field_type().is_array:
            return self._add_array(field_meta=field_meta, value=value, parent_oid=parent_oid, data_meta_id=data_meta_id,
                                   encrypted_or_not=encrypted_or_not)
        elif _get_field_type().is_image:
            return self._add_image(value=value)
        elif _get_field_type().is_file:
            return self._add_file(value=value)
        else:
            # 加密（文件和图片地址没有加密）
            if encrypted_or_not is not False:
                value = encrypted_or_not.encrypt(value)
            return value

    def _add_container(self, field_meta, value, parent_oid, data_meta_id, element_num=None, make_root_owner=False,
                       root_owner_id=None, encrypted_or_not=False):
        if not isinstance(value, dict):
            pass  # TODO 报错
        oid = RollBackHelper.generate_object_id_for(field_type=DataFieldContainer.__class__)

        container = DataFieldContainer(pk=oid, _owner_id=parent_oid,
                                       _path=field_meta.field_path_str, _meta_id=data_meta_id,
                                       _tid=self._template.id)

        if element_num:
            container._element_num = element_num
        if root_owner_id:
            container._root_owner_id = root_owner_id
        root_owner_id = root_owner_id or (oid if make_root_owner else None)
        for sub_field in field_meta.sub_fields:
            sub_value = self._add_field(sub_field, value.get(sub_field.field_name), oid, data_meta_id,
                                        element_num=element_num,
                                        root_owner_id=root_owner_id, encrypted_or_not=encrypted_or_not)
            if sub_value is not None:
                container[sub_field.field_name] = sub_value

        container.save()
        return container.id

    def _add_table(self, field_meta, value, parent_oid, data_meta_id, element_num=None,
                   root_owner_id=None, encrypted_or_not=False):
        if not isinstance(value, list):
            pass  # TODO 报错
        oid = RollBackHelper.generate_object_id_for(DataFieldTable.__class__)
        table_row_ids = []
        row_count = 0
        for row_dict in value:
            row_count += 1
            sub_oid = RollBackHelper.generate_object_id_for(DataFieldTableRow.__class__)
            if not isinstance(row_dict, dict):
                pass
            table_row = DataFieldTableRow(pk=sub_oid, _owner_id=oid,
                                          _path=field_meta.field_path_str, _meta_id=data_meta_id,
                                          _tid=self._template.id, _row_num=row_count)
            if element_num:
                table_row._element_num = element_num
            if root_owner_id:
                table_row._root_owner_id = root_owner_id
            for header in field_meta.sub_fields:
                sub_value = self._add_field(header, row_dict.get(header.field_name), sub_oid, data_meta_id,
                                            root_owner_id=root_owner_id, encrypted_or_not=encrypted_or_not)
                if sub_value is not None:
                    table_row[header.field_name] = sub_value
            table_row.save()
            table_row_ids.append(sub_oid)

        table = DataFieldTable(pk=oid, _owner_id=parent_oid, _path=field_meta.field_path_str,
                               _meta_id=data_meta_id, _tid=self._template.id, rows=table_row_ids,
                               row_count=len(table_row_ids))
        if element_num:
            table._element_num = element_num
        if root_owner_id:
            table._root_owner_id = root_owner_id
        table.save()
        return table.id

    def _add_array(self, field_meta, value, parent_oid, data_meta_id, encrypted_or_not=False):
        if not isinstance(value, list):
            pass
        value_list = []
        element_meta = field_meta.element_field
        for index, element_value in enumerate(value):
            val = self._add_field(element_meta, element_value, parent_oid, data_meta_id, element_num=index + 1,
                                  make_root_owner=True, encrypted_or_not=encrypted_or_not)
            if val is not None:
                value_list.append(val)
        return value_list

    def _add_image(self, value):
        if not isinstance(value, list):
            return
        new_value = []
        for path in value:
            path = path.strip()
            if path.startswith(settings.MEDIA_URL):
                path = path[len(settings.MEDIA_URL):]
            self.image_path_list.append(path)
            new_value.append(path)
        return new_value

    def _add_file(self, value):
        if not isinstance(value, list):
            return
        new_value = []
        for path in value:
            path = path.strip()
            if path.startswith(settings.MEDIA_URL):
                path = path[len(settings.MEDIA_URL):]
            self.file_path_list.append(path)
            new_value.append(path)
        return new_value
