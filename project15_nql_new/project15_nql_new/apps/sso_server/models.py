# -*- coding: utf-8 -*-

# @File   : models.py
# @Author : Yuvv
# @Date   : 2018/6/1
from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models
from django.http import HttpRequest
from django.utils import timezone
from django.utils.deconstruct import deconstructible
from oauth2_provider.models import AccessToken

from apps.account.models import User
from apps.sso_server.openapi.auth import OpenApiAuthState
from apps.sso_server.openapi.validator import validate_open_api_name
from mgedata.utils.general import gen_secret_key

from oauth2_provider.settings import oauth2_settings


@deconstructible
class SecretKeyGenerator(object):
    """
    Helper to give default values to Client.secret and Client.key
    """

    def __init__(self, field, length=64):
        self.field = field
        self.length = length

    def __call__(self):
        key = gen_secret_key(self.length)
        while self.get_model().objects.filter(**{self.field: key}).exists():
            key = gen_secret_key(self.length)
        return key


class ConsumerSecretKeyGenerator(SecretKeyGenerator):
    def get_model(self):
        return SSOConsumer


class TokenSecretKeyGenerator(SecretKeyGenerator):
    def get_model(self):
        return SSOToken


class SSOConsumer(models.Model):
    name = models.CharField(max_length=255, unique=True)
    access_key = models.CharField(
        max_length=16, unique=True,
        default=ConsumerSecretKeyGenerator('access_key', 16)
    )
    access_secret = models.CharField(
        max_length=32, unique=True,
        default=ConsumerSecretKeyGenerator('access_secret', 32)
    )
    add_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def rotate_keys(self):
        self.key = ConsumerSecretKeyGenerator('access_key')()
        self.secret = ConsumerSecretKeyGenerator('access_secret')()
        self.save()


class SSOToken(models.Model):
    consumer = models.ForeignKey(
        SSOConsumer,
        related_name='tokens',
        on_delete=models.CASCADE,
    )
    request_token = models.CharField(
        unique=True, max_length=64,
        default=TokenSecretKeyGenerator('request_token')
    )
    access_token = models.CharField(
        unique=True, max_length=64,
        default=TokenSecretKeyGenerator('access_token')
    )
    timestamp = models.DateTimeField(default=timezone.now)
    redirect_to = models.CharField(max_length=255)
    user = models.ForeignKey(
        getattr(settings, 'AUTH_USER_MODEL', 'auth.User'),
        null=True,
        on_delete=models.CASCADE,
    )

    def refresh(self):
        self.timestamp = timezone.now()
        self.save()


class ThirdPlatformTokenInformation(models.Model):
    """
    子系统请求token
    """
    platform_name = models.CharField(primary_key=True, max_length=32)
    token = models.TextField(blank=True, null=True)


class UserThirdPlatformToken(models.Model):
    """
    第三方平台的用户Token信息
    """
    third_platform = models.ForeignKey(to=ThirdPlatformTokenInformation, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    token = models.TextField(blank=False, null=True)

    class Meta:
        unique_together = ('user', 'third_platform')


class Oauth2OpenApiAuth(models.Model):
    """
    Oauth2 API 用户权限控制
    """
    application = models.ForeignKey(oauth2_settings.APPLICATION_MODEL, on_delete=models.CASCADE)
    api_name = models.CharField(max_length=64,
                                validators=[RegexValidator(r'^openapi_oauth2'), validate_open_api_name])
    state = models.IntegerField(choices=OpenApiAuthState.choices())
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('application', 'api_name')

    def to_dict(self):
        return {
            'id': self.id,
            'application_name': self.application.name,
            'client_id': self.application.client_id,
            # 'user_id': self.application.user.username,
            'api_name': self.api_name,
            'state': self.state,
            'created': self.created,
            'updated': self.updated
        }

    @staticmethod
    def get_token(request: HttpRequest):
        AUTH_VALUE_HEADER = 'Bearer '
        authorization_header = request.headers.get('Authorization')
        token = authorization_header[len(AUTH_VALUE_HEADER):]
        return token

    @staticmethod
    def get_user(request: HttpRequest):
        token = Oauth2OpenApiAuth.get_token(request)
        application = AccessToken.objects.get(token=token).application
        return application.user
