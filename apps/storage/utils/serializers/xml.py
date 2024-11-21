# -*- coding: utf-8 -*-

# @File   : xml
# @Author : Harold Chen
# @Date   : 2018/2/26
import decimal
import random
import re
import shutil
import string
from decimal import Decimal

from django.db import transaction
from django.utils.translation import gettext as _
from lxml import etree
from mongoengine import DoesNotExist

from apps.storage.docs.data import *
from apps.storage.models.data import DataMetaFieldEnum, DataMeta, DATA_VISIBILITY_NAME_MAP
from apps.storage.models.file import DataContentImage, DataContentFile
from apps.storage.models.template import Template, TemplateField, TemplateFieldEnum
from .common import *


class XMLFieldSerializer(FieldSerializer):

    def serialize_field(self, mongo_value, field_meta, meta_id):
        if mongo_value is None:
            return None
        t = field_meta.field_type
        if t.is_string:
            return str(mongo_value)
        elif t.is_number:
            return str(mongo_value)
        elif t.is_range:
            field_type = field_meta.field_type
            if field_type.is_range_interval(field_meta.range_type):
                lb = mongo_value.get('lb', '-∞')
                ub = mongo_value.get('ub', '+∞')
                return f'({lb}, {ub})'
            else:
                err = mongo_value.get('err', '?')
                val = mongo_value.get('val', '?')
                return f'{val}±{err}'
        elif t.is_image or t.is_file:
            return self.serialize_image_file(mongo_value, meta_id)
        elif t.is_choice:
            return str(mongo_value)


class XMLFieldParser(FieldParser):

    def parse_field(self, field_meta: TemplateField, raw_value):
        if raw_value is None:
            if field_meta.required:
                raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
            return None
        else:
            return super().parse_field(field_meta, raw_value)

    def parse_string(self, field_meta, raw_value: str):
        return raw_value

    def parse_number(self, field_meta, raw_value: float):
        try:
            return float(Decimal(raw_value))
        except (TypeError, ValueError):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=raw_value, o2=field_meta.field_type.description,
                               o3=field_meta.field_name)

    def parse_range(self, field_meta, raw_value: str):
        if TemplateFieldEnum.is_range_error(field_meta.range_type):
            try:
                err_data = re.split('[,，]', raw_value)
                val = float(Decimal(err_data[0]))
                err = float(Decimal(err_data[1]))
                return {'val': val, 'err': err}
            except (IndexError, AttributeError, TypeError, ValueError, decimal.InvalidOperation):
                raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=raw_value,
                                   o2=_("Error Type"), o3=field_meta.field_name)
        else:
            try:
                trimmed = raw_value[1:-1]
                bounds = re.split('[,，]', trimmed)
                return {'lb': float(Decimal(bounds[0])), 'ub': float(Decimal(bounds[1]))}
            except (IndexError, AttributeError, TypeError, ValueError, decimal.InvalidOperation):
                raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=raw_value,
                                   o2=_("Interval Type"), o3=field_meta.field_name)

    def parse_file_image(self, field_meta, raw_value: list):
        path_list = raw_value
        url_list = []
        for path in path_list:
            if path is None or path.strip() == '':
                raise ParsingError(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.field_path_str)
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


