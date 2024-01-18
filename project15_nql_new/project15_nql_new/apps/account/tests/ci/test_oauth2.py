from django.shortcuts import reverse

from mgedata.test import MGETestCase
from mgedata.test.utils.server import create_oauth2_access_token, create_oauth2_application
from mgedata.test.utils.client import post_to_login, post_to_create_user

from apps.account.models import User


class TestOauth2GetUserInfo(MGETestCase):

    def postSetUp(self) -> None:
        post_to_create_user(self.client,
                            '中文名称',
                            'test',
                            '真实名称',
                            'xx@xx.com',
                            '12000000000',
                            'ustb')

        self.user = User.objects.get(pk='test')
        self.application = create_oauth2_application(self.user, 'hello', 'http://localhost')
        self.access_code = create_oauth2_access_token(self.user, self.application)

        post_to_login(self.client, '中文名称', 'test')

    def test_get_user_info(self):
        res = self.client.get(
            reverse('api_v1_account:oauth2_user_info'),
            Authorization=' '.join(('Bearer', self.access_code.token))
        )
        self.assertEqual(res.status_code, 200, res.json())
        print(res.json())
