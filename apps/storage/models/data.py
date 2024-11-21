# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2018/1/4
# @Description : 元数据相关


import logging
import re
from enum import Enum, IntEnum
from typing import Tuple

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.validators import RegexValidator
from django.db import models
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext_noop as _, gettext

from apps.account.models.users import User, UserRole
from apps.storage.docs.data import DataContent
from apps.storage.models.material import MaterialProject, MaterialSubject, ProjectSubjectMember
from .material import Category

logger = logging.getLogger('django')

_KEYWORDS_SEP = re.compile(r'[,， ]')


class DataReviewState(IntEnum):
    PENDING = 0
    APPROVED = 1
    DISAPPROVED = 2

    @property
    def description(self):
        if self == DataReviewState.PENDING:
            return gettext("Reviewing Pending")
        elif self == DataReviewState.APPROVED:
            return gettext("Approved")
        elif self == DataReviewState.DISAPPROVED:
            return gettext("Disapproved")


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
    DATA_ID = '数据ID'
    TITLE = "数据标题"
    ABSTRACT = "摘要"
    MATERIAL_CLASS = "领域分类"
    TEMPLATE_NAME = "模板名"
    KEYWORDS = "关键词"
    AUTHOR = "上传人"
    CREATED_AT = "上传时间"
    REVIEWER = "审核人"
    REVIEWER_INS = "审核人单位"
    PROJECT = "一级机构"
    SUBJECT = "二级机构"
    TEMPLATE_ID = "模板ID"

    CATEGORY = "领域分类"
    CATEGORY_ID = "领域分类ID"
    TEMPLATE_TITLE = "模板标题"

    VISIBILITY = "可见范围"
    WATER_MARK = "水印"

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
        elif self == DataMetaFieldEnum.VISIBILITY:
            return "visibility"
        elif self == DataMetaFieldEnum.PROJECT:
            return "project_id"
        elif self == DataMetaFieldEnum.SUBJECT:
            return "subject_id"
        elif self == DataMetaFieldEnum.TEMPLATE_NAME:
            return "template__name"
        elif self == DataMetaFieldEnum.MATERIAL_CLASS:
            return "category__name"
        elif self == DataMetaFieldEnum.CATEGORY_ID:
            return "category_id"
        elif self == DataMetaFieldEnum.TITLE:
            return "title"
        elif self == DataMetaFieldEnum.ABSTRACT:
            return "abstract"
        elif self == DataMetaFieldEnum.KEYWORDS:
            return "keywords"
        elif self == DataMetaFieldEnum.REVIEWER:
            return "reviewer_id"
        elif self == DataMetaFieldEnum.REVIEWER_INS:
            return "reviewer__institution"
        elif self == DataMetaFieldEnum.CREATED_AT:
            return "add_time"
        elif self == DataMetaFieldEnum.AUTHOR:
            return "user_id"
        # elif self == DataMetaFieldEnum.WATER_MARK:
        #     return "water_mark"
        else:
            raise ValueError(f"Unknown field {self}")

    @property
    def description(self):
        return gettext(self.value)

    @property
    def required(self):
        if self in (
                DataMetaFieldEnum.TITLE,
                DataMetaFieldEnum.ABSTRACT,
                DataMetaFieldEnum.KEYWORDS,
        ):
            return True
        else:
            return False

    def is_blank_value(self, value):
        if self in (
                DataMetaFieldEnum.TITLE,
                DataMetaFieldEnum.ABSTRACT,
                DataMetaFieldEnum.KEYWORDS,
        ) and len(str(value).strip()) == 0:
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
        elif self in (self.__class__.MATERIAL_CLASS, self.__class__.CATEGORY):
            return data_meta.category.name

        elif self == self.__class__.TEMPLATE_ID:
            return str(data_meta.template_id)
        elif self == self.__class__.KEYWORDS:
            return ', '.join(data_meta.keywords or [])
        elif self == self.__class__.AUTHOR:
            return data_meta.user_real_name
        elif self == self.__class__.CREATED_AT:
            return data_meta.add_time.strftime('%Y-%m-%d %H:%M:%S')
        elif self == self.__class__.ABSTRACT:
            return data_meta.abstract
        elif self == self.__class__.REVIEWER:
            return getattr(data_meta.reviewer, 'real_name', _("无"))
        elif self == self.__class__.PROJECT:
            return data_meta.project_id
        elif self == self.__class__.SUBJECT:
            return data_meta.subject_id
        elif self == self.__class__.VISIBILITY:
            return data_meta.visibility

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
        # if self == DataMetaFieldEnum.PROJECT:
        #     if MaterialProject.objects.filter(pk=value).first() is None:
        #         from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
        #         raise ParsingError(ParsingErrorEnum.PROJECT_NOT_FOUND, o1=value)
        #     return
        # if self == DataMetaFieldEnum.SUBJECT:
        #     value = str(value)
        #     if MaterialSubject.objects.filter(pk=value).first() is None:
        #         from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
        #         raise ParsingError(ParsingErrorEnum.SUBJECT_NOT_FOUND, o1=value)
        if self == DataMetaFieldEnum.VISIBILITY:
            if isinstance(value, str):
                value = value.strip()
                try:
                    return DATA_VISIBILITY_NAME_MAP[value]
                except KeyError:
                    from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                    raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=value, o2=_("字符串"), o3=self.description)
            try:
                return DataVisibility(value)
            except ValueError:
                from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
                raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=value, o2=_("字符串"), o3=self.description)
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
            DataMetaFieldEnum.ABSTRACT,
            DataMetaFieldEnum.KEYWORDS,
            DataMetaFieldEnum.PROJECT,
            DataMetaFieldEnum.SUBJECT,
            DataMetaFieldEnum.VISIBILITY,
            # DataMetaFieldEnum.WATER_MARK
        )

    @staticmethod
    def writer_meta_fields() -> Tuple['DataMetaFieldEnum', ...]:
        return (
            DataMetaFieldEnum.TITLE,
            DataMetaFieldEnum.MATERIAL_CLASS,
            DataMetaFieldEnum.ABSTRACT,
            DataMetaFieldEnum.KEYWORDS,
            DataMetaFieldEnum.AUTHOR,
            DataMetaFieldEnum.CREATED_AT,
            DataMetaFieldEnum.PROJECT,
            DataMetaFieldEnum.SUBJECT,
            # DataMetaFieldEnum.WATERMARK

        )


