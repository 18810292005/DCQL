import re
from typing import Dict
from django.shortcuts import reverse
from django.http.request import HttpRequest
import json, requests, copy
from rest_framework import views, viewsets, generics, mixins, response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from elasticsearch.exceptions import TransportError
from mgedata.utils.general import get_json_field_r, MGEError, json_response
from apps.search.models import Query
from apps.search.apis.v2.serialzers import QueryModelSerializer, QueryDownloadSerializer
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.search.core_v2.cache import set_list_cache, get_list_cache
from apps.search.core_v2.es import Manager
from apps.search.apis.v2.util import extract_result, extract_params_from_request, extract_paging_params_from_request
import logging

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
                size=page_size)

            results = [extract_result(hit, query_ins) for hit in es_query['hits']['hits']]
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


def field_changer(q : dict):
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
        q["field"] = q["field"][number+1:]
        return q["field"]


def query_changer(q : dict):
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
            for j,k in b.items():
                q[j] = k
        else:
            pass


def convert_query(request: HttpRequest):
    '''
    仅仅！针对南大通用进行的查询结构调整
    '''
    q = get_json_field_r(request, 'q', required_type=Dict)
    data = q["data"]
    template_q = data[0]["q"]

    query_changer(template_q)
    if "and" or "or" not in q["data"][0]["q"]:
        # 如果结果是单字段结构则要加上“and”或“or”
        cy = copy.deepcopy(q["data"][0]["q"])

        q["data"][0]["q"].clear()

        q["data"][0]["q"]["and"] = [cy]
    end = {}
    end["q"] = q
    end = json.dumps(end,ensure_ascii=False)
    end = end.encode("utf-8")
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url='http://nmdms.ustb.edu.cn/mgeAnalysis/mgeAnalysisInterfaceController/analysisSql', headers=headers, data=end)
    dict_end = json.loads(response.text)
    data_end = {}
    data_end["data"] = dict_end["data"]

    return json_response(data=data_end)
