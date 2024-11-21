import base64
import binascii
import json

import numpy as np
from django.db.models import Q
from django.shortcuts import reverse

from apps.account.models.users import User
from apps.storage.models.template import Template


def extract_result(hit, value):
    _download = (hit['_source']['id'] in value.download['data']['include'] or
                 (hit['_source']['id'] not in value.download['data']['exclude']
                  and hit['_source']['template']
                  in value.download['template']['include']))
    return dict(
        data=hit['_source'],
        score=hit['_score'],
        download=_download,
    )


class FreeExtractDataset():
    CATEGORY_FIELDS = {'category__id': 'category_id', 'category__name_zh': 'category_name'}
    ALL_TEMPLATE_FIELDS = {'id': 'template_id', 'title': 'template_name', 'user_id': 'user_id',
                           'user__real_name': 'user_real_name', 'category__name_zh': 'category_name'}
    TEMPLATE_FIELDS = {'id': 'template_id', 'title': 'name'}
    USER_FIELDS = {'username': 'user_id', 'real_name': 'real_name'}
    TEMPLATE_USER_INSTITUTION_FIELDS = {'institution': 'institution'}

    SEPERATOR_CHARACTERS = '#@#'

    def __init__(self, buckets: list, aggregate_fields: dict = {}):
        """
        Args:
            buckets: list
                聚合信息buckets,传入参数为aggregations['xxxx']['buckets']
            aggregate_fields: dict
                例如aggregate_fields={'key': 'title'},则返回字段包含title
                例如aggregate_fields={'doc_count': 'num'},则返回字段包含num
        """
        self.buckets = buckets
        for key in aggregate_fields.keys():
            if key not in ['key', 'doc_count']:
                raise ValueError('键值只能为key或者doc_count字段')
        self.aggregate_fields = aggregate_fields
        self.more_keys = []

    def _extract_dataset(self, return_fields: dict = {}, more_params_dict={}, with_dataset_id=True, target='Template'):
        """
        Args:
            return_fields: dict
                自定义返回字段
            with_dataset_id: bool
                是否返回数据集id
            more_params_dict: dict
                是否返回doc_count等更多的参数, 如{'doc_count': ['X', 'X',...]}
        Returns:
        """
        if return_fields == {}:
            return_fields = FreeExtractDataset.ALL_TEMPLATE_FIELDS

        primary_key_list = more_params_dict.pop('primary_key')
        if target == 'Template' or target == 'Category':
            # TODO 可能的待优化
            queryset = Template.objects.filter(id__in=primary_key_list).select_related('category', 'user').order_by(
                'id')
        elif target == 'User':
            queryset = User.objects.filter(Q(username__in=primary_key_list)).order_by('username')
        else:
            raise ValueError('无效的查询')

        queryset = queryset.values(*(return_fields.keys())).distinct()
        res = []
        for index, primary_key in enumerate(primary_key_list):
            _dict = {}
            # 解析返回字段
            try:
                obj = queryset.get(id=primary_key) if target != 'User' else queryset.get(username=primary_key)
            except (Template.DoesNotExist, User.DoesNotExist):
                continue
            for field, value in return_fields.items():
                _dict[value] = obj[field]
            # 解析额外参数
            for key in more_params_dict.keys():
                _dict[key] = more_params_dict[key][index]
            # 解析数据集
            if with_dataset_id:
                _dict['dataset_id'] = base64.b64encode(json.dumps(_dict).encode()).decode()
            if _dict not in res:
                res.append(_dict)

        return res

    def _parse_es_keys(self):
        """
        解析需要返回的es字段
        """
        es_keys = {'primary_key': []}
        if self.aggregate_fields.__contains__('key'):
            es_fields_split_list = self.aggregate_fields['key'].split(',')
            for index, es_fields in enumerate(es_fields_split_list):
                if index > 0:
                    es_keys[es_fields] = []
                    self.more_keys.append(es_fields)
        if self.aggregate_fields.__contains__('doc_count'):
            es_keys[self.aggregate_fields['doc_count']] = []

        return es_keys

    def _sort(self, es_keys):
        """
        按照primary_key排序
        """
        sorted_index = sorted(range(len(es_keys['primary_key'])), key=lambda k: es_keys['primary_key'][k])
        es_keys['primary_key'] = np.array(es_keys['primary_key'])[sorted_index].tolist()
        if self.aggregate_fields.__contains__('doc_count'):
            es_keys[self.aggregate_fields['doc_count']] = np.array(es_keys[self.aggregate_fields['doc_count']])[
                sorted_index].tolist()
        for key in self.more_keys:
            es_keys[key] = np.array(es_keys[key])[sorted_index].tolist()
        return es_keys

    def get(self, return_fields: dict = {}, with_dataset_id=True, target='Template'):
        """
        Args:
            return_fields: dict
                自定义返回字段,参考局部变量的设置,如FreeExtractDataset.ALL_TEMPLATE_FIELDS
            with_dataset_id: bool
                是否返回数据集id
            target: str
                查询的目标,如Template,Category,User等
        Returns:
        """
        if len(self.buckets) == 0:
            return []

        es_keys = self._parse_es_keys()

        # 解析buckets中的字段,如key和doc_count,key可能包含复合关系
        for bucket in self.buckets:
            if self.aggregate_fields.__contains__('doc_count'):
                es_keys[self.aggregate_fields['doc_count']].append(bucket['doc_count'])

            if isinstance(bucket['key'], int):
                es_keys['primary_key'].append(bucket['key'])
            else:
                es_complex_fields_list = str(bucket['key']).split(FreeExtractDataset.SEPERATOR_CHARACTERS)
                for index, field in enumerate(es_complex_fields_list):
                    if index == 0:
                        try:
                            es_keys['primary_key'].append(int(field))
                        except ValueError:
                            es_keys['primary_key'].append(field)
                    else:
                        es_keys[self.more_keys[index - 1]].append(field)

        es_keys = self._sort(es_keys)

        return self._extract_dataset(return_fields, es_keys, with_dataset_id, target)

    def customize_aggregate_info(self):
        """
        用户自定义定制聚合信息返回字段信息，支持按照自定义字段返回数据
        """
        self.buckets = list(filter(lambda x: x['key'] != '', self.buckets))
        buckets = self.buckets.copy()
        for bucket in buckets:
            for old_key in self.aggregate_fields.keys():
                bucket[self.aggregate_fields[old_key]] = bucket.pop(old_key)
        return buckets


