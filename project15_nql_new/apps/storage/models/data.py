# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2018/1/4
# @Description : 元数据相关


import logging
import re
import traceback
from datetime import datetime
from enum import Enum, IntEnum, unique
from typing import List, Tuple

from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from django.contrib.postgres.indexes import GinIndex
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models
from django.db import transaction, connection
from django.utils import timezone
from django.utils.translation import get_language
from django.utils.translation import ugettext_noop as _, ugettext
from elasticsearch.exceptions import NotFoundError
from mongoengine.errors import DoesNotExist, ValidationError

from apps.account.models.notifications import NotificationType
from apps.account.models.users import User
from apps.account.notify import notify
from apps.storage.docs.data import DataContent
from apps.storage.doi.models import DoiRegisterState
from apps.storage.models import MaterialProject, MaterialSubject
from mgedata.errors.models import MGEError
from mgedata.utils.general import get_current_username
from .file import UploadedSourceFile
from .material import MaterialCategory
from .platform import Platforms
from ..utils.constant import CONST

logger = logging.getLogger('django')

_KEYWORDS_SEP = re.compile(r'[,， ]')


class DataReviewState(IntEnum):
    PENDING = 0
    APPROVED = 1
    DISAPPROVED = 2

    @property
    def description(self):
        if self == DataReviewState.PENDING:
            return ugettext("Reviewing Pending")
        elif self == DataReviewState.APPROVED:
            return ugettext("Approved")
        elif self == DataReviewState.DISAPPROVED:
            return ugettext("Disapproved")


class DisapproveReason(IntEnum):
    OTHER = 0
    META_MISSING = 1
    CONDITION_MISSING = 2
    PERFORMANCE_INFO_MISSING = 3
    COMPONENTS_MISSING = 4
    INFORMAL_TITLE = 5
    REFERENCE_MISSING = 6
    CONTRIBUTOR_MISSING = 7

    @property
    def to_string(self):
        if self == 0:
            return _("Other")
        elif self == 1:
            return _("Missing some meta fields")
        elif self == 2:
            return _("Missing conditions of computation/experiment")
        elif self == 3:
            return _("Missing information of performance")
        elif self == 4:
            return _("Missing component")
        elif self == 5:
            return _("Title lacks standardization")
        elif self == 6:
            return _("Missing references")
        elif self == 7:
            return _("Missing collector/contributor/reviewer")


