import os
import re

from django.test import TestCase
from mgedata.errors.models import MGEException
from typing import Union, List
from django.test.client import Client
from django.conf import settings


class MGEBaseTestCase(TestCase):
    # if os.environ.get("DJANGO_SETTINGS_MODULE") == 'mgedata.ci_settings':
    #     fixtures = ['test_fixture_ci.json']
    # elif os.path.exists(os.path.join(settings.BASE_DIR, 'test_fixture.json')):
    #     fixtures = ['test_fixture.json']
    # else:
    #     fixtures = ['test_fixture_ci.json']

    @staticmethod
    def assert_mge_error(error: MGEException, msg: Union[List[str], str] = None,
                         msg_pattern: str = None):
        return _MGEErrorTester(error, msg, msg_pattern)

    # @classmethod
    # def setUpTestData(cls):
    #     from mongoengine import disconnect, connect
    #     disconnect()
    #     connect('mongoenginetest', host='mongomock://localhost')


class _MGEErrorTester:
    def __init__(self, error: MGEException = None, msg: Union[List[str], str] = None, msgr: str = None):
        self._error = error
        self._msg = msg
        self._msgr = msgr

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val: MGEException, exc_tb):
        if exc_type is None:
            raise AssertionError("测试失败！未抛出任何异常！")
        if exc_type != MGEException:
            raise AssertionError("测试失败！MGEException！")
        if exc_type == MGEException:
            if self._error is None:
                return True
            if exc_val.code != self._error.code:
                msg = f"测试失败！未抛出{self._error.msg} ({self._error.__class__.__name__})，" \
                      f"抛出的异常为{str(exc_val)} ({exc_val.__class__.__name__})"
                raise AssertionError(msg) from None
            error_msg = ""
            match = True
            if self._msg:
                error_msg = f'不包含错误信息"{self._msg}"'
                if isinstance(self._msg, str):
                    self._msg = [self._msg]
                # 要求错误信息包含所有给定的字符串
                match = all([x in str(exc_val) for x in self._msg])
            elif self._msgr:
                error_msg = f'错误信息不匹配"{self._msgr}"'
                match = re.search(self._msgr, str(exc_val))
            if not match:
                raise AssertionError(f'测试失败！{error_msg}，原始错误信息为"{str(exc_val)}"')

        return True


def assert_mge_error(error: MGEException, msg: Union[List[str], str] = None,
                     msg_pattern: str = None) -> _MGEErrorTester:
    """
    生成一个_projectErrorTester上下文管理器，用来
    断言with块内的代码一定抛出包含给定的ProjectError的ProjectException异常，
    如果指定msg则要求抛出的异常中一定包含msg字符串

    :param error: ProjectError枚举
    :param msg: 要求必须包含的错误信息，用以区分具体的error
    :param msg_pattern: msg正则匹配
    """
    return _MGEErrorTester(error, msg, msg_pattern)


class JSONClient(Client):

    def __getattr__(self, item):
        # suppresses 'Unresolved attribute' in Pycharm
        pass

    def _set_response(self, response):
        try:
            data = response.json()
            self.__dict__.update(data)
            return response
        except Exception:
            try:
                raise ValueError(f'Response is not a json object. Response is "{response.content.decode()}"')
            except UnicodeDecodeError:
                raise ValueError("Response is binary instead of a json object.")

    def get(self, path, data: dict = None, follow: bool = False, secure: bool = False, **extra):
        res = super().get(path=path, data=data, follow=follow, secure=False, **extra)
        self._set_response(res)
        return res

    def post(self, path, data=None, content_type='application/json',
             follow=False, secure=False, **extra):
        res = super().post(path, data, content_type, follow, secure, **extra)
        self._set_response(res)
        return res

    def post_file(self, path, data: dict, follow=False, secure=False, **extra):
        res = super().post(path, data, follow=follow, secure=secure, **extra)
        self._set_response(res)
        return res
