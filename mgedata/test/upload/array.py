import json

from django.shortcuts import reverse

from mgedata.test import MGETestCase
from mgedata.test.utils.server import create_template
from mgedata.test.utils.client import post_to_login

from apps.storage.models.material import Category


class TestDataUploadUtilityUsingStorageAPIV1(MGETestCase):

    def postSetUp(self):
        from mgedata.test.utils.sample.array import template
        self.template = create_template('test template',
                                        'for test',
                                        Category.objects.get(name_en='leaf'),
                                        template)

    def test_data_upload_v1(self):
        from mgedata.test.utils.sample.array import dict_data

        for i in range(len(dict_data)):
            dict_data[i]['meta']['source'] = {
                'source': '10',
                'methods': '100'
            }
            dict_data[i]['meta']['tid'] = self.template.id

        post_to_login(self.client, 'test', 'test')
        for i in range(len(dict_data)):
            res = self.client.post(
                reverse('api_v1_1_storage:data_full'),
                json.dumps(dict_data[i]),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 201, res.json())
            data_id = res.json()['data']

            res = self.client.get(
                reverse('api_v2_storage:get_data', kwargs={'oid': data_id})
            )
            self.assertEqual(res.status_code, 200, res.json())
            self.assertEqual(res.json()['data']['content'], dict_data[i]['content'])