class DataMetaFieldEnum(Enum):
    """
    DataMeta字段
    """
    DATA_ID = 'Data ID'
    TITLE = "Title"
    DOI = "DOI"
    ABSTRACT = "Abstract"
    MATERIAL_CLASS = "Material Class"
    TEMPLATE_NAME = "Template Name"
    KEYWORDS = "Keywords"
    AUTHOR = "Author"
    INSTITUTION = "Institution"
    CONTRIBUTOR = "Contributor"
    CREATED_AT = "Created at"
    SOURCE = "Source"
    REFERENCE = "Reference"
    REVIEWER = "Reviewer"
    REVIEWER_INS = "Reviewer's Institution"

    OTHER_INFO = "Other Info"
    TEMPLATE_ID = "Template ID"

    VIEWS = "views"
    DOWNLOADS = "downloads"
    SCORE = "score"
    CATEGORY = "category"
    CATEGORY_ID = "category_id"
    TEMPLATE_TITLE = "template_title"

    PUBLIC_DATE = "public_date"
    PUBLIC_RANGE = "public_range"

    PLATFORM_BELONG = "platform_belong"

    @property
    def sql_name(self):
        if self == DataMetaFieldEnum.CREATED_AT:
            return 'add_time'
        elif self == DataMetaFieldEnum.DATA_ID:
            return 'id'
        elif self == DataMetaFieldEnum.TEMPLATE_ID:
            return 'template_id'
        elif self == DataMetaFieldEnum.AUTHOR:
            return 'user__real_name'
        elif self == DataMetaFieldEnum.CATEGORY:
            from django.utils.translation import get_language
            if 'zh-hans' == get_language():
                return "category__name_zh"
            return "category__name_en"
        elif self == DataMetaFieldEnum.REVIEWER:
            return "reviewer__real_name"
        elif self == DataMetaFieldEnum.REVIEWER_INS:
            return "reviewer__institution"
        elif self == DataMetaFieldEnum.TEMPLATE_TITLE:
            return "template__title"
        elif self == DataMetaFieldEnum.PUBLIC_DATE:
            return "public_date"
        elif self == DataMetaFieldEnum.PUBLIC_RANGE:
            return "public_range"
        else:
            return self.name.lower()

    @property
    def description(self):
        return ugettext(self.value)

    @property
    def required(self):
        if self in (
                DataMetaFieldEnum.TITLE,
                DataMetaFieldEnum.ABSTRACT,
                DataMetaFieldEnum.KEYWORDS,
                DataMetaFieldEnum.SOURCE,
        ):
            return True
        else:
            return False

    def is_blank_value(self, value):
        if self in (
                DataMetaFieldEnum.TITLE,
                DataMetaFieldEnum.ABSTRACT,
                DataMetaFieldEnum.KEYWORDS,
                DataMetaFieldEnum.DOI,
                DataMetaFieldEnum.REFERENCE,
                DataMetaFieldEnum.INSTITUTION,
                DataMetaFieldEnum.CONTRIBUTOR
        ) and (CONST.META_BLANK_STRING in str(value) or len(str(value)) == 0):
            return True
        else:
            return False

    def get_value(self, data_meta):
        """
        从DataMeta对象中获取字段的值
        :param data_meta:
        :return:
        """
        if self == self.__class__.DATA_ID:
            return data_meta.id
        elif self == self.__class__.TITLE:
            return data_meta.title
        elif self == self.__class__.MATERIAL_CLASS:
            return data_meta.category.name
        elif self == self.__class__.TEMPLATE_ID:
            return str(data_meta.template_id)
        elif self == self.__class__.KEYWORDS:
            return ', '.join(data_meta.keywords or [])
        elif self == self.__class__.AUTHOR:
            return data_meta.user_real_name
        elif self == self.__class__.CREATED_AT:
            return data_meta.add_time.strftime('%Y-%m-%d %H:%M:%S')
        elif self == self.__class__.SOURCE:
            return data_meta.source
        elif self == self.__class__.REFERENCE:
            return data_meta.reference
        elif self == self.__class__.DOI:
            return data_meta.doi
        elif self == self.__class__.ABSTRACT:
            return data_meta.abstract
        elif self == self.__class__.CONTRIBUTOR:
            return data_meta.contributor
        elif self == self.__class__.INSTITUTION:
            return data_meta.institution
        elif self == self.__class__.REVIEWER:
            return getattr(data_meta.reviewer, User.real_name.field_name, "N/A")
        elif self == self.__class__.REVIEWER_INS:
            return getattr(data_meta.reviewer, User.institution.field_name, "N/A")
        elif self == self.__class__.OTHER_INFO:
            return '; '.join([f'{key}: {value}' for key, value in (data_meta.other_info or {}).items()])
        elif self == self.__class__.PUBLIC_DATE:
            return data_meta.public_date
        elif self == self.__class__.PUBLIC_RANGE:
            return data_meta.public_range

    def get_value_from_dict(self, meta_dict: dict, translated_key=False):
        if translated_key:
            return self.validate(meta_dict.get(self.description))
        else:
            return self.validate(meta_dict.get(self.field_raw_name))

    def validate(self, value):
        if value is None:
            if self.required:
                from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                raise ParsingError(ParsingErrorEnum.META_FIELD_MISSING, o1=self.description)
            else:
                return None
        if self.is_blank_value(value):
            if self.required:
                from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                raise ParsingError(ParsingErrorEnum.META_FIELD_BLANK, o1=self.description)
            else:
                return None
        if self == DataMetaFieldEnum.KEYWORDS:
            if not isinstance(value, list):
                if not isinstance(value, str):
                    from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                    raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=type(value).__name__, o2=self.description)
                return [x.strip() for x in _KEYWORDS_SEP.split(value)]
            return [str(x) for x in value]
        elif self == DataMetaFieldEnum.OTHER_INFO:
            # 用于校验 subject格式为：课题名(课题号) 是的数据否合法
            def validate_subject(raw_subject: str):
                from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                result = re.match(r'.*\((.*)\)', raw_subject)
                if result is not None:
                    subject = MaterialSubject.objects.filter(pk=result.group(1)).first()
                    if subject is not None:
                        validate_subject_name = result.group(0).split('(')[0]
                        if subject.name != validate_subject_name:
                            correct_subject_id = MaterialSubject.objects.get(name=validate_subject_name).id
                            raise ParsingError(ParsingErrorEnum.BAD_SUBJECT, o1=result.group(0),
                                               o2=result.group(1),
                                               o3=correct_subject_id)
                        return {'project': subject.project.id, 'subject': subject.id}
                    else:
                        raise ParsingError(ParsingErrorEnum.INVALID_SUBJECT)
                else:
                    raise ParsingError(ParsingErrorEnum.INVALID_SUBJECT)

            if isinstance(value, str):
                try:
                    if re.match(r'.*\((.*)\)', value):
                        validate_subject(value)
                        return value
                    else:
                        new_value = dict()
                        for key_value in re.split(r'[;；]', value):
                            key, value = re.split(r'[:：]', key_value)
                            new_value[key.strip()] = value.strip()
                        value = new_value
                except Exception as e:
                    from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                    if isinstance(e, ParsingError):
                        raise ParsingError(ParsingErrorEnum.INVALID_SUBJECT)
                    return None
            if isinstance(value, dict):
                if 'project' in value and 'subject' in value:
                    if (
                            MaterialProject.objects.filter(
                                pk=value['project']
                            ).first() is not None and
                            MaterialSubject.objects.filter(
                                pk=value['subject']
                            ).first() is not None
                    ):
                        return {'project': value['project'], 'subject': value['subject']}
                if 'subject' in value:
                    from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                    if value['subject'] is not None:
                        return validate_subject(value['subject'])
                    else:
                        raise ParsingError(ParsingErrorEnum.INVALID_SUBJECT)

            return None
        elif self == DataMetaFieldEnum.PUBLIC_DATE:
            return DataPublicRange.generate_date(value)
        elif self == DataMetaFieldEnum.PUBLIC_RANGE:
            return DataPublicRange.generate_range(value)

        return str(value)

    @property
    def field_raw_name(self):
        """
        获取DataMeta JSON中的字段名
        :return:
        """
        return self.name.lower()

    @staticmethod
    def writer_iterator(with_id=False):
        """
        导出Excel时DataMeta页填写的字段
        :return: 迭代器
        """
        _meta_fields = DataMetaFieldEnum.writer_meta_fields()
        if with_id:
            _meta_fields = (DataMetaFieldEnum.DATA_ID,) + _meta_fields
        return iter(_meta_fields)

    @staticmethod
    def reader_iterator(with_id=False):
        """
        生成导入模板时DataMeta页填写的字段
        :return: 迭代器
        """
        _meta_fields = DataMetaFieldEnum.reader_meta_fields()
        if with_id:
            _meta_fields = (DataMetaFieldEnum.DATA_ID,) + _meta_fields
        return iter(_meta_fields)

    @staticmethod
    def reader_meta_fields() -> Tuple['DataMetaFieldEnum', ...]:
        return (
            DataMetaFieldEnum.TITLE,
            DataMetaFieldEnum.DOI,
            DataMetaFieldEnum.ABSTRACT,
            DataMetaFieldEnum.KEYWORDS,
            DataMetaFieldEnum.SOURCE,
            DataMetaFieldEnum.REFERENCE,
            DataMetaFieldEnum.OTHER_INFO,
            DataMetaFieldEnum.INSTITUTION,
            DataMetaFieldEnum.CONTRIBUTOR,
            DataMetaFieldEnum.PUBLIC_DATE,
            DataMetaFieldEnum.PUBLIC_RANGE,
        )

    @staticmethod
    def writer_meta_fields() -> Tuple['DataMetaFieldEnum', ...]:
        return (
            DataMetaFieldEnum.TITLE,
            DataMetaFieldEnum.MATERIAL_CLASS,
            DataMetaFieldEnum.DOI,
            DataMetaFieldEnum.ABSTRACT,
            DataMetaFieldEnum.KEYWORDS,
            DataMetaFieldEnum.AUTHOR,
            DataMetaFieldEnum.CREATED_AT,
            DataMetaFieldEnum.SOURCE,
            DataMetaFieldEnum.REFERENCE,
            DataMetaFieldEnum.CONTRIBUTOR,
            DataMetaFieldEnum.INSTITUTION,
            DataMetaFieldEnum.REVIEWER,
            DataMetaFieldEnum.REVIEWER_INS,
            DataMetaFieldEnum.OTHER_INFO,
        )


