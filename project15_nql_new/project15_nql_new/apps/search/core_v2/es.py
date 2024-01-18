'''
Description: ES的业务逻辑操作
Autor: liminghong.dev
Date: 2021-09-14 22:15:49
'''
import logging
import traceback

import elasticsearch
from django.db.models import F, Q
from django.db.models.query import QuerySet
from django.utils import timezone
from elasticsearch_dsl import Search, query

from apps.account.models.users import User
from apps.search.core_v2.helps import TemplateIndexHelp, Service
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.storage.models import MaterialCategory, DataMeta, Template

logger = logging.getLogger('django')


def meta_ids_of_query(q, download):
    _query = MultiTemplateQueryFactory.produce(Filter.using_download(q, download))
    es_query = Service.search(index='template_*', _query=_query, _source=['id'], size=100000)
    return [hit['_source']['id'] for hit in es_query['hits']['hits']]


class Filter:
    @staticmethod
    def using_aggregations(dsl, dataset=None):
        dsl['aggs'] = {
            "template": {
                "terms": {
                    "size": 1000,  # TODO es默认不支持精确聚合 默认取各分片topN 之后可能需要用分页修复
                    "field": "template"
                }
            },
            "realname": {
                "terms": {
                    "size": 1000,
                    "field": "realname",
                    "order": {
                        "_term": "desc"
                    }  # 按照字典序排序
                }  # 早起es版本可以用0指定全部 后面无法使用
            },
            "subject": {
                "terms": {
                    "size": 1000,
                    "field": "subject"
                }
            },
            "project": {
                "terms": {
                    "size": 1000,
                    "field": "project",
                }
            },
            "institution": {
                "terms": {
                    "size": 1000,
                    "field": "institution",
                }
            },
            "source": {
                "terms": {
                    "size": 1000,
                    "field": "source",
                }
            },
            "group_by_time": {
                "date_histogram": {
                    "field": "add_time",
                    "format": "yyyy-MM-dd",
                    "interval": "month",
                    "min_doc_count": 0,
                    "time_zone": "+08:00"
                }
            },
            "keywords": {
                "terms": {
                    "field": "keywords"
                }
            }
        }
        if dataset is not None:
            dsl['aggs']["dataset"] = {
                "terms": {
                    "script": "doc['template'].value + '#@#' + doc['title'].value",
                    "size": 200
                }
            }
        return dsl

    @staticmethod
    def using_download(api_query, download):
        meta = api_query.pop('meta', None)
        api_query['meta'] = {
            'and': [{
                'or': [{
                    'and': [{
                        'field': 'template',
                        'op': 'in',
                        'val': download['template']['include']
                    }, {
                        'field': 'id',
                        'op': 'nin',
                        'val': download['data']['exclude']
                    }]
                }, {
                    'field': 'id',
                    'op': 'in',
                    'val': download['data']['include']
                }]
            }]
        }
        if meta:
            api_query['meta']['and'].append(meta)
        return api_query

    @staticmethod
    def private_category(dsl, user):
        qs = MaterialCategory.objects.all().only('id')
        if not user.is_anonymous:
            qs = (qs.filter(is_public=True)
                  | qs.filter(is_public=False).filter(
                        id__in=user.authorized_private_categories.values_list(
                            'category_id', flat=True)))
        else:
            qs = qs.filter(is_public=True)
        available_category_id = list(qs.values_list('id', flat=True))

        can_view = query.Bool(must=query.Terms(category=available_category_id))
        _query = dsl.pop('query', dict())
        dsl['query'] = (Search.from_dict(_query) & can_view).to_dict()
        return dsl

    @staticmethod
    def public_data(dsl, user: User) -> dict:
        subjects_id = list(user.my_subjects.values_list(
            'id', flat=True)) if not user.is_anonymous else []
        projects_id = list(user.my_projects.all().values_list(
            'id', flat=True)) if not user.is_anonymous else []

        user_is_me = query.Term(user=user.username)
        subject_is_public = query.Bool(must=[
            query.Terms(subject=subjects_id),
            query.Term(public_range='subject')
        ])
        project_is_public = query.Bool(must=[
            query.Terms(project=projects_id),
            query.Term(public_range='project')
        ])
        data_is_public = query.Term(public_range='public')

        can_view = user_is_me | subject_is_public | project_is_public | data_is_public
        dsl['query'] = dsl.pop('query', dict())
        dsl['query'] = (Search.from_dict(dsl['query']) & can_view).to_dict()
        return dsl

    @staticmethod
    def review_is_approved(dsl) -> dict:
        can_view = query.Bool(must=query.Term(review_state='approved'))
        dsl['query'] = dsl.pop('query', dict())
        dsl['query'] = (Search.from_dict(dsl['query']) & can_view).to_dict()
        return dsl


