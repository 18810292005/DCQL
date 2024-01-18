# -*- coding: utf-8 -*-

# @File   : urls
# @Author : Harold Chen
# @Date   : 2018/1/15

from django.urls import path
from . import views

urlpatterns = [
    path(r'tickets/<int:ticket_id>', views.show_ticket, name='show_ticket'),
    path(r'new/', views.create_ticket, name='create_ticket'),
    path(r'list_tickets/', views.list_tickets, name='list_tickets'),
]
