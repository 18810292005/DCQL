import binascii
import hashlib
import json
from base64 import b64decode

from django.core.cache import cache
from enum import Enum

from apps.search.apis.v2.util import FreeExtractDataset, extract_result
from apps.search.core_v2.es import Manager
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.search.models import Query
from mgedata.errors.models import MGEError


def decode_query(query_str: str) -> dict:
    try:
        query_decoded = b64decode(query_str)
        return json.loads(query_decoded.decode())
    except (binascii.Error, UnicodeError, json.JSONDecodeError):
        raise MGEError.INVALID_QUERY


def set_memcached(key, value, expired_in=60 * 60):
    md5 = hashlib.md5()
    md5.update(key)
    cache.set(md5.hexdigest(), value, expired_in)


def get_memcached(key):
    md5 = hashlib.md5()
    md5.update(key)
    return cache.get(md5.hexdigest())


def get_memcached_key(user, other_param={}):
    key = 'MGE_QUERY_NXP_RAW_KEY_'
    try:
        key = key + 'user:' + str(user.username)
    except:
        pass
    for k, value in other_param.items():
        key = f'{key}_{k}:{value}'
    return key.encode('utf8')


class SubQueryField(Enum):
    """
    将检索的查询,转换成ES格式
    """
    CATEGORY_ID = 'category_id'
    PROJECT_ID = 'project_id'
    SUBJECT_ID = 'subject_id'
    TEMPLATE_ID = 'template_id'
    ADD_TIME_LB = 'add_time_lb'
    ADD_TIME_UB = 'add_time_ub'
    AUTHOR_INS = 'author_ins'

    def to_sql_field(self):
        if self == SubQueryField.ADD_TIME_LB:
            return 'add_time__gte'
        elif self == SubQueryField.ADD_TIME_UB:
            return 'add_time__lte'
        elif self == SubQueryField.AUTHOR_INS:
            return 'user__institution'
        elif self == SubQueryField.PROJECT_ID:
            return 'project'
        elif self == SubQueryField.SUBJECT_ID:
            return 'subject'
        elif self == SubQueryField.TEMPLATE_ID:
            return 'template'
        return self.value


class EsQueryField:
    META_FIELD = ['abstract', 'institution', 'author_institution', 'category', 'category_name', 'project', 'subject']
    DATA_FIELD = ['template', 'template_id']
    ADD_TIME = ['add_time__lte', 'add_time__gte']
    TEXT_FIELD = ['text']
    AUTHOR_FIELD = ['author', 'user_id', 'user']
    # 检索title就不能包含text,不然查不到结果.
    ATOMIC_OP = ['title']


class ConstructEsQuery:

    @staticmethod
    def single_meta(field, value, op='contains'):
        return {
            'field': field,
            'val': value,
            'op': op
        }

    @staticmethod
    def multiple_meta(field, value, condition, op='contains'):
        return {
            condition: [{
                'field': field,
                'val': value,
                'op': op
            }]
        }

    def construct_meta(self, field: str, value, op='contains'):
        res = []
        if field is None:
            return res
        elif isinstance(value, str):
            res.append(self.single_meta(field, value, op))
        elif isinstance(value, list):
            # 多个值，解析成or条件
            for v in value:
                if len(res) == 0:
                    meta = self.single_meta(field, v, op)
                else:
                    meta = self.multiple_meta(field, v, 'or')
                res.append(meta)
            res = [{'or': res}]
        return res

    @staticmethod
    def single_data(tid_list):
        res = []
        if isinstance(tid_list, int):
            tid_list = [tid_list]
        for tid in tid_list:
            res.append({
                "tid": tid,
                "q": {
                    "and": []
                }
            })
        return res

    def construct_es_query(self, sub_query_dict: dict):
        """
        遍历请求的参数,构造es查询格式
        sub_query_dict: dict
            子查询模式,例如{"template": [1,2,3], "text": [2], "title": [2,3,4],...}
        """
        es_query = {'text': None, 'meta': {'and': []}, 'data': []}
        for key in sub_query_dict.keys():
            value = sub_query_dict[key]
            if value is None:
                continue
            if key in EsQueryField.TEXT_FIELD:
                es_query['text'] = value[0] if isinstance(value, list) else value
            elif key in EsQueryField.DATA_FIELD:
                es_query['data'].extend(self.single_data(value))
            elif key in EsQueryField.META_FIELD:
                es_query['meta']['and'].extend(self.construct_meta(key, value))
            elif key in EsQueryField.ATOMIC_OP:
                es_query['meta']['and'].extend(self.construct_meta(key, value))
            elif key in EsQueryField.AUTHOR_FIELD:
                es_query['meta']['and'].extend(self.construct_meta('user', value))
            elif key in EsQueryField.ADD_TIME:
                es_query['meta']['and'].extend(self.construct_meta(key, value, key.split('__')[1]))
            else:
                pass
        # 如果包含title等,就不能有text
        for v in EsQueryField.ATOMIC_OP:
            if v in sub_query_dict.keys():
                es_query.pop('text', None)
                break
        return MultiTemplateQueryFactory.produce(es_query)


