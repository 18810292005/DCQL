import json
from django.shortcuts import reverse

from mgedata.test import MGETestCase
from mgedata.test.utils.client import post_to_upload_data, post_to_login, post_to_create_dataset
from mgedata.test.utils.server import create_template

from apps.storage.models.material import Category


class TestDataSetApi(MGETestCase):

    def postSetUp(self):
        from mgedata.test.utils.sample.array import template, dict_data
        post_to_login(self.client, 'test', 'test')
        self.template = create_template('test',
                                        'test',
                                        Category.objects.get(name_en='leaf'),
                                        template)
        for i in range(len(dict_data)):
            dict_data[i]['meta']['source'] = {
                'source': '10',
                'methods': '100'
            }
            dict_data[i]['meta']['tid'] = self.template.id
        self.data_ids = []
        for i in range(10):
            self.data_ids.extend(post_to_upload_data(self.client, dict_data))

    def test_dataset_creation(self):
        res = self.client.post(
            reverse('api_v3_storage:create_dataset'),
            json.dumps({'data_ids': [self.data_ids[0], ],
                        'title': 'test',
                        'project': 'project',
                        'contributor': 'test'}),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['code'], 0)
        print(res.json())

    def test_dataset_get_dataset(self):
        dataset_id = post_to_create_dataset(self.client, [self.data_ids[0], ], 'test', 'project', 'test')['id']

        res = self.client.get(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id})
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['data']['data_ids'], [self.data_ids[0]])

    def test_dataset_modify_1(self):
        dataset_id = post_to_create_dataset(self.client, [self.data_ids[0], ], 'test', 'project', 'test')['id']

        res = self.client.patch(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id}),
            json.dumps({'add_data_ids': self.data_ids[1:],
                        'del_data_ids': [self.data_ids[0], ],
                        'title': 'new title',
                        'project': 'new project',
                        'contributor': 'new contributor'}),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200, res.json())
        res = self.client.get(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id})
        )

        self.assertEqual(set(res.json()['data']['data_ids']) & set(
            self.data_ids[1:]), set(res.json()['data']['data_ids']))
        self.assertEqual(res.json()['data']['title'], 'new title')
        self.assertEqual(res.json()['data']['project'], 'new project')
        self.assertEqual(res.json()['data']['contributor'], 'new contributor')

    def test_dataset_modify_2(self):
        dataset_id = post_to_create_dataset(self.client, [self.data_ids[0], ], 'test', 'project', 'test')['id']

        res = self.client.patch(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id}),
            json.dumps({'add_data_ids': self.data_ids,
                        'del_data_ids': [self.data_ids[0], ],
                        'title': 'new title',
                        'project': 'new project',
                        'contributor': 'new contributor'}),
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 200, res.json())
        res = self.client.get(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id})
        )

        self.assertEqual(set(res.json()['data']['data_ids']) & set(
            self.data_ids[1:]), set(res.json()['data']['data_ids']))
        self.assertEqual(res.json()['data']['title'], 'new title')
        self.assertEqual(res.json()['data']['project'], 'new project')
        self.assertEqual(res.json()['data']['contributor'], 'new contributor')

    def test_dataset_delete(self):
        dataset_id = post_to_create_dataset(self.client, [self.data_ids[0], ], 'test', 'project', 'test')['id']

        res = self.client.delete(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id})
        )
        self.assertEqual(res.status_code, 200)

        res = self.client.get(
            reverse('api_v3_storage:manage_dataset_one', kwargs={'id': dataset_id})
        )
        self.assertEqual(res.status_code, 422)
