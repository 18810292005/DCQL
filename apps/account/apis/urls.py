from django.urls import path

from . import user

urlpatterns = [
    path(r'users/', user.users, name='users'),
    path('user/excel/', user.excel, name='download_template'),
    path(r'user/password/', user.edit_password_personal, name='edit_password_personal'),
    path(r'users/<str:username>/role/', user.edit_role, name='edit_role'),
    path(r'users/<str:username>/status/', user.toggle_enable, name='toggle_enable'),
    path(r'users/<str:username>/password/', user.edit_password, name='edit_password'),
    path(r'users/<str:username>/edit/', user.edit_user_base_info, name='edit_user_base_info'),
    path(r'users/<str:username>/', user.delete_user, name='delete_user'),
]