class DataMetaManager(models.Manager):
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(importing=False).order_by('-add_time')


class ImportingDataMetaManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(importing=True)


class DataVisibility(IntEnum):
    """
    数据的公开范围
    """
    PUBLIC = 0
    PROJECT = 1
    SUBJECT = 2
    PRIVATE = 3

    @property
    def description(self):
        if self == DataVisibility.PUBLIC:
            return '公开'
        elif self == DataVisibility.PROJECT:
            return '一级机构内可见'
        elif self == DataVisibility.SUBJECT:
            return '二级机构内可见'
        elif self == DataVisibility.PRIVATE:
            return '私有'


DATA_VISIBILITY_NAME_MAP = {
    DataVisibility.PRIVATE.description: DataVisibility.PRIVATE.value,
    DataVisibility.PUBLIC.description: DataVisibility.PUBLIC.value,
    DataVisibility.PROJECT.description: DataVisibility.PROJECT.value,
    DataVisibility.SUBJECT.description: DataVisibility.SUBJECT.value,
}


class BatchUploadHistory(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)


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
    category = models.ForeignKey(Category, null=True,
                                 on_delete=models.PROTECT, limit_choices_to={'leaf': True})
    template = models.ForeignKey('storage.Template', on_delete=models.PROTECT, null=True)
    keywords = ArrayField(models.CharField(max_length=255), null=True, blank=True, default=list)
    doi = models.CharField(max_length=255, null=True, blank=True)
    abstract = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    add_time = models.DateTimeField(auto_now_add=True, db_index=True)
    dc_id = models.CharField(max_length=24, validators=(RegexValidator(r'^[a-f\d]{24}$'),))
    importing = models.BooleanField(default=False)
    reviewer = models.ForeignKey(User, null=True, on_delete=models.PROTECT, related_name="reviewed_data")
    review_state = models.IntegerField(default=DataReviewState.PENDING)
    review_time = models.DateTimeField(null=True)
    disapprove_reason = models.TextField(null=True)
    objects = DataMetaManager()
    importing_objects = ImportingDataMetaManager()
    public_date = models.DateTimeField(default=timezone.now)
    visibility = models.IntegerField(default=DataVisibility.PRIVATE, db_index=True)
    project = models.ForeignKey(MaterialProject, on_delete=models.PROTECT)
    subject = models.ForeignKey(MaterialSubject, on_delete=models.PROTECT)
    batch_upload_history = models.ForeignKey(BatchUploadHistory, on_delete=models.PROTECT, null=True)
    # 0(默认):无水印, 1:数据水印, 2:二级机构水印, 3:一级机构水印
    water_mark = models.IntegerField(default=0)

    class Meta:
        # 不要在这一层加默认排序
        verbose_name = _('Data Meta')
        verbose_name_plural = _('Data Metas')
        indexes = [
            models.Index(fields=['importing']),
            models.Index(fields=['-add_time']),
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
        return _("用户已删除")

    def delete(self, *args, **kwargs):
        from apps.storage.models.template import TemplateDataStatistic
        """
        删除自身，同时删除content，并将所用模板和标签的引用计数 -1
        同时从es 中删除
        """
        template_id = self.template_id
        d_id = self.id
        with transaction.atomic():
            super().delete(*args, **kwargs)
            import pytz
            beijing_tz = pytz.timezone(settings.TIME_ZONE)
            now_date = self.add_time
            beijing_now = now_date.astimezone(beijing_tz)
            now_date = beijing_now.date()
            TemplateDataStatistic.objects.filter(
                template_id=template_id,
                day=now_date
            ).select_for_update().update(num_new_data=models.F('num_new_data') - 1)
            from apps.search.core_v2.es import delete_meta_with_ids
            delete_meta_with_ids(meta_ids=[d_id])
            dc = DataContent.objects.get(pk=self.dc_id)
            dc.delete()

    def delete_meta_only(self):
        assert settings.DEBUG
        super().delete()

    def to_dict(self, meta_only=True):
        """返回 meta 部分的 dict"""
        d = {'id': self.id,
             'title': self.title,
             'category': self.category.name if self.category else "NULL",
             'category_id': self.category_id,
             'tid': self.template_id,
             'keywords': self.keywords or [],
             'abstract': self.abstract,
             'author': self.user_real_name,
             'add_time': timezone.localtime(self.add_time).strftime('%Y-%m-%d %H:%M:%S'),
             'project': self.project.id,
             'subject': self.subject.id,
             'reviewer': getattr(self.reviewer, 'real_name', ''),
             'reviewer_ins': getattr(self.reviewer, 'institution', ''),
             'approved': self.approved,
             'visibility': self.visibility,
             'project_name': self.project.name,
             'subject_name': self.subject.name,
             # 'water_mark': self.water_mark
             }
        if not meta_only:
            content = DataContent.objects(pk=self.dc_id).first()
            d['content'] = content.to_mongo() if content else None
        return d

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
        from ...search.core_v2.es import insert_meta_with_ids
        with transaction.atomic():
            DataMeta.objects.filter(
                pk=self.pk
            ).update(
                review_state=DataReviewState.APPROVED, reviewer=reviewer,
                disapprove_reason=None, review_time=timezone.now()
            )
            insert_meta_with_ids([self.pk])

    def disapprove(self, reviewer: User, reason: str):
        DataMeta.objects.filter(
            pk=self.pk
        ).update(
            review_state=DataReviewState.DISAPPROVED,
            reviewer=reviewer,
            disapprove_reason=reason,
            review_time=timezone.now()
        )

    @staticmethod
    def batch_approve(meta_id_list: list[int], reviewer: User):
        from apps.search.core_v2.es import update_field
        with transaction.atomic():
            DataMeta.objects.filter(
                pk__in=meta_id_list
            ).update(
                reviewer=reviewer,
                review_state=DataReviewState.APPROVED, disapprove_reason=None, review_time=timezone.now()
            )
            update_field(meta_id_list, 'review_state', DataReviewState.APPROVED.value)

    @staticmethod
    def batch_disapprove(meta_id_list: list[int], reviewer: User, reason: str):
        DataMeta.objects.filter(
            pk__in=meta_id_list
        ).update(
            review_state=DataReviewState.DISAPPROVED, reviewer=reviewer, disapprove_reason=reason,
            review_time=timezone.now()
        )

    @property
    def reason_list(self):
        if self.disapprove_reason:
            return [gettext(x) for x in self.disapprove_reason.split(';')]
        else:
            return []

    def get_subject_id(self):
        return self.subject_id

    def get_project_id(self):
        return self.project_id

    def can_view(self, user: User):
        if not user.is_authenticated:
            return False

        if self.username == user.username:
            return True
        if self.visibility == DataVisibility.PRIVATE:
            return self.username == user.username
        if user.role == UserRole.RESEARCHER:
            if self.visibility == DataVisibility.PUBLIC:
                return self.is_approved()
            if self.visibility == DataVisibility.PROJECT:
                if ProjectSubjectMember.objects.filter(project_id=self.project_id, user=user).exists():
                    return self.is_approved()
            if self.visibility == DataVisibility.SUBJECT:
                if ProjectSubjectMember.objects.filter(subject_id=self.subject_id, user=user).exists():
                    return self.is_approved()
        if user.role >= UserRole.DATA_ADMIN:
            if self.visibility == DataVisibility.PUBLIC:
                # 公开数据未审核前只能由本项目内的数据审核员查看
                if ProjectSubjectMember.objects.filter(project=self.project, user=user).exists():
                    return True
                return self.is_approved()
            if self.visibility == DataVisibility.PROJECT:
                if ProjectSubjectMember.objects.filter(project_id=self.project_id, user=user).exists():
                    return True
            if self.visibility == DataVisibility.SUBJECT:
                q1 = Q(subject_id=self.subject_id, user=user)
                q2 = Q(project_id=self.project_id, subject_id__isnull=True, user=user)
                if ProjectSubjectMember.objects.filter(q1 | q2).exists():
                    return True

    def is_approved(self):
        return self.review_state == DataReviewState.APPROVED


class DataStatistic(models.Model):
    meta = models.ForeignKey(DataMeta, on_delete=models.CASCADE)
    template = models.ForeignKey('storage.Template', on_delete=models.CASCADE)
    num_views = models.IntegerField(default=0, db_index=True)
    num_downloads = models.IntegerField(default=0, db_index=True)
    day = models.DateField(db_index=True, auto_now_add=True)
    # waterMark = models.BooleanField(default=False)

    class Meta:
        unique_together = ('meta', 'day')
