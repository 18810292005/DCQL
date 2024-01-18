from django.views import View
from django.contrib.auth import login
from apps.account.models import User
from mgedata.utils.general import get_json_field_r
import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse


class SsoClient(View):

    def post(self, request):
        try:
            username = get_json_field_r(request, 'username')
            password = get_json_field_r(request, 'password')
            if settings.DEBUG:
                url = "http://nmdms.ustb.edu.cn/appInterfaceController/api/appLogin"
            else:
                url = settings.SSO_CLIENT
            resp = requests.get(url=url, params={
                'userAccount': username,
                'userPassword': password
            }).json()
            if resp["code"] == 200:
                user = User.objects.get(username=username)
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return HttpResponse(status=200)
            else:
                return JsonResponse({
                    'error': resp["msg"]
                }, status=403)
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=400)

    @staticmethod
    def debug_sso_login():
        res = {
            "data": {
                "isLogin": True,
                "loginEntity": {
                    "userAccount": "test",
                    "mail": "test@test.com",
                    "userName": "test",
                    "deptName": "institution",
                    "tuserRoleList": [
                        {
                            "roleCode": "020016",
                        },
                        {
                            "roleCode": "0200321",
                        },
                    ],
                    "ssoUserRole": [
                        {
                            "id": 5,
                            "userId": "90ef857ddf364f22963a11ad6db1d2fe",
                            "roleValue": "01",
                            "name": "评价组长"
                        },
                        {
                            "id": 6,
                            "userId": "90ef857ddf364f22963a11ad6db1d2fe",
                            "roleValue": "02",
                            "name": "专家"
                        },
                        {
                            "id": 7,
                            "userId": "90ef857ddf364f22963a11ad6db1d2fe",
                            "roleValue": "03",
                            "name": "项目结题专家组长"
                        },
                        {
                            "id": 8,
                            "userId": "90ef857ddf364f22963a11ad6db1d2fe",
                            "roleValue": "04",
                            "name": "项目结题专家"
                        },
                        {
                            "id": 8,
                            "userId": "90ef857ddf364f22963a11ad6db1d2fe",
                            "roleValue": "000",
                            "name": "游客"
                        }
                    ],
                },
            }
        }
        redirect_url = "http://www.mgedata.cn:8000/storage/template/new"
        return res, redirect_url