class Manager:
    @staticmethod
    def insert(meta_ids: list):
        if not meta_ids:
            return
        _str, template_ids = 'template_id', set()
        page, page_left, page_size = 0, 0, 1000000
        page_right = min(page_size * (page + 1), len(meta_ids))
        while page_left < len(meta_ids):
            qs = DataMeta.objects.filter(id__in=meta_ids[page_left:page_right]).order_by(_str)
            template_ids = set.union(template_ids, set(qs.distinct(_str).values_list(_str, flat=True)))
            page += 1
            page_left = page_size * page
            page_right = min(page_size * (page + 1), len(meta_ids))
        for template_id in template_ids:
            TemplateIndexHelp(template_id).create()

        page, page_left, page_size = 0, 0, 10000
        page_right = min(page_size * (page + 1), len(meta_ids))
        meta_count = len(meta_ids)
        while page_left < meta_count:
            print(f"{page_left}/{meta_count} inserted into ES")
            Manager._insert_meta(meta_ids[page_left:page_right])
            page += 1
            page_left = page_size * page
            page_right = min(page_size * (page + 1), meta_count)

    @staticmethod
    def _insert_meta(ids: list):
        use_bulk = True if len(ids) >= 50 else False
        try:
            datametas = DataMeta.objects.filter(id__in=ids)
            meta_ids = list(datametas.values_list('id', flat=True))
            Service.create_data(meta_ids=meta_ids, use_bulk=use_bulk)
            datametas.update(update_es_time=timezone.now())
        except Exception as e:
            logger.error('_insert_meta:{}'.format(e))

    # 删除索引
    @staticmethod
    def delete_templates(queryset: QuerySet):
        for ins in queryset:
            if type(ins) is Template:
                try:
                    TemplateIndexHelp(ins.id).delete()
                except elasticsearch.exceptions.NotFoundError:
                    pass

    # 删除数据
    @staticmethod
    def delete_datametas(meta_ids: list, template_id='*', opposite=False):
        if len(meta_ids) == 0:
            return

        index = TemplateIndexHelp.to_index_name_by(template_id)
        # 将id成多分，避免ES对于Terms中元素的数量限制(65536)
        meta_ids_list = [
            meta_ids[i:i + 65536] for i in range(0, len(meta_ids), 65536)
        ]
        _query = query.Terms(id=meta_ids_list[0])
        for i in range(1, len(meta_ids_list)):
            _query = _query | query.Terms(id=meta_ids_list[i])
        _query = ~_query if opposite else _query
        Service.delete_by_query(index=index,
                                _query=Search().query(_query).to_dict())

    # 增量更新一个索引下的所有数据
    @staticmethod
    def update_template(template: Template):
        Manager._delete_excess_data(template.id)

        datametas = DataMeta.objects.filter(template_id=template.id,
                                            deleted=False)
        datametas = datametas.filter(
            Q(update_es_time__lt=F('update_time'))
            | Q(update_es_time__isnull=True))
        meta_ids = list(datametas.values_list('id', flat=True))
        Manager.insert(meta_ids)

    # 更新数据的指定字段，但不会修改数据库中的 update_es_time 字段
    @staticmethod
    def update_datameta(datameta: DataMeta, changes: dict):
        index = TemplateIndexHelp.to_index_name_by(datameta.template_id)
        _query = Search().query(query.Term(id=datameta.id)).to_dict()
        _hits = Service.search(index, _query, _source=False)['hits']['hits']
        for hit in _hits:
            Service.update(index=index, id=hit['_id'], _query={'doc': changes})

    # 全量更新一个索引下的所有数据
    @staticmethod
    def insert_template(template: Template):
        Manager.delete_templates(Template.objects.filter(id=template.id))

        datametas = DataMeta.objects.filter(template_id=template.id,
                                            deleted=False)
        meta_ids = list(datametas.values_list('id', flat=True))
        Manager.insert(meta_ids)

    # 删除不在数据库中的datameta
    @staticmethod
    def _delete_excess_data(template_id):
        if not TemplateIndexHelp(template_id).is_exists():
            return
        datametas = DataMeta.objects.filter(template_id=template_id,
                                            deleted=False)
        meta_ids = list(datametas.values_list('id', flat=True))
        Manager.delete_datametas(meta_ids, template_id, opposite=True)

    # 增量更新
    @staticmethod
    def update_all_data():
        Manager._delete_excess_template()
        for template in Template.objects.all():
            try:
                Manager.update_template(template)
            except Exception:
                _e = traceback.format_exc()
                logger.error('update_all_data:{}, template_id:{}'.format(
                    _e, template.id))

    # 删除不在数据库中的template索引
    @staticmethod
    def _delete_excess_template():
        for index_name in TemplateIndexHelp.get_all():
            template_id = TemplateIndexHelp.to_template_id_by(index_name)

            if not index_name.startswith('template_'):
                TemplateIndexHelp(template_id).delete()
            if not Template.objects.filter(id=template_id).exists():
                TemplateIndexHelp(template_id).delete()

    @staticmethod
    def default_search(user, template_id: str, query: dict, dataset=None, **kwargs):
        _query = Filter.using_aggregations(query, dataset)
        if not user.is_superuser:
            _query = Filter.private_category(_query, user)
            _query = Filter.public_data(_query, user)
            _query = Filter.review_is_approved(_query)
        index = TemplateIndexHelp.to_index_name_by(template_id)
        return Service.search(index, _query, **kwargs)

    @staticmethod
    def search_use_download(download: dict, template_id: str, api_query: dict,
                            **kwargs):
        _query = Filter.using_download(api_query, download)
        _query = MultiTemplateQueryFactory.produce(_query)
        index = TemplateIndexHelp.to_index_name_by(template_id)
        return Service.search(index, _query, **kwargs)

    @staticmethod
    def search(contitions: dict, **kwargs):
        _query = Search().query(query.Terms(**contitions)).to_dict()
        return Service.search('template_*', _query, **kwargs)
