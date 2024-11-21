from django.test.utils import override_settings
from .account import user_create
import json
from django.urls import reverse


@override_settings(DEBUG=True)
def test_for_login(client):
    """
    使用该函数可以实现用户登录
    :param client:
    :return:
    """

    user = user_create()
    client.post(
        reverse('api_v1_account:session_api'),
        json.dumps({'user': user.username, 'password': user.password, 'captcha_response': 'captcha'}),
        content_type='application/json'
    )
