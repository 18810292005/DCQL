# -*- coding: utf-8 -*-

# @File   : api_v1_views
# @Author : Harold Chen
# @Date   : 2018/5/8

from mgedata.utils.general import *
from apps.task.models import UserTask, TaskState
from django.http import HttpRequest
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.db.models import Q


@login_required
def task_list(request: HttpRequest):
    task_type = get_param('state')
    query = Q(user=request.user) & ~Q(state=TaskState.DELETED.value)
    if task_type == 'running':
        query = query & (Q(state=TaskState.RUNNING.value) | Q(state=TaskState.PENDING.value))
    elif task_type == 'success':
        query = query & Q(state=TaskState.SUCCESS.value)
    elif task_type == 'revoked':
        query = query & Q(state=TaskState.CANCELLED.value)
    elif task_type == 'failed':
        query = query & Q(state=TaskState.FAILED.value)
    else:
        task_type = 'all'

    page = get_param('page')
    paginator = Paginator(UserTask.objects.filter(query), 5)
    try:
        tasks = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        tasks = paginator.page(1)
        page = 1
    for task in tasks:
        task.refresh_state()
    return render(request, template_name='task/my_tasks.html',
                  context={'task_list': tasks, 'task_type': task_type, 'page_count': paginator.num_pages,
                           'current_page': page})
