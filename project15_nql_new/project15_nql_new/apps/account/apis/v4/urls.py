from django.urls import path

from apps.account.apis.v4.newSso import *
from apps.account.apis.v4.sso_client import SsoClient
from apps.account.apis.v4.sync_pms import sync_all_user_project_and_subject

urlpatterns = [
    path('roleData/api/getAllUserRole', RoleDataView.as_view(), name='getAllRoleData'),
    # path('userToken', GenerateToken.as_view(), name='generateToken'),
    path('ssoLogin', SsoLoginView.as_view(), name='ssoLogin'),
    path('ssoRegister', SsoRegister.as_view(), name='ssoRegister'),
    path('ssoClient', SsoClient.as_view(), name='ssoClient'),
    path('sync/account/projects', sync_all_user_project_and_subject, name='syncUserProjectAndSubject'),
]
