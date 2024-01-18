# -*- coding: utf-8 -*-

# @File   : view.py
# @Author : Yuvv
# @Date   : 2017/12/5

import json
from collections import OrderedDict

from django.conf import settings
from django.shortcuts import HttpResponseRedirect, HttpResponse, render
from django.template.exceptions import TemplateDoesNotExist
from django.urls import reverse
from django.utils import translation
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_safe, require_GET

from apps.account.models import User
from apps.mge.management.commands.collect_urls import URLS_RESOLVE_JS, Command as JsResolver
from apps.mge.models import UpdateHistory, DatabaseBackup
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_param, get_json_field_r


@require_safe
def set_language(request):
    lang = request.GET.get('lang', translation.get_language())
    if translation.check_for_language(lang):
        translation.activate(lang)
        next_page_url = request.GET.get('next', reverse('site_index'))
        response = HttpResponseRedirect(next_page_url)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, lang)
        return response
    else:
        raise MGEError.INVALID_LANGUAGE


# 仅开发时使用，部署时使用静态文件
@require_GET
@cache_page(5 * 60)
def get_js_resolver(request):
    js_patterns = OrderedDict()
    exclude_ns = ['admin']
    JsResolver.handle_url_module(js_patterns, settings.ROOT_URLCONF, exclude_ns)
    return HttpResponse(URLS_RESOLVE_JS + 'Urls._urls=' + json.dumps(js_patterns) + ';',
                        content_type='application/javascript')


def site_index(request):
    return render(request, 'index.html')


def site_help(request):
    lang = translation.get_language()
    try:
        return render(request, '_page/help/%s.html' % lang[:2])
    except TemplateDoesNotExist:
        return render(request, '_page/help/zh.html')


def site_help(request):
    lang = translation.get_language()
    try:
        return render(request, '_page/project_analytics/%s.html' % lang[:2])
    except TemplateDoesNotExist:
        return render(request, '_page/project_analytics/zh.html')


def update_history(request):
    num = get_param('num', convert_to=int)
    num = num or 5
    histories = UpdateHistory.objects.all()[:num]
    res = []
    for his in histories:
        res.append({
            'time': his.time,
            'content': his.content
        })
    return json_response(res)


def latest_migrations(request):
    username = get_json_field_r(request, 'username')
    password = get_json_field_r(request, 'password')
    try:
        if not User.objects.get(username=username).check_password(password):
            raise User.DoesNotExist
    except User.DoesNotExist:
        return json_response(status_code=403)
    rec = DatabaseBackup.objects.filter(db_type='g').order_by('-id').first()
    if not rec:
        return json_response()
    return json_response(rec.file.url)


def latest_core_dump(request):
    username = get_json_field_r(request, 'username')
    password = get_json_field_r(request, 'password')
    try:
        if not User.objects.get(username=username).check_password(password):
            raise User.DoesNotExist
    except User.DoesNotExist:
        return json_response(status_code=403)
    rec = DatabaseBackup.objects.filter(db_type='d').order_by('-id').first()
    if not rec:
        return json_response()
    return json_response(rec.file.url)
