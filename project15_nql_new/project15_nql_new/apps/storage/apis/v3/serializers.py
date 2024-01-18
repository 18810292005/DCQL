from django.db.models import Q, F, Avg
from rest_framework import serializers
from apps.certificate.models import TemplateRecommend
from ...models.data import UploadHistory, DataMeta
from ...models.template import Template, Snippet, MaterialMethodTemplateRelation


class UploadSourceFileToUrlField(serializers.Field):
    def to_representation(self, value):
        return value.get_url()

    def to_internal_value(self, data):
        raise NotImplementedError


class DataIDListField(serializers.Field):
    def to_representation(self, value):
        queryset = DataMeta.objects.filter(pk__in=value).annotate(tid=F('template_id'))
        c = queryset.filter(Q(is_public=False) | ~Q(public_range='public')).count()

        rs = {'public': True if c == 0 else False, 'data_list': queryset.values('id', 'title', 'tid')}
        return rs

    def to_internal_value(self, data):
        raise NotImplementedError


# UploadHistory的序列化器
class UploadHistorySerializer(serializers.ModelSerializer):
    real_name = serializers.CharField(source='user.real_name', read_only=True)
    reviewer_real_name = serializers.CharField(source='reviewer.real_name', read_only=True)
    meta_id_list = DataIDListField(read_only=True)
    source = UploadSourceFileToUrlField(read_only=True)
    data_title = serializers.SerializerMethodField(read_only=True)

    def get_data_title(self, upload_history):
        data_title = ""
        if upload_history.source is not None:
            data_title = upload_history.source.get_url().split('/')[-1].split('.')[0]
            if isinstance(data_title, list):
                data_title = '.'.join(data_title)
        else:
            for meta_id in upload_history.meta_id_list:
                data_meta = DataMeta.objects.filter(id=meta_id).first()
                if data_meta is not None:
                    data_title = data_meta.title
                    break
        return data_title
    
    class Meta:
        model = UploadHistory
        exclude = ('via_file',)


# 不带数据列表的序列化器
# 防止数据列表过长导致API请求缓慢
class SlimUploadHistorySerializer(serializers.ModelSerializer):
    real_name = serializers.CharField(source='user.real_name', read_only=True)
    reviewer_real_name = serializers.CharField(source='reviewer.real_name', read_only=True)
    source = UploadSourceFileToUrlField(read_only=True)
    data_title = serializers.SerializerMethodField(read_only=True)
    subjects = serializers.SerializerMethodField(read_only=True)

    def get_data_title(self, upload_history):
        return upload_history.title

    def get_subjects(self, upload_history):
        subjects = set(
            DataMeta.objects.filter(id__in=upload_history.meta_id_list).values_list('other_info__subject', flat=True))
        return subjects

    class Meta:
        model = UploadHistory
        exclude = ('meta_id_list', 'via_file',)


class TemplateMethodReadField(serializers.Field):

    def to_representation(self, value):
        if hasattr(value, 'method_rel'):
            return value.method_rel.method.name
        return None

    def to_internal_value(self, data):
        raise NotImplementedError


class SnippetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Snippet
        fields = ('id', 'snippet_name', 'add_time', 'content')


class TemplateSerializer(serializers.ModelSerializer):
    real_name = serializers.CharField(source='user.real_name', read_only=True)
    reviewer_real_name = serializers.CharField(source='reviewer.real_name', read_only=True)
    method = TemplateMethodReadField(source='*')
    method_id = serializers.SerializerMethodField()
    data_count = serializers.SerializerMethodField()
    avg_score = serializers.SerializerMethodField()

    def get_method_id(self, template):
        return template.method_rel.method.id

    def get_data_count(self, template):
        return template.datameta_set.count()

    def get_avg_score(self, template):
        tr = template.templaterecommend_set.all()
        count = tr.count()
        if count == 0:
            return -1 
        sum_score = 0
        for k in tr:
            sum_score = sum_score + k.score
        return sum_score / count

    class Meta:
        model = Template
        # fields = ('id', 'title', 'content', 'category', 'user', 'abstract', 'pub_date',
        #           'published', 'trashed', 'reviewer', 'review_state', 'disapprove_reason')
        exclude = ('trashed',)