class XMLHandler(DataHandler):

    def __init__(self, mode: DataMode, template: Template = None, no_attachments=False, verify_only=False):
        super().__init__(mode, template, no_attachments, verify_only)
        if self._mode == DataMode.WRITE or self._mode == DataMode.TEMPLATE:
            if template is None:
                raise ValueError(f'A template must be provided in {self._mode.description} mode.')
            self._root_node = etree.Element('root', tid=str(template.id))
        self._serializer = XMLFieldSerializer()

    def write_data(self, data_meta: DataMeta, with_none=True):
        if self._mode != DataMode.WRITE:
            raise ValueError(f"Cannot write XML in {self._mode.description} mode.")
        if not isinstance(data_meta, DataMeta):
            raise ValueError("data_meta should be an instance of DataMeta")
        if data_meta.template_id != self._template.id:
            raise ValueError(f'Data\'s tid should be "{self._template.id}", got "{data_meta.tid}" instead')

        def _add_field(field_meta: TemplateField, field_data, in_array=False):
            if field_data is None or (isinstance(field_data, list) and len(field_data) == 0):
                if with_none and not in_array:
                    return etree.Element('field', name=field_meta.field_name)
                else:
                    return None
            if in_array:
                node = etree.Element('element')
            else:
                node = etree.Element('field', name=field_meta.field_name)
            t = field_meta.field_type

            if t.is_table:
                for row in field_data:
                    row_node = etree.SubElement(node, 'row')
                    for header in field_meta.sub_fields:
                        sub_node = _add_field(header, getattr(row, header.field_name, None))
                        if sub_node is not None:
                            row_node.append(sub_node)
            elif t.is_container:
                for sub_field in field_meta.sub_fields:
                    if sub_field.field_name in field_data:
                        sub_node = _add_field(sub_field, field_data.get(sub_field.field_name))
                        if sub_node is not None:
                            node.append(sub_node)
            elif t.is_array:
                for element_value in field_data:
                    sub_node = _add_field(field_meta.element_field, element_value,
                                          in_array=True)
                    if sub_node is not None:
                        node.append(sub_node)
            elif t.is_file or t.is_image:
                hyperlinks = self._serializer.serialize_image_file(field_data, data_meta.id)
                link_node_name = 'image' if t.is_image else 'file'
                for link in hyperlinks:
                    link_node = etree.SubElement(node, link_node_name)
                    link_node.text = link
            else:
                unit = field_meta.unit
                if unit is not None:
                    node.attrib['unit'] = unit
                node.text = self._serializer.serialize_field(field_data, field_meta, data_meta.id)
            return node

        data_node = etree.SubElement(self._root_node, 'data')
        meta_node = etree.SubElement(data_node, 'meta')
        content_node = etree.SubElement(data_node, 'content')

        for field in DataMetaFieldEnum.writer_iterator(with_id=True):
            value = field.get_value(data_meta)
            if (value is None or getattr(value, '__len__', int)() == 0) and not with_none:
                continue
            node = etree.Element('field', name=field.description)
            if value is not None:
                node.text = str(value)
            meta_node.append(node)

        try:
            content = DataContent.objects.get(pk=data_meta.dc_id).data
        except DoesNotExist:
            content = {}  # TODO 找不到

        for field in self._template.fields:
            node = _add_field(field, content.get(field.field_name))
            if node is not None:
                content_node.append(node)

    def read_data(self, xml_path_or_fp, uploaded_by, file_dir=None,
                  progress_handler: Callable[[float, bool], None] = None):
        if self._mode != DataMode.READ:
            raise ValueError(f"Cannot read XML in {self._mode.description} mode.")
        if self._parser is None:
            self._parser = XMLFieldParser(uploaded_by, file_dir, verify_only=self._verify_only)
        parser = self._parser
        total_count = 0
        current_count = 0

        def _raise_parsing_exception(error: ParsingErrorEnum, o1=None, o2=None, o3=None, line: int = None):
            from django.utils.translation import gettext as _
            e = ParsingError(error, o1=o1, o2=o2, o3=o3)
            if line:
                e.add_detail(_(" (line %(line_number)s)") % {'line_number': line})
            raise e

        def _read_field(field_meta: TemplateField, parent_node: etree.Element, in_array=False):
            """
            读取某个字段的值
            :param field_path_list: 字段path列表
            :param node: 元素的节点
            :return: 字段的json值
            """
            t = field_meta.field_type
            required = field_meta.required
            if in_array:
                nodes = parent_node.findall('element')
            else:
                node = parent_node.find(f"field[@name='{field_meta.field_name}']")
                nodes = [] if node is None else [node]
            if required and len(nodes) == 0:
                _raise_parsing_exception(ParsingErrorEnum.FIELD_MISSING, o1=field_meta.external_field_path_str,
                                         line=parent_node.sourceline)

            all_data = []

            for node in nodes:
                if t.is_container:
                    raw_data = {}
                    for sub_field in field_meta.sub_fields:
                        raw_data[sub_field.field_name] = _read_field(sub_field, node)
                elif t.is_array:
                    raw_data = _read_field(field_meta.element_field, parent_node=node, in_array=True)
                elif t.is_table:
                    rows = node.findall('row')
                    if len(rows) == 0:
                        if required:
                            _raise_parsing_exception(ParsingErrorEnum.NODE_MISSING, o1='row',
                                                     o2=f'field({field_meta.external_field_path_str})')
                    raw_data = []
                    for row in rows:
                        raw_data.append({})
                        for header in field_meta.sub_fields:
                            raw_data[-1][header.field_name] = _read_field(header, parent_node=row)
                elif t.is_generator:
                    selected_node = node.find('field[1]')
                    if selected_node is None:
                        _raise_parsing_exception(ParsingErrorEnum.VALUE_MISSING, o1=field_meta.external_field_path_str,
                                                 line=node.sourceline)
                    selected_name = selected_node.attrib.get('name')
                    if selected_name is None:
                        _raise_parsing_exception(ParsingErrorEnum.XML_ATTRIBUTE_MISSING, o1='name', o2='field',
                                                 line=node.sourceline)
                    if selected_name not in field_meta.sub_field_names:
                        _raise_parsing_exception(ParsingErrorEnum.UNKNOWN_FIELD, o1=selected_node.tag,
                                                 line=node.sourceline)
                    raw_data = {selected_name: _read_field(field_meta[selected_name], node)}
                elif t.is_file or t.is_image:
                    files = node.findall('image' if t.is_image else 'file')
                    raw_data = parser.parse_field(field_meta, [x.text for x in files])
                    if len(raw_data) == 0:
                        if required:
                            _raise_parsing_exception(ParsingErrorEnum.VALUE_MISSING,
                                                     o1=field_meta.external_field_path_str)
                else:
                    text = node.text
                    if text is None or text.strip() == '':
                        if required:
                            _raise_parsing_exception(ParsingErrorEnum.VALUE_MISSING,
                                                     o1=field_meta.external_field_path_str,
                                                     line=node.sourceline)
                        raw_data = None
                    else:
                        raw_data = parser.parse_field(field_meta, text)
                all_data.append(raw_data)
            if in_array:
                return all_data
            elif len(all_data) == 1:
                return all_data[0]
            else:
                return None

        def _read_data(data_node):
            nonlocal current_count, total_count
            data = {}
            for sub_field in self._template.fields:
                data[sub_field.field_name] = _read_field(sub_field, data_node)
            current_count += 1
            if progress_handler:
                progress_handler(current_count / total_count)
            return data

        def _read_meta(meta_node):
            temp_meta = {}
            for meta_field in DataMetaFieldEnum.reader_iterator(with_id=True):
                field_node = meta_node.find(f"field[@name='{meta_field.description}']")
                if field_node is None:
                    _raise_parsing_exception(ParsingErrorEnum.FIELD_MISSING, o1=meta_field.description,
                                             line=meta_node.sourceline)
                # if field_node.text is None or field_node.text.strip() == '':
                # _raise_parsing_exception(ParsingErrorEnum.VALUE_MISSING, o1=meta_field.description)
                if meta_field == DataMetaFieldEnum.VISIBILITY:
                    if field_node.text not in DATA_VISIBILITY_NAME_MAP:
                        choices = '，'.join(DATA_VISIBILITY_NAME_MAP.keys())
                        _raise_parsing_exception(ParsingErrorEnum.INVALID_CHOICE_VALUE, o1=field_node.text, o2=choices,
                                                 line=field_node.sourceline)
                    temp_meta[meta_field.field_raw_name] = DATA_VISIBILITY_NAME_MAP[field_node.text]
                elif meta_field == DataMetaFieldEnum.DATA_ID:
                    if not field_node.text:
                        _raise_parsing_exception(ParsingErrorEnum.FIELD_MISSING, o1=meta_field.description,
                                                 line=field_node.sourceline)
                else:
                    temp_meta[meta_field.field_raw_name] = field_node.text
            temp_meta.pop(None, None)
            return temp_meta

        try:
            root = etree.parse(xml_path_or_fp).getroot()
        except etree.XMLSyntaxError as e:
            _raise_parsing_exception(ParsingErrorEnum.XMLSyntaxError, o1=str(e))
        tid = root.attrib.get('tid')
        if tid is None:
            _raise_parsing_exception(ParsingErrorEnum.BAD_TEMPLATE)
        else:
            try:
                template = Template.objects.get(id=tid)
                self._template = template
            except Template.DoesNotExist:
                _raise_parsing_exception(ParsingErrorEnum.TEMPLATE_DOES_NOT_EXIST, o1=tid)
        data_root_nodes = root.xpath('data')
        meta_id_set = set()
        try:
            if self._verify_only:
                total_count = len(data_root_nodes)
            else:
                total_count = len(data_root_nodes) * 2  # 认为数据解析和写数据库各占一半时间
            if total_count == 0:
                raise ParsingError(ParsingErrorEnum.DATA_IS_BLANK)
            current_count = 0
            for data_root_node in data_root_nodes:
                meta_node = data_root_node.find('meta')
                if meta_node is None:
                    _raise_parsing_exception(ParsingErrorEnum.NODE_MISSING, o1='meta', o2='data',
                                             line=data_root_node.sourceline)
                data_node = data_root_node.find('content')
                if data_node is None:
                    _raise_parsing_exception(ParsingErrorEnum.NODE_MISSING, o1='content', o2='data',
                                             line=data_root_node.sourceline)
                meta = _read_meta(meta_node)
                data = _read_data(data_node)
                if (meta_id := meta.pop(DataMetaFieldEnum.DATA_ID.field_raw_name, None)) in meta_id_set:
                    _raise_parsing_exception(ParsingErrorEnum.DUPLICATE_META_ID, o1=str(meta_id))
                else:
                    meta_id_set.add(meta_id)
                if not self._verify_only:
                    self.meta_id_list.append(
                        self._template.add_data(meta, data, uploaded_by=uploaded_by, importing=True).id)
                    current_count += 1
                    if progress_handler:
                        progress_handler(current_count / total_count)

            if not self._verify_only:
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
        except Exception:
            self.roll_back()
            raise

    def generate_template(self, number_of_data=2, elements_per_array=2, rows_per_table=2):
        """
        生成导入模板
        :param number_of_data:
        :param elements_per_array:
        :param rows_per_table:
        :return:
        """

        def _add_field(field_meta: TemplateField, in_array=False):
            if in_array:
                node = etree.Element('element')
            else:
                node = etree.Element('field', name=field_meta.field_name)
            t = field_meta.field_type
            if t.is_table:
                for index in range(1, rows_per_table + 1):
                    row_node = etree.SubElement(node, 'row')
                    row_node.append(etree.Comment(
                        _("***Fill row %(row_number)s below and remove this line***") % {'row_number': index}))
                    for header in field_meta.sub_fields:
                        row_node.append(_add_field(header))
            elif t.is_generator:
                node.append(etree.Comment(_('***Keep only ONE of the following fields and remove this line***')))
                for option in field_meta.sub_fields:
                    node.append(_add_field(option))
            elif t.is_container:
                for sub_field in field_meta.sub_fields:
                    node.append(_add_field(sub_field))
            elif t.is_array:
                for index in range(1, elements_per_array + 1):
                    node.append(etree.Comment(_("***Fill element %(element_number)s below and remove this line***") % {
                        'element_number': index}))
                    node.append(_add_field(field_meta.element_field, in_array=True))
            elif t.is_file or t.is_image:
                link_node_name = 'image' if t.is_image else 'file'
                for index in range(1, elements_per_array + 1):
                    link_node = etree.SubElement(node, link_node_name)
                    link_node.text = _("***Fill %(type_name)s %(file_number)s's path here***") % {
                        'type_name': link_node_name,
                        'file_number': str(index)}
            else:
                context = {'field_name': field_meta.field_name, 'field_type': t.description}
                if t.is_choice:
                    context['choices'] = ', '.join(field_meta.choices_list)
                    node.text = _(
                        '***Fill %(field_name)s (%(field_type)s) here. Choices are %(choices)s ***') % context
                else:
                    if in_array:
                        node.text = _('***Fill array element (%(field_type)s) here***') % context
                    else:
                        node.text = _('***Fill %(field_name)s (%(field_type)s) here***') % context
            return node

        for index in range(1, number_of_data + 1):
            data_node = etree.SubElement(self._root_node, 'data')
            meta_node = etree.SubElement(data_node, 'meta')
            content_node = etree.SubElement(data_node, 'content')
            for field in DataMetaFieldEnum.reader_iterator(with_id=True):
                field_node = etree.Element('field', name=field.description)
                if field == DataMetaFieldEnum.DATA_ID:
                    field_node.text = _("***Data %(data_number)s's ID***") % {'data_number': index}
                elif field == DataMetaFieldEnum.PROJECT:
                    field_node.text = _("***在这里填写一级机构的编号***")
                elif field == DataMetaFieldEnum.SUBJECT:
                    field_node.text = _("***在这里填写二级机构的编号***")
                elif field == DataMetaFieldEnum.VISIBILITY:
                    choices = ', '.join(DATA_VISIBILITY_NAME_MAP.keys())
                    field_node.text = _("***在这里填写可见性(可选值为 %(choices)s )***") % {'choices': choices}
                else:
                    field_node.text = _('***Fill %(field_name)s here***') % {'field_name': field.description}
                meta_node.append(field_node)

            for field in self._template.fields:
                node = _add_field(field)
                content_node.append(node)

    def save(self, output_dir):
        if self._mode == DataMode.READ:
            raise ValueError("Nothing to save in read mode.")
        content_to_save = etree.tostring(self._root_node, encoding='utf-8', xml_declaration=True,
                                         pretty_print=True)
        if not self._no_attachments:
            for src, new_filename in self._serializer.filenames:
                try:
                    shutil.copy(src, os.path.join(output_dir, new_filename))
                except FileNotFoundError:
                    continue
        filename = f'{self._template.title.replace("/", "")}.xml'
        with open(os.path.join(output_dir, filename), 'wb') as fp:
            fp.write(content_to_save)
        return filename
