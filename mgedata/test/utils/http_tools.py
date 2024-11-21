import pprint
from json import dumps

from django.urls import reverse
from rest_framework import status

from apps.account.models.users import User, UserRole
from mgedata.test.utils.client import post_to_login


class HttpTools:
    token = None  # oauth2 token

    @classmethod
    def check_http_status(cls, http_result):
        if http_result.status_code not in [status.HTTP_200_OK, status.HTTP_201_CREATED]:
            try:
                msg = pprint.pformat(http_result.json())
            except Exception:
                raise ValueError
            raise ValueError(msg)
        return

    @classmethod
    def http_request(cls, client, url, data, method, **extra):
        if method == 'post':
            result = client.post(url, dumps(data), **extra, content_type='application/json')
        elif method == 'delete':
            result = client.delete(url, dumps(data), **extra, content_type='application/json')
        elif method == 'get':
            result = client.get(url, data, **extra)
        elif method == 'patch':
            result = client.patch(url, dumps(data), **extra, content_type='application/json')
        elif method == 'put':
            result = client.put(url, dumps(data), **extra, content_type='application/json')
        else:
            raise ValueError
        cls.check_http_status(result)

        return result.json()

    @classmethod
    def get(cls, client, url, data=None, **extra):
        return cls.http_request(client, url, data, 'get', **extra)

    @classmethod
    def oauth2_get(cls, client, url, data=None, **extra):
        return cls.get(client, url, data, Authorization=' '.join(('Bearer', cls.get_oauth2_token())), **extra)

    @classmethod
    def post(cls, client, url, data=None, **extra):
        return cls.http_request(client, url, data, 'post', **extra)

    @classmethod
    def oauth2_post(cls, client, url, data=None, **extra):
        return cls.post(client, url, data, Authorization=' '.join(('Bearer', cls.get_oauth2_token())), **extra)

    @classmethod
    def delete(cls, client, url, data=None, **extra):
        return cls.http_request(client, url, data, 'delete', **extra)

    @classmethod
    def patch(cls, client, url, data=None, **extra):
        return cls.http_request(client, url, data, 'patch', **extra)

    @classmethod
    def put(cls, client, url, data=None, **extra):
        return cls.http_request(client, url, data, 'put', **extra)

    @classmethod
    def login(cls, client):
        cls.create_data_uploader_user()
        return post_to_login(client=client, username='test', password='test')

    @classmethod
    def logout(cls, client):
        return cls.delete(client=client, url=reverse('api_v1_account:session_api'))

    @classmethod
    def login_as_root_user(cls, client):
        cls.create_root_user()
        return post_to_login(client=client, username='supertest', password='supertest')

    @classmethod
    def create_root_user(cls):
        if User.objects.filter(username='supertest').count() == 0:
            User.objects.create_user(username='supertest', email='cc@cc.cn', password='supertest',
                                     real_name='supertest', institution='ustb', roles=UserRole.ROOT)
        return

    @classmethod
    def create_data_uploader_user(cls):
        if User.objects.filter(username='test').count() == 0:
            User.objects.create_user(username='test', email='xx@xx.cn', password='test',
                                     real_name='test', institution='ustb', roles=UserRole.DATA_UPLOADER)
        return

    @classmethod
    def email_verify(cls, username):
        user = User.objects.get(username=username)
        user.email_verified = True
        user.save()
        return
