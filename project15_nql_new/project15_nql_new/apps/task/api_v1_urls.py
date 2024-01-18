# -*- coding: utf-8 -*-

# @File   : api_v1_urls
# @Author : Harold Chen
# @Date   : 2018/5/8

from django.urls import path
from . import api_v1_views

urlpatterns = [
    path(r'tasks/<int:task_id>', api_v1_views.one_task, name='one_task'),
    path(r'tasks/importVerify/<int:task_id>', api_v1_views.import_verify, name='import_verify'),
    path(r'tasks/list', api_v1_views.tasks_list, name='tasks_list'),
]
