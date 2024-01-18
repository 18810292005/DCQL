'''
Description: 生成ES数据相关的单元测试
Autor: liminghong.dev
Date: 2021-03-29 11:46:58
'''
import unittest

from mgedata.test.utils.sample.query import API_queries, ES_DSL
from apps.search.core_v2.query import SingleTemplateQueryFactory


class TestAPIQueryToEsQuery(unittest.TestCase):
    maxDiff = 1000

    def test_sample_search(self):
        for i in range(len(API_queries)):
            q = SingleTemplateQueryFactory.produce(API_queries[i]['q'])
            self.assertEqual(q, ES_DSL[i])