class DeactivateQuerySet(models.query.QuerySet):
    def get(self, *args, **kwargs):
        instance = super().get(*args, **kwargs)
        if instance.deleted:
            raise DataMeta.DoesNotExist
        return instance

    def delete(self):
        meta_ids = list(self.values_list('id', flat=True))
        self.update(deleted=True)
        from apps.search.tasks import delete_datametas
        delete_datametas.delay(meta_ids=meta_ids)

    def update(self, *args, **kwargs):
        super().update(**kwargs)
        if len(kwargs.keys()) <= 1 and ('deleted' in kwargs.keys() or 'update_es_time' in kwargs.keys()):
            return
        from apps.search.tasks import import_to_es
        import_to_es.delay(meta_id_or_list=list(self.values_list('id', flat=True)))


class DataMetaManager(models.Manager):
    def get_queryset(self):
        queryset = DeactivateQuerySet(self.model, using=self._db)
        return queryset.filter(importing=False, deleted=False).order_by('-add_time')


class DeletedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(importing=False, deleted=True)


class RawDataMetaManager(models.Manager):
    pass


class ImportingDataMetaManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(importing=True, deleted=False)


class ArticleReference(models.Model):
    """
    外部引用的文章信息
    """
    doi = models.TextField(primary_key=True)
    title = models.TextField(null=False)
    author = models.TextField(null=False)
    abstract = models.TextField(null=False)
    article_url = models.TextField(null=True)

    def to_dict(self):
        return {
            "doi": self.doi,
            "title": self.title,
            "author": self.author,
            "abstract": self.abstract,
            "article_url": self.article_url
        }


class DataSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, default=None)
    contributor = models.TextField(null=True)
    title = models.TextField()
    project = models.CharField(max_length=300, null=True, blank=True)
    doi = models.CharField(max_length=300, null=True, blank=True, default=None)
    objects = models.Manager()
    article_ref = models.ManyToManyField(ArticleReference, blank=True)

    def to_dict(self):
        content = {}
        for name, value in vars(self).items():
            content[name] = value
        del content['_state']
        return content

    def update(self, update_dict):
        for key, value in update_dict.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()
        add_data_ids = update_dict.get('add_data_ids', [])
        data_ids = update_dict.get('data_ids', [])
        add_data_ids.extend(data_ids)
        user = update_dict['user']
        for d in add_data_ids:
            data = DataMeta.objects.get(pk=d)
            if user != data.user:
                continue
            data.dataset = self
            data.save()
        del_data_ids = update_dict.get('del_data_ids', [])
        for d in del_data_ids:
            data = DataMeta.objects.get(pk=d)
            if user != data.user and data.dataset != self:
                continue
            data.dataset = None
            data.save()

    @property
    def get_ref_count(self):
        # 通过article_ref获得数据引用数.
        return self.article_ref.all().count()


