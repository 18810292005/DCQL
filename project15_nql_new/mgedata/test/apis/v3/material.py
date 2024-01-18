import pprint

from django.shortcuts import reverse

from mgedata.test import MGETestCase
from mgedata.test.utils.sample.material import methods

from apps.storage.models.material import MaterialMethod


class TestMaterialMethodView(MGETestCase):

    def test_get_result(self):
        res = self.client.get(reverse('api_v3_storage:material_method'))
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(len(res.json()['data']), 2, pprint.pformat(res.json()))
