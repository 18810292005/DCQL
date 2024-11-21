import json
import logging

from rest_framework import serializers

from apps.account.models import User
from apps.search.apis.v2.util import extract_summary, extract_params_from_request
from apps.search.core_v2.es import Manager
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.search.models import Query
from apps.service.models import SearchRecord
from apps.storage.models.template import DataMeta, Template
from mgedata.utils.general import MGEError, get_param

logger = logging.getLogger('django')


class QueryField(serializers.Field):

    def to_internal_value(self, data):
        return {
            'q': data,
            'download': {
                "data": {"include": [], "exclude": []},
                "template": {"include": []}
            }
        }

    def to_representation(self, value):
        page, page_size, return_fields = extract_params_from_request(
            self.context['request'])
        dataset = get_param('dataset', convert_to=bool, default=False)  # 是否按数据集聚合返回
        es_query = Manager.default_search(
            user=self.context['request'].user,
            template_id='*',
            dataset=dataset,
            query=MultiTemplateQueryFactory.produce(value.q),
            from_=(page - 1) * page_size,
            size=page_size,
            fields=return_fields
        )
        SearchRecord.visit(self.context['request'].user, json.dumps(value.q))
        if es_query.get('_shards', {}).get('failures', 0):
            logger.error('未知的查询错误: ' + str(es_query['_shards']['failures']))
            raise ValueError('未知的查询错误: ' + str(es_query['_shards']['failures']))

        return dict(value=value.q,
                    summary=extract_summary(es_query['aggregations'], value),
                    page=page,
                    page_size=page_size,
                    data=[],
                    total=es_query['hits']['total']['value'])


class QueryModelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    username = serializers.PrimaryKeyRelatedField(source='user',
                                                  queryset=User.objects.all(),
                                                  required=False,
                                                  allow_null=True)
    q = QueryField(source='*')

    class Meta:
        model = Query
        fields = ('id', 'username', 'q')


class DownloadField(serializers.Field):

    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        template_include = Template.objects.filter(id__in=value['template']['include'])
        template_include = [dict(id=ins.id, title=ins.title) for ins in template_include]

        data_include = DataMeta.objects.filter(id__in=value['data']['include'])
        data_include = [dict(id=ins.id, title=ins.title, template=ins.template_id, template_title=ins.template.title)
                        for ins in data_include]

        data_exclude = DataMeta.objects.filter(id__in=value['data']['exclude'])
        data_exclude = [dict(id=ins.id, title=ins.title, template=ins.template_id, template_title=ins.template.title)
                        for ins in data_exclude]

        template_group = dict((x['id'], x['title']) for x in template_include)
        for x in data_include:
            if x['template'] not in template_group:
                template_group[x['template']] = x['template_title']

        return dict(
            data=dict(
                include=data_include,
                exclude=data_exclude,
            ),
            template=dict(
                include=template_include
            ),
            template_group=template_group
        )


class QueryDownloadSerializer(serializers.ModelSerializer):
    download = DownloadField()

    def validate(self, data):
        data = data.get('download', {})
        if 'data' in data and 'template' in data:
            data_include = data['data'].get('include', [])
            data_exclude = data['data'].get('exclude', [])
            template_include = data['template'].get('include', [])
            template_exclude = data['template'].get('exclude', [])
            return dict(download=dict(data=dict(include=data_include, exclude=data_exclude),
                                      template=dict(include=template_include, exclude=template_exclude)))
        else:
            raise MGEError.BAD_DATA('`data` or `template` must in download dict')

    class Meta:
        model = Query
        fields = ('download',)
