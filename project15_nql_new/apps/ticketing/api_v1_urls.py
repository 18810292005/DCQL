# -*- coding: utf-8 -*-

# @File   : api_v1_urls
# @Author : Harold Chen
# @Date   : 2018/1/15

from . import api_v1 as views
from django.urls import path

urlpatterns = [
    path(r'create_ticket', view=views.create_ticket, name='create_ticket'),
    path(r'reply', view=views.reply, name='reply'),
    path(r'close_ticket', view=views.close_ticket, name='close_ticket'),
    path(r'finish_ticket', view=views.finish_ticket, name='finish_ticket'),
    path(r'upload_file', view=views.upload_file, name='upload_file'),
    path(r'upload_image', view=views.upload_image, name='upload_image'),

    path(r'tickets', view=views.TicketList.as_view(), name='tickets'),
    # ADDed By @ChenFangyigit
    path(r'topic_choices', view=views.topic_choices, name="topic_choices"),
    path(r'list_tickets',view = views.list_tickets,name="list_tickets"),
    path(r'ticket/<int:ticket_id>',view = views.ticket,name="ticket")
]