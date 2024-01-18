from datetime import datetime
from django.db.models import Q
from django.http import HttpRequest
from django.utils import timezone

from apps.sso_server.models import Oauth2OpenApiAuth
from apps.sso_server.openapi.decorator import open_api_auth
from apps.storage.models import Template, DataMeta
from apps.storage.models.data import DataReviewState
from apps.storage.models.file import FileContentType
from apps.storage.utils.data_import_export import export_data

from mgedata.errors.models import MGEError
from mgedata.utils.general import require_GET_api, get_param, json_response


@require_GET_api
@open_api_auth
def sync_data(request: HttpRequest):
    """
    对外数据同步接口,仅同步审核通过数据
    Args:
        template_id: 模版id
        begin_time: 时间戳. 起始时间
        end_time: 时间戳. 截止时间
    Returns:
        1. 当template为空是返回时间段内存在需要同步的模版id
        2. 当template不为空时,执行异步任务导出时间段内数据
    """
    template_id = get_param('template_id', allow_none=True, convert_to=int)
    update_time = get_param('begin_time', allow_none=False, convert_to=int)
    end_time = get_param('end_time', allow_none=True, convert_to=int)
    if end_time is None:
        end_time = datetime.now(tz=timezone.utc)
    else:
        end_time = datetime.fromtimestamp(end_time / 1000, tz=timezone.utc)
    user = Oauth2OpenApiAuth.get_user(request)
    update_time = datetime.fromtimestamp(update_time / 1000, tz=timezone.utc)
    try:
        time_filter = Q(update_time__gte=update_time) & Q(update_time__lte=end_time)
        state_filter = Q(review_state=DataReviewState.APPROVED, public_range='public', is_public=True)
        if template_id is None:
            _str = 'template_id'
            update_template_ids = set(
                DataMeta.objects.filter(time_filter & state_filter).order_by(
                    _str).distinct(_str).values_list(_str, flat=True))
            delete_template_ids = set(
                DataMeta.deleted_objects.filter(time_filter).order_by(
                    _str).distinct(_str).values_list(_str, flat=True))
            template_ids = set.union(update_template_ids, delete_template_ids)
            if None in template_ids:
                template_ids.remove(None)
            return json_response({'template_ids': list(template_ids), 'begin_time': update_time, 'end_time': end_time})
        template = Template.objects.get(id=template_id)
        template_filter = Q(template=template)
        queryset = DataMeta.objects.filter(time_filter & state_filter & template_filter)
        delete_queryset = DataMeta.deleted_objects.filter(time_filter & template_filter)

        dm_ids = list(queryset.values_list('id', flat=True))
        deleted_dm_ids = list(delete_queryset.values_list('id', flat=True))
        if len(dm_ids) != 0:
            task_id = export_data(user, meta_or_list=dm_ids, file_format=FileContentType.JSON, no_attachments=True).id
        else:
            task_id = None
            if len(delete_queryset) == 0:
                raise MGEError.NO_AVAILABLE_DATA(f"id为{template_id}的模版没有需要同步的数据")

        return json_response(
            {'task_id': task_id, 'sync_data_count': len(dm_ids), 'sync_delete_count': len(deleted_dm_ids),
             'deleted_dm_ids': deleted_dm_ids, 'begin_time': update_time, 'end_time': end_time})
    except ValueError as e:
        raise MGEError.BAD_DATA(str(e))
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND("模版id:\"{}\"不存在".format(template_id))
