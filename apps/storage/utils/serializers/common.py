# -*- coding: utf-8 -*-

# @File   : common
# @Author : Harold Chen
# @Date   : 2018/2/26

import hashlib
import os
from datetime import datetime
from enum import Enum, IntEnum
from typing import Callable
from typing import Dict, Tuple

from django.conf import settings
from django.utils.translation import gettext

import apps.storage.models.data as data_models
from apps.storage.utils.constant import CONST


class DataMode(IntEnum):
    """
    Excel操作模式
    """
    READ = 1  # 导入数据
    WRITE = 2  # 导出数据
    TEMPLATE = 3  # 生成导入模板

    @property
    def description(self):
        if self == 1:
            return "read"
        elif self == 2:
            return "write"
        elif self == 3:
            return "template"


class ParsingErrorEnum(Enum):
    DUPLICATE_META_ID = gettext("多条数据具有相同的数据ID \"%(o1)s\"")
    META_FIELD_MISSING = gettext("元数据字段 \"%(o1)s\" 缺失 ")
    META_FIELD_BLANK = gettext("元数据字段 \"%(o1)s\" 缺失. ")
    FIELD_MISSING = gettext("字段 \"%(o1)s\" 缺失 ")
    UNKNOWN_FIELD = gettext("未知字段 \"%(o1)s\" ")
    VALUE_MISSING = gettext('字段 "%(o1)s" 不能为空.')
    INVALID_VALUE = gettext('字段 "%(o3)s" (%(o2)s) 的值 "%(o1)s" 无效.')
    NO_ELEMENTS_IN_ARRAY = gettext('数组 %(o1)s 中没有元素.')
    NO_META = gettext('数据 （ID="%(o1)s"） 没有对应的元数据。工作表"元数据"中需要有数据ID相同的行。')
    NO_DATA = gettext('数据 "%(o1)s" 未填写数据内容.')
    TEMPLATE_NOT_FOUND = gettext('模板%(o1)s不存在.')
    FILE_NOT_FOUND = gettext('压缩文件中不存在文件"%(o1)s"。 请使用只包含英文字符+数字的文件名。')
    BAD_TEMPLATE = gettext('请重新下载填写模板')
    INVALID_CHOICE_VALUE = gettext('"%(o1)s" 不是有效的选项。允许的选项为 %(o2)s.')
    XMLSyntaxError = gettext("XML语法错误: %(o1)s.")
    JSONSyntaxError = gettext("JSON语法错误: %(o1)s.")
    NODE_MISSING = gettext("节点\"%(o2)s\"中缺少节点\"%(o1)s\".")
    XML_ATTRIBUTE_MISSING = gettext("节点\"%(o1)s\"中缺少属性\"%(o2)s\".")
    TEMPLATE_DOES_NOT_EXIST = gettext("模板\"%(o1)s\"不存在.")
    EXCESSIVE_FILES_OR_IMAGES = gettext('字段 "%(o1)s" 中只允许一个文件或图片。')
    INVALID_IMAGE_FORMAT = gettext("不支持扩展名为\"%(o1)s\"的图片文件。")
    FIRST_DATA_IS_BLANK = gettext("数据内容的第一行不允许为空")
    DATA_IS_BLANK = gettext("data_content字段不能为空")
    PROJECT_NOT_FOUND = gettext("一级机构 \"%(o1)s\" 不存在。")
    SUBJECT_NOT_FOUND = gettext("二级机构 \"%(o1)s\" 不存在。")
    MALFORMED_PROJECT_SUBJECT = gettext('"一级机构/二级机构"的格式必须为"一级机构名称(编号)/二级机构名称(编号)"')



class ParsingError(Exception):

    def __init__(self, error, no_position_info=False, **kwargs):
        self.is_api = True
        self.message = gettext(error.value) % kwargs
        self.error = error
        self.no_position_info = no_position_info

    def __str__(self):
        return self.__unicode__()

    def __repr__(self):
        return self.__unicode__()

    def __unicode__(self):
        return self.message

    def add_detail(self, message):
        self.message += message


