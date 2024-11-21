# -*- coding: utf-8 -*-

import json
# @File   : flat_json
# @Author : Harold Chen
# @Date   : 2018/4/10
import os
import shutil
from datetime import datetime

from apps.storage.docs.data import DataContent
from apps.storage.models.data import DataMeta, DataMetaFieldEnum
from apps.storage.models.template import TemplateField, Template
from .json import JSONFieldSerializer


class FlatJSONWriter:

    def __init__(self, template: Template, serializer=None, with_meta=False, with_headers=False,
                 with_headers_type=False, to_url=False):
        self._template = template
        self._headers = [None]
        self._header_field_type_map = {}
        self._to_url = to_url
        self._temp_id_data_map = {}
        self._temp_id_meta_map = {}
        self._meta_id_list = []
        self._serializer = serializer
        self._with_headers = with_headers
        self._with_headers_type = with_headers_type
        self._with_meta = with_meta
        if serializer is None:
            serializer = JSONFieldSerializer(to_url=to_url, absolute_file_path=True)
        self._serializer = serializer

    def write_data(self, data_meta: DataMeta):
        header_index = 0  # 当前表头下标
        data_content = DataContent.objects.get(id=data_meta.dc_id)
        temp_data = {}
        temp_meta_data = []

        def _add_field(field_meta: TemplateField, field_value, header_path_list: tuple):
            nonlocal header_index
            if field_meta.field_type.is_array:
                for index, value in enumerate(field_value or []):
                    _add_field(field_meta.element_field, value, header_path_list + (index + 1,))
            elif field_meta.field_type.is_table:
                if field_value:
                    for index, row in enumerate(field_value):
                        for table_header in field_meta.sub_fields:
                            _add_field(table_header, row.get(table_header.field_name),
                                       header_path_list + (table_header.field_name, index + 1))
            elif field_meta.field_type.is_container or field_meta.field_type.is_generator:
                if field_value:
                    for sub_field in field_meta.sub_fields:
                        _add_field(sub_field, field_value.get(sub_field.field_name),
                                   header_path_list + (sub_field.field_name,))
            else:
                header = '.'.join([str(x) for x in header_path_list])  # 表头
                self._header_field_type_map[header] = field_meta.field_type.name.lower()
                if self._headers[header_index] != header:  # 如果当前位置表头不是header，插进来
                    self._headers.insert(header_index, header)
                header_index += 1
                if field_value is not None:
                    temp_data[header] = self._serializer.serialize_field(field_value, field_meta, data_meta.id)

        for field in self._template.fields:
            _add_field(field, data_content.get(field.field_name), (field.field_name,))

        for meta_field in DataMetaFieldEnum.writer_iterator():
            temp_meta_data.append(meta_field.get_value(data_meta))

        self._temp_id_data_map[data_meta.id] = temp_data
        self._temp_id_meta_map[data_meta.id] = temp_meta_data
        self._meta_id_list.append(data_meta.id)

    def save(self, output_dir_or_fp=None):
        """
        :param output_dir_or_fp: 直接写入fp，用于导出到OCPMDM，或者导出到临时文件夹，用于用户下载，为None则为用于导出二维Excel
        :return:
        """
        self._headers.pop()
        final_data = {'data': []}
        if self._with_headers:
            final_data['data_headers'] = self._headers
        if self._with_headers_type:
            final_data['data_headers_type'] = self._header_field_type_map

        for meta_id in self._meta_id_list:
            temp_data = self._temp_id_data_map[meta_id]
            flattened = []
            for header in self._headers:
                flattened.append(temp_data.get(header))
            final_data['data'].append(flattened)

        if hasattr(output_dir_or_fp, 'write'):
            content = json.dumps(final_data, ensure_ascii=False, indent=4)
            output_dir_or_fp.name = f'{self._template.title.replace("/", "")}.' \
                                    f'{datetime.now().strftime("%Y%m%d%H%M%S")}.json'
            output_dir_or_fp.write(content.encode('utf-8'))
            output_dir_or_fp.seek(0)
            return output_dir_or_fp.name
        elif output_dir_or_fp is None:
            return final_data
        else:
            # 打包下载
            for src, new_filename in self._serializer.filenames:
                shutil.copy(src, os.path.join(output_dir_or_fp, new_filename))
            filename = f'{self._template.title.replace("/", "")}_flat.json'
            with open(os.path.join(output_dir_or_fp, filename), 'w') as fp:
                json.dump(final_data, fp, ensure_ascii=False)
            return filename
