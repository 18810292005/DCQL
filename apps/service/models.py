import json

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import models

from apps.account.models import User
from apps.storage.models.data import DataMeta
from apps.storage.models.material import Category


class FrontendStaticInfo(models.Model):
    name = models.TextField(unique=True)
    file = models.FileField(upload_to='_fs/static/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField(default=False)

    def get_url(self, absolute=False):
        if absolute:
            return settings.SITE_ADDR + settings.MEDIA_URL + self.file.name
        return settings.MEDIA_URL + self.file.name


class SearchRecord(models.Model):
    """
    记录用户的搜索内容
    search_params:str 搜索参数
    """
    username = models.TextField(null=True, blank=True, max_length=150, default="匿名用户")
    search_params = models.TextField(null=True, blank=True, max_length=150)
    search_time = models.DateTimeField(auto_now_add=True)

    def parse_search_params(self):
        """
        解析json字符串，返回搜索内容(val)，搜索类型(title)和搜索条件（and/or）
        """
        search_result = []
        _dict = {}
        params: dict = json.loads(self.search_params)
        if 'text' in params.keys():
            _dict['search_content'] = params.get('text')
            _dict['search_type'] = 'text'
            _dict['search_condition'] = 'and'
            search_result.append(_dict)
        elif 'meta' in params.keys():
            params = params.get('meta')
            search_condition = list(params.keys())[0]
            for content in params.get(search_condition):
                _dict['search_content'] = content['val']
                _dict['search_type'] = content['field']
                _dict['search_condition'] = search_condition
                search_result.append(_dict)
        return search_result

    def to_dict(self):
        return {
            "username": self.username,
            "search_result": self.parse_search_params(),
            "search_time": self.search_time
        }

    @staticmethod
    def visit(user, search_params):
        if isinstance(user, AnonymousUser):
            username = "匿名用户"
        else:
            username = user.username
        record = SearchRecord(username=username, search_params=search_params)
        record.save()


class SiteConfiguration(models.Model):
    site_name = models.CharField(max_length=100)
    navbar_logo = models.FileField(upload_to='_fs/static/', null=True, blank=True)
    login_logo = models.FileField(upload_to='_fs/static/', null=True, blank=True)

    def get_logo_urls(self, absolute=False):
        logo_urls = {}
        if self.navbar_logo:
            if absolute:
                logo_urls['navbar_logo'] = settings.SITE_ADDR + settings.MEDIA_URL + self.navbar_logo.name
            else:
                logo_urls['navbar_logo'] = settings.MEDIA_URL + self.navbar_logo.name
        if self.login_logo:
            if absolute:
                logo_urls['login_logo'] = settings.SITE_ADDR + settings.MEDIA_URL + self.login_logo.name
            else:
                logo_urls['login_logo'] = settings.MEDIA_URL + self.login_logo.name
        return logo_urls
