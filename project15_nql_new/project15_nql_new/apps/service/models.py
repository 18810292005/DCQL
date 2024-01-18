import json
from datetime import timedelta

from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AnonymousUser
from apps.storage.models import MaterialCategory, DataMeta
from django.utils.translation import gettext as _
from apps.account.models import User


class SubBase(models.Model):
    username = models.CharField(max_length=100)

    class Meta:
        abstract = True


class ClassSub(SubBase):
    content = ArrayField(models.IntegerField())  # 引用到 id

    def add(self, mat_class_list):
        s = set(self.content)
        for c in mat_class_list:
            s.add(c)
        self.content = list(s)
        self.save()

    def remove(self, mat_class_list):
        s = set(self.content)
        for c in mat_class_list:
            s.remove(c)
        self.content = list(s)
        self.save()

    def to_list(self):
        return [{'name': _(s.name), 'oid': str(s.id)} for s in self.content]

    @staticmethod
    def get_unique(name):
        sub = ClassSub.objects.filter(username=name).first()
        return ClassSub(username=name).save() if sub is None else sub


class TagSub(SubBase):
    content = ArrayField(models.CharField(max_length=32))

    def add(self, tag_list):
        s = set(self.content)
        for t in tag_list:
            s.add(t)
        self.content = list(s)
        self.save()

    def remove(self, tag_list):
        s = set(self.content)
        for t in tag_list:
            s.remove(t)
        self.content = list(s)
        self.save()

    @staticmethod
    def get_unique(name):
        sub = TagSub.objects.filter(username=name).first()
        return TagSub(username=name).save() if sub is None else sub


class UserSub(SubBase):
    content = ArrayField(models.CharField(max_length=32))

    def add(self, name_list):
        s = set(self.content)
        for name in name_list:
            s.add(name)
        self.content = list(s)
        self.save()

    def remove(self, name_list):
        s = set(self.content)
        for name in name_list:
            s.remove(name)
        self.content = list(s)
        self.save()

    @staticmethod
    def get_unique(name):
        sub = UserSub.objects.filter(username=name).first()
        return UserSub(username=name).save() if sub is None else sub


class RecommendItem(models.Model):
    data = models.ForeignKey(DataMeta, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)

    def __eq__(self, other):
        return self.score == other.score

    def __gt__(self, other):
        return self.score > other.score

    def __lt__(self, other):
        return self.score < other.score


class ClassRecommends(models.Model):
    ref = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE)

    items = ArrayField(models.IntegerField())  # 引用到 RecommendItem 的 id

    @staticmethod
    def get_unique(mat_class):
        obj = ClassRecommends.objects.filter(ref=mat_class).first()
        return ClassRecommends(ref=mat_class).save() if obj is None else obj


class VisitRecord(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='system_views')
    views = models.BigIntegerField(default=0)
    last_visit = models.DateTimeField(auto_now=True)

    @staticmethod
    def visit(user):
        if hasattr(user, 'system_views'):
            last_visit = user.system_views.last_visit
            now_visit = timezone.now()
            if last_visit.date() < now_visit.date():
                user.system_views.views += 1
            user.system_views.last_visit = now_visit
            user.system_views.save()
        else:
            record = VisitRecord(user=user, views=1)
            record.save()

    @staticmethod
    def get_user_activities(time_delta=timedelta(minutes=15)):
        starting_time = timezone.now() - time_delta
        return VisitRecord.objects.filter(last_visit__gte=starting_time).order_by('-last_visit')


class DatabaseContribution(models.Model):
    category = models.OneToOneField(MaterialCategory, primary_key=True, on_delete=models.CASCADE,
                                    related_name='category', verbose_name='划分类别，包括材料类别和其他类别')
    brief = models.TextField(verbose_name='简介')
    detail = models.TextField(verbose_name='详情介绍')
    participants = JSONField(default=dict, verbose_name='参与人员')
    undertaker = models.CharField(max_length=128, verbose_name='承接单位')
    contact = models.CharField(max_length=128, verbose_name='联系方式')

    @staticmethod
    def filed_list():
        field_list = []
        for field in DatabaseContribution._meta.fields:
            field_name = str(field).split('.')[-1]
            field_list.append(field_name)
        return field_list

    def to_dict(self):
        ret = {
            'id': self.category_id,
            'brief': self.brief,
            'detail': self.detail,
            'participants': self.participants,
            'undertaker': self.undertaker,
            'contact': self.contact
        }
        return ret


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


class VisitDataRecord(models.Model):
    """
    记录用户对于单条数据的访问信息
    """
    visit_user = models.TextField(null=True, blank=True, max_length=150, default="匿名用户")
    visit_data_meta = models.ForeignKey(DataMeta, on_delete=models.SET_NULL, null=True, blank=True)
    visit_time = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return{
            "username": self.visit_user,
            "data_meta_title": self.visit_data_meta.title,
            "data_meta_category": self.visit_data_meta.category,
            "data_meta_abstract": self.visit_data_meta.abstract,
            "data_meta_keywords": self.visit_data_meta.keywords,
            "data_meta_doi": self.visit_data_meta.doi,
            "data_meta_template_id": self.visit_data_meta.template.id,
            "visit_time": self.visit_time
        }

    @staticmethod
    def visit(user, data_meta):
        if isinstance(user, AnonymousUser):
            username = "匿名用户"
        else:
            username = user.username
        record = VisitDataRecord(visit_user=username, visit_data_meta=data_meta)
        record.save()


class VisitApiRecord(models.Model):
    username = models.TextField(null=True, default="匿名用户")
    path = models.TextField(max_length=50, null=False, blank=True)
    method = models.TextField(null=True, default="GET")
    body = JSONField(default=dict, verbose_name="请求内容")
    cost_time = models.SmallIntegerField(null=False)
    visit_time = models.DateTimeField(auto_now=True)