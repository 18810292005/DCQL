# -*- coding: utf-8 -*-

# @File   : views.py
# @Author : Yuvv
# @Date   : 2018/6/1

import datetime
import base64
from urllib.parse import urlparse, urlunparse, urlencode

from django.http import (HttpResponseForbidden, HttpResponseBadRequest, HttpResponseRedirect, QueryDict)
from django.urls import path
from django.urls import reverse
from django.utils import timezone
from django.views.generic.base import View
from .utils.http import BaseProvider, provider_for_django
from .utils.cipher import AesGcmUtil

from .models import SSOToken, SSOConsumer


class RequestTokenProvider(BaseProvider):

    def __init__(self, server):
        self.server = server

    def get_access_secret(self, access_key):
        try:
            self.consumer = SSOConsumer.objects.get(access_key=access_key)
        except SSOConsumer.DoesNotExist:
            return None
        return self.consumer.access_secret

    def provide(self, data):
        redirect_to = data['redirect_to']
        token = SSOToken.objects.create(consumer=self.consumer, redirect_to=redirect_to)
        return {'request_token': token.request_token}


class AuthorizeView(View):
    """
    The client get's redirected to this view with the `request_token` obtained
    by the Request Token Request by the client application beforehand.

    This view checks if the user is logged in on the server application and if
    that user has the necessary rights.

    If the user is not logged in, the user is prompted to log in.
    """
    server = None

    def get(self, request):
        request_token = request.GET.get('token', None)
        if not request_token:
            return self.missing_token_argument()
        try:
            self.token = SSOToken.objects.select_related('consumer').get(request_token=request_token)
        except SSOToken.DoesNotExist:
            return self.token_not_found()
        if not self.check_token_timeout():
            return self.token_timeout()
        self.token.refresh()
        if request.user.is_authenticated:
            return self.handle_authenticated_user()
        else:
            return self.handle_unauthenticated_user()

    def missing_token_argument(self):
        return HttpResponseBadRequest('Token missing')

    def token_not_found(self):
        return HttpResponseForbidden('Token not found')

    def token_timeout(self):
        return HttpResponseForbidden('Token timed out')

    def check_token_timeout(self):
        delta = timezone.now() - self.token.timestamp
        if delta > self.server.token_timeout:
            self.token.delete()
            return False
        else:
            return True

    def handle_authenticated_user(self):
        if self.server.has_access(self.request.user, self.token.consumer):
            return self.success()
        else:
            return self.access_denied()

    def handle_unauthenticated_user(self):
        next_page = '%s?%s' % (self.request.path, urlencode([('token', self.token.request_token)]))
        url = '%s?%s' % (reverse(self.server.auth_view_name), urlencode([('next', next_page)]))
        return HttpResponseRedirect(url)

    def access_denied(self):
        return HttpResponseForbidden("Access denied")

    def success(self):
        self.token.user = self.request.user
        self.token.save()
        parse_result = urlparse(self.token.redirect_to)
        query_dict = QueryDict(parse_result.query, mutable=True)
        aes_gcm = AesGcmUtil(self.token.consumer.access_secret)
        wrapped_data = BaseProvider.wrap_json_str(None, self.token.access_token)
        encrypted_access_token = BaseProvider.encrypt_data(aes_gcm, wrapped_data)
        query_dict['access_token'] = base64.urlsafe_b64encode(encrypted_access_token)
        url = urlunparse((parse_result.scheme, parse_result.netloc, parse_result.path, '', query_dict.urlencode(), ''))
        return HttpResponseRedirect(url)


class VerificationProvider(BaseProvider, AuthorizeView):
    def get_access_secret(self, access_key):
        try:
            self.consumer = SSOConsumer.objects.get(access_key=access_key)
        except SSOConsumer.DoesNotExist:
            return None
        return self.consumer.access_secret

    def provide(self, data):
        token = data['access_token']
        try:
            self.token = SSOToken.objects.select_related('user').get(access_token=token, consumer=self.consumer)
        except SSOToken.DoesNotExist:
            return self.token_not_found()
        if not self.check_token_timeout():
            return self.token_timeout()
        if not self.token.user:
            return self.token_not_bound()
        return self.server.get_user_data(self.token.user, self.consumer)

    def token_not_bound(self):
        return HttpResponseForbidden("Invalid token")


class SSOServer:
    request_token_provider = RequestTokenProvider
    authorize_view = AuthorizeView
    verification_provider = VerificationProvider
    token_timeout = datetime.timedelta(minutes=5)

    auth_view_name = 'account:login'

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def has_access(self, user, consumer):
        return True

    def get_user_data(self, user, consumer):
        return user.get_third_part_info()

    def get_urls(self):
        return [
            path('request-token/',
                 provider_for_django(self.request_token_provider(server=self)),
                 name='sso-request-token'),
            path('authorize/',
                 self.authorize_view.as_view(server=self),
                 name='sso-authorize'),
            path('verify/',
                 provider_for_django(self.verification_provider(server=self)),
                 name='sso-verify'),
        ]
