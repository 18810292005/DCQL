# -*- coding: utf-8 -*-

# @File   : new_json
# @Author : Harold Chen
# @Date   : 2018/3/19
import decimal
import json
import random
import re
import shutil
import string
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils.translation import gettext as _
from mongoengine import DoesNotExist

from apps.storage.docs.data import *
from apps.storage.models.data import DataMetaFieldEnum, DataMeta, DATA_VISIBILITY_NAME_MAP
from apps.storage.models.file import (DataContentImage, DataContentFile)
from apps.storage.models.template import Template, TemplateField, TemplateFieldEnum
from .common import *

FILE_REGEX = re.compile(r'"(_fs/data_files/[0-9]{4}/[0-9]{2}/[0-9]{2}/([^"]+))"')
IMAGE_REGEX = re.compile(r'"(_fs/data_images/[0-9]{4}/[0-9]{2}/[0-9]{2}/([^"]+))"')


class JSONFieldSerializer(FieldSerializer):

    def __init__(self, absolute_file_path=False, decompose_range=True, to_url=True):
        super().__init__()
        self.absolute_file_path = absolute_file_path
        self.to_url = to_url
        self.decompose_range = decompose_range

    def serialize_field(self, mongo_value, field_meta, meta_id):
        if mongo_value is None:
            return None
        t = field_meta.field_type
        if t.is_string:
            return str(mongo_value)
        elif t.is_number:
            return mongo_value
        elif t.is_range:
            field_type = field_meta.field_type
            if field_type.is_range_interval(field_meta.range_type):
                lb = mongo_value.get('lb', '-∞')
                ub = mongo_value.get('ub', '+∞')
                if self.decompose_range:
                    return {'lb': lb, 'ub': ub}
                return f'({lb}, {ub})'
            else:
                err = mongo_value.get('err', '?')
                val = mongo_value.get('val', '?')
                if self.decompose_range:
                    return {'val': val, 'err': err}
                return f'{val}±{err}'
        elif t.is_image or t.is_file:
            return self.serialize_image_file(mongo_value, meta_id)
        elif t.is_choice:
            return str(mongo_value)

    def serialize_image_file(self, mongo_value, meta_id):
        if self.to_url:
            if not isinstance(mongo_value, list):
                mongo_value = [mongo_value]
            if self.absolute_file_path:
                return [settings.SITE_ADDR +
                        (settings.MEDIA_URL if not x.startswith('/api/') else '') + x for x in mongo_value]
            return [
                (settings.MEDIA_URL if not x.startswith('/api/') and not x.startswith(settings.MEDIA_URL) else '') + x
                for x in mongo_value]

        return super(JSONFieldSerializer, self).serialize_image_file(mongo_value, meta_id)


class JSONFieldParser(FieldParser):

    def parse_field(self, field_meta: TemplateField, raw_value):
        if raw_value is None:
            if field_meta.required:
                raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
            return None
        else:
            return super().parse_field(field_meta, raw_value)

    def parse_string(self, field_meta, raw_value: str):
        if not isinstance(raw_value, str):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(raw_value), o2=field_meta.field_type.description,
                               o3=field_meta.external_field_path_str)
        return raw_value

    def parse_number(self, field_meta, raw_value: float):
        try:
            return float(Decimal(raw_value))
        except (TypeError, ValueError, decimal.InvalidOperation):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(raw_value), o2=field_meta.field_type.description,
                               o3=field_meta.external_field_path_str)

    def parse_range(self, field_meta, raw_value: str):
        if TemplateFieldEnum.is_range_error(field_meta.range_type):
            try:
                err_data = raw_value.split('±')
                val = float(Decimal(err_data[0]))
                err = float(Decimal(err_data[1]))
                return {'val': val, 'err': err}
            except (IndexError, AttributeError, TypeError, ValueError, decimal.InvalidOperation):
                raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(raw_value),
                                   o2=_("Error Type"), o3=field_meta.external_field_path_str)
        else:
            try:
                trimmed = raw_value[1:-1]
                bounds = trimmed.split(',')
                return {'lb': float(Decimal(bounds[0])), 'ub': float(Decimal(bounds[1]))}
            except (IndexError, AttributeError, TypeError, ValueError, InvalidOperation):
                raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(raw_value),
                                   o2=_("Interval Type"), o3=field_meta.external_field_path_str)

    def parse_file_image(self, field_meta, raw_value: list):
        path_list = raw_value
        url_list = []
        for path in path_list:
            if path is None or path.strip() == '':
                raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
            if self._is_api:  # 如果是API调用 文件字段值已经是path 只需要检查是否存在即可
                url = path
            else:
                url = self.parse_single_file_or_image(field_meta, path.strip())
            if url is not None:
                url_list.append(url)
        if len(url_list) == 0:
            if field_meta.required:
                raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
        elif len(url_list) > 1 and not field_meta.has_multiple_files:
            raise ParsingError(ParsingErrorEnum.EXCESSIVE_FILES_OR_IMAGES, o1=field_meta.field_path_str)
        return url_list

    def parse_choice(self, field_meta, raw_value: str):
        choices = field_meta.choices_list
        if raw_value not in choices:
            raise ParsingError(ParsingErrorEnum.INVALID_CHOICE_VALUE, o1=raw_value,
                               o2=', '.join(choices))
        return raw_value


