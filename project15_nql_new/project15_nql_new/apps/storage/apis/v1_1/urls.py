# -*- coding: utf-8 -*-

# @File   : urls.py
# @Author : Yuvv
# @Date   : 2017/12/10

from django.urls import path

from apps.storage.apis.v1_0.material import specific_material_project, material_project_query, get_material_projects
from apps.storage.apis.v1_1.material import SubjectView, ProjectView, CategoryView
from apps.storage.apis.v1_1 import data_full, data_full_direct, DataEndpoint

urlpatterns = [
    # data
    path(r'data/full', data_full, name='data_full'),
    path('data/full/direct', data_full_direct, name='data_full_direct'),
    path('o/data/full', DataEndpoint.as_view(), name='o_data_full'),

    # project && subject 老接口 需要迭代删掉
    path(r'projects/all', get_material_projects, name='get_material_projects'),
    path(r'projects/<project_id>', specific_material_project, name='specific_material_project'),
    path(r'projects/search/', material_project_query, name='material_project_query'),

    # material
    path('projects', ProjectView.as_view(), name='projects'),
    path('subjects', SubjectView.as_view(), name='subjects'),
    path('categories', CategoryView.as_view(), name='categories'),
]
