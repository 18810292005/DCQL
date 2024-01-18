from django.urls import reverse

from apps.account.models import User
from apps.account.models.users import UserRole
from apps.storage.models import UploadHistory
from apps.storage.models.data import DataReviewState
from mgedata.test import HttpTools, debug_required
from mgedata.test import MGETestCase
from mgedata.test import data_required
from mgedata.test.testcase import MGEBaseTestCase
from mgedata.test.utils.client import JSONClient


class TestDataV2(MGETestCase):
    def setUp(self):
        self.urls = {
            'get_data': reverse('api_v2_storage:get_data', kwargs={'oid': 1}),
        }
        return

    @data_required
    def test_get_project_and_subject_data(self):
        result = HttpTools.get(client=self.client, url=self.urls['get_data'])
        self.assertEqual(result['code'], 0)
        self.assertEqual(result['data']['project'], '')
        self.assertEqual(result['data']['project_name'], '')
        self.assertEqual(result['data']['subject'], '')
        self.assertEqual(result['data']['subject_name'], '')


class UploadHistoryReviewAPI(MGEBaseTestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.json_client = JSONClient()

    @debug_required
    def setUp(self):
        user = User.objects.create_user(username='test', real_name='test', email='a@a.com', roles=UserRole.ROOT)
        self.user = user

    def test_revoke_data_review(self):
        self.json_client.login(self.user)
        history = UploadHistory.objects.filter(review_state=DataReviewState.APPROVED).first()
        view = reverse('api_v2_storage:revoke_data_history')
        response = self.json_client.patch_json(view, history.id)
        self.assertEqual(response['code'], 0)
        self.assertEqual(history.review_state, DataReviewState.PENDING)
        self.assertEqual(history.reviewer, None)
