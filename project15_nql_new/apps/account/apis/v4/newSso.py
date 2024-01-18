import traceback

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.views import View

from apps.account.apis.v4.sso_client import SsoClient
from apps.account.apis.v4.sync_pms import sync_pms_user_project_and_subject
from apps.account.models.users import User, UserRole, UserRolesForAcceptanceModel, UserRolesForAcceptance
from django.contrib.auth.hashers import make_password
from django.conf import settings
from apps.mge.models import PersistentVariables
from apps.account.models.users import AdminMaterialCategory
import requests
from django.contrib.auth import login
from django.core.exceptions import MultipleObjectsReturned

from apps.sso_server.models import UserThirdPlatformToken, ThirdPlatformTokenInformation
from mgedata.utils.general import get_json_field_r
import logging

from apps.storage.models import MaterialCategory

logger = logging.getLogger('django')

ROLES_FOR_ACCEPTANCE_MAPPING = {
    "01": UserRolesForAcceptance.GroupLeader,
    "02": UserRolesForAcceptance.Expert,
    "03": UserRolesForAcceptance.ProjectConcludeExpertGroupLeader,
    "04": UserRolesForAcceptance.ProjectConcludeExpert,
    "05": UserRolesForAcceptance.AcceptanceExpert,
    "06": UserRolesForAcceptance.ProjectLeader,
    "07": UserRolesForAcceptance.SubjectLeader,
    "08": UserRolesForAcceptance.Member,
    "99": UserRolesForAcceptance.Admin,
}


class RoleDataView(View):
    """
    单点登录系统传入token，子系统验证token，验证通过后，子系统获取当前系统的所有角色信息，传给单点登录系统
    """

    def get(self, request):
        try:
            params = request.GET
            interfaceAccount = params['interfaceAccount']
            interfacePassword = params['interfacePassword']
            childSystemId = params['childSystemId']
            PersistentVariables.set_variable('system_id', childSystemId)
            if not (interfaceAccount == settings.TOKEN_GENERATE_NAME and interfacePassword ==
                    settings.TOKEN_GENERATE_PASSWORD):
                return HttpResponse(status=403)
            mcs = MaterialCategory.objects.all()
            roles = UserRole.get_all_roles()
            for role in roles:
                code = role.get("code")
                if code in ["020008", "020032"]:  # template_admin , data_admin
                    role.update({"item": "categories"})
            data = {
                "roleReturnObj": [
                    {
                        "key": settings.SYSTEM_NAME,
                        "value": roles,
                        "items": {
                            "categories": [mc.to_dict() for mc in mcs]
                        }
                    }
                ],
                "childSystemId": childSystemId
            }
            return JsonResponse({
                "code": 200,
                "msg": "success",
                "data": data
            })
        except Exception as e:
            logger.error('RoleDataView_get:{}'.format(e))
            return JsonResponse({
                'error': str(e)
            }, status=400)


