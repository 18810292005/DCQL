import base64
import json
from tempfile import NamedTemporaryFile
from typing import Dict, Any, List

import pandas as pd
from PIL import Image
import numpy as np
from bson import ObjectId
from django.conf import settings
from mongoengine import DoesNotExist

from apps.storage.data_refactor.utils.data_flatten import json_flat
from apps.storage.data_refactor.utils.path_node import PathNode, SearchPlan
from apps.storage.docs import DataFieldContainer, DataFieldTableRow, DataContent, DataFieldTable
from apps.storage.models import Template, DataMeta
from apps.storage.models.data import DataMetaFieldEnum
# from apps.storage.models.file import DataRefactorFile, FileContentType
from apps.storage.models.template import DocumentScope, TemplateField
from apps.storage.utils.serializers import FlatJSONWriter
from apps.storage.utils.serializers.json import JSONFieldSerializer
from mgedata.errors.models import MGEError
from django.utils.translation import ugettext as _


class ColumnDatatGetter():
    def __init__(self, template: Template):
        self.config_data_mapping: Dict[PathNode, Any] = {}
        self._serializer = JSONFieldSerializer(decompose_range=False, to_url=False)
        self._flat_json_writer = FlatJSONWriter(template)
        self.template = template

    def _refactor_data(self, configs: List[dict], data_ids: List[int] = None, all_with_meta=True):
        frame, path_nodes, data_ids = self.refactor_datas(configs, data_ids, all_with_meta=all_with_meta)
        meta = self._generate_meta(path_nodes, data_ids, self.template)
        return frame, meta

    def refactor_to_hdf(self, filename, configs: List[dict], data_ids: List[int] = None, all_with_meta=True):
        frame, meta = self._refactor_data(configs, data_ids, all_with_meta=all_with_meta)
        return self.write_hdf(filename, frame, meta)

    def refactor_to_json(self, filename, configs: List[dict], data_ids: List[int] = None, file=False,
                         all_with_meta=True):
        frame, meta = self._refactor_data(configs, data_ids, all_with_meta=all_with_meta)
        return self.write_json(filename, frame, meta, file)

    def _handle_jiuzhan_name(self, name):
        return name.replace(" ", "_").replace(
            '/', '_').replace('-', '_').replace('*', 'x').replace(
            '（', '(').replace('）', ')').replace('％', '%').replace(
            '℃', '(摄氏度)').replace('℉', '(华氏度)')

    def refactor_datas(self, configs: List[dict], data_ids: List[int] = None, all_with_meta=True):
        self._serializer = JSONFieldSerializer(decompose_range=False)
        mapping, path_nodes = self.from_dict_to_path_nodes(configs)
        raw_datas = self.get_data_from_type2node(mapping)
        print("raw_datas", raw_datas)
        if data_ids:
            new_datas = {data_id: raw_datas.get(data_id, {}) for data_id in data_ids}
        else:
            new_datas = raw_datas
        records = []
        print("new_datas", new_datas)
        for data_id, raw_data in new_datas.items():
            flatten_data = {}
            if not all_with_meta:
                flatten_data.update({"meta_data_id": data_id})
            else:
                try:
                    data_meta = DataMeta.objects.get(id=data_id)
                except DataMeta.DoesNotExist:
                    data_meta = None
                for field in DataMetaFieldEnum.writer_iterator(with_id=True):
                    if data_meta is None:
                        value = None
                    else:
                        value = field.get_value(data_meta) or None
                        if field == field.__class__.PUBLIC_DATE:
                            value = value.strftime('%Y-%m-%d')
                    field_name = "meta_" + self._handle_jiuzhan_name(str(field.value).lower())
                    flatten_data.update({field_name: value})
            for node in path_nodes:
                data = raw_data.get(node.path, {})
                node_name = node.name
                while (node.name in flatten_data):
                    node_name = "duplicate_" + self._handle_jiuzhan_name(node_name)
                flatten_data.update(json_flat({node_name: data}))
                # flatten_data.update(json_flat({node.name: data}), **node.option)
                # flatten_data.update({'data_meta_id': data_id})
            records.append(flatten_data)
        print("records", records)
        frame = pd.DataFrame(records)
        print("frame", frame)
        return frame, path_nodes, list(new_datas.keys())

    def _generate_meta(self, path_nodes: List[PathNode], data_ids, template):
        meta = {}
        meta["flat_config"] = [p.to_dict() for p in path_nodes]
        meta["used_datas"] = data_ids
        meta["template_id"] = template.id
        return pd.Series(list(meta.values()),
                         index=list(meta.keys()))

    def write_hdf(self, filename, frame: pd.DataFrame, meta: pd.Series):
        """
        write_hdf将数据和元数据写入HDF文件。

        frame : 展开后的数据，DataFrame类型。
        meta：元数据，Series类型。
        """
        store = None
        # try:
        #     store = pd.HDFStore(filename)
        #     frame = frame.fillna(np.nan, inplace=True)
        #     print(frame.axes)
        #     store.put(key='datas', value=frame, format='t')
        #     meta = meta
        #     store.put(key='metas', value=meta)
        #     fp = None
        #     try:
        #         fp = open(filename, 'rb')
        #         return DataRefactorFile.add(fp, content_type=FileContentType.OTHERS, filename=filename,
        #                                     randomize=False)  # 存入数据库和本地
        #     except Exception as e:
        #         raise MGEError.NO_VALID_FILE(_(f"Can not generate hdf file. Detailed:{str(e)}"))
        #     finally:
        #         if fp:
        #             fp.close()
        # finally:
        #     if store:
        #         store.close()

    def write_json(self, filename, frame: pd.DataFrame, meta: pd.Series, file):
        try:
            print(frame)
            frame_data = frame.to_dict(orient="list")
            meta_data = meta.to_dict()
            data = {"metas": meta_data, "datas": frame_data}
            # if file:
            #     fp = None
            #     try:
            #         fp = NamedTemporaryFile(mode='wb+')
            #         json_str = json.dumps(data, ensure_ascii=False)
            #         fp.write(json_str.encode(encoding="utf-8"))
            #         return DataRefactorFile.add(fp, content_type=FileContentType.OTHERS, filename=filename,
            #                                     randomize=False)
            #     except Exception as e:
            #         raise e
            #     finally:
            #         if fp:
            #             fp.close()
            return data
        except Exception as e:
            raise MGEError.NO_VALID_FILE(_(f"Can not generate json. Detailed:{str(e)}"))

    def from_dict_to_path_nodes(self, datas: List[dict]):
        nodes_mapping = {k: {} for k in DocumentScope}
        nodes = []
        for d in datas:
            pn = PathNode.from_dict(d)
            sp = SearchPlan(template=pn.template, document_path=pn.document_path,
                            document_scope=pn.template_field.document_scope)
            path_mapping = nodes_mapping[pn.template_field.document_scope].get(sp, [])
            path_mapping.append(pn)
            nodes.append(pn)
            nodes_mapping[pn.template_field.document_scope][sp] = path_mapping
        return nodes_mapping, nodes

    def get_data_from_type2node(self, type2node):
        query_result = {}
        for scope, node_list in type2node.items():
            for search_plan, path_nodes in node_list.items():
                if search_plan.document_path == "/":
                    document_field = None
                else:
                    document_field = search_plan.document_scope
                mongo_values = self._get_mongo_values(search_plan, document_field)
                raw_data = self._get_data_by_path(search_plan, mongo_values, path_nodes)
                for data_id, data in raw_data.items():
                    if data_id not in query_result:
                        query_result[data_id] = data
                    else:
                        query_result[data_id].update(data)
        print(query_result)
        return query_result

    def _get_data_by_path(self, search_plan: SearchPlan, docs, path_nodes: List[PathNode]):
        template = search_plan.template
        return_raw_data = {}
        for doc in docs:
            for path_node in path_nodes:
                data_location_field = path_node.data_location_field
                if isinstance(doc, DataContent) or isinstance(doc, DataFieldTableRow):
                    mongo_value = self._handle_mongo_value_with_field(
                        getattr(doc, path_node.template_field.field_name, None),
                        data_location_field,
                        doc.get_meta_id)
                    _not_from_content = False
                else:
                    mongo_value = self._handle_mongo_value_with_field(doc, data_location_field, doc.get_meta_id)
                    _not_from_content = True
                if _not_from_content:
                    field_path = path_node.template_field.field_path_str
                    if data_location_field.field_path_str != path_node.template_field.field_path_str:  # 查询字段在容器或表格中
                        if data_location_field.field_type.is_table:
                            value_list = []
                            for row in mongo_value:
                                row_new = {}
                                value = row.get(field_path, None)
                                if value is not None:
                                    row_new[field_path] = value
                                value_list.append(row_new)
                            mongo_value = value_list
                        else:
                            mongo_value = mongo_value.get(field_path.split('.')[-1], None)
                if doc.get_meta_id not in return_raw_data:
                    return_raw_data[doc.get_meta_id] = {}
                if path_node.path not in return_raw_data[doc.get_meta_id]:
                    return_raw_data[doc.get_meta_id][path_node.path] = mongo_value
                else:
                    if not isinstance(return_raw_data[doc.get_meta_id][path_node.path], list):
                        return_raw_data[doc.get_meta_id][path_node.path] = [
                            return_raw_data[doc.get_meta_id][path_node.path]]
                    return_raw_data[doc.get_meta_id][path_node.path].append(mongo_value)
        return return_raw_data

    def _get_mongo_values(self, search_plan: SearchPlan, document_field: DocumentScope):
        if document_field:
            mongo_table = document_field
        else:
            mongo_table = None
        if not mongo_table or mongo_table == DocumentScope.DATA_CONTENT:
            mongo_entry_list = DataContent.objects.filter(_tid=search_plan.template.id)
        elif mongo_table == DocumentScope.DATA_CONTAINER:
            mongo_entry_list = DataFieldContainer.objects.filter(_tid=search_plan.template.id,
                                                                 _path=search_plan.document_path)
        elif mongo_table == DocumentScope.DATA_TABLE:
            mongo_entry_list = DataFieldTable.objects.filter(_tid=search_plan.template.id,
                                                             _path=search_plan.document_path)
        elif mongo_table == DocumentScope.DATA_TABLE_ROW:
            mongo_entry_list = DataFieldTableRow.objects.filter(_tid=search_plan.template.id,
                                                                _path=search_plan.document_path)
        else:
            raise MGEError.UNKNOWN_ERROR
        final_mongo_entry_list = []
        for mongo_entry in mongo_entry_list:
            final_mongo_entry_list.append(mongo_entry)
        return final_mongo_entry_list

    def _handle_mongo_value_with_field(self, mongo_value, field_meta, meta_id):
        def _serialize_container_or_generator(field_meta, mongo_value, meta_id):
            content_body = {}
            try:
                if isinstance(mongo_value, ObjectId):
                    container_content = DataFieldContainer.objects.get(pk=mongo_value)
                else:
                    container_content = DataFieldContainer.objects.get(pk=mongo_value.id)
            except DoesNotExist:
                container_content = {}
            for sub_field in field_meta.sub_fields:
                val = _serialize_field(getattr(container_content, sub_field.field_name, None), sub_field, meta_id)
                if val is not None:
                    content_body[sub_field.field_name] = val
                    if field_meta.field_type.is_generator:
                        return content_body
                else:
                    if field_meta.field_type.is_container:
                        content_body[sub_field.field_name] = val
            return content_body

        def _serialize_table(field_meta, mongo_value, meta_id):
            if isinstance(mongo_value, ObjectId):
                rows = DataFieldTableRow.objects(_owner_id=mongo_value)
            else:
                rows = DataFieldTableRow.objects(_owner_id=mongo_value.id)
            values = []
            for row in rows:
                content_body = {}
                for header in field_meta.sub_fields:
                    val = _serialize_field(getattr(row, header.field_name, None), header, meta_id)
                    if val is not None:
                        content_body[header.field_name] = val
                values.append(content_body)
            return values

        def _serialize_array(field_meta, mongo_value, meta_id):
            values = []
            for element_mongo_value in mongo_value:
                new_mongo_value = element_mongo_value
                val = _serialize_field(new_mongo_value, field_meta.element_field, meta_id)
                if val is not None:
                    values.append(val)
            return values

        def _serialize_field(mongo_value, field_meta: TemplateField, meta_id):
            def _handle_url(filename):
                return filename

            def _get_image(files):
                result = []
                for filename in files:
                    result.append(_handle_url(filename))
                    # try:
                    #     result.append(np.array(Image.open(filename), np.float64))
                    # except Exception as e:
                    #     print(e)
                    #     result.append(None)
                if len(result) == 1: result = result[0]
                return result

            def _get_file(files):
                result = []
                for filename in files:
                    result.append(_handle_url(filename))
                    # try:
                    #     result.append(base64.b64encode(open(filename, "rb").read()).decode())
                    # except Exception as e:
                    #     print(e)
                    #     result.append(None)
                if len(result) == 1: result = result[0]
                return result

            if mongo_value is None:
                return None
            t = field_meta.field_type
            if t.is_container or t.is_generator:
                return _serialize_container_or_generator(field_meta, mongo_value, meta_id)
            elif t.is_table:
                return _serialize_table(field_meta, mongo_value, meta_id)
            elif t.is_array:
                return _serialize_array(field_meta, mongo_value, meta_id)
            elif t.is_image or t.is_file:
                if not isinstance(mongo_value, list):
                    files = [mongo_value]
                else:
                    files = mongo_value
                # return _get_file(files)
                if t.is_image:
                    return _get_image(files)
                elif t.is_file:
                    return _get_file(files)
            else:
                return self._serializer.serialize_field(mongo_value, field_meta, meta_id)

        if mongo_value:
            return _serialize_field(mongo_value, field_meta, meta_id)
        else:
            return None
