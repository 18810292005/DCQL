from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpRequest
from django.utils import timezone

from apps.account.auth import require_role, ensure_privacy
from apps.account.models.users import UserRole
from apps.search.tasks import import_to_es
from apps.storage.models.data import DataReviewState, DataMeta
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_param, require_GET_api, require_POST_api, get_json_field_r


@require_role(UserRole.RESEARCHER)
@require_GET_api
@login_required
def upload_history(request: HttpRequest):
    state = get_param('review_state', convert_to=int, allowed=(-1, 0, 1, 2), default=-1)
    page = get_param('page', convert_to=int, default=1)
    page_size = get_param('page_size', convert_to=int, default=10)

    q = Q(review_state=state) if state != -1 else Q()
    q = q & Q(user=request.user) & ~Q(meta_id_list=[])
    histories = UploadHistory.objects.filter(q)

    paginator = Paginator(histories, page_size)
    try:
        histories: list[UploadHistory] = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        page = 1
        histories: list[UploadHistory] = paginator.page(1)

    history_list = []
    for history in histories:
        if not history.meta_id_list:
            continue
        data_meta = DataMeta.objects.filter(id=history.meta_id_list[0]).first()
        if not data_meta:
            continue
        ret = {'id': history.id, 'upload_time': history.time, 'data_count': history.count,
               'upload_via': history.via_file,
               'reviewer': history.reviewer.real_name if history.reviewer is not None else None,
               'review_state': DataReviewState(history.review_state).description,
               'disapprove_reason': history.disapprove_reason,
               'title': history.title,
               'public_date': data_meta.public_date,
               }
        history_list.append(ret)

    return json_response(data={'results': history_list, 'page_count': paginator.num_pages,
                               'current_page': page, 'state': state, 'count': paginator.count})


@require_POST_api
@login_required
def public_upload_history(request: HttpRequest):
    history_id = get_json_field_r(request, 'history_id', int)
    public_date = get_json_field_r(request, 'public_date', str)
    public_range = get_json_field_r(request, 'public_range', str, allowed=['public', 'subject', 'project', 'person'])
    try:
        public_date = datetime.strptime(public_date, '%Y-%m-%d %H:%M:%S').astimezone(tz=timezone.utc)
        history = UploadHistory.objects.get(id=history_id)
        data_meta = DataMeta.objects.filter(id__in=history.meta_id_list).first()
        if data_meta is None:
            raise MGEError.BAD_DATA("上传历史下数据为空")
        ensure_privacy(request, history.user)
        if public_date < timezone.now():
            DataMeta.objects.filter(id__in=history.meta_id_list).update(is_public=True, public_range=public_range,
                                                                        public_date=public_date)
        else:
            DataMeta.objects.filter(id__in=history.meta_id_list).update(is_public=False, public_range=public_range,
                                                                        public_date=public_date)
        import_to_es.delay(history.meta_id_list)
        return json_response()
    except ValueError:
        raise MGEError.BAD_DATA("日期格式化错误,format:%Y-%m-%d %H:%M:%S")
    except UploadHistory.DoesNotExist:
        raise MGEError.NOT_FOUND(f"上传历史({history_id})不存在")