class JSONHandler(DataHandler):

    def __init__(self, mode: DataMode, template: Template = None, no_attachments=False, verify_only=False,
                 is_api=False):
        super().__init__(mode, template, no_attachments, verify_only)
        self._is_api = is_api
        self._content_to_save = None
        self._template = template
        self._serializer = JSONFieldSerializer(to_url=False)
        if mode == DataMode.WRITE or mode == DataMode.TEMPLATE:
            if template is None:
                raise ValueError(f'A template must be provided in {self._mode.description} mode.')
            self._load_template(template)

    def _load_template(self, template: Template):
        self._content_to_save = {'template': template.dict_for_export, 'data': []}

    def _meta_to_dict(self, data_meta, with_none):
        meta_body = {}
        for field in DataMetaFieldEnum.writer_iterator(with_id=True):
            value = field.get_value(data_meta)
            if (value is None or getattr(value, '__len__',
                                         int)() == 0) and field != DataMetaFieldEnum.DATA_ID and not with_none:
                continue
            meta_body[field.description] = value
        return meta_body

    def _data_to_dict(self, data_meta: DataMeta, with_none, absolute_file_path, decompose_range, to_url):
        self._serializer.absolute_file_path = absolute_file_path
        self._serializer.decompose_range = decompose_range
        self._serializer.to_url = to_url

        try:
            content = DataContent.objects.get(pk=data_meta.dc_id)
        except DoesNotExist:
            raise MGEError.DATA_INCONSISTENCY("数据内容不存在")

        json_str = json.dumps(content.data, ensure_ascii=False)
        MEDIA_URL_PREFIX = settings.MEDIA_URL
        json_str = json_str.replace('"_fs/data_images/', f'"{MEDIA_URL_PREFIX}_fs/data_images/')
        json_str = json_str.replace('"_fs/data_files/', f'"{MEDIA_URL_PREFIX}_fs/data_files/')
        return json.loads(json_str)

    def write_data(self, data_meta: DataMeta, with_none=False):
        if self._mode != DataMode.WRITE:
            raise ValueError(f"Cannot write XML in {self._mode.description} mode.")
        if not isinstance(data_meta, DataMeta):
            raise ValueError("data_meta should be an instance of DataMeta")
        if data_meta.template_id != self._template.id:
            raise ValueError(f'Data\'s tid should be "{self._template.id}", got "{data_meta.template_id}" instead')

        meta_body = self._meta_to_dict(data_meta, with_none)

        try:
            content = DataContent.objects.get(pk=data_meta.dc_id)
        except DoesNotExist:
            content = {}  # TODO 找不到
        json_dict = {}
        fields = [field.field_name for field in self._template.fields]
        for key in content.data.keys():
            if key in fields:
                json_dict[key] = content.data[key]
        json_str = json.dumps(json_dict, ensure_ascii=False)
        files = list(FILE_REGEX.findall(json_str)) + list(IMAGE_REGEX.findall(json_str))
        for path, filename in files:
            self._serializer.filenames.append((os.path.join(settings.MEDIA_ROOT, path), filename))
            json_str = json_str.replace(path, filename)
        content_body = json.loads(json_str)
        self._content_to_save['data'].append({'meta': meta_body, 'content': content_body})

    def read_data(self, path_or_fp, uploaded_by: str, file_dir=None,
                  progress_handler: Callable[[float, bool], None] = None):
        if self._mode != DataMode.READ:
            raise ValueError(f"Cannot read JSON in {self._mode.description} mode.")
        if self._parser is None:
            self._parser = JSONFieldParser(uploaded_by, file_dir, verify_only=self._verify_only)
        parser = self._parser
        parser._is_api = self._is_api
        current_path_str = ""
        total_count = 0
        current_count = 0
        current_meta_id = 0

        def _read_field(field_meta: TemplateField, field_value):
            """
            读取某个字段的值
            :param field_meta: 字段meta
            :return: 字段的json值
            """
            nonlocal current_path_str
            current_path_str = field_meta.external_field_path_str
            t = field_meta.field_type
            if field_value in (None, [None], [], [""]):
                if field_meta.required:
                    raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)
                return None

            if t.is_array or t.is_table or t.is_file or t.is_image:
                if not isinstance(field_value, list):
                    raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                                       o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
                if len(field_value) == 0:
                    if field_meta.required:
                        raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)

            elif t.is_container or t.is_generator:
                if not isinstance(field_value, dict):
                    raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                                       o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
                if len(field_value) == 0:
                    if field_meta.required:
                        raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)

            if t.is_container:
                raw_value = {}
                for sub_field in field_meta.sub_fields:
                    raw_value[sub_field.field_name] = _read_field(sub_field, field_value.get(sub_field.field_name))
            elif t.is_array:
                raw_value = []
                for raw_element in field_value:
                    v = _read_field(field_meta.element_field, raw_element)
                    if v is not None:
                        raw_value.append(v)
            elif t.is_table:
                raw_value = []
                for row in field_value:
                    raw_value.append({})
                    for header in field_meta.sub_fields:
                        raw_value[-1][header.field_name] = _read_field(header, row.get(header.field_name))
            elif t.is_generator:
                raw_value = None
                try:
                    selected_field = list(field_value.keys())[0]
                    try:
                        v = _read_field(field_meta[selected_field], field_value[selected_field])
                    except KeyError:
                        raise ParsingError(ParsingErrorEnum.UNKNOWN_FIELD, o1=selected_field)
                    if v is not None:
                        raw_value = {selected_field: v}
                except IndexError:
                    raw_value = None

            else:
                raw_value = parser.parse_field(field_meta, field_value)
            return raw_value

        def _read_data(data_json):
            nonlocal current_count, total_count
            data = {}
            for field in template.fields:
                data[field.field_name] = _read_field(field, data_json.get(field.field_name))
            current_count += 1
            if progress_handler:
                if current_count % 3 == 0:
                    # 每3条数据更新一次进度
                    progress_handler(current_count / total_count)
            return data

        def _read_meta(meta_json):
            nonlocal current_meta_id
            temp_meta = {}
            current_meta_id = DataMetaFieldEnum.DATA_ID.get_value_from_dict(meta_json, translated_key=True)
            if current_meta_id is None:
                raise ParsingError(ParsingErrorEnum.META_FIELD_MISSING, o1='数据ID')
            for meta_field in DataMetaFieldEnum.reader_iterator():
                temp_meta[meta_field.field_raw_name] = meta_field.get_value_from_dict(meta_json, translated_key=True)
            temp_meta.pop(None, None)
            return temp_meta

        try:
            if isinstance(path_or_fp, str):
                with open(path_or_fp, encoding='utf-8') as fp:
                    json_dict = json.load(fp)
            else:
                json_dict = json.load(path_or_fp)
        except json.JSONDecodeError as e:
            raise ParsingError(ParsingErrorEnum.JSONSyntaxError, o1=str(e))
        tid = json_dict.get('template', {}).get('_id')
        if tid is None:
            raise ParsingError(ParsingErrorEnum.BAD_TEMPLATE)
        try:
            template = Template.objects.get(id=tid)
            self._load_template(template)
            self._template = template
        except Template.DoesNotExist:
            raise ParsingError(ParsingErrorEnum.TEMPLATE_DOES_NOT_EXIST, o1=tid)

        if 'data' not in json_dict or not isinstance(json_dict['data'], list):
            raise ParsingError(ParsingErrorEnum.BAD_TEMPLATE)
        data_list = json_dict['data']
        if self._verify_only:
            total_count = len(data_list)
        else:
            total_count = len(data_list) * 2  # 认为数据解析和写数据库各占一半时间
        if total_count == 0:
            raise ParsingError(ParsingErrorEnum.DATA_IS_BLANK)
        current_count = 0
        current_meta_index = 0
        try:
            for index, data_json in enumerate(data_list):
                current_meta_index = index + 1
                if 'meta' not in data_json or 'content' not in data_json:
                    raise ParsingError(ParsingErrorEnum.BAD_TEMPLATE)
                meta = _read_meta(data_json.get('meta'))
                if meta is None:
                    raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1='meta')
                data = _read_data(data_json.get('content'))
                if data is None:
                    raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1='content')
                if not self._verify_only:
                    self.meta_id_list.append(template.add_data(meta, data, uploaded_by=uploaded_by, importing=True,
                                                               check_uploaded_files=True if self._is_api else False
                                                               ).id)
                    current_count += 1
                    if progress_handler:
                        progress_handler(current_count / total_count)
                else:
                    current_count += 1
            if not self._verify_only and not self._is_api:  # api 方式不包含文件
                if progress_handler:
                    progress_handler(-1, True)
                data_images = []
                data_files = []
                temp_dir_name = "__tmp_dir_for_packing__"
                temp_dir = os.path.join(file_dir, temp_dir_name)
                os.makedirs(temp_dir, exist_ok=True)
                # 把图片和文件重命名，打包，移动到media，解包
                date_part = parser.date_prefix
                file_dst_dir = os.path.join(temp_dir, settings.DATA_FILE_PREFIX, date_part)
                image_dst_dir = os.path.join(temp_dir, settings.DATA_IMAGE_PREFIX, date_part)
                os.makedirs(file_dst_dir, exist_ok=True)
                os.makedirs(image_dst_dir, exist_ok=True)
                for image_path, packed in parser.file_image_path_info_map.items():
                    new_filename, hash_value, size = packed
                    data_images.append(
                        DataContentImage(file=os.path.join(settings.DATA_IMAGE_PREFIX, date_part, new_filename),
                                         hash_value=hash_value,
                                         size=size))
                    shutil.move(os.path.join(file_dir, image_path), os.path.join(image_dst_dir, new_filename))
                for file_path, packed in parser.file_path_info_map.items():
                    new_filename, hash_value, size = packed
                    data_files.append(
                        DataContentFile(file=os.path.join(settings.DATA_FILE_PREFIX, new_filename),
                                        hash_value=hash_value,
                                        size=size))
                    shutil.move(os.path.join(file_dir, file_path), os.path.join(file_dst_dir, new_filename))
                if data_files or data_images:
                    rand = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
                    archive_name = rand
                    archive_path = os.path.join(file_dir, archive_name)
                    shutil.make_archive(archive_path, 'zip', temp_dir, settings.MEDIA_PREFIX)
                    archive_path += '.zip'
                    archive_name += '.zip'
                    new_archive_path = os.path.join(settings.MEDIA_ROOT, archive_name)
                    shutil.move(archive_path, new_archive_path)
                    shutil.unpack_archive(new_archive_path, settings.MEDIA_ROOT, 'zip')
                    os.remove(new_archive_path)
                    parser.file_path_info_map = {}  # 清空， 防止read被再次调用导致再次移动文件
                    parser.file_image_path_info_map = {}
                with transaction.atomic():
                    DataContentFile.objects.bulk_create(data_files, ignore_conflicts=True)
                    DataContentImage.objects.bulk_create(data_images, ignore_conflicts=True)

            return self.meta_id_list
        except ParsingError as e:
            if current_meta_id is None:
                e.add_detail(f" (第{current_meta_index}条数据)")
            else:
                e.add_detail(f"（第{current_meta_index}条数据，数据ID：{current_meta_id})")
            raise e
        except Exception:
            self.roll_back()
            raise

    @property
    def template(self):
        return self._template

    def generate_template(self, number_of_data=2, elements_per_array=2, rows_per_table=2):
        """
        生成导入模板
        :param number_of_data:
        :param elements_per_array:
        :param rows_per_table:
        :return:
        """

        def _add_field(field_meta: TemplateField):
            t = field_meta.field_type
            if t.is_table:
                data = []
                for index in range(1, rows_per_table + 1):
                    data.append({})
                    for header in field_meta.sub_fields:
                        data[-1][header.field_name] = _add_field(header)
            elif t.is_generator:
                data = {}
                for option in field_meta.sub_fields:
                    data[option.field_name] = (_add_field(option))
            elif t.is_container:
                data = {}
                for sub_field in field_meta.sub_fields:
                    data[sub_field.field_name] = _add_field(sub_field)
            elif t.is_array:
                data = []
                for index in range(1, elements_per_array + 1):
                    data.append(_add_field(field_meta.element_field))
            elif t.is_file or t.is_image:
                data = []
                link_node_name = 'image' if t.is_image else 'file'
                for index in range(1, elements_per_array + 1):
                    data.append(_("***Fill %(type_name)s %(file_number)s's path here***") %
                                {
                                    'type_name': link_node_name,
                                    'file_number': str(index)
                                }
                                )
            else:
                context = dict(field_name=field_meta.field_name, field_type=t.description)
                if t.is_choice:
                    context['choices'] = ', '.join(field_meta.choices_list)
                    data = _(
                        '***Fill %(field_name)s (%(field_type)s) here. Choices are %(choices)s ***') % context
                else:
                    data = _('***Fill %(field_name)s (%(field_type)s) here***') % context

            return data

        for index in range(1, number_of_data + 1):
            meta_part = {}
            content_part = {}
            for field in DataMetaFieldEnum.reader_iterator(with_id=True):
                if field == DataMetaFieldEnum.DATA_ID:
                    text = _("***Data %(data_number)s's ID***") % {'data_number': index}
                elif field in (DataMetaFieldEnum.PROJECT, DataMetaFieldEnum.SUBJECT):
                    text = _("***在这里填写机构编号***")
                elif field == DataMetaFieldEnum.VISIBILITY:
                    choices = '，'.join(DATA_VISIBILITY_NAME_MAP.keys())
                    text = _("***在这里填写可见范围：%s 之一***") % choices
                else:
                    text = _('***Fill %(field_name)s here***') % {'field_name': field.description}
                meta_part[field.description] = text

            for field in self._template.fields:
                content_part[field.field_name] = _add_field(field)
            self._content_to_save['data'].append({'meta': meta_part, 'content': content_part})

    def save(self, output_dir):
        if self._mode == DataMode.READ:
            raise ValueError("Nothing to save in read mode.")
        if not self._no_attachments:
            for src, new_filename in self._serializer.filenames:
                shutil.copy(src, os.path.join(output_dir, new_filename))
        json_filename = f'{self._template.title.replace("/", "")}.json'
        with open(os.path.join(output_dir, json_filename), 'w') as fp:
            json.dump(self._content_to_save, fp, ensure_ascii=False, indent=4)

        return json_filename

    def data_to_dict(self, data_meta: DataMeta, absolute_file_path=False, decompose_range=True):
        """
        简便函数，用于web展示数据使用
        :param data_meta:
        :param absolute_file_path:
        :param decompose_range:
        :return:
        """
        return self._data_to_dict(data_meta, with_none=False, absolute_file_path=absolute_file_path,
                                  decompose_range=decompose_range, to_url=True)
