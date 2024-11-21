import traceback
from functools import wraps
from os import remove

from django.conf import settings
from django.test import TransactionTestCase
from django.urls import reverse
from mongoengine import connect, disconnect

from apps.storage.models.data import DataMeta
from apps.storage.models.material import MaterialProject, Category, MaterialMethod
from mgedata.errors.models import MGEError, MGEException
from mgedata.test.utils.fixture.data import create_full_data
from mgedata.test.utils.fixture.template import create_templates
from mgedata.test.utils.generator import generate_random_file, generate_random_picture
from mgedata.test.utils.http_tools import HttpTools
from .utils.client import post_to_create_user
from .utils.server import create_material_category_tree


def debug_required(func):
    @wraps(func)
    def inner(*args, **kwargs):
        settings.DEBUG = True
        return func(*args, **kwargs)

    return inner


def material_category_required(func):
    @wraps(func)
    def inner(test_case, *args, **kwargs):
        create_material_category_tree(Category, test_case.material_categories_to_create())
        MaterialProject.make(test_case.material_projects_to_create())
        MaterialMethod.make(test_case.material_methods_to_create())
        return func(test_case, *args, **kwargs)

    return inner


def template_required(func):
    @wraps(func)
    @material_category_required
    @debug_required
    def inner(self):
        HttpTools.login_as_root_user(client=self.client)  # TODO 测试数据创建方法应该与API无关
        self.material_category_id: int = Category.objects.get(name_zh='leaf').id
        self.template_response_data: dict = HttpTools.post(client=self.client, url=reverse('api_v1_storage:templates'),
                                                           data=create_templates(self.material_category_id))
        self.template_id: str = self.get_template_id_from_data(self.template_response_data)
        HttpTools.logout(client=self.client)
        return func(self)

    return inner


def upload_file_required(func):
    @wraps(func)
    def inner(self):
        HttpTools.login_as_root_user(client=self.client)
        self.file_response_data = self.upload_testfile(self.client)
        self.image_response_data = self.upload_testimage(self.client)
        self.file_path = self.get_path_from_data(self.file_response_data)
        self.image_path = self.get_path_from_data(self.image_response_data)
        HttpTools.logout(client=self.client)

        self.delete_uploaded_testfile(self.file_response_data)
        self.delete_uploaded_testfile(self.image_response_data)
        return func(self)

    return inner


def data_required(func):
    @wraps(func)
    @template_required
    @upload_file_required
    def inner(self):
        HttpTools.login_as_root_user(client=self.client)
        self.data_response_data: dict = HttpTools.post(client=self.client, url=reverse('api_v1_1_storage:data_full'),
                                                       data=create_full_data(
                                                           file_path=self.file_path,
                                                           image_path=self.image_path,
                                                           category_id=self.material_category_id,
                                                           template_id=self.template_id))
        self.data_meta_id: int = self.get_data_meta_id_from_data(self.data_response_data)
        self.data_id: int = DataMeta.objects.get(pk=self.data_meta_id).id
        HttpTools.logout(client=self.client)
        func(self)
        return

    return inner


class MGEErrorTester:
    def __init__(self, mge_error: MGEError, msg: str = None):
        self._mge_error = mge_error
        self._msg = msg

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val: MGEException, exc_tb):
        if exc_type is None:
            raise AssertionError("测试失败！未抛出异常")
        try:
            if exc_type == MGEException:
                if exc_val.mge_error != self._mge_error:
                    raise AssertionError(f"测试失败！未抛出MGEError.{self._mge_error.name}")
                elif self._msg and self._msg not in exc_val.message:
                    raise AssertionError(f'测试失败！MGEError不包含错误信息"{self._msg}"')
            else:
                raise AssertionError("测试失败！未抛出MGEException！")
        except AssertionError as e:
            msg = '\n\n\n'
            msg += f"抛出的异常为：{exc_val.full_string}\n"
            msg += ''.join(traceback.format_tb(exc_tb))
            msg += str(e)
            raise AssertionError(msg)
        else:
            return True


class MGETestCase(TransactionTestCase):
    """
    1. create user
    2. create material categories
    3. create projects
    """

    @staticmethod
    def assert_mge_error(mge_error: MGEError, msg: str = None):
        return MGEErrorTester(mge_error, msg)

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')
        cls.postSetUpClass()
        super(TransactionTestCase, cls).setUpClass()

    @classmethod
    def tearDownClass(cls):
        disconnect()

    @data_required
    def setUp(self) -> None:
        for user in self.users_to_create():
            post_to_create_user(self.client, *user)
        self.postSetUp()
        super().setUp()

    def tearDown(self):
        super().setUp()
        return

    @staticmethod
    def users_to_create():
        return [('test', 'test', 'test', 'xx@xx.cn', '12003451356', 'ustb'), ]

    @staticmethod
    def material_categories_to_create():
        return [
            {'name_zh': '科研成果', 'name_en': '科研成果', 'hidden': True},
            {'name_zh': 'leaf', 'name_en': 'leaf'},
            {'name_zh': 'leaf_1', 'name_en': 'leaf_1'},
            {
                'name_zh': 'leaf_private',
                'name_en': 'leaf_private',
                'is_public': False
            },
            {
                'name_zh': 'middle',
                'name_en': 'middle',
                'is_public': False,
                'children': [
                    {'name_zh': 'middle_leaf',
                     'name_en': 'middle_leaf',
                     'is_public': False}
                ]
            }
        ]

    @staticmethod
    def material_projects_to_create():
        from mgedata.test.utils.sample.material import projects
        return projects

    @staticmethod
    def material_methods_to_create():
        from mgedata.test.utils.sample.material import methods
        return methods

    @staticmethod
    def get_data_meta_id_from_data(response_data: dict) -> int:
        return response_data['data']

    @staticmethod
    def get_template_id_from_data(data: dict) -> str:
        return data['data']['succeed'][0]

    @staticmethod
    def get_path_from_data(data: dict) -> str:
        return data['data'][0]

    @staticmethod
    def upload_testfile(client):
        file = generate_random_file()
        return client.post(path=reverse('api_v1_storage:data_content_file'),
                           data={'type': '', 'files[]': [file]}).json()

    @staticmethod
    def upload_testimage(client):
        file = generate_random_picture()
        return client.post(path=reverse('api_v1_storage:data_content_file'),
                           data={'type': 'image', 'files[]': [file]}).json()

    def delete_uploaded_testfile(self, response_data):
        remove(settings.BASE_DIR + self.get_path_from_data(response_data))
        return

    def postSetUp(self):
        pass

    @classmethod
    def postSetUpClass(cls):
        pass
