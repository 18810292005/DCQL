from mgedata.test import MGETestCase
from mgedata.test.utils.http_tools import HttpTools
from apps.storage.models.data import DataScore
from django.urls import reverse


class TestDataApi(MGETestCase):

    def postSetUp(self):
        HttpTools.login_as_root_user(client=self.client)
        self.urls = {
            'data_metas': reverse('api_v1_storage:data_metas'),
            'data_meta_one': reverse('api_v1_storage:data_meta_one', kwargs={'mid': self.data_meta_id}),
            'retract_data': reverse('api_v1_storage:retract_data', kwargs={'history_id': 1}),
            'data_score': reverse('api_v1_storage:data_score', kwargs={'did': self.data_id})
        }
        return

    def test_data_metas(self):
        # TODO This api may not be used
        result = HttpTools.get(client=self.client, url=self.urls['data_metas'])
        self.assertEquals(result['data']['results'][0]['title'], 'test_data')
        # TODO The post method haven't find using
        return

    def test_data_meta_one(self):
        result = HttpTools.get(client=self.client, url=self.urls['data_meta_one'])
        self.assertEquals(result['data']['title'], 'test_data')
        self.assertEquals(result['data']['category'], 'leaf')
        self.assertEquals(result['data']['category_id'], self.material_category_id)
        self.assertEquals(result['data']['content']['test_str'], 'test_data')
        # TODO post and delete methods haven't find using

        # HttpTools.delete(client=self.client,
        #                  url=reverse('api_v1_storage:data_meta_one', kwargs={'mid': self.data_meta_id}))
        #
        # self.assertEquals(DataMeta.objects.all().count(), 0)
        return

    def test_retract_data(self):
        # TODO This api may not be used
        return

    def test_data_score(self):
        self.assertEquals(DataScore.objects.all().count(), 0)
        HttpTools.post(client=self.client, url=self.urls['data_score'], data={'score': 5})
        self.assertEquals(DataScore.objects.get(data_id=self.data_id).score, float(5))
        self.assertEquals(DataScore.objects.all().count(), 1)
        return