class SsoLoginView(View):

    def get(self, request: HttpRequest):
        try:
            params = request.GET
            token = params['token']
            _type = params.get('type', '0')
            payload = {
                "tokenStr": token,
                "system": params["systemId"]
            }
            if settings.DEBUG:
                res, redirect_url = SsoClient.debug_sso_login()
            else:
                res = requests.get(settings.SSO_URL, params=payload).json()
                redirect_url = settings.SSO_REDIRECT_URLS.get(_type, settings.SSO_REDIRECT_URL)
            if res["data"]["isLogin"]:
                user_sso = res["data"]["loginEntity"]
                user_sso_id = user_sso['idInt']
                email = user_sso["mail"]
                # 处理角色
                role_list = user_sso["tuserRoleList"]
                role_for_acceptance_list = user_sso["ssoUserRole"]
                roles = 0
                roles_for_acceptance = []
                categories = []
                roles_list = []
                for r in role_list:
                    r_code = r["roleCode"]
                    if r_code[2:].startswith(settings.USER_ROLE_ORDER["userRole"]):
                        r_code_3_6 = r_code[3:6]
                        if r_code_3_6 not in roles_list:
                            roles |= int(r_code_3_6)
                            roles_list.append(r_code_3_6)
                        if len(r_code) > 6:
                            category_id = int(r_code[6:])
                            try:
                                category = MaterialCategory.objects.get(id=category_id)
                                categories.append(category)
                            except MaterialCategory.DoesNotExist:
                                pass
                if roles == 0:  # 默认可以上传数据
                    roles = UserRole.DATA_UPLOADER.value
                for rfa in role_for_acceptance_list:
                    r_code = rfa["roleValue"]
                    role = ROLES_FOR_ACCEPTANCE_MAPPING.get(r_code)
                    if role is not None:
                        roles_for_acceptance.append(ROLES_FOR_ACCEPTANCE_MAPPING[r_code])
                users = User.objects.filter(email=email)
                if users.count() > 0:  # 该用户存在
                    user = users[0]
                    # 同步角色
                    user.roles = roles
                    user.save()
                    try:
                        urfa = UserRolesForAcceptanceModel.objects.get(user=user)
                        urfa.roles = roles_for_acceptance
                        urfa.save()
                    except UserRolesForAcceptanceModel.DoesNotExist:
                        UserRolesForAcceptanceModel.objects.create(
                            user=user,
                            roles=roles_for_acceptance
                        )
                    if categories:
                        for category in categories:
                            try:
                                AdminMaterialCategory.objects.get(user=user, category=category)
                            except AdminMaterialCategory.DoesNotExist:
                                AdminMaterialCategory.objects.create(
                                    user=user,
                                    category=category
                                )
                            except MultipleObjectsReturned:
                                AdminMaterialCategory.objects.filter(user=user, category=category).delete()
                                AdminMaterialCategory.objects.create(
                                    user=user,
                                    category=category
                                )
                            except Exception:
                                logger.error(f'sso error{traceback.format_exc()}')
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                else:  # 该用户不存在，直接创建用户
                    username = user_sso["mail"].split('@')[0]
                    email = user_sso["mail"]
                    real_name = user_sso["userName"]
                    institution = user_sso["deptName"]
                    uname = username
                    for i in range(User.objects.all().count() + 100):
                        if User.objects.filter(username=username).count() == 0:  # 如果用户名不重复
                            try:
                                user = User.objects.create(
                                    username=username,
                                    real_name=real_name,
                                    email=email,
                                    email_verified=True,  # 不需要邮箱验证了
                                    institution=institution,
                                    # password=make_password(str(hash(time.localtime())))
                                    # 由于邮箱不能使用，不能修改密码，所以先默认密码为ustb@micl
                                    password=make_password("ustb@micl"),
                                    roles=roles
                                    #  这里权限是默认值
                                )
                                UserRolesForAcceptanceModel.objects.create(
                                    user=user,
                                    roles=roles_for_acceptance
                                )
                                if categories:
                                    for category in categories:
                                        AdminMaterialCategory.objects.create(
                                            user=user,
                                            category=category
                                        )
                                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                            except Exception as e:
                                logger.error('SsoLoginView_get_user_create:{}'.format(e))
                            break
                        else:
                            username = uname + str(i)

                user = User.objects.get(email=email)
                third_platform = ThirdPlatformTokenInformation.objects.get(platform_name='ndty-ssologin')
                user_third_token = UserThirdPlatformToken.objects.filter(user=user, third_platform=third_platform)
                if user_third_token.exists():
                    user_third_token.update(token=token)
                else:
                    UserThirdPlatformToken.objects.create(user=user, third_platform=third_platform, token=token)
                sync_pms_user_project_and_subject(email, user_sso_id)
            return redirect(redirect_url)
        except Exception as e:
            logger.error('SsoLoginView_get:{}'.format(e))
            return JsonResponse({
                'error': str(e)
            }, status=400)


class SsoRegister(View):

    def post(self, request: HttpRequest):
        try:
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            if ip == "10.0.3.200":
                email = get_json_field_r(request, field='email', required_type=str)
                username = get_json_field_r(request, field='username', required_type=str)
                real_name = get_json_field_r(request, field='realname', required_type=str)
                User.get_or_make_for_sso(email=email, username=username, real_name=real_name)
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=400)
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=400)
