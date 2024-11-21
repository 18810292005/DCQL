import os
from datetime import timedelta
from io import BytesIO
from pathlib import Path

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.forms import model_to_dict
from django.http import HttpRequest, FileResponse
from django.utils import timezone
from django.conf import settings

from apps.account.models.users import User
from apps.service.models import FrontendStaticInfo, SearchRecord, SiteConfiguration
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response, get_param


@require_methods_api(['GET'])
def online_user_counts(request):
    # 10分钟内有活动记录的用户被认为是在线
    counts = User.objects.filter(last_online__gte=timezone.now() - timedelta(seconds=60)).count()
    return json_response({
        'counts': counts
    })


@require_methods_api(['GET'])
def total_user_counts(request):
    counts = User.objects.all().count()
    return json_response({
        'counts': counts
    })


@require_methods_api(['GET'])
def user_visits(request):
    total_visits = 0
    return json_response({
        'counts': total_visits
    })


@require_methods_api(['GET'])
def get_frontend(request: HttpRequest):
    name = get_param('name', allow_none=False, convert_to=str)
    try:
        fs = FrontendStaticInfo.objects.get(name=name, is_delete=False)
        ret = model_to_dict(fs, exclude='file')
        ret['file'] = fs.get_url()
        return json_response(ret)
    except FrontendStaticInfo.DoesNotExist:
        return json_response({'file': '/static/img/logo-new.png'})


@require_methods_api(['GET'])
def search_record(request: HttpRequest):
    """
    获取用户搜索记录
    """
    page = get_param('page', convert_to=int, allow_none=True, default=1)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=10)
    q = Q()
    paginator = Paginator(SearchRecord.objects.filter(q).order_by('search_time'), page_size)
    try:
        result_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        result_page = paginator.page(1)
        page = 1
    result = [instance.to_dict() for instance in result_page]

    content = {'result': result, 'page_count': paginator.num_pages, 'page': page, 'page_size': page_size}
    return json_response(content)


@require_methods_api(['POST'])
def logo_edit(request):
    site_name = request.POST['site_name']
    navbar_logo = request.FILES.get('navbar_logo')
    login_logo = request.FILES.get('login_logo')

    if not site_name:
        raise MGEError.BAD_DATA("站点名称未设置")
    elif not site_name.strip():
        raise MGEError.BAD_DATA("站点名称不能为空")

    existing_logo = SiteConfiguration.objects.first()

    if existing_logo:
        existing_logo.site_name = site_name
        if navbar_logo:
            existing_logo.navbar_logo = navbar_logo
        if login_logo:
            existing_logo.login_logo = login_logo
        existing_logo.save()
    else:
        new_logo = SiteConfiguration(
            site_name=site_name,
            navbar_logo=navbar_logo,
            login_logo=login_logo
        )
        new_logo.save()
    return json_response()


@require_methods_api(['GET'])
def get_navbar(request: HttpRequest):
    site_config = SiteConfiguration.objects.first()
    if site_config is not None:
        navbar_urls = site_config.get_logo_urls()['navbar_logo']
        if not os.path.exists(navbar_urls):
            navbar_urls = '/static/img/logo.png'
    else:
        navbar_urls = '/static/img/logo.png'
    NAVBAR_PATH = navbar_urls
    with open(NAVBAR_PATH, 'rb') as fp:
        data = fp.read()
    filename = 'navbar_logo.png'
    return FileResponse(BytesIO(data), filename=filename, as_attachment=False)


@require_methods_api(['GET'])
def get_login(request: HttpRequest):
    site_config = SiteConfiguration.objects.first()
    if site_config is not None and "login_logo" in site_config.get_logo_urls():
        login_urls = site_config.get_logo_urls()['login_logo']
        if not os.path.exists(login_urls):
            login_urls = '/static/img/logo-login.png'
    else:
        login_urls = '/static/img/logo-login.png'
    LOGIN_PATH = login_urls
    with open(LOGIN_PATH, 'rb') as fp:
        data = fp.read()
    filename = 'login_logo.png'
    return FileResponse(BytesIO(data), filename=filename, as_attachment=False)
