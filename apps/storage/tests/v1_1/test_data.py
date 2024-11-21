from unittest import skip

from mgedata.test import *
from mgedata.test.utils.http_tools import HttpTools
from mgedata.test.utils.fixture.data import create_full_data
from django.urls import reverse


class TestDataApi(MGETestCase):

    def setUp(self):
        self.urls = {
            'data_full': reverse('api_v1_1_storage:data_full'),
            'oauth2_data_full': reverse('api_v1_1_storage:o_data_full'),
        }
        return

    @data_required
    def test_data_full(self):
        self.assertEquals(self.data_response_data['code'], 0)
        self.assertIsInstance(self.data_response_data['data'], int)
        res = HttpTools.get(client=self.client,
                            url=reverse('api_v2_storage:get_data', kwargs={'oid': self.data_meta_id}))
        print(res)
        return

    #  TODO 单独测试没问题，可以分开
    @data_required
    @skip
    def test_oauth2_data_full(self):
        HttpTools.login_as_root_user(client=self.client)
        result = HttpTools.oauth2_post(client=self.client, url=self.urls['oauth2_data_full'],
                                       data=create_full_data(file_path=self.get_path_from_data(self.file_response_data),
                                                             image_path=self.get_path_from_data(
                                                                 self.image_response_data),
                                                             category_id=self.material_category_id,
                                                             template_id=self.template_id))
        self.assertEquals(result['code'], 0)
        self.assertIsInstance(result['data'], int)
        return
