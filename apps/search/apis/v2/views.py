import json
import logging

import pytz
from django.conf import settings
from django.core.paginator import Paginator
from django.http.request import HttpRequest
from django.shortcuts import reverse
from elasticsearch.exceptions import TransportError
from rest_framework import views, viewsets, generics, mixins, response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from apps.search.apis.v2.serialzers import QueryModelSerializer, QueryDownloadSerializer
from apps.search.apis.v2.util import extract_result, extract_params_from_request, extract_paging_params_from_request
from apps.search.core_v2.cache import set_list_cache, get_list_cache
from apps.search.core_v2.es import Manager
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.search.models import Query
from apps.storage.models import DataMeta
from apps.storage.models.material import Category, CategoryTree
from mgedata.utils.general import get_json_field_r, MGEError, get_param, json_response

logger = logging.getLogger('django')


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class QueryList(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                viewsets.GenericViewSet):
    serializer_class = QueryModelSerializer
    queryset = Query.objects.all()
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def create(self, request, *args, **kwargs):
        easy = get_param("easy", allow_none=True, convert_to=int, default=None)
        page = get_param("page", allow_none=True, convert_to=int, default=None)
        page_size = get_param("page_size", allow_none=True, convert_to=int, default=None)
        if easy:
            text = get_json_field_r(request, 'text', allow_none=True, required_type=str, default=None)
            category = get_json_field_r(request, 'category', allow_none=True, required_type=list, default=None)
            real_name = get_json_field_r(request, 'real_name', allow_none=True, required_type=list, default=None)
            keywords = get_json_field_r(request, 'keywords', allow_none=True, required_type=list, default=None)
            title = get_json_field_r(request, 'title', allow_none=True, required_type=list, default=None)
            abstract = get_json_field_r(request, 'abstract', allow_none=True, required_type=list, default=None)
            request_data = request.data.copy()
            if text:
                q = {"text": text, "meta": {"and": []}}
            else:
                q = {"meta": {"and": []}}
            if category:
                category = [int(c) for c in category]
                if len(category) == 1:
                    temp = {"field": "category", "val": category[0], "op": "eq"}
                    q["meta"]["and"].append({"and": [temp]})
                elif len(category) > 1:
                    c_temp = []
                    for c in category:
                        temp = {"field": "category", "val": c, "op": "eq"}
                        c_temp.append(temp)
                    q["meta"]["and"].append({"or": c_temp})
            if real_name:
                real_name = [str(r) for r in real_name]
                if len(real_name) == 1:
                    temp = {"field": "real_name", "val": real_name[0], "op": "eq"}
                    q["meta"]["and"].append({"and": [temp]})
                elif len(real_name) > 1:
                    r_temp = []
                    for r in real_name:
                        temp = {"field": "real_name", "val": r, "op": "eq"}
                        r_temp.append(temp)
                    q["meta"]["and"].append({"or": r_temp})
            if keywords:
                keywords = [str(k) for k in keywords]
                if len(keywords) == 1:
                    temp = {"field": "keywords", "val": keywords[0], "op": "eq"}
                    q["meta"]["and"].append({"and": [temp]})
                elif len(keywords) > 1:
                    k_temp = []
                    for k in keywords:
                        temp = {"field": "keywords", "val": k, "op": "eq"}
                        k_temp.append(temp)
                    q["meta"]["and"].append({"or": k_temp})
            if title:
                title = [str(t) for t in title]
                if len(title) == 1:
                    temp = {"field": "title", "val": title[0], "op": "contains"}
                    q["meta"]["and"].append({"and": [temp]})
                elif len(title) > 1:
                    title_temp = []
                    for t in title:
                        temp = {"field": "title", "val": t, "op": "contains"}
                        title_temp.append(temp)
                    q["meta"]["and"].append({"or": title_temp})
            if abstract:
                abstract = [str(a) for a in abstract]
                if len(abstract) == 1:
                    temp = {"field": "abstract", "val": abstract[0], "op": "contains"}
                    q["meta"]["and"].append({"and": [temp]})
                elif len(abstract) > 1:
                    abstract_temp = []
                    for a in abstract:
                        temp = {"field": "abstract", "val": a, "op": "contains"}
                        abstract_temp.append(temp)
                    q["meta"]["and"].append({"or": abstract_temp})
            print(q)
            request_data['q'] = q
            request.data.update(request_data)
            request.data['username'] = None if request.user.is_anonymous else request.user.username
            result = super(QueryList, self).create(request, args, kwargs)
            template_candidates = result.data['q']['summary']['category']
            category_candidates = result.data['q']['summary']['category']
            real_name_candidates = result.data['q']['summary']['real_name']
            keywords_candidates = result.data['q']['summary']['keywords']
            template_result = []
            category_result = []
            real_name_result = []
            keywords_result = []
            for cat in template_candidates:
                for t in cat['templates']:
                    template_result.append({"category_id": cat['id'], "category_name": cat['name'],
                                            "template_id": t["id"], "template_name": t['name'],
                                            "url": t["url"], "count_at_least": t["count_at_least"],
                                            "download": t["download"]})
            for c in category_candidates:
                category_result.append({"id": c["id"], "name": c["name"], "count_at_least": c["count_at_least"]})
            for r in real_name_candidates:
                real_name_result.append({"real_name": r["key"], "doc_count": r["doc_count"]})
            for k in keywords_candidates:
                keywords_result.append({"keywords": k["key"], "doc_count": k["doc_count"]})
            v, categories = CategoryTree.get_tree()
            category_result = build_hierarchy(categories, category_result)
            result_new = {}
            result_new['templates_result'] = template_result
            result_new["category_result"] = category_result
            result_new["real_name_result"] = real_name_result
            result_new["keywords_result"] = keywords_result
            if page and page_size:
                paginator = Paginator(template_result, page_size)
                page_obj = list(paginator.get_page(page))
                result_new['templates_result'] = page_obj
            result_new["id"] = result.data["id"]
            result_new["total_templates"] = len(template_result)
            result_new["page"] = page
            result_new["page_size"] = page_size
            return json_response(result_new)
        else:
            request.data['username'] = None if request.user.is_anonymous else request.user.username
            return super(QueryList, self).create(request, args, kwargs)


