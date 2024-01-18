import json
import logging
import threading
import traceback

import pytz
from django.conf import settings
from django.contrib.auth import login
from django.http import HttpResponse, HttpRequest
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin

from apps.account.models import User
from apps.mge.models import RequestInformation
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
            if settings.DEBUG:
                raise
            logger.error(traceback.format_exc())
            exception = MGEError.UNKNOWN_ERROR(str(exception))
        else:
            logger.error(exception.full_string)
            logger.debug(str(exception.__traceback__))

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
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.
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


class TrackUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # print("md处理请求")
        try:
            requestinfo = RequestInformation()
            requestinfo.url = request.path
            requestinfo.method = request.method
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            requestinfo.ip = ip
            if request.GET:
                requestinfo.params = request.GET
            if request.body:
                requestinfo.body = json.loads(request.body)
            try:
                user = User.objects.get(username=request.user)
                requestinfo.username = user.username
            except User.DoesNotExist:
                requestinfo.username = '游客'
            requestinfo.save()
        except Exception as e:
            pass
        # print(info)
        response = self.get_response(request)
        # print("md处理响应")
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
