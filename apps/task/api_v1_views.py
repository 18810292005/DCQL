# -*- coding: utf-8 -*-

# @File   : api_v1_views
# @Author : Harold Chen
# @Date   : 2018/5/8
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.db.models import Q

from mgedata.utils.general import *
from apps.account.auth import login_required_api, ensure_privacy
from apps.task.models import UserTask, TaskState, TaskType
from apps.storage.tasks import DataImportTask
from django.http import HttpRequest
from django.utils.translation import gettext as _


@login_required_api
@require_methods_api(['GET', 'PATCH', 'DELETE'])
def one_task(request: HttpRequest, task_id):
    task = None
    with transaction.atomic():
        try:
            task = UserTask.objects.select_for_update().get(id=task_id)
            task.refresh_state()
        except UserTask.DoesNotExist:
            raise MGEError.NOT_FOUND
        # if request.user.role > UserRole.USER_ADMIN:
        ensure_privacy(request, task.user)
        if request.method == 'GET':
            return json_response(task.to_dict())
        elif request.method == 'DELETE':
            task.state = TaskState.DELETED.value
            task.save()
            return json_response()
        elif request.method == 'PATCH':
            state = get_json_field_r(request, 'state', str)
            if state == TaskState.PENDING.value:
                if task.state == TaskState.RUNNING.value or task.state == TaskState.PENDING.value:
                    raise MGEError.TASK_IS_STILL_RUNNING
                new_task_id = task.retry()
                if new_task_id is None:
                    raise MGEError.TASK_IS_STILL_RUNNING
            elif state == TaskState.CANCELLED:
                task.cancel()
            else:
                raise MGEError.BAD_PARAMETER(_('未知的任务状态: %s') % state)
    return json_response(task.to_dict())


@login_required_api
@require_methods_api(['POST'])
def import_verify(request: HttpRequest, task_id):
    task = None
    with transaction.atomic():
        try:
            task = UserTask.objects.select_for_update().get(id=task_id)
            task.refresh_state()
        except UserTask.DoesNotExist:
            raise MGEError.NOT_FOUND
        ensure_privacy(request, task.user)
        if task.task_type != TaskType.DATA_IMPORT_VERIFY or task.state != TaskState.SUCCESS.value:
            raise MGEError.PERMISSION_DENIED("此任务不能用于汇交")
        with transaction.atomic():
            UserTask.add_task(request.user, DataImportTask().s(*task.signature['args']), TaskType.DATA_IMPORT)
            task.delete()
    return json_response()


@login_required_api
@require_GET_api
def tasks_list(request: HttpRequest):
    """
    获取当前登录用户的任务信息。并按创建时间和任务状态过滤
    Args:
        state:任务状态TaskState
        created_at:任务创建时间,以%Y-%m-%d %H:%M:%S格式进行组织
    Returns:
        data:返回的任务信息列表
        count:返回的任务信息数
    """
    task_state = get_param('state', convert_to=str, allow_none=False)
    created_at = get_param('created_at', allow_none=True, convert_to=str)
    page = get_param('page', convert_to=int, allow_none=False)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=5)

    query = Q(user=request.user) & ~Q(state=TaskState.DELETED.value)
    if created_at is not None:
        try:
            created_at = timezone.make_aware(datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S'))
            query = query & Q(created_at__gte=created_at)
        except ValueError:
            raise MGEError.BAD_PARAMETER('created_at参数格式错误,清遵循%Y-%m-%d %H:%M:%S')
    if task_state == 'running':
        query = query & (Q(state=TaskState.RUNNING.value) | Q(state=TaskState.PENDING.value))
    elif task_state == 'success':
        query = query & Q(state=TaskState.SUCCESS.value)
    elif task_state == 'revoked':
        query = query & Q(state=TaskState.CANCELLED.value)
    elif task_state == 'failed':
        query = query & Q(state=TaskState.FAILED.value)
    else:
        task_state = 'all'

    paginator = Paginator(UserTask.objects.filter(query), page_size)
    try:
        tasks = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        tasks = paginator.page(1)
        page = 1
    for task in tasks:
        task.refresh_state()

    return json_response({'tasks': [task.to_dict() for task in tasks], 'page_count': paginator.num_pages,
                          'current_page': page, 'page_size': page_size, 'task_state': task_state})
