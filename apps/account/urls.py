from django.urls import path
from django.views.generic import TemplateView

from apps.account.views import *

urlpatterns = [
    path("login/", login_view, name='login'),
    path("login_mge/", login_view_mge, name='login_mge'),  # mge的测试登录入口
    path("logout/", logout_view, name='logout'),
    path("register/", register_view, name='register'),
    path("reset_password_request", TemplateView.as_view(template_name='account/reset_password_request.html'),
         name='reset_request'),
    path("reset_password", reset_password, name='reset_password'),
    path("verify_email", verify_email, name='verify_email'),
    path("notifications/page/<int:page>", notifications, name='notifications_page'),
    path("notifications", notifications, name='notifications'),
    path("me", my_info, name='my_info'),
    path("me/data", my_data, name='my_data'),
    path("me/uploads/<int:history_id>", upload_history_list_data, name='upload_history_data'),
    path("me/uploads/<str:state>/page/<int:page>", upload_history, name='upload_history_state'),
    path("me/uploads/page/<int:page>", upload_history, name='upload_history_page'),
    path("me/uploads/", upload_history, name='upload_history'),

]