class DataMeta(models.Model):
    """数据元信息类，包含一系列元数据信息和数据内容`content`的字段

    `title`:   数据标题
    `category`: 数据所属类别，使用`set_material_class`设置
    `tid`:     所使用的模板，使用`set_template`设置
    `keywords`: 数据关键词，即标签，直接存储而不引用到 MaterialTag
    `doi`:      DOI标识
    `abstract`: 简介
    `author`:   用户名
    `add_time`:   创建时间
    `dc_id`:  数据内容，引用 `DataContent`
    """
    title = models.TextField()
    category = models.ForeignKey(MaterialCategory, null=True,
                                 on_delete=models.SET_NULL, limit_choices_to={'leaf': True})
    template = models.ForeignKey('storage.Template', on_delete=models.SET_NULL, null=True)
    keywords = ArrayField(models.CharField(max_length=255), null=True, blank=True, default=list)
    doi = models.CharField(max_length=255, null=True, blank=True)
    abstract = models.TextField(null=True, blank=True)
    purpose = models.TextField(null=True, blank=True)
    source = models.TextField(null=True)
    reference = models.TextField(null=True)
    contributor = models.TextField(null=True)
    institution = models.TextField(null=True)
    is_public = models.BooleanField(null=False, default=True)
    other_info = JSONField(null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    add_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    update_es_time = models.DateTimeField(null=True)
    deleted = models.BooleanField(default=False)
    downloads = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    score = models.FloatField(default=0, validators=(MinValueValidator(0), MaxValueValidator(10)))
    dc_id = models.CharField(max_length=24, validators=(RegexValidator(r'^[a-f\d]{24}$'),))
    importing = models.BooleanField(default=False)
    reviewer = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="reviewed_data")
    review_state = models.IntegerField(default=DataReviewState.PENDING)
    review_date = models.DateTimeField(null=True)
    disapprove_reason = models.TextField(null=True)
    objects = DataMetaManager()
    importing_objects = ImportingDataMetaManager()
    deleted_objects = DeletedManager()
    raw_objects = RawDataMetaManager()
    dataset = models.ForeignKey(DataSet, on_delete=models.SET_NULL, null=True, blank=True, default=None)
    public_date = models.DateTimeField(default=timezone.now)
    public_range = models.CharField(max_length=10, default='public')
    sync_version = models.IntegerField(default=0)
    platform_belong = models.IntegerField(choices=Platforms.PLATFORM_CHOICE, default=0)

    class Meta:
        # 不要在这一层加默认排序
        verbose_name = _('Data Meta')
        verbose_name_plural = _('Data Metas')
        indexes = [
            GinIndex(fields=['other_info']),
            models.Index(fields=['-add_time']),
            models.Index(fields=['doi']),
            models.Index(fields=['importing', '-deleted']),
        ]

    class SourceHelper:
        REPRESENTATION_HEADER = 'MGE-SOURCE_HEADER'
        REPRESENTATION_END = '#'
        VERSION_1 = 'v1'

        SOURCE_SELF_PRODUCTION_INDEX = 0
        SOURCE_REFERENCE_INDEX = 1
        SOURCE_TUPLE = (_('self-production'), _('reference'))

        METHOD_TUPLE = (_('computation'), _('experiment'), _('production'), _('other'))

        def __init__(self, source, methods):
            self.source = source
            self.methods = methods

        def representation(self):
            source_mask = ''
            methods_mask = ''
            for source in DataMeta.SourceHelper.SOURCE_TUPLE:
                if ugettext(self.source) == ugettext(source):
                    source_mask += '1'
                else:
                    source_mask += '0'
            if len(set(source_mask)) != 2:
                raise ValueError(ugettext("Source must be single choice with exact 0 and 1 in the representation"))
            for method in DataMeta.SourceHelper.METHOD_TUPLE:
                if ugettext(method) in list(ugettext(method) for method in self.methods):
                    methods_mask += '1'
                else:
                    methods_mask += '0'
            return ' '.join([DataMeta.SourceHelper.REPRESENTATION_HEADER,
                             DataMeta.SourceHelper.VERSION_1,
                             methods_mask,
                             source_mask,
                             DataMeta.SourceHelper.REPRESENTATION_END])

        def is_self_production(self):
            return self.source == DataMeta.SourceHelper.SOURCE_SELF_PRODUCTION_INDEX

        def is_reference(self):
            return self.source == DataMeta.SourceHelper.SOURCE_REFERENCE_INDEX

        def get_source_name(self):
            return dict(zip(range(2), DataMeta.SourceHelper.SOURCE_TUPLE))[self.source]

        def get_method_names(self):
            method_names = []
            idx_names = dict(zip(range(4), DataMeta.SourceHelper.METHOD_TUPLE))
            for idx in self.methods:
                method_names.append(idx_names[idx])
            return method_names

        @classmethod
        def parse(cls, represent: str):
            methods = []
            source = None
            if represent.startswith(DataMeta.SourceHelper.REPRESENTATION_HEADER) and represent.endswith(
                    DataMeta.SourceHelper.REPRESENTATION_END
            ):
                segments = represent.strip().split()
                if len(segments) <= 2:
                    raise ValueError(_("Can not get the source version"))
                version = segments[1]
                if version == cls.VERSION_1:
                    if len(segments) != 5:
                        raise ValueError(_("Wrong Segments in the source representation"))
                    multi_choice_mask = segments[2]
                    single_choice_mask = segments[3]

                    if len(multi_choice_mask) != 4 or set(multi_choice_mask) | set('01') != set('01'):
                        raise ValueError(_("Wrong Format for the multi choice"))
                    if len(single_choice_mask) != 2 or set(single_choice_mask) != set('01'):
                        raise ValueError(_("Wrong Format for the single choice"))

                    for idx in range(4):
                        if multi_choice_mask[idx] == '1':
                            methods.append(idx)
                    for idx in range(2):
                        if single_choice_mask[idx] == '1':
                            source = idx

                    return cls(source, methods)

                else:
                    raise ValueError(_("Wrong source version in Source representation"))
            else:
                raise ValueError(
                    _("Source must be start with '%(header)s' and end with '%(end)s'") % {
                        'header': DataMeta.SourceHelper.REPRESENTATION_HEADER,
                        'end': DataMeta.SourceHelper.REPRESENTATION_END
                    })

    class OtherInfoHelper:
        FIELDS = (_('project'), _('subject'))
        DEFAULT_VALUE = ('2016YFB0700500', '2016YFB0700503')

        @staticmethod
        def subject_representation(pk=None):
            if pk is None:
                pk = DataMeta.OtherInfoHelper.DEFAULT_VALUE[1]
            try:
                subject = MaterialSubject.objects.get(pk=pk)
            except MaterialSubject.DoesNotExist:
                subject = MaterialSubject.objects.get(pk=DataMeta.OtherInfoHelper.DEFAULT_VALUE[1])
            return '{}({})'.format(subject.name, subject.id)

        @staticmethod
        def subjects_representation_group_by_project_name():
            return dict((ins.name,
                         [DataMeta.OtherInfoHelper.subject_representation(s.pk)
                          for s in ins.materialsubject_set.all()]) for ins in MaterialProject.objects.all())

        @staticmethod
        def get_data_meta_id_list_filter_by_subject_id(subject_id: str):
            if MaterialSubject.objects.filter(id=subject_id).exists():
                with connection.cursor() as cursor:
                    subject = "\'" + "{" + "\"subject\":\"{subject}\"".format(subject=subject_id) + "}" + "\'"
                    sql = "SELECT \"storage_datameta\".\"id\" FROM\"storage_datameta\" " \
                          "WHERE( \"storage_datameta\".\"importing\" = FALSE AND" \
                          f"\"storage_datameta\".\"other_info\" @> {subject})"
                    cursor.execute(sql)
                    data_meta_ids = [row[0] for row in cursor.fetchall()]
                    return data_meta_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{subject_id} does not exist')

        @staticmethod
        def get_data_meta_id_list_filter_by_project_id(project_id: str):
            if MaterialProject.objects.filter(id=project_id).exists():
                with connection.cursor() as cursor:
                    sql = """
                        SELECT storage_datameta.id FROM storage_datameta WHERE(storage_datameta.importing = FALSE AND 
                        storage_datameta.other_info @> '{"project":"project_id"}')
                    """
                    sql = sql.replace('project_id', project_id)
                    cursor.execute(sql)
                    data_meta_ids = [row[0] for row in cursor.fetchall()]
                    return data_meta_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')

        @staticmethod
        def get_template_id_list_filter_by_subject_id(subject_id: str):
            if MaterialSubject.objects.filter(id=subject_id).exists():
                with connection.cursor() as cursor:
                    subject = "\'" + "{" + "\"subject\":\"{subject}\"".format(subject=subject_id) + "}" + "\'"
                    sql = "SELECT * FROM (SELECT DISTINCT ON" \
                          "( \"storage_datameta\".\"template_id\" ) \"storage_datameta\".\"template_id\" AS Col1 " \
                          "FROM\"storage_datameta\" " \
                          "WHERE( \"storage_datameta\".\"importing\" = FALSE AND " \
                          f"\"storage_datameta\".\"other_info\" @> {subject})" \
                          "ORDER BY \"storage_datameta\".\"template_id\" ASC ) subquery"
                    cursor.execute(sql)
                    template_ids = [row[0] for row in cursor.fetchall()]
                    return template_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{subject_id} does not exist')

        @staticmethod
        def get_template_id_list_filter_by_project_id(project_id: str):
            if MaterialProject.objects.filter(id=project_id).exists():
                with connection.cursor() as cursor:
                    sql = """
                        SELECT DISTINCT ON (storage_datameta.template_id) storage_datameta.template_id AS Col1
                        FROM storage_datameta 
                        WHERE(storage_datameta.importing = FALSE AND 
                            storage_datameta.other_info @> '{"project":"project_id"}')
                        ORDER BY storage_datameta.template_id ASC
                    """
                    sql = sql.replace('project_id', project_id)
                    cursor.execute(sql)
                    template_ids = [row[0] for row in cursor.fetchall()]
                    return template_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')

        @staticmethod
        def get_template_id_list_filter_by_project_or_subject_id(ps_id: str, is_project=True):
            sql = """
                    SELECT DISTINCT ON (storage_datameta.template_id) storage_datameta.template_id AS Col1
                    FROM storage_datameta 
                    WHERE(storage_datameta.importing = FALSE AND 
                        storage_datameta.other_info @> '{"project":"project_id"}')
                    ORDER BY storage_datameta.template_id ASC
                """
            sql = sql.replace('project_id', ps_id)
            if not is_project:
                sql = sql.replace('project', 'subject')
            with connection.cursor() as cursor:
                cursor.execute(sql)
                template_ids = [row[0] for row in cursor.fetchall()]
                return template_ids

        @staticmethod
        def get_category_id_list_filter_by_subject_id(subject_id: str):
            if MaterialSubject.objects.filter(id=subject_id).exists():
                with connection.cursor() as cursor:
                    subject = "\'" + "{" + "\"subject\":\"{subject}\"".format(subject=subject_id) + "}" + "\'"
                    sql = "SELECT * FROM (SELECT DISTINCT ON" \
                          "( \"storage_datameta\".\"category_id\" ) \"storage_datameta\".\"category_id\" AS Col1 " \
                          "FROM\"storage_datameta\" " \
                          "WHERE( \"storage_datameta\".\"importing\" = FALSE AND" \
                          f" \"storage_datameta\".\"other_info\" @> {subject})" \
                          "ORDER BY \"storage_datameta\".\"category_id\" ASC ) subquery"
                    cursor.execute(sql)
                    template_ids = [row[0] for row in cursor.fetchall()]
                    return template_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{subject_id} does not exist')

        @staticmethod
        def get_category_id_list_filter_by_project_id(project_id: str):
            if MaterialProject.objects.filter(id=project_id).exists():
                with connection.cursor() as cursor:
                    project = "\'" + "{" + "\"project\":\"{project}\"".format(project=project_id) + "}" + "\'"
                    sql = "SELECT * FROM (SELECT DISTINCT ON" \
                          "( \"storage_datameta\".\"category_id\" ) \"storage_datameta\".\"category_id\" AS Col1 " \
                          "FROM\"storage_datameta\" " \
                          "WHERE( \"storage_datameta\".\"importing\" = FALSE AND " \
                          f"\"storage_datameta\".\"other_info\" @> {project})" \
                          "ORDER BY \"storage_datameta\".\"category_id\" ASC ) subquery"
                    cursor.execute(sql)
                    template_ids = [row[0] for row in cursor.fetchall()]
                    return template_ids
            else:
                raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')

        @staticmethod
        def get_data_meta_count_filter_by_project_id(project_id: str):
            if MaterialProject.objects.filter(id=project_id).exists():
                with connection.cursor() as cursor:
                    project = "\'" + "{" + "\"project\":\"{project}\"".format(project=project_id) + "}" + "\'"
                    sql = "SELECT COUNT(*) FROM\"storage_datameta\" " \
                          "WHERE( \"storage_datameta\".\"importing\" = FALSE AND" \
                          f" \"storage_datameta\".\"other_info\" @> {project})"
                    cursor.execute(sql)
                    data_meta_count = cursor.fetchone()[0]
                    return data_meta_count
            else:
                raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')

        @staticmethod
        def get_data_meta_add_time_count_group_by_project_id():
            with connection.cursor() as cursor:
                sql = """
                    SELECT min(add_time) as time, count(id)
                    from storage_datameta where importing = False
                    group by other_info ->> 'project';
                """
                cursor.execute(sql)
                data_meta_ids = [[row[0].strftime('%Y'), row[1]] for row in cursor.fetchall()]
                return data_meta_ids

        @staticmethod
        def get_data_meta_ids_by_ps_id(ps_id: str) -> List:
            dm_ids = []
            if MaterialProject.objects.filter(id=ps_id).exists():
                dm_ids = DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_project_id(ps_id)
            elif MaterialSubject.objects.filter(id=ps_id).exists():
                dm_ids = DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_subject_id(ps_id)

            return dm_ids

        @staticmethod
        def get_trend_by_ps_id(ps_id: str, is_project=True):
            sql = """
                SELECT t1.id, t1.name_en, t1.name_zh, t2.template_count, t2.data_count
                FROM storage_materialcategory AS t1
                INNER JOIN
                (SELECT count(DISTINCT storage_datameta.template_id) AS template_count,
                        count(DISTINCT storage_datameta.id) AS data_count,
                        storage_datameta.category_id
                FROM storage_datameta
                WHERE(storage_datameta.importing = FALSE
                        AND storage_datameta.other_info @> '{"project":"project_id"}')
                GROUP BY storage_datameta.category_id) AS t2
                ON t1.id = t2.category_id
                ORDER BY t1.id;
            """
            sql = sql.replace('project_id', ps_id)
            if not is_project:
                sql = sql.replace('project', 'subject')
            with connection.cursor() as cursor:
                cursor.execute(sql)
                columns = [col[0] for col in cursor.description]
                return [
                    dict(zip(columns, row))
                    for row in cursor.fetchall()
                ]

    @property
    def username(self):
        """
        上传者的用户名
        :return:
        """
        return self.user_id

    @property
    def user_real_name(self):
        """
        上传者的真实姓名
        :return:
        """
        if self.user:
            return self.user.real_name
        return _("User Deleted")

    def delete(self, *args, **kwargs):
        """
        删除自身，同时删除content，并将所用模板和标签的引用计数 -1
        同时从es 中删除
        """
        template_id = self.template_id
        d_id = self.id
        self.deleted = True  # 使用软删除, queryset已经默认批量删除使用DeactivateQuerySet
        self.save()
        # super().delete(*args, **kwargs)
        try:
            dc = DataContent.objects.get(pk=self.dc_id)
            dc.delete()
            try:
                from apps.search.core_v2.es import Manager as ESManager
                ESManager.delete_datametas(meta_ids=[d_id], template_id=template_id)
            except Exception:
                logger.error(f"datameta.delete.es_delete: {traceback.format_exc()}")
        except DoesNotExist:
            pass
        except ValidationError:
            pass
        except NotFoundError:
            pass

    def delete_meta_only(self):
        assert settings.DEBUG
        super().delete()

    def to_dict(self, meta_only=True):
        """返回 meta 部分的 dict"""
        d = {'id': self.id,
             'title': self.title,
             'category': self.category.name if self.category else "NULL",
             'category_id': self.category_id,
             'source': self.get_source(),
             'methods': self.get_methods(),
             'tid': self.template_id,
             'keywords': self.keywords or [],
             'doi': self.doi,
             'score': self.score,
             'downloads': self.downloads,
             'views': self.views,
             'abstract': self.abstract,
             'purpose': self.purpose or '',
             'author': self.user_real_name,
             'add_time': timezone.localtime(self.add_time).strftime('%Y-%m-%d %H:%M:%S'),
             'reference': self.reference or '',
             'project': (self.other_info or {}).get('project', ''),
             'subject': (self.other_info or {}).get('subject', ''),
             'contributor': self.contributor or '',
             'institution': self.institution or '',
             'reviewer': getattr(self.reviewer, 'real_name', ''),
             'reviewer_ins': getattr(self.reviewer, 'institution', ''),
             'approved': self.approved,
             'external_link': (self.other_info or {}).get('external_link'),
             'public_date': timezone.localtime(self.public_date).strftime('%Y-%m-%d %H:%M:%S'),
             'public_range': self.public_range,
             'platform_belong': self.get_platform_belong_display()
             }
        # d.update(self.other_info or {})  # FIXME 用户字段覆盖
        if not meta_only:
            content = DataContent.objects(pk=self.dc_id).first()
            d['content'] = content.to_mongo() if content else None
        return d

    @staticmethod
    def on_download(metas_pk: list):
        """
        下载量 +1
        """
        DataMeta.objects.filter(pk__in=metas_pk).update(downloads=models.F('downloads') + 1)  # TODO 后台

    @staticmethod
    def on_view(meta_pk):
        """
        访问量 +1
        """
        DataMeta.objects.filter(pk=meta_pk).update(views=models.F('views') + 1)  # TODO 后台

    @property
    def review_status_description(self):
        return DataReviewState(self.review_state).description

    @property
    def pending(self):
        return self.review_state == DataReviewState.PENDING

    @property
    def approved(self):
        return self.review_state == DataReviewState.APPROVED

    @property
    def disapproved(self):
        return self.review_state == DataReviewState.DISAPPROVED

    def approve(self, reviewer: User):
        with transaction.atomic():
            # h = UploadHistory.objects.filter(meta_id_list__overlap=[self.id]).first()
            # if h:
            #     h.meta_id_list.remove(self.id)
            #     h.save()
            DataMeta.objects.filter(pk=self.pk).update(review_state=DataReviewState.APPROVED, reviewer=reviewer,
                                                       disapprove_reason=None, review_date=timezone.now())

    def disapprove(self, reviewer: User, reasons: List[DisapproveReason], reason: str):
        if reasons:
            reasons = [DisapproveReason(x).to_string for x in reasons]
            reasons = ';'.join(reasons)
        else:
            reasons = reason
        with transaction.atomic():
            # h = UploadHistory.objects.filter(meta_id_list__overlap=[self.id]).first()
            # if h:
            #       h.meta_id_list.remove(self.id)
            #     h.save()
            DataMeta.objects.filter(pk=self.pk).update(review_state=DataReviewState.DISAPPROVED, reviewer=reviewer,
                                                       disapprove_reason=reasons, review_date=timezone.now())

    @property
    def reason_list(self):
        if self.disapprove_reason:
            return [ugettext(x) for x in self.disapprove_reason.split(';')]
        else:
            return []

    def check_source(self):
        try:
            sh = DataMeta.SourceHelper.parse(self.source)
            if sh.is_reference() and (self.reference is None or len(self.reference.strip()) == 0):
                raise ValueError(_('Source Reference with no Reference'))
        except ValueError as e:
            raise e

    def get_source(self):
        try:
            return DataMeta.SourceHelper.parse(self.source).get_source_name()
        except Exception:
            return ''

    def get_methods(self):
        try:
            return DataMeta.SourceHelper.parse(self.source).get_method_names()
        except Exception:
            return []

    def get_platform(self):
        try:
            return Platforms.get_platform_name(self.platform_belong)
        except Exception:
            return ''

    def get_subject_id(self):
        return (self.other_info or {}).get('subject')

    def get_project_id(self):
        return (self.other_info or {}).get('project')

    @property
    def dataset_ref_count(self):
        # 同数据集的引用次数.
        return self.dataset.get_ref_count if self.dataset else 0

    def check_other_info_completeness(self):
        return (self.get_project_id() and self.get_subject_id()) is not None

    def has_view_permission(self, username):
        if self.public_range == 'public':
            return True
        if self.public_range == 'person' or not self.check_other_info_completeness():
            return self.username == username

        usernames = [self.user.username]
        project_usernames = MaterialProject.objects.get(id=self.get_project_id()).get_leader_and_members_username()
        subject_usernames = MaterialSubject.objects.get(id=self.get_subject_id()).get_leader_and_members_username()

        if self.public_range == 'project':
            usernames.extend(project_usernames)
        if self.public_range == 'subject':
            usernames.extend(subject_usernames)
        return username in list(set(usernames))


