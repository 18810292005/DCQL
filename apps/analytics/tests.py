# Create your tests here.
import pprint
from unittest import TestCase

from django.shortcuts import reverse

from apps.analytics.core.cache import DataStatisticsCache, CacheTimeType, CacheKeyManager
from apps.storage.models.material import MaterialProject
from mgedata.test import MGETestCase, material_category_required
from mgedata.test.testcase import MGEBaseTestCase
from mgedata.test.utils.client import JSONClient
from mgedata.test.utils.http_tools import HttpTools


class TestProjectTrend(MGETestCase):

    @material_category_required
    def test_get_subject_trend_for_sanity(self):
        from apps.storage.models.material import MaterialSubject
        ins: MaterialSubject = MaterialSubject.objects.all().first()
        pprint.pprint(ins.to_dict())
        ret = HttpTools.get(
            self.client,
            reverse('api_v1_analytics:trend_of_subject',
                    kwargs={
                        'pid': ins.project.id,
                        'sid': ins.id
                    }),
            {
                'beg': 201801,
                'end': 201811,
            }
        )
        pprint.pprint(ret)

    @material_category_required
    def test_get_project_trend_for_sanity(self):
        from apps.storage.models.material import MaterialProject
        ins: MaterialProject = MaterialProject.objects.all().first()
        pprint.pprint(ins.to_dict())
        ret = HttpTools.get(
            self.client,
            reverse('api_v1_analytics:trend_of_project',
                    kwargs={
                        'pid': ins.id
                    }),
            {
                'beg': 201801,
                'end': 201811,
            }
        )
        pprint.pprint(ret)


class TestAnalyticsAPI(MGEBaseTestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.json_client = JSONClient()

    def test_all_projects_info(self):
        view = reverse('api_v1_analytics:all_projects_info')
        response = self.json_client.get_json(view)

        MaterialProject.objects.create(id='test',
                                       name='test',
                                       leader='test',
                                       institution='test',
                                       leader_contact_method='test',
                                       responsible_expert='test',
                                       )

        project_count = MaterialProject.objects.all().count()
        self.assertNotEqual(project_count, len(response['data']))  # 无数据的项目信息不返回
        self.assertTrue('test' not in response['data'])
        print(response['data'])
        self.assertTrue('id' in response['data'][0])
        self.assertTrue('name' in response['data'][0])
        self.assertTrue('leader' in response['data'][0])
        self.assertTrue('data_count' in response['data'][0])
        self.assertTrue('tem_count' in response['data'][0])
        self.assertEqual(response['code'], 0)


class TestAnalyticsMemCache(TestCase):

    def test_site_count(self):
        # 缓存设置.
        DataStatisticsCache.set_data_cache("自定义key测试材料", 10, CacheTimeType.ONE_DAY.value)
        value = DataStatisticsCache.get_data_cache("自定义key测试材料")
        self.assertEqual(value, 10)
        # 缓存设置列表.
        cache_key = CacheKeyManager.get_key(MaterialProject, "Test")
        value_list = ["test1_value", 5, "中文"]
        DataStatisticsCache.set_data_cache(cache_key, value_list, CacheTimeType.ONE_DAY.value)
        cache_value_list = DataStatisticsCache.get_data_cache(cache_key)
        for x, y in zip(value_list, cache_value_list):
            self.assertEqual(x, y)
        # 删除有值的缓存.
        DataStatisticsCache.delete_data_cache(cache_key)
        cache_value_list = DataStatisticsCache.get_data_cache(cache_key)
        self.assertIsNone(cache_value_list)
