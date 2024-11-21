from django.urls import re_path, path

from apps.account.apis.v1.user import *

urlpatterns = [
    path(r'user/new_token/', new_token, name='new_token'),
    path(r'user/session/', session_api, name='session_api'),
    path(r'user/session/refresh/', refresh_login_status, name='refresh_login_status_api'),
    path(r'user/token', login_for_token, name='login_for_token'),
    path(r'user/password/reset_request/', reset_password_request, name='reset_password_request'),
    path(r'user/password/', reset_password, name='reset_password'),
    path(r'user/email_verification/', resend_verification_email, name='resend_verification_email'),
    path(r'users/', user_list, name='user_list'),
    path(r'users/subjects/<str:subject_id>/subject_users', subject_users, name='subject_users'),
    path(r'user/info', user_info, name='user_info'),
    re_path(r'users/(?P<username>[\w.@+-]+)/$', user_resource, name='user_resource'),
    path(r'notifications/', notification_list, name='notification_list'),
    path(r'notifications/<int:n_id>/', notification_resource, name='notification_resource'),
    path(r'user/captcha/', send_email_captcha, name='send_email_captcha'),
    path(r'user/captcha/login/', login_for_captcha, name='login_for_captcha'),
    path(r'user/register_api/', register_user, name='register_user'),  # 游客注册
]
