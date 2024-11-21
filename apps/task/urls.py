# -*- coding: utf-8 -*-

# @File   : urls
# @Author : Harold Chen
# @Date   : 2018/5/8


from django.urls import path
from . import views

urlpatterns = [
    path(r'', views.task_list, name='index'),
]
