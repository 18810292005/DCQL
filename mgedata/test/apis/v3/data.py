import json
from unittest.mock import patch, sentinel

from django.test import TestCase
from django.shortcuts import reverse
from mongoengine import connect, disconnect

from mgedata.test.utils.client import post_to_create_user, post_to_login
from mgedata.test.utils.server import create_material_category_tree
from mgedata.test import MGETestCase
from mgedata.test.utils.sample.material import projects as material_projects
from mgedata.generic.trans import DataRandomFiller

from apps.storage.models.material import Category, Template, MaterialProject
from apps.storage.trans.api import DataToApiRequestBody
from apps.account.models import User
from django.test.utils import override_settings


class TestDataUploadApi(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        from mgedata.test.utils.sample.template import templates
        self.upload_data_ids = []

        post_to_create_user(self.client, 'test', 'test', 'test', 'xx@xx.cn', '12003451356', 'ustb')
        create_material_category_tree(Category,
                                      [
                                          {'name_zh': 'leaf', 'name_en': 'leaf'}
                                      ])
        self.category = Category.objects.get(name_zh='leaf')

        self.user = User.objects.get(pk='test')
        self.templates = []
        for i in range(len(templates)):
            Template.objects.filter(title=('模板测试{}'.format(i + 100))).delete()
            t, _ = Template.objects.update_or_create(user=self.user,
                                                     title='模板测试{}'.format(i + 100),
                                                     abstract='abstract',
                                                     category=self.category,
                                                     content=templates[i])
            self.templates.append(t)

        MaterialProject.make(material_projects)

    @override_settings(DEBUG=True)
    def test_upload_data_1(self):
        post_to_login(self.client, 'test', 'test')
        # results = self.client.post(reverse('api_v1_account:session_api'),
        #                            json.dumps({'user': 'test', 'password': 'test', 'captcha_response': '123'}),
        #                            content_type='application/json')
        # print(results.json())
        upload_data_api_url = reverse('api_v3_storage:manage_data_by_data_manager')
        for i in range(len(self.templates)):
            d = DataRandomFiller(self.user.pk, self.category.id, self.templates[i].id).to()
            results = self.client.post(upload_data_api_url,
                                       json.dumps(DataToApiRequestBody(d).to()),
                                       content_type='application/json')
            print(results.json())
            self.assertEqual(results.json()['code'], 0)
            self.upload_data_ids.append(results.json()['data'])
            fetch_results = self.client.get(reverse('api_v3_storage:manage_one_data_by_data_manager',
                                                    kwargs={'meta_id': results.json()['data']}))
