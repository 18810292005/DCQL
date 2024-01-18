# -*- coding: utf-8 -*-

# @File   : v2/urls.py
# @Author : Jasper0819X
# @Date   : 2018/01/25

from django.urls import path

from .data import *
from .template import *

urlpatterns = [
    # data
    path(r'data/admin_export_category', export_data_of_category_admin),
    path(r'data/<int:oid>', get_data, name='get_data'),
    path(r'data/<int:meta_id>/review', review_data, name='review_data'),

    path(r'data/histories/<int:history_id>/review', review_upload_history, name='review_upload_history'),
    path(r'data/histories/<int:history_id>/revoke', revoke_review_upload_history, name='revoke_review_upload_history'),
    path(r'data/histories/<int:history_id>', get_upload_history_data_metas, name='get_upload_history_data_metas'),
    path(r'template/names', get_template_names, name='template_names'),
    path(r'template/review/state/<int:tpl_id>', review_template, name='review_template'),
    path(r'template', check_template_title, name='check_template_title'),

    # oauth2
    path('o/data/full/<int:oid>', DataEndpoint.as_view(), name='o_data_full_one'),
]
