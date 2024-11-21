# -*- coding: utf-8 -*-

# @File   : template
# @Author : Harold
# @Date   : 2018/1/6

from copy import deepcopy
from datetime import date
from enum import IntEnum, Enum
from typing import Union, List, Tuple, Optional, Dict
import pytz
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db import transaction
from django.utils import timezone
from django.utils.translation import gettext
from django.utils.translation import gettext as _

from apps.account.models.users import User
from apps.storage.models.data import DataMeta, DataReviewState, DisapproveReason
from apps.storage.models.data_helper import DataHelper
from mgedata.errors.models import MGEError


class RangePart(Enum):
    LOWER_BOUND = 'lb'
    UPPER_BOUND = 'ub'
    VALUE = 'val'
    ERROR = 'err'


class TemplateFieldEnum(IntEnum):
    """模板字段枚举"""
    STRING = 1  # 字符串型
    NUMBER = 2  # 数值型
    RANGE = 3  # 范围型
    IMAGE = 4  # 图片型
    FILE = 5  # 文件型
    CHOICE = 6  # 候选型
    ARRAY = 7  # 数组型
    TABLE = 8  # 表格型
    CONTAINER = 9  # 容器型
    GENERATOR = 10  # 生成器型

    @classmethod
    def min_value(cls):
        return cls._member_map_.get(cls._member_names_[0]).value

    @classmethod
    def max_value(cls):
        return cls._member_map_.get(cls._member_names_[-1]).value

    @classmethod
    def get_field_enum(cls, name_or_value):
        return cls._value2member_map_.get(name_or_value)

    @classmethod
    def get_name_by_value(cls, value):
        return cls._value2member_map_.get(value).name

    @classmethod
    def get_value_by_name(cls, name):
        return cls._value2member_map_.get(name).value

    @property
    def is_string(self):
        return self.value == TemplateFieldEnum.STRING

    @property
    def is_number(self):
        return self.value == TemplateFieldEnum.NUMBER

    @property
    def is_range(self):
        return self.value == TemplateFieldEnum.RANGE

    @property
    def is_image(self):
        return self.value == TemplateFieldEnum.IMAGE

    @property
    def is_file(self):
        return self.value == TemplateFieldEnum.FILE

    @property
    def is_choice(self):
        return self.value == TemplateFieldEnum.CHOICE

    @property
    def is_array(self):
        return self.value == TemplateFieldEnum.ARRAY

    @property
    def is_table(self):
        return self.value == TemplateFieldEnum.TABLE

    @property
    def is_container(self):
        return self.value == TemplateFieldEnum.CONTAINER

    @property
    def is_generator(self):
        return self.value == TemplateFieldEnum.GENERATOR

    @property
    def description(self):
        arr = (_("字符串型"), _("数值型"), _("范围型"), _("图片型"), _("文件型"), _("候选项"), _("数组型"), _("表格型"),
               _("容器型"), _("生成器型"),)
        return arr[self - 1]

    @property
    def is_basic(self):
        return self in (
            TemplateFieldEnum.STRING,
            TemplateFieldEnum.NUMBER,
            TemplateFieldEnum.RANGE,
            TemplateFieldEnum.CHOICE
        )

    @property
    def is_basic_or_attachment(self):
        return self in (
            TemplateFieldEnum.STRING,
            TemplateFieldEnum.NUMBER,
            TemplateFieldEnum.RANGE,
            TemplateFieldEnum.CHOICE,
            TemplateFieldEnum.FILE,
            TemplateFieldEnum.IMAGE,
        )

    @staticmethod
    def is_range_interval(type_number):
        return type_number == 0

    @staticmethod
    def is_range_error(type_number):
        return type_number == 1


class DocumentScope(IntEnum):
    """
    字段对应的搜索域（对应的MongoDB集合）
    """
    DATA_CONTENT = 0
    DATA_CONTAINER = 1
    DATA_TABLE_ROW = 2
    DATA_TABLE = 3


