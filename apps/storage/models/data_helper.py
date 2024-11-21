import json
import re
import pytz
from django.conf import settings
from django.db import transaction
from django.db.models import F, Q
from django.utils import timezone
from django.utils.translation import gettext as _

from apps.storage.docs.data import DataContent
from apps.storage.models.data import DataMeta, DataMetaFieldEnum, DataVisibility, DataReviewState
from apps.storage.models.file import FileUsage, DataContentFile, DataContentImage, ImageUsage
from apps.storage.models.material import MaterialProject, MaterialSubject, ProjectSubjectMember
from mgedata.errors.models import MGEError

image_regex = re.compile(rf'"{settings.MEDIA_URL}(_fs/data_images/[^"]+)"')
file_regex = re.compile(rf'{settings.MEDIA_URL}(_fs/data_files/[^"]+)"')


class DataHelper:

    def __init__(self, template):
        self._template = template
        self.file_path_list = []
        self.image_path_list = []
        self.image_usage_list = []
        self.file_usage_list = []

    def add_data(self, meta_dict: dict | DataMeta, content_dict: dict, upload_username: str,
                 importing=False, check_uploaded_files=False) -> DataMeta:
        from apps.storage.models.template import TemplateDataStatistic
        if isinstance(meta_dict, dict):
            try:
                visibility = DataVisibility(meta_dict['visibility'])
            except (ValueError, KeyError):
                raise MGEError.BAD_DATA(_('Invalid visibility'))
            project_id = meta_dict['project']
            subject_id = meta_dict['subject']
            try:
                project = MaterialProject.objects.get(pk=project_id)
                subject = MaterialSubject.objects.get(pk=subject_id)
            except MaterialProject.DoesNotExist:
                raise MGEError.NOT_FOUND(_('一级机构"%s"不存在') % project_id)
            except MaterialSubject.DoesNotExist:
                raise MGEError.NOT_FOUND(_('二级机构"%s"不存在') % subject_id)
            if subject.project != project:
                raise MGEError.PROJECT_OR_SUBJECT_NOT_FOUND(_("%(s)s、%(p)s没有从属关系") % {
                    's': subject.description, 'p': project.description
                })

            data_meta = DataMeta(template=self._template, category_id=self._template.category_id,
                                 user_id=upload_username, visibility=visibility,
                                 importing=True)
            self._enrich_data_meta(data_meta=data_meta, meta_dict=meta_dict)

        else:
            visibility = meta_dict.visibility
            data_meta = meta_dict
        if visibility == DataVisibility.PRIVATE:
            data_meta.review_state = DataReviewState.APPROVED
        else:
            data_meta.review_state = DataReviewState.PENDING
        q1 = Q(subject=data_meta.subject, user_id=upload_username)
        q2 = Q(project=data_meta.project, subject__isnull=True, user_id=upload_username)
        if not ProjectSubjectMember.objects.filter(q1 | q2).exists():
            raise MGEError.PROJECT_OR_SUBJECT_NOT_FOUND(_('您不是%(project)s/%(subject)s的成员') % {
                'project': data_meta.project.name, 'subject': data_meta.subject.name
            })
        data_meta.reviewer = None
        data_meta.save()
        json_str = json.dumps(content_dict, ensure_ascii=False)
        self.image_path_list = list(image_regex.findall(json_str))
        self.file_path_list = list(file_regex.findall(json_str))
        json_str = json_str.replace('/media/_fs/data_files', '_fs/data_files')
        json_str = json_str.replace('/media/_fs/data_images', '_fs/data_images')
        content_dict = json.loads(json_str)

        data_content = DataContent(
            _tid=self._template.id, _meta_id=data_meta.id, data=content_dict
        )
        data_content.save()
        data_meta.dc_id = str(data_content.pk)

        if check_uploaded_files is True:
            self._do_check_files()

        self._append_file_usage_list(data_meta=data_meta)
        with transaction.atomic():
            FileUsage.objects.filter(meta_id=data_meta.id).delete()
            ImageUsage.objects.filter(meta_id=data_meta.id).delete()
            FileUsage.objects.bulk_create(self.file_usage_list, ignore_conflicts=True)
            ImageUsage.objects.bulk_create(self.image_usage_list, ignore_conflicts=True)
            if not importing:
                data_meta.importing = False
            beijing_tz = pytz.timezone(settings.TIME_ZONE)
            now_date = timezone.now()
            beijing_now = now_date.astimezone(beijing_tz)
            now_date = beijing_now.date()
            num_updated = TemplateDataStatistic.objects.filter(
                template_id=self._template.id, day=now_date
            ).select_for_update().update(
                num_new_data=F('num_new_data') + 1
            )
            if num_updated == 0:
                bulk = [TemplateDataStatistic(template_id=self._template.id, num_new_data=1, day=now_date)]
                TemplateDataStatistic.objects.bulk_create(bulk, ignore_conflicts=True)
            data_meta.save()
        return data_meta

    def modify_data(self, meta: DataMeta, meta_dict: dict, content_dict: dict, only_content) -> DataMeta:
        old_content_id = meta.dc_id
        if not only_content:
            self._enrich_data_meta(data_meta=meta, meta_dict=meta_dict)

        self.add_data(meta, content_dict, meta.username, importing=False, check_uploaded_files=False)
        DataContent.objects.filter(pk=old_content_id).delete()

        return meta

    @staticmethod
    def _enrich_data_meta(data_meta: DataMeta, meta_dict: dict):
        for data_meta_field in DataMetaFieldEnum.reader_iterator():
            field_value = data_meta_field.get_value_from_dict(meta_dict)
            if field_value is not None:
                data_meta.__setattr__(data_meta_field.sql_name, field_value)

    def _find_image_and_file_paths(self, content_dict) -> (list, list):
        image_paths = []
        file_paths = []
        from apps.storage.models.template import TemplateField

        def _recursive(field_meta: TemplateField, value):
            if field_meta.field_type.is_file:
                value = self._remove_path_prefix(value)
                file_paths.extend(value)
            elif field_meta.field_type.is_image:
                value = self._remove_path_prefix(value)
                image_paths.extend(value)
            elif field_meta.field_type.is_container or field_meta.field_type.is_generator:
                for sub_field_meta in field_meta.sub_fields:
                    child_value = value.get(sub_field_meta.field_name)
                    if not child_value:
                        continue
                    value[sub_field_meta.field_name] = _recursive(sub_field_meta, child_value)

            elif field_meta.field_type.is_table:
                for row in value:
                    for sub_field_meta in field_meta.sub_fields:
                        child_value = row.get(sub_field_meta.field_name)
                        if not child_value:
                            continue
                        row[sub_field_meta.field_name] = _recursive(sub_field_meta, child_value)
            elif field_meta.field_type.is_array:
                for i, child_value in enumerate(value):
                    value[i] = _recursive(field_meta.sub_fields[0], child_value)
            return value

        for field_meta in self._template.fields:
            value = content_dict.get(field_meta.field_name)
            if not value:
                continue
            _recursive(field_meta, value)
        print(image_paths, file_paths)
        return image_paths, file_paths

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

    @staticmethod
    def _remove_path_prefix(value) -> list[str]:
        if not isinstance(value, list):
            return []
        new_value = []
        for path in value:
            path = path.strip()
            if path.startswith(settings.MEDIA_URL):
                path = path[len(settings.MEDIA_URL):]
            new_value.append(path)
        return new_value
