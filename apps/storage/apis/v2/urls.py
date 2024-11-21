# -*- coding: utf-8 -*-

# @File   : v2/urls.py
# @Author : Jasper0819X
# @Date   : 2018/01/25

from django.urls import path

from .data import *
from .template import *
urlpatterns = [
    # data
    path(r'data/<int:oid>', get_data, name='get_data'),

    path(r'template/names', get_template_names, name='template_names'),
    path(r'template/review/state/<int:tpl_id>', review_template, name='review_template'),
    path(r'template', check_template_title, name='check_template_title'),

]