class TemplateField:
    """模板字段，屏蔽了模板底层的数据格式，提供了统一的访问模板字段的方法"""

    def __init__(self, field_dict: dict, field_path_list: Union[List[str], Tuple[str]], parent_field=None,
                 is_array_element=False, array_depth=0, field_scope: DocumentScope = DocumentScope.DATA_CONTENT,
                 direct_array_parent=None, range_part=None, exclude_list=(), include_list=(), force_include=False):
        """
        :param field_dict: 字段原始dict
        :param field_path_list: 字段的完整路径list
        :param is_array_element: 字段本身是否是数组的元素
        :param array_depth: 数组深度
        """
        self.delay_excluded = False
        self._field_path_str_field_map = {}
        self._sub_field_name_field_map = {}
        self._t = TemplateFieldEnum(field_dict['t'])
        self._scope = field_scope
        self._self_in_array = is_array_element
        self._misc = field_dict.get('misc', {})
        self._r = field_dict.get('r', False)
        self._parent_field = parent_field
        self._field_path_list = field_path_list
        self._field_path_str = '.'.join([str(x) for x in field_path_list])
        self._parent_path_str = '.'.join([str(x) for x in field_path_list[:-1]])

        self._direct_array_parent = direct_array_parent
        self._range_part = range_part
        self._is_embedded_in_array = array_depth > 0
        if not force_include:
            if exclude_list and self._field_path_str in exclude_list or include_list and self._field_path_str not in include_list:
                self.delay_excluded = True
                return

        if self._t.is_container or self._t.is_generator:
            sub_scope = DocumentScope.DATA_CONTAINER
        elif self._t.is_table:
            sub_scope = DocumentScope.DATA_TABLE_ROW
        else:
            sub_scope = field_scope

        if is_array_element:
            self._field_name = field_path_list[-2]
        else:
            self._field_name = field_path_list[-1]
        self._field_path_str_for_display = '.'.join(filter(lambda x: isinstance(x, str), field_path_list))

        self._sub_fields = []

        force_include = force_include or include_list and self._field_path_str in include_list

        if self._t.is_array:

            f = TemplateField(self._misc, self._field_path_list + [self._misc['t']],
                              parent_field=self,
                              is_array_element=True,
                              field_scope=sub_scope,
                              array_depth=array_depth + 1,
                              direct_array_parent=self,
                              force_include=force_include)

            if f.delay_excluded:
                self.delay_excluded = True
                return

            self._sub_fields.append(f)
            self._field_path_str_field_map[f._field_path_str] = f
            self._field_path_str_field_map.update(f._field_path_str_field_map)
            del f._field_path_str_field_map

        elif self._t.is_range and range_part is None:

            if self.range_type == 0:
                child1 = TemplateField(field_dict, field_path_list + ['lb'], parent_field, is_array_element,
                                       array_depth, field_scope, direct_array_parent, RangePart.LOWER_BOUND)
                child2 = TemplateField(field_dict, field_path_list + ['ub'], parent_field, is_array_element,
                                       array_depth,
                                       field_scope, direct_array_parent, RangePart.UPPER_BOUND)
            else:
                child1 = TemplateField(field_dict, field_path_list + ['val'], parent_field, is_array_element,
                                       array_depth, field_scope, direct_array_parent, RangePart.VALUE)
                child2 = TemplateField(field_dict, field_path_list + ['err'], parent_field, is_array_element,
                                       array_depth,
                                       field_scope, direct_array_parent, RangePart.ERROR)

            self._field_path_str_field_map[child1._field_path_str] = child1
            self._field_path_str_field_map[child2._field_path_str] = child2

        else:
            is_embedded = False
            if exclude_list or include_list:
                misc_copy = deepcopy(self._misc)
            else:
                misc_copy = {}

            def remove_sub_field(sub_field_name):
                misc_copy.pop(sub_field_name, None)
                if self._t.is_generator:
                    sub = misc_copy['_opt']
                elif self._t.is_table:
                    sub = misc_copy['_head']
                elif self._t.is_container:
                    sub = misc_copy['_ord']
                else:
                    sub = []
                sub.remove(sub_field_name)

            for sub_field_name in self.sub_field_names:
                f = TemplateField(self._misc[sub_field_name], self._field_path_list + [sub_field_name],
                                  parent_field=self,
                                  is_array_element=False,
                                  field_scope=sub_scope,
                                  array_depth=array_depth,
                                  direct_array_parent=direct_array_parent,
                                  force_include=force_include)
                if f.delay_excluded:
                    remove_sub_field(sub_field_name)
                    continue
                self._sub_fields.append(f)
                self._sub_field_name_field_map[f.field_name] = f
                self._field_path_str_field_map[f._field_path_str] = f
                self._field_path_str_field_map.update(f._field_path_str_field_map)
                del f._field_path_str_field_map
                is_embedded = True
            if is_embedded and not len(self._sub_fields):
                self.delay_excluded = True
            if exclude_list or include_list:
                self._misc = misc_copy

    def __getitem__(self, item: Union[str, int]):
        """
        提供下标访问方式，如果下标i是数字则返回第i个子字段，是字符串则返回名称为i的子字段
        :param item: 子字段的名称或者序号（0开始）
        :return: 子字段TemplateField
        """
        if isinstance(item, str):
            return self._sub_field_name_field_map[item]
        else:
            return self._sub_fields[item]

    def __unicode__(self):
        return f"{self.field_path_str}: {self.field_type.description}"

    def __str__(self):
        return self.__unicode__()

    def __repr__(self):
        return self.__unicode__()

    def __eq__(self, other):
        if not isinstance(other, TemplateField):
            return False
        return self._field_path_str == other._field_path_str

    def __ne__(self, other):
        return not self == other

    @property
    def document_scope(self) -> DocumentScope:
        """
        字段所在搜索域，检索时才使用
        :return:
        """
        return self._scope

    @property
    def document_path(self):
        """
        字段的document_path，检索时才使用
        :return:
        """
        if self.is_array_element:
            return self.parent_field.document_path
        elif self.parent_field is not None:
            return self.parent_field.field_path_str
        else:
            return '/'  # DataContent的字段，认为其_path是"/"

    @property
    def is_embedded_in_array(self):
        """
        字段的祖先字段是否是数组元素，检索时才使用
        :return:
        """
        return self._is_embedded_in_array

    @property
    def direct_array_or_table_parent(self) -> 'TemplateField':
        """
        父级的数组或表格字段，只考虑父级，不考虑祖父及再往上。检索时才使用
        :return:
        """
        if self.is_table_column:
            return self._parent_field
        return self._direct_array_parent

    @property
    def is_table_column(self):
        """
        是否是表格的列（其父字段是否是表格）。检索时才使用
        :return:
        """
        if self._parent_field:
            return self._parent_field.field_type.is_table

    @property
    def sub_fields(self) -> List["TemplateField"]:
        """
        子字段，如果没有返回[]
        :return:
        """
        return self._sub_fields

    @property
    def parent_field(self) -> "TemplateField":
        """
        父字段
        :return:
        """
        return self._parent_field

    @property
    def is_array_element(self) -> bool:
        """
        是否是数组的元素
        :return:
        """
        return self._self_in_array

    @property
    def parent_is_array_element(self) -> bool:
        """
        字段的父字段是否是数组元素，检索时才使用
        :return:
        """
        return False if self._parent_field is None else self._parent_field.is_array_element

    @property
    def sub_field_names(self) -> List[str]:
        """
        子字段的名称数组
        :return:
        """
        if self._t is None or self._t.is_container:
            sub_name_list = '_ord'
        elif self._t.is_generator:
            sub_name_list = '_opt'
        elif self._t.is_table:
            sub_name_list = '_head'
        else:
            return []
        return self._misc.get(sub_name_list, [])

    @property
    def external_field_path_str(self):
        """
        字段的path，给用户展示时使用，否则请使用field_path_str
        :return:
        """
        return self._field_path_str_for_display

    @property
    def field_path_str(self):
        """
        字段的path，代码中使用，给用户展示时请使用external_field_path_str
        :return:
        """
        return self._field_path_str

    @property
    def field_type(self) -> TemplateFieldEnum:
        """
        字段类型
        :return:
        """
        return self._t

    @property
    def field_name(self):
        """
        字段的名字
        :return:
        """
        return self._field_name

    @property
    def misc(self):
        """
        字段的misc字典
        :return:
        """
        return self._misc

    @property
    def unit(self) -> Optional[str]:
        """
        字段的单位，若没有返回None
        :return:
        """
        return self._misc.get('unit')

    @property
    def element_field(self) -> Optional['TemplateField']:
        """
        数组字段的子字段
        :return:
        """
        if self._t.is_array:
            return self._sub_fields[0]

    @property
    def choices_list(self) -> Optional[List[str]]:
        """
        候选型字段合并分组之后的选项列表
        :return:
        """
        if self._t.is_choice:
            choices = []
            choices.extend(self._misc.get('opt', []))
            for group in self._misc.get('grp', []):
                choices.extend(group.get('items', []))
            return choices

    @property
    def required(self):
        """
        是否必须填写
        :return:
        """
        return self._r

    @property
    def range_type(self):
        """
        范围型字段的type
        :return:
        """
        return self._misc.get('type')

    @property
    def has_multiple_files(self):
        """
        文件型和图片型是否允许多个文件或图片
        :return:
        """
        return self._misc.get('multi') or False

    @property
    def dict_for_export(self):
        j = {'_type': self.field_type.description, 'r': self.required}
        if self.unit:
            j['_unit'] = self.unit
        for sub_field in self.sub_fields:
            j[sub_field.field_name] = sub_field.dict_for_export
        if self.field_type.is_array:
            j[self.field_name] = self.element_field.dict_for_export
        return j

    def to_dict(self):
        return {'t': self._t.value, 'misc': self._misc}

    @property
    def field_path_str_field_map(self):
        return self._field_path_str_field_map

    @property
    def range_part(self):
        return self._range_part

    def remove_sub_field(self, field_path_str):
        pass


