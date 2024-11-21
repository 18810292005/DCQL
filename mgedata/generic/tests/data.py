import json
import copy
import pprint

from django.shortcuts import reverse

from mgedata.test import MGETestCase
from mgedata.test.utils.server import create_template
from mgedata.test.utils.client import post_to_login
from mgedata.test.utils.asserts import dict_contains_another
from mgedata.test.utils.sample.matcloud import data, template
from mgedata.generic.trans import DataToDict

from apps.storage.models.material import Category
from apps.storage.trans.db import DbToData


class TestDbToDataWithMatCloudDataSet(MGETestCase):
    maxDiff = None

    def postSetUp(self):
        self.template = create_template('test template',
                                        'for test',
                                        Category.objects.get(name_en='leaf'),
                                        template)
        self.data_ids = []

        data_copy = copy.deepcopy(data)
        for i in range(len(data_copy)):
            data_copy[i]['meta']['source'] = {
                'source': '10',
                'methods': '100'
            }
            data_copy[i]['meta']['tid'] = self.template.id
        post_to_login(self.client, 'test', 'test')
        for i in range(len(data_copy)):
            res = self.client.post(
                reverse('api_v1_1_storage:data_full'),
                json.dumps(data_copy[i]),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 201, res.json())
            self.data_ids.append(res.json()['data'])

    def test_db_to_data_1(self):
        for i in range(len(self.data_ids)):
            stored_data = DbToData(self.data_ids[i]).to()
            stored_data_dict = DataToDict(stored_data).to()
            dict_contains_another(stored_data_dict['content'], data[i]['content'])