class QueryDetail(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  generics.GenericAPIView):
    queryset = Query.objects.all()
    serializer_class = QueryModelSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, args, kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, args, kwargs)

    def patch(self, request, *args, **kwargs):
        q = self.get_object().q
        patch = request.data['q']
        for field in patch:
            q[field] = patch[field]
        request.data['q'] = q
        return self.update(request, args, kwargs)


class QueryDetails(views.APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def get_object(self, pk):
        try:
            return Query.objects.get(pk=pk)
        except Query.DoesNotExist:
            raise MGEError.NOT_FOUND

    def get(self, request: HttpRequest, pk: int, key: str):
        try:
            page, page_size, return_fields = extract_params_from_request(request)
            query = {'query': {'terms': {'id': get_list_cache(key)}}}
            es_query = Manager.default_search(
                user=request.user,
                template_id='*',
                query=query,
                _source=return_fields,
                from_=(page - 1) * page_size,
                size=page_size)

            query_ins = self.get_object(pk)
            results = [
                extract_result(hit, query_ins)
                for hit in es_query['hits']['hits']
            ]
            return response.Response(
                dict(total=es_query['hits']['total']['value'],
                     data=results,
                     page=page,
                     page_size=page_size))
        except (ValueError, KeyError, TypeError, TransportError) as e:
            raise MGEError.BAD_REQUEST(str(e))

    # 传入id list,返回对应的缓存key
    def post(self, request: HttpRequest):
        ids = get_json_field_r(request, 'ids', list)
        unique_key = set_list_cache(ids)
        return response.Response(dict(key=unique_key))


class QueryTemplateDetail(views.APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def get_object(self, pk):
        try:
            return Query.objects.get(pk=pk)
        except Query.DoesNotExist:
            raise MGEError.NOT_FOUND

    def get(self, request, pk, template_id):
        try:
            page, page_size, return_fields = extract_params_from_request(request)
            query_ins = self.get_object(pk)
            template_query = dict(
                meta=query_ins.q.get('meta'),
                text=query_ins.q.get('text'),
                data=[
                    x for x in query_ins.q.get('data', []) or []
                    if x['tid'] == template_id
                ])

            es_query = Manager.default_search(
                user=request.user,
                template_id=str(template_id),
                query=MultiTemplateQueryFactory.produce(template_query),
                _source=return_fields,
                from_=(page - 1) * page_size,
                another_template_id=template_id,
                size=page_size)

            results = [extract_result(hit, query_ins) for hit in es_query['hits']['hits']]
            for idx in range(len(results)):
                results[idx]["data"]["add_time"] = DataMeta.objects.get(pk=results[idx]["data"]["id"]).add_time.astimezone(pytz.timezone(settings.TIME_ZONE)).strftime('%Y-%m-%d %H:%M:%S')
            return response.Response(dict(
                total=es_query['hits']['total']['value'],
                data=results,
                page=page,
                page_size=page_size))
        except (ValueError, KeyError, TypeError, TransportError) as e:
            raise MGEError.BAD_REQUEST(str(e))


class QueryDownload(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    viewsets.GenericViewSet):
    queryset = Query.objects.all()
    serializer_class = QueryDownloadSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def put(self, request, *args, **kwargs):
        return super(QueryDownload, self).update(request, args, kwargs)

    def patch(self, request, *args, **kwargs):
        download = self.get_object().download
        if 'download' not in request.data:
            raise MGEError.BAD_DATA('`download` must in request data')

        patch = request.data['download']
        for data_include in patch.get('data', {}).get('include', []):
            if data_include in download['data']['exclude']:
                download['data']['exclude'].remove(data_include)
            if data_include not in download['data']['include']:
                download['data']['include'].append(data_include)
        for data_exclude in patch.get('data', {}).get('exclude', []):
            if data_exclude in download['data']['include']:
                download['data']['include'].remove(data_exclude)
            if data_exclude not in download['data']['exclude']:
                download['data']['exclude'].append(data_exclude)
        for template_include in patch.get('template', {}).get('include', []):
            if template_include not in download['template']['include']:
                download['template']['include'].append(template_include)
        for template_exclude in patch.get('template', {}).get('exclude', []):
            if template_exclude in download['template']['include']:
                download['template']['include'].remove(template_exclude)
        request.data['download'] = download
        return self.put(request, args, kwargs)


class QueryDownloadTemplate(views.APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    permission_classes = ()

    def get_object(self, pk):
        try:
            return Query.objects.get(pk=pk)
        except Query.DoesNotExist:
            raise MGEError.NOT_FOUND

    def get(self, request, pk, template_id):
        try:
            page, page_size = extract_paging_params_from_request(request)
            query_ins = self.get_object(pk)
            template_query = dict(
                meta=query_ins.q.get('meta'),
                text=query_ins.q.get('text'),
                data=[
                    x for x in query_ins.q.get('data', []) or []
                    if x['tid'] == template_id
                ])

            es_query = Manager.search_use_download(
                download=query_ins.download,
                template_id=str(template_id),
                api_query=template_query,
                _source=['title', 'id'],
                from_=(page - 1) * page_size,
                size=page_size)
            results = [hit['_source'] for hit in es_query['hits']['hits']]
            if page_size * (page + 1) < es_query['hits']['total']['value']:
                next_url = reverse('api_v2_search:query_download_template',
                                   args=(pk, template_id)) + f'?page={page + 1}'
            else:
                next_url = None

            return response.Response(dict(
                total=es_query['hits']['total']['value'],
                data=results,
                page=page,
                page_size=page_size,
                next_url=next_url))
        except (ValueError, KeyError, TypeError, TransportError) as e:
            raise MGEError.BAD_REQUEST(str(e))


def field_changer(q: dict):
    """
    用于去掉表格型field中"."前面的内容
    """
    if "and" in q:
        for i in range(len(q["and"])):
            field_changer(q["and"][i])
    elif "or" in q:
        for i in range(len(q["or"])):
            field_changer(q["or"][i])
    else:
        number = q["field"].find(".")
        q["field"] = q["field"][number + 1:]
        return q["field"]


def query_changer(q: dict):
    """
    改变查询结构
    """
    if "and" in q:
        for i in range(len(q["and"])):
            query_changer(q["and"][i])
    elif "or" in q:
        for i in range(len(q["or"])):
            query_changer(q["or"][i])
    else:
        if q["op"] == "all":
            field_changer(q['val'])
            b = q['val']
            q.clear()
            for j, k in b.items():
                q[j] = k
        else:
            pass


def build_hierarchy(categories, category_result):
    result_dict = {item['id']: item for item in category_result}

    def add_children(category):
        if category['id'] in result_dict:
            new_category = {
                'id': category['id'],
                'name': category['name'],
                'count_at_least': result_dict[category['id']]['count_at_least'],
                'children': []
            }
            for child in category['children']:
                child_result = add_children(child)
                if child_result:
                    new_category['children'].append(child_result)
            return new_category
        else:
            children = []
            for child in category['children']:
                child_result = add_children(child)
                if child_result:
                    children.append(child_result)
            if children:
                return {
                    'id': category['id'],
                    'name': category['name'],
                    'children': children
                }
            else:
                return None

    result_hierarchy = []
    for category in categories:
        new_category = add_children(category)
        if new_category:
            result_hierarchy.append(new_category)

    return result_hierarchy