class TemplateTag(IntEnum):
    """
    模板Tag
    """
    ORDINARY = 0  # 普通（默认Tag）
    RECOMMEND = 1  # 推荐（推荐人数大于等于三）
    STANDARD = 2  # 标准（单独定义的）

    @property
    def description(self):
        return ("普通", "推荐", "标准")[self.value]

    @staticmethod
    def choices():
        return ((x.value, x.description) for x in TemplateTag)


class Snippet(models.Model):
    """
    模板片段 用于保存用户自定义的模板片段，用于实现模板嵌套

    """
    id = models.AutoField(primary_key=True)
    snippet_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="snippet_creater")
    add_time = models.DateTimeField(auto_now_add=True)
    content = JSONField()

    class Meta:
        ordering = ('-id',)

    def to_dict(self):
        """返回dict"""
        d = {'id': self.id,
             'snippet_name': self.snippet_name,
             'add_time': timezone.localtime(self.add_time).strftime('%Y-%m-%d %H:%M:%S'),
             'content': self.content,
             }
        return d

    @staticmethod
    def validate_content(content: dict):

        black_field_start_names = ['$']
        start_names_error = 'Field "%(sub_field_name)s" name can not start with "%(black_start)s"'

        def _validate_field(field_dict):
            if 't' not in field_dict:
                raise ValueError('键 \"t\" 缺失')
            misc = field_dict.get('misc', {})
            field_type = TemplateFieldEnum(field_dict['t'])
            if field_type.is_choice:
                options = misc.get('opt')
                groups = misc.get('grp')
                if not (options or groups):  # 不同时为空
                    raise ValueError('至少有一个选项或设置选项组')
                if not isinstance(options, (tuple, list)):
                    raise ValueError('选项（opt）应为数组或元组')
                if groups:
                    if isinstance(groups, (list, tuple)):
                        for grp in groups:
                            if isinstance(grp, dict) and 'name' in grp and 'items' in grp and isinstance(grp['items'],
                                                                                                         (list, tuple)):
                                if not grp['items']:
                                    raise ValueError(
                                        "选项组 %s's 的选项为空" % grp['name'])
                            else:
                                raise ValueError('选项组应该是数组或元组，并且有`name`和`items`两个键，'
                                                 '且`items`应该是数组或元组')
                    else:
                        raise ValueError('选项组应该是数组或元组')
            elif field_type.is_array:
                _validate_field(misc, )
            elif field_type.is_table:
                if '_head' not in misc:
                    raise ValueError('键 \"_head\" 缺失')
                if not isinstance(misc['_head'], (list, tuple)):
                    raise ValueError('\"_head\" 应该是数组或元组')
                for head_name in misc['_head']:
                    if head_name not in misc:
                        raise ValueError(
                            '"%(header)s" 在 "%(field)s" 中缺失' % {'header': head_name, 'field': str(misc)})
                    for black_start in black_field_start_names:
                        if head_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': head_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[head_name])
            elif field_type.is_container:
                if '_ord' not in misc:
                    raise ValueError('键 \"_ord\" 缺失（容器为空）')
                if not isinstance(misc['_ord'], (list, tuple)):
                    raise ValueError('\"_ord\" 应该是数组或元组')
                for sub_field_name in misc['_ord']:
                    if sub_field_name not in misc:
                        raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                            'sub_field_name': sub_field_name,
                            'field': str(misc)})
                    for black_start in black_field_start_names:
                        if sub_field_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': sub_field_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[sub_field_name])
            elif field_type.is_generator:
                if '_opt' not in misc:
                    raise ValueError("键 \"_opt\" 缺失（生成器为空）")
                if not isinstance(misc['_opt'], (list, tuple)):
                    raise ValueError('\"_opt\" 应该是数组或元组')
                for sub_field_name in misc['_opt']:
                    if sub_field_name not in misc:
                        raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                            'sub_field_name': sub_field_name,
                            'field': str(misc)})
                    for black_start in black_field_start_names:
                        if sub_field_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': sub_field_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[sub_field_name])
            elif field_type.is_range:
                if 'type' not in misc:
                    raise ValueError("键 \"type\" 缺失")
                scope = [0, 1]
                if misc['type'] not in scope:
                    raise ValueError("键 \"type\" 越界")

        try:

            if '_ord' not in content:
                raise ValueError('键 \"_ord\" 缺失')
            if not isinstance(content['_ord'], (list, tuple)):
                raise ValueError('\"_ord\" 应该是数组或元组')
            for sub_field_name in content['_ord']:
                if sub_field_name not in content:
                    raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                        'sub_field_name': sub_field_name,
                        'field': str(content)})
                for black_start in black_field_start_names:
                    if sub_field_name.startswith(black_start):
                        raise ValueError(start_names_error % {
                            'sub_field_name': sub_field_name,
                            'black_start': black_start
                        })
                _validate_field(content[sub_field_name])
        except ValueError as e:
            raise MGEError.BAD_TEMPLATE(str(e))