class DataUploadSourceMap(models.Model):
    meta = models.OneToOneField(DataMeta, on_delete=models.CASCADE)
    file = models.ForeignKey(UploadedSourceFile, on_delete=models.SET_NULL, null=True)


class UploadHistory(models.Model):
    class Meta:
        ordering = ("-time",)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='upload_histories')
    time = models.DateTimeField(auto_now_add=True)
    meta_id_list = ArrayField(models.IntegerField())
    count = models.IntegerField()
    source = models.ForeignKey(UploadedSourceFile, on_delete=models.SET_NULL, null=True)
    # 判断时统一以source为准，source为空表示表单提交，否则是文件提交
    via_file = models.BooleanField(default=False)
    review_state = models.IntegerField(default=DataReviewState.PENDING)
    reviewer = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(MaterialCategory, null=True, on_delete=models.SET_NULL)
    disapprove_reason = models.TextField(null=True)
    platform_belong = models.IntegerField(choices=Platforms.PLATFORM_CHOICE, default=0)

    @property
    def reason_list(self):
        if self.disapprove_reason:
            return [ugettext(x) for x in self.disapprove_reason.split(';')]
        else:
            return []

    @property
    def source_url(self):
        if self.source:
            return self.source.get_url(absolute=True)

    @property
    def format_time(self):
        if self.time:
            return timezone.localtime(self.time).strftime('%Y-%m-%d %H:%M:%S')

    def delete(self, using=None, keep_parents=False):
        if self.source:
            self.source.delete()
        super().delete(using, keep_parents)

    @property
    def review_status_description(self):
        return DataReviewState(self.review_state).description

    @property
    def pending(self):
        return self.review_state == DataReviewState.PENDING

    @property
    def approved(self):
        return self.review_state == DataReviewState.APPROVED

    @property
    def disapproved(self):
        return self.review_state == DataReviewState.DISAPPROVED

    @property
    def reviewer_real_name(self):
        return self.reviewer.real_name if self.reviewer else _("User Deleted")

    @property
    def uploaded_by_real_name(self):
        return self.user.real_name if self.user else _("User Deleted")

    @property
    def title(self):
        upload_history_title = ""
        if self.source is not None:
            upload_history_title = self.source.get_url().split('/')[-1].split('.')[0]
        else:
            for meta_id in self.meta_id_list:
                data_meta = DataMeta.objects.filter(id=meta_id).first()
                if data_meta is not None:
                    upload_history_title = data_meta.title
                    break
        return upload_history_title

    MAX_REVOKE_REVIEW_DATA_SYNC_NUM = 10000  # 数据量大于MAX_REVOKE_REVIEW_DATA_SYNC_NUM，异步撤回数据审核通过
    MAX_RETRACT_DATA_SYNC_NUM = 1000  # MAX_REVOKE_DATA_SYNC_NUM，异步撤回数据

    def approve_data(self, reviewer: User, approved, reasons=None, reason=None):
        state = DataReviewState.APPROVED if approved else DataReviewState.DISAPPROVED
        update_kwargs = dict(review_state=state, reviewer=reviewer)
        if not approved:
            if not reasons and not reason:
                raise ValueError("Must provide at least one reason")
            if reasons is not None:
                reasons = [DisapproveReason(x).to_string for x in reasons]
                update_kwargs['disapprove_reason'] = ';'.join(reasons)
            else:
                update_kwargs['disapprove_reason'] = reason
        with transaction.atomic():
            DataMeta.objects.filter(id__in=self.meta_id_list).update(**update_kwargs)
            DataMeta.objects.filter(id__in=self.meta_id_list).update(review_date=timezone.now())
            UploadHistory.objects.filter(id=self.id).update(**update_kwargs)

    def revoke_data_review_status(self):
        if self.review_state == DataReviewState.PENDING:
            raise MGEError.BAD_DATA("数据未审核，拒绝撤回！")
        with transaction.atomic():
            DataMeta.objects.filter(id__in=self.meta_id_list).update(review_state=DataReviewState.PENDING,
                                                                     reviewer=None, review_date=None)
            UploadHistory.objects.filter(id=self.id).update(review_state=DataReviewState.PENDING, reviewer=None,
                                                            disapprove_reason=None)
            notify(self.user, NotificationType.DATA_REVIEW_REVOKE, self.format_time)

    def retract_data(self):
        history = UploadHistory.objects.get(id=self.id)
        with transaction.atomic():
            DataMeta.objects.filter(id__in=history.meta_id_list).delete()
            history.delete()
            notify(history.user, NotificationType.DATA_RETRACT, history.format_time, self.id)
            return len(history.meta_id_list)


