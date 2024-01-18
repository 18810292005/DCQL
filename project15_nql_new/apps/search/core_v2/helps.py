'''
Description: ES交互相关
Autor: liminghong.dev
Date: 2021-09-15 09:06:14
'''
import logging
import traceback
from elasticsearch.helpers import bulk, scan
from elasticsearch_dsl import Search, query
from elasticsearch_dsl.connections import connections

from mgedata.generic.trans.internal import DictToTemplateContent

from apps.storage.models.template import Template
from apps.storage.trans.db import DbToData
from apps.search.core_v2.cache import set_list_cache, get_list_cache
from apps.search.trans.data import DataToEsDocument
from apps.search.trans.template import TemplateContentToEsMapping

logger = logging.getLogger('django')


class TemplateIndexHelp:
    def __init__(self, template_id) -> None:
        self.template_id = template_id
        self.index_name = TemplateIndexHelp.to_index_name_by(template_id)
        self._indices = connections.get_connection().indices

    def is_exists(self) -> bool:
        index_names = get_list_cache('index_names')
        if index_names is None:
            index_names = list(self._indices.get_alias('*').keys())
            set_list_cache(index_names, 'index_names')
            return self.index_name in index_names
        if self.index_name in index_names:
            return True
        if self._indices.exists(self.index_name):
            set_list_cache(list(self._indices.get_alias('*').keys()), 'index_names')
            return True
        return False

    def create(self) -> None:
        if self.is_exists():
            return
        template = Template.objects.get(id=self.template_id)
        template_content = DictToTemplateContent(template.content).to()
        es_mapping = TemplateContentToEsMapping(self.index_name,
                                                template_content).to()
        self._indices.create(self.index_name, es_mapping)

    def delete(self) -> None:
        if not self.is_exists():
            return
        self._indices.delete(self.index_name)

    @staticmethod
    def get_all() -> list:
        return connections.get_connection().indices.get_alias('*').keys()

    @staticmethod
    def to_index_name_by(template_id):
        return 'template_{}'.format(template_id)

    @staticmethod
    def to_template_id_by(index):
        return int(index.replace('template_', ''))


class Service:
    # 批量构造要创建的数据
    @staticmethod
    def _generate_datas(meta_ids: list):
        def generate_data(meta_id) -> dict:
            _data = DbToData(meta_id).to()
            _index = TemplateIndexHelp.to_index_name_by(_data['template'])
            _source = DataToEsDocument(_data).to()
            return dict(_id=meta_id,
                        _index=_index,
                        _type='_doc',
                        doc=_source,
                        _op_type='update',
                        doc_as_upsert=True)

        for meta_id in meta_ids:
            try:
                yield generate_data(meta_id)
            except Exception:
                _e = traceback.format_exc()
                _str = "generate_data:{}, data_meta_id:{}".format(_e, meta_id)
                logger.error(_str)

    # 批量创建数据
    @staticmethod
    def create_data(meta_ids: list, use_bulk=True):
        cli = connections.get_connection()
        datas = Service._generate_datas(meta_ids)
        if use_bulk:
            bulk(cli, datas, request_timeout=600)
        else:
            for data in datas:
                cli.update(index=data['_index'],
                           id=data['_id'],
                           body=dict(
                               doc=data['doc'],
                               doc_as_upsert=data['doc_as_upsert']
                           ))

    # 批量构造要删除的数据
    @staticmethod
    def _generate_deletes(cli, meta_ids: list, index: str):
        _query = Search().query(query.Terms(id=meta_ids)).to_dict()
        for result in scan(client=cli,
                           index=index,
                           query=_query,
                           _source=False,
                           track_scores=False,
                           scroll='10m',
                           request_timeout=300):
            result['_op_type'] = 'delete'
            yield result

    # 批量删除数据（该问题的终极解决方案应该是使用data_id作为es doc id),记得在重构的时候修改
    @staticmethod
    def delete_data(meta_ids: list, index='template_*', use_bulk=True):
        cli = connections.get_connection()
        if use_bulk:
            actions = Service._generate_deletes(cli, meta_ids, index)
            bulk(cli, actions, request_timeout=300)
        else:
            _query = Search().query(query.Terms(id=meta_ids)).to_dict()
            Service.delete_by_query(index, _query)

    @staticmethod
    def search(index: str, _query: dict, **kwargs):
        cli = connections.get_connection()
        return cli.search(index=index,
                          body=_query,
                          track_total_hits=True,
                          **kwargs)

    @staticmethod
    def delete_by_query(index: str, _query: dict):
        cli = connections.get_connection()
        return cli.delete_by_query(index=index, body=_query, slices=2, request_timeout=600)

    @staticmethod
    def update(index: str, id: str, _query: dict):
        cli = connections.get_connection()
        cli.update(index, id, body=_query)
