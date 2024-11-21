# -*- coding: utf-8 -*-

# @File   : view.py
# @Author : Yuvv
# @Date   : 2017/12/5

import json
from collections import OrderedDict
from pathlib import Path

from django.conf import settings
from django.http import HttpRequest
from django.shortcuts import HttpResponseRedirect, HttpResponse, redirect
from django.urls import reverse
from django.utils import translation
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_safe, require_GET
from django.views.generic import TemplateView

from apps.account.auth import login_required_api, require_role
from apps.account.models.users import UserRole
from apps.mge.management.commands.collect_urls import URLS_RESOLVE_JS, Command as JsResolver
from mgedata.errors.models import MGEError


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
    return TemplateView.as_view(template_name='index.html')


STATIC_DIR = Path(settings.BASE_DIR) / 'static'


@login_required_api
def role_help_pdf(request: HttpRequest):
    with open(STATIC_DIR / 'roles.pdf', 'rb') as f:
        return HttpResponse(f.read(), content_type='application/pdf')


@login_required_api
@require_role(UserRole.SYS_ADMIN)
def manage_help_pdf(request: HttpRequest):
    with open(STATIC_DIR / 'manage.pdf', 'rb') as f:
        return HttpResponse(f.read(), content_type='application/pdf')


@login_required_api
@require_role(UserRole.RESEARCHER)
def research_help_pdf(request: HttpRequest):
    with open(STATIC_DIR / 'research.pdf', 'rb') as f:
        return HttpResponse(f.read(), content_type='application/pdf')


@login_required_api
@require_role(UserRole.DATA_ADMIN)
def review_help_pdf(request: HttpRequest):
    with open(STATIC_DIR / 'review.pdf', 'rb') as f:
        return HttpResponse(f.read(), content_type='application/pdf')