class Template(models.Model):
    """模板类，包含模板元数据和模板内容`content`部分。

    `title`:     模板标题，标题不能重复
    `category`:  所属材料类别，引用`MaterialCategory`
    `author`:    创建者名字，对应 account 中的用户名（无需显示设置，默认为当前登录用户，未登录则为 '_system'）
    `abstract`:  简要介绍，包括模板内容、功能、作用等
    `ref_count`: 引用计数，即使用这个模板的数据的数目
    `pub_date`:  发布时间
    `published`: 是否发布
    `trashed`:   是否已删除
    `content`:   模板内容，一个复杂的字典类型数据，详见文档示例
    """
    id = models.AutoField(primary_key=True)
    title = models.CharField(unique=True, max_length=255)
    category = models.ForeignKey('Category', null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="user")
    abstract = models.TextField(null=False)
    pub_date = models.DateTimeField(auto_now=True, db_index=True)
    is_private = models.BooleanField(default=False)
    published = models.BooleanField(default=False)
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reviewer")
    review_state = models.IntegerField(default=0)  # 0: 待审核   1: 审核通过 2: 审核不通过
    review_time = models.DateTimeField(null=True)
    content = JSONField()
    disapprove_reason = models.TextField(null=True)
    public = models.BooleanField(default=True)  # 公有/私有

    class Meta:
        ordering = ('-pub_date',)

    def save(self, *args, **kwargs):
        if self.pk:
            this = Template.objects.get(id=self.pk)
            if this.category != self.category:
                with transaction.atomic():
                    DataMeta.objects.filter(template=self).update(category=self.category)
                    super().save(*args, **kwargs)
            else:
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._fields = None
        self._ref_count_cached = None
        self._field_path_str_field_map = None

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

    @property
    def review_status_description(self):
        return DataReviewState(self.review_state).description

    @property
    def reviewer_real_name(self):
        """
        审核人的真实姓名
        :return:
        """
        if self.reviewer:
            return self.reviewer.real_name
        return _("User Deleted")

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
            Template.objects.filter(pk=self.pk).update(review_state=DataReviewState.APPROVED,
                                                       reviewer=reviewer)

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
            Template.objects.filter(pk=self.pk).update(review_state=DataReviewState.DISAPPROVED,
                                                       reviewer=reviewer, disapprove_reason=reasons,
                                                       review_time=timezone.now())

    @property
    def reason_list(self):
        if self.disapprove_reason:
            return [gettext(x) for x in self.disapprove_reason.split(';')]
        else:
            return []

    @property
    def ref_count(self):
        return DataMeta.objects.filter(template=self).count()

    @property
    def ref_data(self):
        return [data.to_dict() for data in DataMeta.objects.filter(template=self)]

    def set_content(self, content: dict):
        """
        设置模板的 content 内容，会进行验证
        :param content: content内容
        :return: None
        """

        self.validate_content(content)
        self.content = content
        self.save()

    @staticmethod
    def get_by_id(t_id: int, **kwargs):
        try:
            template = Template.objects.get(id=t_id)

        except Template.DoesNotExist:
            raise MGEError.NOT_FOUND("模板不存在")
        return template

    @staticmethod
    def validate_content(content: dict):

        black_field_start_names = ['$']
        start_names_error = 'Field "%(sub_field_name)s" name can not start with "%(black_start)s"'

        def _validate_field(field_dict):
            if 't' not in field_dict:
                raise ValueError('键 \"t\" 缺失')
            misc = field_dict.get('misc', {})
            field_type = TemplateFieldEnum(field_dict['t'])
            if field_type.is_choice:
                options = misc.get('opt')
                groups = misc.get('grp')
                if not (options or groups):  # 不同时为空
                    raise ValueError('至少有一个选项或设置选项组')
                if not isinstance(options, (tuple, list)):
                    raise ValueError('选项（opt）应为数组或元组')
                if groups:
                    if isinstance(groups, (list, tuple)):
                        for grp in groups:
                            if isinstance(grp, dict) and 'name' in grp and 'items' in grp and isinstance(grp['items'],
                                                                                                         (list, tuple)):
                                if not grp['items']:
                                    raise ValueError(
                                        "选项组 %s's 的选项为空" % grp['name'])
                            else:
                                raise ValueError('选项组应该是数组或元组，并且有`name`和`items`两个键，'
                                                 '且`items`应该是数组或元组')
                    else:
                        raise ValueError('选项组应该是数组或元组')
            elif field_type.is_array:
                _validate_field(misc, )
            elif field_type.is_table:
                if '_head' not in misc:
                    raise ValueError('键 \"_head\" 缺失')
                if not isinstance(misc['_head'], (list, tuple)):
                    raise ValueError('\"_head\" 应该是数组或元组')
                for head_name in misc['_head']:
                    if head_name not in misc:
                        raise ValueError('"%(header)s" 在 "%(field)s" 中缺失' % {'header': head_name, 'field': str(misc)})
                    for black_start in black_field_start_names:
                        if head_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': head_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[head_name])
            elif field_type.is_container:
                if '_ord' not in misc:
                    raise ValueError('键 \"_ord\" 缺失（容器为空）')
                if not isinstance(misc['_ord'], (list, tuple)):
                    raise ValueError('\"_ord\" 应该是数组或元组')
                for sub_field_name in misc['_ord']:
                    if sub_field_name not in misc:
                        raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                            'sub_field_name': sub_field_name,
                            'field': str(misc)})
                    for black_start in black_field_start_names:
                        if sub_field_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': sub_field_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[sub_field_name])
            elif field_type.is_generator:
                if '_opt' not in misc:
                    raise ValueError("键 \"_opt\" 缺失（生成器为空）")
                if not isinstance(misc['_opt'], (list, tuple)):
                    raise ValueError('\"_opt\" 应该是数组或元组')
                for sub_field_name in misc['_opt']:
                    if sub_field_name not in misc:
                        raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                            'sub_field_name': sub_field_name,
                            'field': str(misc)})
                    for black_start in black_field_start_names:
                        if sub_field_name.startswith(black_start):
                            raise ValueError(start_names_error % {
                                'sub_field_name': sub_field_name,
                                'black_start': black_start
                            })
                    _validate_field(misc[sub_field_name])
            elif field_type.is_range:
                if 'type' not in misc:
                    raise ValueError("键 \"type\" 缺失")
                scope = [0, 1]
                if misc['type'] not in scope:
                    raise ValueError("键 \"type\" 越界")

        try:

            if '_ord' not in content:
                raise ValueError('键 \"_ord\" 缺失')
            if not isinstance(content['_ord'], (list, tuple)):
                raise ValueError('\"_ord\" 应该是数组或元组')
            for sub_field_name in content['_ord']:
                if sub_field_name not in content:
                    raise ValueError('字段 "%(sub_field_name)s" 在 "%(field)s" 中缺失' % {
                        'sub_field_name': sub_field_name,
                        'field': str(content)})
                for black_start in black_field_start_names:
                    if sub_field_name.startswith(black_start):
                        raise ValueError(start_names_error % {
                            'sub_field_name': sub_field_name,
                            'black_start': black_start
                        })
                _validate_field(content[sub_field_name])
        except ValueError as e:
            raise MGEError.BAD_TEMPLATE(str(e))

    def clean(self):
        self.set_content(self.content)
        super(Template, self).clean()

    # TODO: ref_count每次都要实时计算，考虑重构
    def to_dict(self, meta_only=False):
        self.get_deferred_fields()
        print(self.content)
        d = {'id': self.id,
             'title': self.title,
             'category': self.category.name,
             'category_id': self.category_id,
             'author': self.user_real_name,
             'abstract': self.abstract,
             'ref_count': self.ref_count,
             'pub_date': self.pub_date,
             'username': self.user_id,
             'published': self.published,
             'public': self.public}  # trashed 永远不被外部获取不予设置
        if not meta_only:
            d['content'] = self.content
        return d

    @staticmethod
    def publish(t_or_pk):
        """
        发布模板
        :param t_or_pk: 待更新的模板或模板 pk
        :type t_or_pk: Template, int
        :return: None
        """
        t = t_or_pk
        if not isinstance(t, Template):
            t = Template.objects.filter(pk=t_or_pk).only('published').first()
        if t:
            t.published = True
            t.save(update_fields=('published', 'pub_date'))

    @property
    def dict_for_export(self):
        j = {'_id': self.id}
        for field in self.fields:
            j[field.field_name] = field.dict_for_export
        return j

    def add_data(self, meta_dict: dict, content_dict: dict, uploaded_by: str,
                 importing=False, check_uploaded_files=False) -> DataMeta:
        """
        唯一的添加数据的方法
        :param meta_dict: 包含元数据的dict
        :param content_dict:  包含数据内容的dict（必须是正确的最终格式，文件型和图片型已转为url）
        :param uploaded_by: 上传者的用户名
        :return: DataMeta对象
        """
        return DataHelper(template=self).add_data(meta_dict=meta_dict, content_dict=content_dict,
                                                  upload_username=uploaded_by, importing=importing,
                                                  check_uploaded_files=check_uploaded_files)

    def modify_data(self, meta: DataMeta, meta_dict: dict, content_dict: dict, only_content=False):
        """
        唯一的修改数据的方法
        :param meta_dict: 包含元数据的dict
        :param content_dict:  包含数据内容的dict（必须是正确的最终格式，文件型和图片型已转为url）
        :param only_content:  是否不更新meta信息
        :return:
        """
        return DataHelper(template=self).modify_data(meta=meta, meta_dict=meta_dict, content_dict=content_dict,
                                                     only_content=only_content)

    @property
    def fields(self) -> List[TemplateField]:
        """
        获取子字段元数据列表
        :return: 子字段元数据列表
        """
        if self._fields is None:
            self._load_fields()
        return self._fields

    def _load_fields(self, exclude_list=(), include_list=()):
        self._fields = []
        self._field_path_str_field_map = {}
        if exclude_list or include_list:
            content_copy = deepcopy(self.content)

        def remove_sub_field(sub_field_name):
            content_copy['_ord'].remove(sub_field_name)
            content_copy.pop(sub_field_name, None)
        exclude_for_root = [x.split('.')[0] for x in exclude_list]
        include_for_root = [x.split('.')[0] for x in include_list]
        for field_name in self.content['_ord']:
            if exclude_list and field_name in exclude_for_root or include_list and field_name not in include_for_root:
                remove_sub_field(field_name)
                continue

            f = TemplateField(self.content[field_name], field_path_list=[field_name], exclude_list=exclude_list,
                              include_list=include_list, force_include=True)
            if f.delay_excluded:
                remove_sub_field(field_name)
                continue
            self._fields.append(f)
            self._field_path_str_field_map[f.field_path_str] = f
            self._field_path_str_field_map.update(f.field_path_str_field_map)
            del f._field_path_str_field_map

        if exclude_list or include_list:
            self.content = content_copy

    def filter_fields(self, excluded_fields=(), included_fields=()):
        if excluded_fields and included_fields:
            raise ValueError("不能同时指定排除（excluded_fields）和包含的字段（included_fields）")
        if not excluded_fields and not included_fields:
            raise ValueError("必须指定排除（excluded_fields）或包含的字段（included_fields）")
        self._load_fields(excluded_fields, included_fields)

    @property
    def field_names(self) -> List[str]:
        """
        获取子字段名称列表
        :return: 子字段名称列表
        """
        return self.content['_ord']

    def delete(self, *args, **kwargs):
        # 防止api 或 admin错误删除
        if self.ref_count > 0:
            raise MGEError.TEMPLATE_REFERENCED
        else:
            super().delete(*args, **kwargs)

    def get_field_by_field_path_str(self, field_path_str):
        if self._field_path_str_field_map is None:
            self._load_fields()
        return self._field_path_str_field_map[field_path_str]

    def __getitem__(self, item) -> TemplateField:
        """

        :param item:
        :return:
        """
        if isinstance(item, str):
            return self.get_field_by_field_path_str(item)
        else:
            return self.get_field_by_field_path_str(self.field_names[item])

    def modify(self, new_content: dict):
        if self.ref_count > 0:
            def compare(old, new, field_path_list=()):
                old_t = old['t']
                new_t = new['t']
                if old_t != new_t:
                    old_t = TemplateFieldEnum(old_t)
                    new_t = TemplateFieldEnum(new_t)
                    raise MGEError.TEMPLATE_INCONSISTENT(
                        f'不能修改模板中已有字段的数据类型。字段"{".".join(field_path_list)}"的类型不能由"{old_t.description}"修改为"{new_t.description}"'
                    )
                t = TemplateFieldEnum(old_t)
                if t.is_choice:
                    old_choices = old.get('opt')
                    # TODO 候选型做限制，暂时不影响解析
                elif t.is_container or t.is_generator or t.is_table:
                    if t.is_generator:
                        _p = '_opt'
                    elif t.is_container:
                        _p = '_ord'
                    else:
                        _p = '_head'
                    old_ord = set(old['misc'][_p])
                    new_ord = set(new['misc'][_p])
                    if not old_ord.issubset(new_ord):
                        missing_fields = old_ord - new_ord
                        field_str_list = []
                        for field in missing_fields:
                            field_str_list.append('.'.join(field_path_list + (field,)))
                        raise ValueError(
                            _('Cannot find field(s): "%(field_list)s" in the new template.') % {
                                'field_list': ', '.join(field_str_list)})
                    for sub_field in old_ord:
                        compare(old['misc'][sub_field], new['misc'][sub_field], field_path_list + (sub_field,))
                elif t.is_array:
                    compare(old['misc'], new['misc'], field_path_list)
                else:
                    pass  # TODO 检测required

            new_content_t = {'t': TemplateFieldEnum.CONTAINER.value, 'misc': new_content}
            old_content_t = {'t': TemplateFieldEnum.CONTAINER.value, 'misc': deepcopy(self.content)}
            try:
                compare(old_content_t, new_content_t)
            except ValueError as e:
                raise MGEError.UNSUPPORTED_TEMPLATE_EDITING(str(e))
            else:
                self.content = new_content
                self.save()
        else:
            self.set_content(new_content)

    def find_spec_field_paths(self, field_type: TemplateFieldEnum) -> Dict:
        """
        找到模版下指定TemplateFieldEnum的所有field_path
        Args:
            field_type: 模板字段枚举

        Returns:
            Dict[field_path:template_field]
            field_path:str field路径
            template_field:TemplateField field_path对应的templateField
        """
        template_path_str_field_map = {}
        spec_type_paths = []

        def find_field_paths(field: TemplateField, field_type: TemplateFieldEnum, field_include_list=[]):
            nonlocal template_path_str_field_map
            for sub_field in field.sub_fields:
                find_field_paths(sub_field, field_type, field_include_list)
            template_path_str_field_map[field.field_path_str] = field
            if field._t == field_type:
                field_include_list.append(field.field_path_str)
            return field_include_list

        for field in self.fields:
            spec_type_paths = find_field_paths(field, field_type)

        ret_template_path_str_field_map = {}
        for key, value in template_path_str_field_map.items():
            if key in spec_type_paths:
                ret_template_path_str_field_map[key] = value

        return ret_template_path_str_field_map


class TemplateDataStatistic(models.Model):
    """
    统计模板下的数据的查看量于下载量，不是模板本身的统计
    """
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    day = models.DateField(db_index=True, default=timezone.now)
    num_views = models.IntegerField(default=0)
    num_downloads = models.IntegerField(default=0)
    num_new_data = models.IntegerField(default=0)

    class Meta:
        unique_together = ('template', 'day')

    @staticmethod
    def inc_count(template_id: int, value: int, day: date = None):
        assert isinstance(template_id, int)
        assert isinstance(value, int)
        if not day:
            beijing_tz = pytz.timezone(settings.TIME_ZONE)
            now_date = timezone.now()
            beijing_now = now_date.astimezone(beijing_tz)
            day = beijing_now.date()
        num_updated = TemplateDataStatistic.objects.filter(
            template_id=template_id,
            day=day
        ).update(num_new_data=models.F('num_new_data') + value)
        if not num_updated:
            TemplateDataStatistic.objects.create(template_id=template_id, day=day, num_new_data=value)
