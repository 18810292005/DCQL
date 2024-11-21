# -*- coding: utf-8 -*-

# @File   : urls.py
# @Author : Yuvv
# @Date   : 2017/12/10

from django.urls import path

from apps.storage.apis.v1_1 import data_full
from apps.storage.apis.v1_1.data import get_institutes
from apps.storage.apis.v1_1.material import SubjectView, ProjectView

urlpatterns = [
    # data
    path(r'data/full', data_full, name='data_full'),

    # material
    path('projects', ProjectView.as_view(), name='projects'),
    path('subjects', SubjectView.as_view(), name='subjects'),

    # institute
    path('institute', get_institutes, name='institute'),
]
