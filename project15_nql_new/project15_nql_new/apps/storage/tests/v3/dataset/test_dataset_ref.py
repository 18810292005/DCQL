'''
@Author: lzj
@Date: 2021-11-12 10:10:20
'''

from django.test import TestCase
from apps.storage.models.data import DataSet, ArticleReference, DataMeta
from apps.account.models.users import User


class TestDatasetReference(TestCase):

    def setUp(self):
        # 创建一条数据.
        self.user = User.objects.create(username='lzj', real_name='lzj', email='1534115214@qq.com',
                                        roles=0, tel='18573765966', password="123")
        self.dataset = DataSet.objects.create(user=self.user, contributor='lzj', title='测试数据集', project='测试项目')

        # 创建元数据.
        self.data_meta = DataMeta.objects.create(title="测试", is_public=True, dataset=self.dataset)
        self.url = "/api/v3/storage/dataset/ref"
        self.data = {
            "article_title": "测试1",
            "article_author": "lzj",
            "article_abstract": "测试",
            "article_doi": "doi1",
            "article_url": "http//www.baidu.com",
            "dataset_id": [self.dataset.id]
        }

    def test_dataset_reference_post(self):
        content_type = "application/json"

        # <正确>访问
        res = self.client.post(self.url, self.data, content_type)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['code'], 0)
        # 测试引用数
        self.assertEqual(self.dataset.get_ref_count, 1)

        # <错误>dataset_id不存在.
        self.data['dataset_id'] = [9999999]
        res = self.client.post(self.url, self.data, content_type)
        self.assertEqual(res.status_code, 422)
        self.assertEqual(res.json()['code'], 2102)

        # <正确>再次引用.
        self.data["article_doi"] = "doi2"
        self.data["dataset_id"] = [self.dataset.id]
        res = self.client.post(self.url, self.data, content_type)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.dataset.get_ref_count, 2)
        self.assertEqual(self.data_meta.dataset_ref_count, 2)

        # <正确>删除
        data = {
            "article_doi": "doi1",
            "dataset_id": [self.dataset.id]
        }
        res = self.client.delete(self.url, data, content_type)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(self.dataset.get_ref_count, 1)
        # 测试元数据集的引用.
        self.assertEqual(self.data_meta.dataset_ref_count, 1)