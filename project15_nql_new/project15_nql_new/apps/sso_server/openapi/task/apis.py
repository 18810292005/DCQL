from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.db.models import Q
from apps.sso_server.models import Oauth2OpenApiAuth
from apps.sso_server.openapi.decorator import token_validator
from mgedata.utils.general import *
from apps.task.models import UserTask, TaskState
from django.http import HttpRequest
from django.utils.translation import ugettext as _


@token_validator
@require_methods_api(['GET', 'PATCH', 'DELETE'])
def oauth2_one_task(request: HttpRequest, task_id):
    task = None
    with transaction.atomic():
        try:
            task = UserTask.objects.select_for_update().get(id=task_id)
            task.refresh_state()
        except UserTask.DoesNotExist:
            raise MGEError.NOT_FOUND

        user = Oauth2OpenApiAuth.get_user(request)
        if task.user != user:
            raise MGEError.PERMISSION_DENIED
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
                raise MGEError.BAD_PARAMETER(_('Unknown task state: %s') % state)
    return json_response(task.to_dict())


@token_validator
@require_GET_api
def oauth2_tasks_list(request: HttpRequest):
    """
    获取当前applicaiton的任务信息。并按创建时间和任务状态过滤
    """
    task_state = get_param('state', convert_to=str, allow_none=True)
    begin_time = get_param('begin_time', allow_none=True, convert_to=int)
    end_time = get_param('end_time', allow_none=True, convert_to=int)
    page = get_param('page', convert_to=int, allow_none=True, default=1)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=10)
    if end_time is not None and begin_time < end_time:
        raise MGEError.BAD_REQUEST("起始时间必须小于截止时间")

    time_filter = Q()
    if begin_time is not None:
        begin_time = datetime.fromtimestamp(begin_time / 1000, tz=timezone.utc)
        time_filter &= Q(created_at__gte=begin_time)
    if end_time is not None:
        end_time = datetime.fromtimestamp(end_time / 1000, tz=timezone.utc)
        time_filter &= Q(created_at__lte=end_time)

    user = Oauth2OpenApiAuth.get_user(request)
    query = Q(user=user) & ~Q(state=TaskState.DELETED.value) & time_filter
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

    paginator = Paginator(UserTask.objects.filter(query).order_by('created_at'), page_size)
    try:
        tasks = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        tasks = paginator.page(1)
        page = 1
    for task in tasks:
        task.refresh_state()

    return json_response({'tasks': [task.to_dict() for task in tasks], 'page_count': paginator.num_pages,
                          'current_page': page, 'page_size': page_size, 'begin_time': begin_time, 'end_time': end_time})
