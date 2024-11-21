from django.db.models import Q, F
from rest_framework import serializers

from ...models.data import DataMeta
from ...models.template import Template, Snippet


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
    data_count = serializers.SerializerMethodField()
    avg_score = serializers.SerializerMethodField()

    def get_method_id(self, template):
        return template.method_rel.method.id

    def get_data_count(self, template):
        return template.datameta_set.count()

    def get_avg_score(self, template):
        return 0

    class Meta:
        model = Template
        fields = '__all__'