class DoiRegisterInfo(models.Model):
    """ 申请doi的注册信息 供doi注册管理员审核查看
    `title`:   数据集或单条数据的标题
    `contributor`：  数据集的责任者
    `project`: 数据集所属的项目
    `status`: 当前的状态( 0-- 未审核 1--已通过  2--未通过)
    `data_ids`:  数据集所包含的数据id列表 （单条数据id与数据集id 统一为list 类型）
    `applicant`: 申请者的用户名
    `add_time`:  申请doi的时间
    `dataset_id`:  所属的dataset的id,如果不属于dataset那么为null
    """
    STATUS = [(DoiRegisterState.UNAUDITED, _('Unaudited')), (DoiRegisterState.APPROVED, _('Approved')),
              (DoiRegisterState.NOT_APPROVED, _('Unapproved'))]
    title = models.CharField(max_length=255, null=False, blank=False)
    contributor = models.CharField(max_length=255, null=False, blank=False)
    project = models.CharField(max_length=255, null=False, blank=False)
    status = models.IntegerField(choices=STATUS, default=0)
    data_ids = ArrayField(models.IntegerField(), null=False, blank=False, default=list)
    applicant = models.TextField(default=get_current_username, null=True)
    add_time = models.DateTimeField(auto_now_add=True)
    dataset_id = models.IntegerField(null=True, default=None)

    class Meta:
        verbose_name = _('DOI Register Info')
        ordering = ('-add_time',)

    def to_dict(self):
        d = {
            'id': self.id,
            'title': self.title,
            'contributor': self.contributor,
            'project': self.project,
            'status': self.status,
            'data_ids': self.data_ids,
            'applicant': self.applicant,
            'add_time': timezone.localtime(self.add_time).strftime('%Y-%m-%d %H:%M:%S'),
            'dataset_id': self.dataset_id
        }
        if self.dataset_id is not None:
            try:
                dataset = DataSet.objects.get(pk=self.dataset_id)
                d['dataset_title'] = dataset.title
            except DataSet.DoesNotExist:
                pass
        return d

    @property
    def is_unaudited(self):
        return self.status == DoiRegisterState.UNAUDITED

    @property
    def is_approved(self):
        return self.status == DoiRegisterState.APPROVED

    @property
    def is_not_approved(self):
        return self.status == DoiRegisterState.NOT_APPROVED