def extract_category_and_template(aggregations, value):
    """
    提取材料种类和模板
    """
    template_buckets = dict()
    for template in aggregations['template_id']['buckets']:
        template_buckets[template['key']] = template['doc_count']

    category_of_templates = dict()
    for template_object in Template.objects.filter(id__in=template_buckets.keys()):
        _id, _category_id = template_object.id, template_object.category_id
        if _category_id not in category_of_templates:
            category_of_templates[_category_id] = dict(
                id=_category_id,
                name=template_object.category.name,
                templates=[]
            )
        category_of_templates[_category_id]['templates'].append(
            dict(
                id=_id,
                name=template_object.title,
                url=reverse('api_v2_search:query_template_detail',
                            kwargs={'pk': value.id, 'template_id': _id}),
                count_at_least=template_buckets[_id],
                download=_id in value.download['template']['include']
            )
        )
    for category_id in category_of_templates:
        category_of_templates[category_id]['count_at_least'] = sum(
            [template['count_at_least'] for template in category_of_templates[category_id]['templates']]
        )
    return list(category_of_templates.values())


def extract_summary(aggregations, value):
    """
    提取更详细的数据聚合信息
    """
    return dict(
        category=extract_category_and_template(aggregations, value),
        real_name=aggregations.get('real_name', {}).get('buckets', []),
        template=aggregations.get('template', {}).get('buckets', []),
        subject=aggregations.get('subject', {}).get('buckets', []),
        project=aggregations.get('project', {}).get('buckets', []),
        source=aggregations.get('source', {}).get('buckets', []),
        group_by_time=aggregations.get('group_by_time', {}).get('buckets', []),
        keywords=aggregations.get('keywords', {}).get('buckets', []),
    )


def extract_source_fields(request, field):
    if request.query_params.get(field) is None:
        return []
    try:
        binary = base64.b64decode(request.query_params.get(field).replace('.', '/').replace('-', '+').encode('utf-8'))
    except binascii.Error:
        raise ValueError('Wrong base 64 with parameter {}'.format(field))
    try:
        fields = json.loads(binary)
    except Exception:
        raise ValueError('Wrong list format, note that json string '
                         'must use double quotes -> " with parameter {}'.format(field))
    return fields


def extract_paging_params_from_request(request):
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    return page, page_size


def extract_params_from_request(request):
    page, page_size = extract_paging_params_from_request(request)
    return_meta_fields = extract_source_fields(request, 'return_meta[]')
    if len(return_meta_fields) == 0:
        return_meta_fields = ['id', 'template', 'template_name', 'category', 'category_name',
                              'abstract', 'doi', 'subject', 'project',
                              'title', 'add_time', 'user', 'real_name',
                              ]
    for field in ('id', 'template'):
        if field not in return_meta_fields:
            return_meta_fields.append(field)

    return_fields = return_meta_fields
    return page, page_size, return_fields
