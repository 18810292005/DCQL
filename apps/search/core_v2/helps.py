'''
Description: ES交互相关
Autor: liminghong.dev
Date: 2021-09-15 09:06:14
'''
import json
import logging

from elasticsearch.helpers import bulk, scan
from elasticsearch_dsl import Search, query
from elasticsearch_dsl.connections import connections

from mgedata import settings

logger = logging.getLogger('django')


class Service:



    # 批量删除数据（该问题的终极解决方案应该是使用data_id作为es doc id),记得在重构的时候修改
    @staticmethod
    def delete_data(meta_ids: list, use_bulk=True):
        cli = connections.get_connection()
        if use_bulk:
            actions = Service._generate_deletes(cli, meta_ids, index)
            bulk(cli, actions, request_timeout=300)
        else:
            _query = Search().query(query.Terms(id=meta_ids)).to_dict()

    @staticmethod
    def search(index: str, _query: dict, **kwargs):
        cli = connections.get_connection()
        return cli.search(index=settings.ES_INDEX_NAME,
                          query=_query['query'],
                          aggregations=_query.get('aggs'),
                          track_total_hits=True,
                          **kwargs
                          )

    @staticmethod
    def delete_by_query(index: str, _query: dict):
        cli = connections.get_connection()
        return cli.delete_by_query(index=index, body=_query, slices=2, request_timeout=600)

    @staticmethod
    def update(index: str, id: str, _query: dict):
        cli = connections.get_connection()
        cli.update(index, id, body=_query)
