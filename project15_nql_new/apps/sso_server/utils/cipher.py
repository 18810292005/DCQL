# -*- coding: utf-8 -*-

# @File   : cipher.py
# @Author : Yuvv
# @Date   : 2018/6/8

from Crypto.Cipher import AES
from datetime import datetime, timezone


def get_utc_timestamp():
    return datetime.now(tz=timezone.utc).timestamp()


class AesGcmUtil:
    DEFAULT_ENCODING = 'utf-8'
    GCM_NONCE_LENGTH = 16
    GCM_TAG_LENGTH = 16

    def __init__(self, private_key: str):
        self.private_key = private_key.encode(self.DEFAULT_ENCODING)
        self.cipher = None
        self.nonce = None
        self.tag = None
        self.result = None

    def encrypt(self, data: (str, bytes)):
        if isinstance(data, str):
            data = data.encode(self.DEFAULT_ENCODING)

        self.cipher = AES.new(self.private_key, AES.MODE_GCM)
        self.nonce = self.cipher.nonce
        self.result, self.tag = self.cipher.encrypt_and_digest(data)

        return self.result

    def decrypt(self, nonce, data, tag) -> bytes:
        # self.nonce = nonce
        # self.tag = tag
        self.cipher = AES.new(self.private_key, AES.MODE_GCM, nonce=nonce)

        self.result = self.cipher.decrypt_and_verify(data, tag)

        return self.result

    def decrypt_wrapped_data(self, data):
        nonce, data, tag = self.unwrap(data)
        return self.decrypt(nonce, data, tag)

    def wrap(self):
        if not self.tag or not self.nonce or not self.result:
            raise ValueError('wrap can only be used after encrypt!')
        return self.nonce + self.result + self.tag

    def unwrap(self, data):
        nonce = data[:self.GCM_NONCE_LENGTH]
        tag = data[-self.GCM_TAG_LENGTH:]
        data = data[self.GCM_NONCE_LENGTH:-self.GCM_TAG_LENGTH]
        return nonce, data, tag
