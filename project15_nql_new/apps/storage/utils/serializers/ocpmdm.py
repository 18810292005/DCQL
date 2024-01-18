# -*- coding: utf-8 -*-

# @File   : ocpmdm
# @Author : Harold Chen
# @Date   : 2018/7/21

from apps.storage.utils.serializers import FlatJSONWriter
from apps.storage.models.template import Template
from apps.storage.models.data import DataMeta


class OCPMDMSerializer:
    def __init__(self, template: Template):
        self._template = template
        self._flat_json_writer = FlatJSONWriter(template, with_headers=True, with_headers_type=True, to_url=True)

    def write_data(self, data_meta: DataMeta):
        self._flat_json_writer.write_data(data_meta)

    def save(self):
        flat_data = self._flat_json_writer.save()
        header_type_map = flat_data['data_headers_type']
        headers = flat_data['data_headers']
        data = flat_data['data']

        transformed = {}

        for row_index, row in enumerate(data):
            for column_index, header in enumerate(headers):
                if header not in transformed:
                    transformed[header] = {}
                transformed[header].update({str(row_index): row[column_index]})

        return transformed, headers, header_type_map
