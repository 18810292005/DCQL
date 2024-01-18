from django.urls import path
from django.urls import re_path

from . import api_v1

urlpatterns = [
    re_path(r'^user/counts', api_v1.online_user_counts, name='online_user_counts'),
    re_path(r'^user/visits', api_v1.user_visits, name='user_visits'),
    path('user/search_record', api_v1.search_record, name='search_record'),
    path('user/visit_data_record', api_v1.visit_data_record, name='visit_data_record'),
    path('contribution/<int:category_id>', api_v1.contribution, name='contribution'),
    path('contribution/main', api_v1.main_category, name='main_category'),
    path('frontend/static', api_v1.get_frontend, name='get_frontend'),
]
