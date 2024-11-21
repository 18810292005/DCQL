from datetime import datetime
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from apps.account.auth import login_required_api
from apps.analytics.apis.v1.data import get_statistic_info_by_category_old, get_top_templates, get_statistics_count, \
    get_user_statistics_count
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response, get_param


@require_methods_api(['GET'])
def index(request):
    start_date_str = get_param('start_date', allow_none=True)
    end_date_str = get_param('end_date', allow_none=True)
    institute_id = get_param('institute_id', allow_none=True)
    institute_level = get_param('institute_level', allow_none=True, convert_to=int)
    username = get_param('username', allow_none=True)
    cur_time = timezone.now()
    if start_date_str is None or start_date_str is None:
        start_date = None
        end_date = None
    else:
        start_date = timezone.make_aware(datetime.strptime(start_date_str, "%Y-%m-%d"),
                                         timezone.get_default_timezone())
        end_date = timezone.make_aware(datetime.strptime(end_date_str, "%Y-%m-%d"),
                                       timezone.get_default_timezone())
        if start_date > end_date or end_date > cur_time:
            raise MGEError.BAD_DATA("时间选择不合法")
        elif start_date.date() == end_date.date():
            raise MGEError.BAD_DATA("开始和结束不能是同一天")
    if institute_id is None or institute_level is None:
        institute_id = None
        institute_level = None
    return json_response(get_statistic_info_by_category_old(institute_id=institute_id, institute_level=institute_level,
                                                            username=username, start_date=start_date, end_date=end_date))


@require_methods_api(['GET'])
def query_class(request, cid):
    year = get_param('year', allow_none=True, convert_to=int)
    cur_time = timezone.now()
    # 检查年份是否在1999到2999之间
    if year and 1999 <= year <= 2999:
        start_date_time = datetime(year, 1, 1, 0, 0, 0)
        end_date_time = datetime(year, 12, 31, 23, 59, 59)
        start_date = timezone.make_aware(start_date_time)
        end_date = timezone.make_aware(end_date_time)
        if start_date > cur_time:
            raise MGEError.BAD_DATA("时间选择不合法，大于当前年份")
    else:
        end_date = timezone.now()
        start_date = end_date - relativedelta(months=11)
    return json_response(get_statistic_info_by_category_old(cid, start_date=start_date, end_date=end_date))

@require_methods_api(['GET'])
def new_query_class(request):
    year = get_param('year', allow_none=True, convert_to=int)
    cid = get_param('cid', allow_none=True, default=None)
    if cid == 0 or cid == '0':
        cid = None
    cur_time = timezone.now()
    # 检查年份是否在1999到2999之间
    if year and 1999 <= year <= 2999:
        start_date_time = datetime(year, 1, 1, 0, 0, 0)
        end_date_time = datetime(year, 12, 31, 23, 59, 59)
        start_date = timezone.make_aware(start_date_time)
        end_date = timezone.make_aware(end_date_time)
        if start_date > cur_time:
            raise MGEError.BAD_DATA("时间选择不合法，大于当前年份")
    else:
        end_date = timezone.now()
        start_date = end_date - relativedelta(months=11)
    return json_response(get_statistic_info_by_category_old(cid, start_date=start_date, end_date=end_date))

@require_methods_api(['GET'])
def top_templates(request, top_k):
    return json_response(get_top_templates(top_k))


@require_methods_api(['GET'])
def statistics_count(request):
    return json_response(get_statistics_count())


@require_methods_api(['GET'])
@login_required_api
def user_statistics_count(request):
    user = request.user
    return json_response(get_user_statistics_count(user))
