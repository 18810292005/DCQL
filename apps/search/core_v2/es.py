'''
Description: ES的业务逻辑操作
Autor: liminghong.dev
Date: 2021-09-14 22:15:49
'''
import logging
from dataclasses import dataclass

from django.conf import settings
from elasticsearch.helpers import bulk
from elasticsearch_dsl import Search, query, connections

from apps.account.models.users import User, UserRole
from apps.search.core_v2.helps import Service
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.storage.docs import DataContent
from apps.storage.models.data import DataMeta, DataVisibility, DataReviewState
from apps.storage.models.material import ProjectSubjectMember
from apps.storage.models.template import Template
from mgedata.errors.models import MGEError

logger = logging.getLogger('django')


def meta_ids_of_query(q, download):
    _query = MultiTemplateQueryFactory.produce(Filter.using_download(q, download))
    es_query = Service.search(index=settings.ES_INDEX_NAME, _query=_query, _source=['id'], size=10000)
    return [hit['_source']['id'] for hit in es_query['hits']['hits']]


class Filter:
    @staticmethod
    def using_aggregations(dsl, dataset=None):
        dsl['aggs'] = {
            "template_id": {
                "terms": {
                    "size": 50,  # TODO es默认不支持精确聚合 默认取各分片topN 之后可能需要用分页修复
                    "field": "template_id"
                }
            },
            "real_name": {
                "terms": {
                    "size": 50,
                    "field": "real_name",
                }
            },
            "subject": {
                "terms": {
                    "size": 50,
                    "field": "subject"
                }
            },
            "project": {
                "terms": {
                    "size": 50,
                    "field": "project",
                }
            },
            "institution": {
                "terms": {
                    "size": 50,
                    "field": "institution",
                }
            },
            "group_by_time": {
                "date_histogram": {
                    "field": "add_time",
                    "format": "yyyy-MM-dd",
                    "calendar_interval": "month",
                    "min_doc_count": 0,
                    "time_zone": "+08:00"
                }
            },
            "keywords": {
                "terms": {
                    "size": 50,
                    "field": "keywords"
                }
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
                        'field': 'template_id',
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
    def filter_visibility(dsl, user: User, template_id=None) -> dict:
        my = query.Term(user=user.username)
        if user.role == UserRole.ROOT:
            can_view = query.Terms(
                visibility=[
                    DataVisibility.PUBLIC.value,
                    DataVisibility.PROJECT.value,
                    DataVisibility.SUBJECT.value
                ]
            )
        else:
            _list = list(ProjectSubjectMember.objects.filter(user=user).values_list(
                'project_id', 'subject_id')
            )
            p_list = [i[0] for i in _list if i[0]]
            s_list = [i[1] for i in _list if i[1]]
            projects_id = list(set(p_list))
            subjects_id = list(set(s_list))

            my = query.Term(user=user.username)
            subject = query.Bool(must=[
                query.Terms(subject_id=subjects_id),
                query.Term(visibility=DataVisibility.SUBJECT.value)
            ])
            project = query.Bool(must=[
                query.Terms(project_id=projects_id),
                query.Term(visibility=DataVisibility.PROJECT.value)
            ])
            public = query.Term(visibility=DataVisibility.PUBLIC.value)

            can_view = subject | project | public
        can_view = can_view & query.Term(review_state=DataReviewState.APPROVED)
        dsl['query'] = dsl.pop('query', dict())
        if template_id:
            final_query = Search.from_dict(dsl['query']) & (can_view | my) & query.Term(template_id=template_id)
        else:
            final_query = Search.from_dict(dsl['query']) & (can_view | my)
        dsl['query'] = final_query.to_dict()
        return dsl


class Manager:

    @staticmethod
    def default_search(user, template_id: str, query: dict, dataset=None, another_template_id=None, **kwargs):
        _query = Filter.using_aggregations(query, dataset)
        _query = Filter.filter_visibility(_query, user, another_template_id)
        return Service.search(settings.ES_INDEX_NAME, _query, **kwargs)

    @staticmethod
    def search_use_download(download: dict, template_id: str, api_query: dict,
                            **kwargs):
        _query = Filter.using_download(api_query, download)
        _query = MultiTemplateQueryFactory.produce(_query)
        return Service.search(settings.ES_INDEX_NAME, _query, **kwargs)


@dataclass
class ESDoc:
    _id: int
    doc: dict


def _transform_data_to_es(meta: DataMeta, template: Template, content: DataContent | dict):
    if isinstance(content, DataContent):
        data_content = content.data
    elif isinstance(content, dict):
        data_content = content
    else:
        raise TypeError("content must be DataContent or dict")

    tokens = []
    tokens = []
    meta_doc = {
        "title": meta.title,
        "keywords": meta.keywords,
        "abstract": meta.abstract,
        "project": meta.project.description,
        "subject": meta.subject.description,
        "category": meta.category.name_zh,
        "template": template.title,
        "user": meta.user.username,
        "real_name": meta.user.real_name,
        "add_time": meta.add_time.strftime('%Y-%m-%d'),
    }

    def _recursive(cur_data, no_keys):
        if isinstance(cur_data, list):
            for i in cur_data:
                _recursive(i, no_keys)
        elif isinstance(cur_data, dict):
            if 'val' in cur_data and 'err' in cur_data:
                val = cur_data['val']
                err = cur_data['err']
                tokens.append(f'{val}±{err}')
            elif 'lb' in cur_data and 'ub' in cur_data:
                lb = cur_data['lb']
                ub = cur_data['ub']
                tokens.append(f'({lb},{ub})')
            else:
                for k, v in cur_data.items():
                    if not no_keys:
                        tokens.append(k)
                    _recursive(v, no_keys)
        elif '_fs/' not in (val := str(cur_data)):
            tokens.append(val)

    _recursive(meta_doc, no_keys=True)
    meta_doc.update({
        "id": meta.pk,
        "visibility": meta.visibility,
        "template_id": template.id,
        "category_id": meta.category_id,
        "project_id": meta.project_id,
        "subject_id": meta.subject_id,
        'review_state': meta.review_state
    })
    _recursive(data_content, no_keys=False)
    doc = {**meta_doc, "summary": tokens}

    return ESDoc(
        _id=meta.pk,
        doc=doc,
    )


def _insert_to_es(doc_list: list[ESDoc]):
    cli = connections.get_connection()

    def upsert(doc: ESDoc):
        insert = {
            '_id': doc._id,
            '_source': doc.doc,
            'doc_as_upsert': True,
            '_index': settings.ES_INDEX_NAME,
        }
        return insert

    bulk(cli, (upsert(d) for d in doc_list))
    # for doc in doc_list:
    #     cli.update(
    #         index=settings.ES_INDEX_NAME,
    #         id=doc._id,
    #         doc_as_upsert=True,
    #         doc=doc.doc,
    #     )


def update_field(meta_id_list: list[int], field: str, value):
    cli = connections.get_connection()
    res = cli.update_by_query(
        index=settings.ES_INDEX_NAME,
        body={
            "query": {
                "terms": {
                    "_id": meta_id_list
                }
            },
            "script": {
                "source": f"ctx._source.{field} = params.value",
                "params": {
                    "value": value
                }
            }
        }
    )
    if res['updated'] != len(meta_id_list):
        raise MGEError.DATA_INCONSISTENCY("ES更新失败")


def insert_meta_with_meta_doc_pairs(meta_doc_pairs: list[tuple[DataMeta, DataContent | dict]]):
    meta_ids = [meta.id for meta, _ in meta_doc_pairs]
    meta_list = DataMeta.objects.filter(
        id__in=meta_ids
    ).select_related(
        'template', 'category', 'subject', 'project'
    )
    template_ids = list(set(meta.template_id for meta in meta_list))
    if len(template_ids) > 1:
        raise MGEError.ONE_TEMPLATE_ONLY
    if len(template_ids) > settings.MAX_NUM_OF_IMPORT:
        raise MGEError.TOO_MANY_DATA

    es_docs = []
    for meta, content in meta_doc_pairs:
        es_doc = _transform_data_to_es(meta, meta.template, content)
        es_docs.append(es_doc)

    _insert_to_es(es_docs)


def insert_meta_with_ids(meta_ids: list[int]):
    meta_list = DataMeta.objects.filter(
        id__in=meta_ids
    ).select_related(
        'template', 'category', 'subject', 'project', 'user'
    ).defer('template__content')
    template_ids = list(set(meta.template_id for meta in meta_list))
    if len(template_ids) > 1:
        raise MGEError.ONE_TEMPLATE_ONLY
    if len(template_ids) > settings.MAX_NUM_OF_IMPORT:
        raise MGEError.TOO_MANY_DATA

    doc_list = DataContent.objects(_meta_id__in=meta_ids)
    meta_id_doc_map = {doc._meta_id: doc for doc in doc_list}
    es_docs = []
    for meta in meta_list:
        doc = meta_id_doc_map.get(meta.id)
        if doc is None:
            raise MGEError.NOT_FOUND(f"数据存在不一致，请联系管理员(id={meta.id})")
        es_doc = _transform_data_to_es(meta, meta.template, doc)
        es_docs.append(es_doc)

    _insert_to_es(es_docs)


def delete_meta_with_ids(meta_ids: list[int]):
    cli = connections.get_connection()
    batch_size = 65535
    for i in range(0, len(meta_ids), batch_size):
        cli.delete_by_query(
            index=settings.ES_INDEX_NAME,
            body={
                "query": {
                    "terms": {
                        "id": meta_ids[i:i + batch_size]
                    }
                }
            }
        )