class FieldParser:
    """
    抽象基类
    """

    def __init__(self, request_username, _file_dir=None, verify_only=False):
        self._file_dir = _file_dir
        self._verify_only = verify_only
        self._request_username = request_username
        # 图片及其对应的(新文件名, hash, 文件大小)
        self.file_image_path_info_map: Dict[str: Tuple[str, str, int]] = {}
        # 文件及其对应的(新文件名, hash, 文件大小)
        self.file_path_info_map: Dict[str: Tuple[str, str, int]] = {}
        # key: 文件 value: 其移动到media后相对于media的路径
        self._file_new_path_map: Dict[str, str] = {}
        self.date_prefix = datetime.now().strftime("%Y/%m/%d")

    def md5(self, file_path) -> tuple:
        if self._verify_only:
            with open(file_path):
                return 'verify only', 0
        with open(file_path, 'rb') as fp:
            m = hashlib.md5()
            while True:
                data = fp.read(4096 * 1024)
                if not data:
                    break
                m.update(data)
            hash_value = m.hexdigest()
            size = fp.tell()
            return hash_value, size

    def parse_single_file_or_image(self, field_meta, file_path):
        if self._file_dir is None:
            return
        if file_path not in self._file_new_path_map:
            temp_full_path = os.path.join(self._file_dir, file_path.strip())  # 文件在tmp文件夹中的路径（解压缩后）
            try:
                hash_value, size = self.md5(temp_full_path)
                filename, ext = os.path.splitext(os.path.basename(file_path))
                if ext:
                    new_filename = f"{filename}.{hash_value}{ext}"
                else:
                    new_filename = f"{filename}.{hash_value}"
                if field_meta.field_type.is_image:
                    if ext.upper() not in CONST.SUPPORT_IMAGE_EXT:
                        raise ParsingError(ParsingErrorEnum.INVALID_IMAGE_FORMAT, o1=ext)
                    self.file_image_path_info_map[file_path] = new_filename, hash_value, size
                    new_path = os.path.join(settings.DATA_IMAGE_PREFIX, self.date_prefix, new_filename)
                else:
                    self.file_path_info_map[temp_full_path] = new_filename, hash_value, size
                    new_path = os.path.join(settings.DATA_FILE_PREFIX, self.date_prefix, new_filename)
                self._file_new_path_map[file_path] = new_path
                return new_path
            except (FileNotFoundError, IsADirectoryError, NotADirectoryError):
                raise ParsingError(ParsingErrorEnum.FILE_NOT_FOUND, o1=file_path)
        return self._file_new_path_map[file_path]

    def parse_field(self, field_meta, raw_value):
        t = field_meta.field_type
        if t.is_image or t.is_file:
            if isinstance(raw_value, str):  # excel中 图片文件型的数据是字符串
                if CONST.is_blank_string(str(raw_value)) or str(raw_value).strip() == '':
                    if field_meta.required:
                        raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
                    return None
            elif isinstance(raw_value, list):
                for k in raw_value:
                    if CONST.is_blank_string(str(k)):
                        raw_value.remove(k)
            return self.parse_file_image(field_meta, raw_value)
        else:
            if CONST.is_blank_string(str(raw_value)) or str(raw_value).strip() == '':
                if field_meta.required:
                    raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
                return None
            if t.is_string:
                return self.parse_string(field_meta, raw_value)
            elif t.is_number:
                return self.parse_number(field_meta, raw_value)
            elif t.is_range:
                return self.parse_range(field_meta, raw_value)
            elif t.is_choice:
                return self.parse_choice(field_meta, raw_value)

    def parse_string(self, field_meta, raw_value):
        raise NotImplementedError

    def parse_number(self, field_meta, raw_value):
        raise NotImplementedError

    def parse_range(self, field_meta, raw_value):
        raise NotImplementedError

    def parse_file_image(self, field_meta, raw_value):
        raise NotImplementedError

    def parse_choice(self, field_meta, raw_value):
        raise NotImplementedError


class FieldSerializer:
    """
    抽象基类
    """

    def __init__(self):
        self.filenames = []
        self._filenames_set = set()

    def serialize_image_file(self, mongo_value, meta_id):
        if not mongo_value:
            return []
        if not isinstance(mongo_value, list):
            mongo_value = [mongo_value]
        file_list = []
        for file_rel_path in mongo_value:
            if file_rel_path.startswith('/'):  # 通过
                file_rel_path = file_rel_path[5:]
            #if file_rel_path in self._filenames_set:
            #    continue
            self._filenames_set.add(file_rel_path)
            filename = os.path.basename(file_rel_path)
            new_filename = str(meta_id) + filename
            self.filenames.append((os.path.join(settings.MEDIA_ROOT, file_rel_path), new_filename))
            file_list.append(new_filename)
            # fullname = os.path.basename(file_rel_path)
            # filename, ext = os.path.splitext(fullname)
            # if filename not in self._filename_set:
            #     self._filename_set[fullname] = 0
            #     new_filename = filename
            #     src = os.path.join(settings.MEDIA_ROOT, file_rel_path)
            # else:
            #     v = self._filename_set[fullname] + 1
            #     self._filename_set[fullname] = v
            #     new_filename = os.path.join(filename, f'({v})', ext)
            #     src = os.path.join(settings.MEDIA_ROOT, new_filename)
            # shutil.copy(src, self._output_dir)
            # file_list.append(new_filename)
        return file_list


class DataHandler:
    def __init__(self, mode: DataMode, template, no_attachments, verify_only):
        self._mode = mode
        self._template = template
        self._parser = None
        self._no_attachments = no_attachments
        self._verify_only = verify_only
        self.meta_id_list = []

    def read_data(self, fp_or_path, uploaded_by, file_dir=None, progress_handler: Callable[[float], None] = None):
        raise NotImplementedError

    def write_data(self, data_meta):
        raise NotImplementedError

    def save(self, output_dir):
        raise NotImplementedError

    def generate_template(self, number_of_data=3, elements_per_array=1, rows_per_table=1):
        raise NotImplementedError

    def roll_back(self):
        data_models.DataMeta.importing_objects.filter(id__in=self.meta_id_list).delete()

    def filter_fields(self, excluded_fields=(), included_fields=()):
        if self._mode != DataMode.WRITE:
            raise ValueError("Cannot filter fields in write mode.")
        self._template.filter_fields(excluded_fields, included_fields)

    @property
    def template(self):
        return self._template
