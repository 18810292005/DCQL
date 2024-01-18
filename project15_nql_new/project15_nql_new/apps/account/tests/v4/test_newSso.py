from pprint import pprint

from django.conf import settings
from django.test import TestCase
from django.test.utils import override_settings
from django.urls import reverse
import json

from apps.account.models import User
from apps.account.models.users import UserRolesForAcceptanceModel, UserRole


class RoleDataView(TestCase):

    def test_good(self):
        self.maxDiff = None
        childSystemId = "123ljafdslk"
        params = {
            "interfaceAccount": 'mgedata',
            "interfacePassword": 'mgedata@micl',
            "childSystemId": childSystemId
        }
        res = json.loads(self.client.get(path=reverse('api_v4_account:getAllRoleData'), data=params).content)
        right_res = {
            "code": 200,
            "msg": "success",
            "data": {
                "roleReturnObj": [
                    {
                        "key": settings.SYSTEM_NAME,
                        "value": [
                            {'code': '020001', 'id': "0", 'name': 'ROOT'},
                            {'code': '020002', 'id': "1", 'name': 'VERIFIED'},
                            {'code': '020004', 'id': "2", 'name': 'TEMPLATE_UPLOADER'},
                            {'code': '020008', 'id': "3", 'name': 'TEMPLATE_ADMIN'},
                            {'code': '020016', 'id': "4", 'name': 'DATA_UPLOADER'},
                            {'code': '020032', 'id': "5", 'name': 'DATA_ADMIN'},
                            {'code': '020064', 'id': "6", 'name': 'DOI_ADMIN'},
                            {'code': '020128', 'id': "7", 'name': 'USER_ADMIN'},
                            # {'code': '021000', 'id': 8, 'name': '评价组长'},
                            # {'code': '021001', 'id': 9, 'name': '专家'},
                            # {'code': '021002', 'id': 10, 'name': '项目结题专家组长'},
                            # {'code': '021003', 'id': 11, 'name': '项目结题专家'},
                            # {'code': '021004', 'id': 12, 'name': '汇交验收专家'},
                            # {'code': '021005', 'id': 13, 'name': '项目负责人'},
                            # {'code': '021006', 'id': 14, 'name': '课题负责人'},
                            # {'code': '021007', 'id': 15, 'name': '管理员'},
                            # {'code': '021008', 'id': 16, 'name': '普通成员'}
                        ]
                    }
                ],
                "childSystemId": childSystemId
            },
        }
        pprint(res)
        # self.assertEqual(res, right_res)
        # self.assertEqual(childSystemId, PersistentVariables.get_variable('system_id'))


class SsoLoginView(TestCase):

    @override_settings(DEBUG=True)
    def test_good(self):
        params = {
            "token": '123',
            "systemId": '123'
        }
        self.client.get(path=reverse('api_v4_account:ssoLogin'), data=params)
        self.assertIn('sessionid', self.client.cookies)
        self.assertEqual(User.objects.get(email='test@test.com').username, 'test')
        print(User.objects.get(email='test@test.com').to_dict())
        self.assertEqual(User.objects.get(email='test@test.com').roles,
                         (UserRole.DATA_ADMIN + UserRole.DATA_UPLOADER + UserRole.VERIFIED))
        self.assertEqual(UserRolesForAcceptanceModel.objects.all()[0].roles, [0, 1, 2, 3])
