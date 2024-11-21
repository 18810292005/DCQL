import json

from django.test import Client as DjangoClient
from django.shortcuts import reverse
from apps.account.models import User
from mgedata.errors.models import MGEError
from typing import List, Dict, BinaryIO, Union


class JSONClient:
    def __init__(self, **kwargs):
        self._client = DjangoClient(False, **kwargs)
        self.response = None

    def login(self, user: User):
        self._client.force_login(user)

    def post_json(self, path, data='', **header):
        if data:
            data = json.dumps(data)
        self.response = self._client.post(path, data, 'application/json', **header)
        return self.raise_mge_error_or_return(self.response.content)

    def get_json(self, path, data='', **header):
        self.response = self._client.get(path, data, **header)
        return self.raise_mge_error_or_return(self.response.content)

    def patch_json(self, path, data='', **header):
        if data:
            data = json.dumps(data)
        self.response = self._client.patch(path, data, 'application/json', **header)
        return self.raise_mge_error_or_return(self.response.content)

    def delete_json(self, path, data='', **header):
        if data:
            data = json.dumps(data)
        self.response = self._client.delete(path, data, 'application/json', **header)
        return self.raise_mge_error_or_return(self.response.content)

    def raise_mge_error_or_return(self, data):
        try:
            data = json.loads(data)
            if data['code'] == MGEError.SUCCESS:
                return data
            raise MGEError[data['code']](data.get('extra', {}).get('err_detail', None))
        except (UnicodeDecodeError, json.JSONDecodeError):
            return data

    def post_files(self, path, files: Dict[str, Union[BinaryIO, List[BinaryIO]]], extra_fields: Dict = None):
        form = files
        if extra_fields:
            form.update(extra_fields)
        self.response = self._client.post(path, form)
        return self.raise_mge_error_or_return(self.response.content)


def post_to_create_user(client, username, password, real_name, email, tel, institution):
    res = client.post(
        reverse('api_v1_account:user_list'),
        json.dumps({
            'username': username,
            'password': password,
            'real_name': real_name,
            'email': email,
            'tel': tel,
            'institution': institution
        }),
        content_type='application/json'
    )
    if res.status_code != 200:
        raise ValueError


def post_to_login(client, username, password):
    res = client.post(
        reverse('api_v1_account:session_api'),
        json.dumps({'user': username, 'password': password, 'captcha_response': 'captcha'}),
        content_type='application/json'
    )
    if res.status_code != 200:
        raise ValueError(res.json())


def post_to_upload_data(client, data):
    ret = []
    for i in range(len(data)):
        res = client.post(
            reverse('api_v1_1_storage:data_full'),
            json.dumps(data[i]),
            content_type='application/json'
        )
        assert res.status_code == 201
        ret.append(res.json()['data'])
    return ret


def post_to_create_dataset(client, data_ids, title, project, contributor):
    res = client.post(
        reverse('api_v3_storage:create_dataset'),
        json.dumps({'data_ids': data_ids,
                    'title': title,
                    'project': project,
                    'contributor': contributor}),
        content_type='application/json'
    )
    assert (res.status_code == 200)
    return res.json()['data']
