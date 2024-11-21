from django.urls import path
from django.urls import re_path

from . import api_v1

urlpatterns = [
    re_path(r'^user/counts', api_v1.online_user_counts, name='online_user_counts'),
    re_path(r'^user/total_user', api_v1.total_user_counts, name='total_user_counts'),
    re_path(r'^user/visits', api_v1.user_visits, name='user_visits'),
    path('user/search_record', api_v1.search_record, name='search_record'),
    path('frontend/static', api_v1.get_frontend, name='get_frontend'),
    path('logo/edit', api_v1.logo_edit, name="logo_edit"),
    path('logo/navbar', api_v1.get_navbar, name="get_navbar"),
    path('logo/login', api_v1.get_login, name="get_login"),
]
