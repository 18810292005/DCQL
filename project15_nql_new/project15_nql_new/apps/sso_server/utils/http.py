# -*- coding: utf-8 -*-

# @File   : consumer.py
# @Author : Yuvv
# @Date   : 2018/6/6

import json
import requests
from urllib.parse import urljoin

from .cipher import AesGcmUtil, get_utc_timestamp
from .exc import BadRequest, WebserviceError


class BaseRequestMixin:
    MAX_AGE = 60  # in seconds
    PUBLIC_KEY_HEADER = 'X-MGE-SSO-ACCESS-KEY'

    @staticmethod
    def pre_process_data(data):
        if isinstance(data, str):
            return data.encode(AesGcmUtil.DEFAULT_ENCODING)
        if not isinstance(data, (bytes, bytearray)):
            raise ValueError('data must be bytes-like str')
        return data

    @staticmethod
    def encrypt_data(cipher, plain_data):
        plain_data = BaseRequestMixin.pre_process_data(plain_data)
        cipher.encrypt(plain_data)
        return cipher.wrap()

    @staticmethod
    def decrypt_data(cipher, ciphered_data):
        ciphered_data = BaseRequestMixin.pre_process_data(ciphered_data)
        return cipher.decrypt_wrapped_data(ciphered_data)

    def wrap_json_str(self, data):
        wrapped_data = json.dumps({'_': get_utc_timestamp(),
                                   'data': data})
        return wrapped_data

    def unwrap_json_str(self, data):
        data = json.loads(data.decode(AesGcmUtil.DEFAULT_ENCODING))
        timestamp = data.pop('_', None)
        if not timestamp:
            raise ValueError('Bad Signature')
        utc_now_timestamp = get_utc_timestamp()
        elapsed = abs(utc_now_timestamp - timestamp)
        if elapsed > self.MAX_AGE:
            raise ValueError('Signature expired')
        return data.pop('data', None)

    def pre_process_data_to_send(self, plain_data):
        raise NotImplementedError

    def pre_process_received_data(self, ciphered_data):
        raise NotImplementedError


class BaseConsumer(BaseRequestMixin):

    def __init__(self, base_url, access_key, access_secret):
        self.base_url = base_url
        self.access_key = access_key
        self.access_secret = access_secret
        self.cipher = AesGcmUtil(access_secret)

    def pre_process_data_to_send(self, plain_data):
        wrapped_data = self.wrap_json_str(plain_data)
        return BaseRequestMixin.encrypt_data(self.cipher, wrapped_data)

    def pre_process_received_data(self, ciphered_data):
        data = BaseRequestMixin.decrypt_data(self.cipher, ciphered_data)
        return self.unwrap_json_str(data)

    def consume(self, path, data):
        if not path.startswith('/'):
            raise ValueError("Paths must start with a slash")

        data = self.pre_process_data_to_send(data)   # 预处理
        url = self.build_url(path)
        headers = {self.PUBLIC_KEY_HEADER: self.access_key}
        body = self.send_request(url, data=data, headers=headers)
        return self.handle_response(body)

    def handle_response(self, body):
        return self.pre_process_received_data(body)   # 预处理

    def send_request(self, url, data, headers):
        raise NotImplementedError

    def raise_for_status(self, status_code, message):
        if status_code == 400:
            raise BadRequest(message)
        elif status_code >= 300:
            raise WebserviceError(message)

    def build_url(self, path):
        path = path.lstrip('/')
        return urljoin(self.base_url, path)


class SyncConsumer(BaseConsumer):
    def __init__(self, base_url, public_key, private_key):
        super(SyncConsumer, self).__init__(base_url, public_key, private_key)
        self.session = requests.session()

    def send_request(self, url, data, headers):
        response = self.session.post(url, data=data, headers=headers)
        self.raise_for_status(response.status_code, response.content)
        return response.content


class BaseProvider(BaseRequestMixin):

    def provide(self, data):
        raise NotImplementedError

    def get_access_secret(self, access_key):
        raise NotImplementedError

    def pre_process_data_to_send(self, plain_data):
        wrapped_data = self.wrap_json_str(plain_data)
        return BaseRequestMixin.encrypt_data(self.cipher, wrapped_data)

    def pre_process_received_data(self, ciphered_data):
        data = BaseRequestMixin.decrypt_data(self.cipher, ciphered_data)
        return self.unwrap_json_str(data)

    def get_cipher(self, access_secret):
        self.cipher = AesGcmUtil(access_secret)
        return self.cipher

    def get_response(self, method, encrypted_data, get_header):
        if method != 'POST':
            return 405, ['POST']
        access_key = get_header(BaseRequestMixin.PUBLIC_KEY_HEADER, None)
        if not access_key:
            return 400, "No access key"

        access_secret = self.get_access_secret(access_key)
        if not access_secret:
            return 400, "Invalid access secret"
        try:
            self.get_cipher(access_secret)
            data = self.pre_process_received_data(encrypted_data)
        except ValueError:
            return 400, "Bad Signature"

        try:
            response_data = self.provide(data)
        except BaseException:
            return 400, "Failed to process the request"

        # 重新获取 cipher，并加密返回数据
        self.get_cipher(access_secret)
        encrypted_response_data = self.pre_process_data_to_send(response_data)
        return 200, encrypted_response_data


def provider_for_django(provider):
    from django.http import HttpResponse
    from django.views.decorators.csrf import csrf_exempt

    def provider_view(request):
        def get_header(key, default):
            django_key = 'HTTP_%s' % key.upper().replace('-', '_')
            return request.META.get(django_key, default)
        method = request.method
        if getattr(request, 'body', None):
            signed_data = request.body
        else:
            signed_data = request.raw_post_data
        status_code, data = provider.get_response(
            method,
            signed_data,
            get_header,
        )
        return HttpResponse(data, status=status_code)
    return csrf_exempt(provider_view)
