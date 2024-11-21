"""
* 测试获取材料分类

    1. private & public
"""

import json
import pprint
import unittest

from django.shortcuts import reverse
from django.test import TestCase

from mongoengine import connect, disconnect

from mgedata.test.utils.client import post_to_create_user, post_to_login
from mgedata.test.utils.server import create_oauth2_application, create_oauth2_access_token, \
    create_material_category_tree
from mgedata.test.utils.asserts import assert_dict_partial_equal
from mgedata.test import MGETestCase
from mgedata.test.utils.sample.material import projects as material_projects

from apps.storage.models.material import Category, Template, MaterialProject
from apps.account.models import AuthorityOfPrivateMaterialCategory
from apps.account.models import User


class TestGetMaterialCategory(MGETestCase):

    def postSetUp(self):
        self.category_public = Category.objects.get(name_zh='leaf')
        self.category_private = Category.objects.get(name_zh='leaf_private')

        self.user = User.objects.get(pk='test')

    def test_login(self):
        post_to_login(self.client, 'test', 'test')
        AuthorityOfPrivateMaterialCategory.objects.create(user=self.user,
                                                          category=self.category_private)
        AuthorityOfPrivateMaterialCategory.objects.create(user=self.user,
                                                          category=Category.objects.get(name_zh='middle_leaf'))
        AuthorityOfPrivateMaterialCategory.objects.create(user=self.user,
                                                          category=Category.objects.get(name_zh='middle'))
        categories = self.client.get(reverse('api_v1_storage:material_categories')).json()['data']
        self.assertEqual(len(categories), 6, pprint.pformat(categories))

    def test_not_login(self):
        categories = self.client.get(reverse('api_v1_storage:material_categories')).json()['data']
        self.assertEqual(len(categories), 3, categories)

    def test_material_tree_1(self):
        post_to_login(self.client, 'test', 'test')
        self.client.get(reverse('api_v1_storage:material_category_tree')).json()

    def test_material_tree_2(self):
        AuthorityOfPrivateMaterialCategory.objects.create(user=self.user,
                                                          category=Category.objects.get(name_zh='middle'))
        post_to_login(self.client, 'test', 'test')
        self.client.get(reverse('api_v1_storage:material_category_tree')).json()


class TestOauth2MaterialInformation(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        post_to_create_user(self.client, 'test', 'test', 'test', 'xx@xx.cn', '12003451356', 'ustb')
        create_material_category_tree(Category,
                                      [
                                          {'name_zh': 'leaf', 'name_en': 'leaf'},
                                          {
                                              'name_zh': 'leaf_private',
                                              'name_en': 'leaf_private',
                                              'is_public': False
                                          }
                                      ])

        self.user = User.objects.get(pk='test')
        self.application = create_oauth2_application(self.user, 'hello', 'http://localhost')
        self.access_code = create_oauth2_access_token(self.user, self.application)

    def test_oauth2_get_templates_v1(self):
        res = self.client.get(
            reverse('api_v1_storage:oauth2_templates'),
            Authorization='Bearer ' + self.access_code.token
        )
        self.assertEqual(res.status_code, 200)

    def test_oauth2_get_material_categories_v1(self):
        res = self.client.get(
            reverse('api_v1_storage:oauth2_material_category_tree'),
            Authorization='Bearer ' + self.access_code.token
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content)['data'][0]['name'], 'leaf')


class TestOauth2DataUpload(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        post_to_create_user(self.client, 'test', 'test', 'test', 'xx@xx.cn', '12003451356', 'ustb')
        create_material_category_tree(Category,
                                      [
                                          {'name_zh': 'leaf', 'name_en': 'leaf'},
                                          {
                                              'name_zh': 'leaf_private',
                                              'name_en': 'leaf_private',
                                              'is_public': False
                                          }
                                      ])

        self.user = User.objects.get(pk='test')
        self.category_leaf = Category.objects.get(name_en='leaf')
        self.application = create_oauth2_application(self.user, 'hello', 'http://localhost')
        self.access_code = create_oauth2_access_token(self.user, self.application)

        self.template = Template.objects.create(
            user=self.user,
            title='used for test',
            abstract='used for test',
            content={'_ord': ['a', 'b'], 'a': {'t': 1}, 'b': {'t': 2}},
            category=self.category_leaf
        )

    def test_data_upload_v1(self):
        create_res = self.client.post(
            reverse('api_v1_1_storage:o_data_full') + f'?username={"test"}',
            json.dumps(
                {
                    'meta': {
                        'tid': self.template.id,
                        'title': 'test 1',
                        'abstract': 'abstract',
                        'keywords': 'a b',
                        'source': {
                            'source': '10',
                            'methods': '000'
                        },
                        'public_date': 1,
                        'public_range': 1
                    },
                    'content': {'a': 'abc'}
                }
            ),
            content_type='application/json',
            Authorization='Bearer ' + self.access_code.token
        )
        self.assertEqual(create_res.status_code, 201)
        data_id = json.loads(create_res.content)['data']

        get_res = self.client.get(
            reverse('api_v2_storage:get_data', kwargs={'oid': data_id})
        )
        data = json.loads(get_res.content)['data']
        assert_dict_partial_equal(
            data,
            {
                'tid': self.template.id,
                'title': 'test 1',
                'abstract': 'abstract',
                'keywords': 'a b',
                'source': '10',
                'methods': '000',
                'content': {'a': 'abc'},
                'public_date': 1,
                'public_range': 1
            },
            [['tid'],
             ['title'],
             ['abstract'],
             ['content']]
        )


class TestOauth2MaterialProjects(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        post_to_create_user(self.client, 'test', 'test', 'test', 'xx@xx.cn', '12003451356', 'ustb')
        create_material_category_tree(Category,
                                      [
                                          {'name_zh': 'leaf', 'name_en': 'leaf'},
                                          {
                                              'name_zh': 'leaf_private',
                                              'name_en': 'leaf_private',
                                              'is_public': False
                                          }
                                      ])

        self.user = User.objects.get(pk='test')
        self.category_leaf = Category.objects.get(name_en='leaf')
        self.application = create_oauth2_application(self.user, 'hello', 'http://localhost')
        self.access_code = create_oauth2_access_token(self.user, self.application)

        MaterialProject.make(material_projects)

    def test_sanity_1(self):
        res = self.client.get(
            reverse('api_v1_storage:oauth2_material_projects'),
            Authorization=' '.join(('Bearer', self.access_code.token)),
            content_type='application/json')
        self.assertEqual(res.status_code, 200, res.json())


if __name__ == '__main__':
    unittest.main(verbosity=2)
