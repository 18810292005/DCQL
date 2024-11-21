from django.shortcuts import reverse
from django.test import TestCase

from apps.account.models import User


class TokenMiddlewareTests(TestCase):

    def setUp(self):
        User.objects.create_user('test', 'test@test.com', 'test', real_name='test')
        url = reverse('api_v1_account:login_for_token')
        res = self.client.post(url, data={'user': 'test', 'password': 'test'}, content_type='application/json')
        self.token = res.json()['data']['token']

    def test_invalid_token(self):
        url = reverse('api_v1_account:user_info')
        res = self.client.get(url)
        self.assertEquals(401, res.status_code)

        res = self.client.get(url, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(200, res.status_code)

        self.client.logout()

        res = self.client.get(url, HTTP_AUTHORIZATION='Bad Token')
        self.assertEquals(401, res.status_code)