def es_query(user, sub_query=None, es_query_id=None, page_size=1):
    model_query = Query.objects.filter(id=es_query_id).first()
    if model_query:
        if sub_query == model_query.q['sub_query']:
            return model_query, model_query.q['summary']
        # 上次查询的条件与这次查询条件合并
        sub_query.update(model_query.q['sub_query'])

    download = {
        "data": {"include": [], "exclude": []},
        "template": {"include": []}
    }
    es_query_content = Manager.default_search(
        user=user, template_id='*', dataset=True,
        query=ConstructEsQuery().construct_es_query(sub_query),
        _source=['id', 'template'], from_=0, size=page_size)

    q = {'sub_query': sub_query, 'summary': es_query_content}
    model_query, _ = Query.objects.get_or_create(download=download, q=q)
    return model_query, es_query_content


def query(user, sub_query=None, es_query_id=None, with_template=None, with_category=None, only_in_cached=False):
    params = {'sub_query': sub_query, 'es_query_id': es_query_id,
              'with_template': with_template, 'with_category': with_category}
    mc_key = get_memcached_key(user, params)
    print(mc_key)
    if get_memcached(mc_key) is not None:
        return get_memcached(mc_key)
    if only_in_cached is True:
        return None, None, None
    model_query, es_query_content = es_query(user, sub_query, es_query_id)

    if with_template:
        buckets = es_query_content['aggregations']['template']['buckets']
        results = FreeExtractDataset(buckets, {'doc_count': 'num_data'}).get()
    else:
        buckets = es_query_content['aggregations']['dataset']['buckets']
        results = FreeExtractDataset(buckets, {'doc_count': 'num_data', 'key': 'id,dataset_name'}).get()
    if with_category:
        buckets = es_query_content['aggregations']['template']['buckets']
        with_category = FreeExtractDataset(buckets).get(FreeExtractDataset.CATEGORY_FIELDS, False)

    set_memcached(mc_key, [model_query.id, results, with_category])
    return model_query.id, results, with_category


def aggregate(q):
    """
    将聚合信息返回
    """
    aggregate_info = {
        'authors': [],
        'templates': [],
        'data_institutions': [],
        'author_institutions': [],
        'projects': [],
        'subjects': []
    }
    es_aggregations = q['summary']['aggregations']
    for key in es_aggregations.keys():
        buckets = es_aggregations[key]['buckets']
        if key == 'template':
            aggregate_info['templates'] = FreeExtractDataset(buckets, {'doc_count': 'num'}).get(
                FreeExtractDataset.TEMPLATE_FIELDS, False)
        elif key == 'realname':
            # 数据作者
            aggregate_info['authors'] = FreeExtractDataset(buckets, {'doc_count': 'num'}).get(
                FreeExtractDataset.USER_FIELDS, False, 'User')
            aggregate_info['author_institutions'] = FreeExtractDataset(buckets, {'doc_count': 'num'}).get(
                FreeExtractDataset.TEMPLATE_USER_INSTITUTION_FIELDS, False, 'User')
        elif key == 'project':
            aggregate_info['projects'] = FreeExtractDataset(buckets, {'key': 'project_id',
                                                                      'doc_count': 'num'}).customize_aggregate_info()
        elif key == 'subject':
            aggregate_info['subjects'] = FreeExtractDataset(buckets, {'key': 'subject_id',
                                                                      'doc_count': 'num'}).customize_aggregate_info()
        elif key == 'institution':
            aggregate_info['data_institutions'] = FreeExtractDataset(buckets, {'key': 'institution',
                                                                               'doc_count': 'num'}).customize_aggregate_info()
    return aggregate_info


def get_dataset(user, q: dict, dataset_id: str, count=-1, use_cache=True):
    """
    根据query_id先获取先前数据集的查询条件,然后再去请求相应的数据id
    """
    dataset_content = decode_query(dataset_id)
    dataset_content.update(q['sub_query'])
    # dataset_content里的为模板作者,这里查询的是数据的作者,所以不需要
    dataset_content.pop('user_id', None)
    dataset_content.pop('user_real_name', None)
    num_data = dataset_content.pop('num_data', 1)
    if count >= 0:
        num_data = count
    mc_key = None
    if use_cache:
        mc_key = get_memcached_key(user, {'dataset_id': dataset_id})
        if get_memcached(mc_key) is not None:
            return get_memcached(mc_key)
    model_query, es_query_content = es_query(user, dataset_content, page_size=num_data)
    data = [extract_result(hit, model_query)['data']['id'] for hit in es_query_content['hits']['hits']]
    if use_cache:
        set_memcached(mc_key, data)
    return data