class DataScore(models.Model):
    """ 记录数据的评分信息
    `user`: 单条评分的用户信息
    `data`: 单条评分的数据信息
    `score`: 具体的评价分数
    `time`: 提交时间
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_scores')
    data = models.ForeignKey(DataMeta, on_delete=models.CASCADE, related_name='data_scores')
    score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    time = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        d = {
            'user': self.user.username,
            'data': self.data.title,
            'score': self.score
        }
        return d


class DataPublicRange:
    """限定数据公开范围以及公开时间
    'public_range_zh': 中文公开范围
    'public_range_en': 英文公开范围
    'public_time': 可选择公开时间 目前都按年计算
    """

    @unique
    class DataPublicRangeEnum(IntEnum):
        public = 0
        project = 1
        subject = 2
        person = 3

    _('public_date')
    _('public_range')

    public_range_zh = [_('public'), _('project'), _('subject'), _('person')]
    public_range_en = ['public', 'project', 'subject', 'person']
    public_time = [0, 1, 2, 3]

    @classmethod
    def to_tree(cls):
        lang = get_language() or 'zh'
        public_range = getattr(cls, 'public_range_' + lang[:2])
        tree = list()
        for item in cls.DataPublicRangeEnum:
            tree.append({
                'id': item.value,
                'name': public_range[item.value],
                'public_time': cls.public_time
            })

        tree[0]['public_time'] = []  # 公开不需要选择时间
        return tree

    @classmethod
    def generate_range(cls, id):
        try:
            id = int(id)
        except (ValueError, TypeError):
            pass
        if isinstance(id, int):
            if 0 <= id <= 3:
                return cls.public_range_en[id]
            else:
                return cls.public_range_en[0]
        else:  # 已经
            if id in cls.public_range_en or id in cls.public_range_zh:
                return id
            else:  # 默认值
                return cls.public_range_en[0]

    @classmethod
    def generate_date(cls, year_plus):
        try:
            year_plus = int(year_plus)
        except (ValueError, TypeError):
            pass
        if isinstance(year_plus, int):
            now_time = timezone.now()
            return now_time.replace(now_time.year + year_plus)
        elif isinstance(year_plus, datetime):
            return year_plus
        else:  # 这里默认现在
            now_time = timezone.now()
            return now_time.replace(now_time.year)


class ResearchDataMeta(DataMeta):
    class Meta:
        proxy = True
        verbose_name = '科研成果'
        verbose_name_plural = '科研成果'
