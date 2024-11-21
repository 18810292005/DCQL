from django.core.paginator import PageNotAnInteger, EmptyPage, Paginator
from django.views import View

from apps.search.models import Query
from apps.search.nxp import nxp
from apps.storage.models.data import DataMeta
from mgedata.errors.models import MGEError
from mgedata.utils.general import HttpRequest, get_json_field_r, require_POST_api, get_param
from mgedata.utils.general import require_GET_api, json_response


def extract_params_from_request(request):
    res = {}
    for field in nxp.SubQueryField:
        value = request.GET.getlist(field.value)
        if value:
            res[nxp.SubQueryField(field.value).to_sql_field()] = value
    return res


def nxp_paginator(data, page=1, page_size=10):
    paginator = Paginator(data, page_size)
    try:
        res = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        raise MGEError.NOT_FOUND
    return list(res), paginator.num_pages, paginator.count


@require_POST_api
def new_query(request: HttpRequest):
    """
    Returns:
        query_id: 查询id
        categories: 材料信息
        datasets: 数据集信息
        page_size: 页大小
        num: 页数
    """
    query_type = get_json_field_r(request, 'type', allowed=[
        'text', 'title', 'author', 'abstract', 'institution', 'author_institution'
    ])
    query_value = get_json_field_r(request, 'value')
    page = get_json_field_r(request, 'page', allow_none=True, default=1)
    page_size = get_json_field_r(request, 'page_size', allow_none=True, default=10)

    query_id, datasets, categories = nxp.query(request.user, sub_query={query_type: query_value}, with_category=True,
                                               with_template=True)
    datasets, num_pages, num = nxp_paginator(datasets, page, page_size)
    data = {
        'query_id': query_id,
        'categories': categories,
        'datasets': datasets,
        'page_size': page_size,
        'num_pages': num_pages,
        'num': num
    }
    return json_response(data)


@require_GET_api
def aggregate_info_view(request: HttpRequest, query_id: int):
    """
    根据查询id,获取此次查询数据的聚合结果
    Returns:
        authors: 作者list
        templates: 模板list
        data_institutions: 数据机构list
        author_institutions: 作者机构list
        projects: 项目list
        subjects: 课题list
    """
    try:
        query = Query.objects.get(pk=query_id)
    except Query.DoesNotExist:
        raise MGEError.NOT_FOUND
    res = nxp.aggregate(query.q)
    return json_response(res)


class DataSetView(View):
    def get(self, request: HttpRequest, datasets_query_id=None, template_query_id=None):
        """
        根据查询id,获取此次数据查询的聚合结果
        Args
            request: HttpRequest
            datasets_query_id: 检索数据的es id
            template_query_id: 检索模板的es id
        """

        def _generate_abstract(query, dataset_id):
            data_ids = nxp.get_dataset(user=request.user, q=query.q, dataset_id=dataset_id, count=1, use_cache=False)
            if len(data_ids) <= 0:
                return "(No Data)"
            data_ids.sort()
            try:
                data = DataMeta.objects.get(id=data_ids[0])
            except DataMeta.DoesNotExist:
                return "(Missing)"
            return data.abstract

        def _get_dataset_from_cache_or_storage():
            # 先取当前查询的缓存
            _, datasets, _ = nxp.query(request.user, sub_query=sub_query, es_query_id=query.id,
                                       with_template=(template_query_id != None), only_in_cached=True)
            if datasets is not None:
                return datasets
            # 取全局缓存
            origin_query_sub_query = query.q.get("sub_query", {})
            _, full, _ = nxp.query(request.user, sub_query=origin_query_sub_query, es_query_id=None,
                                   with_template=True, with_category=True, only_in_cached=True)
            if full is not None:
                return full
            # 没有缓存
            _, datasets, _ = nxp.query(request.user, sub_query=sub_query, es_query_id=query.id,
                                       with_template=(template_query_id != None))
            return datasets

        try:
            query = Query.objects.get(pk=datasets_query_id or template_query_id)
        except Query.DoesNotExist:
            raise MGEError.NOT_FOUND
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int, default=10)
        sub_query = extract_params_from_request(request)
        # TODO 时间戳判断是否有问题

        datasets = _get_dataset_from_cache_or_storage()
        datasets, num_pages, num = nxp_paginator(datasets, page, page_size)
        final_datasets = []
        for dataset in datasets:
            if datasets_query_id is not None:
                abstract = _generate_abstract(query, dataset.get('dataset_id', None))
                dataset_with_abstract = {"abstract": abstract}
                dataset_with_abstract.update(dataset)
                final_datasets.append(dataset_with_abstract)
            else:
                final_datasets.append(dataset)
        return json_response({
            'page': page,
            'page_size': page_size,
            'num_pages': num_pages,
            'num': num,
            'datasets': final_datasets
        })


@require_GET_api
def dataset_id_list_view(request: HttpRequest, query_id: int, dataset_id: str):
    try:
        query = Query.objects.get(pk=query_id)
    except Query.DoesNotExist:
        raise MGEError.NOT_FOUND
    page = get_param('page', allow_none=True, convert_to=int, default=1)
    page_size = get_param('page_size', allow_none=True, convert_to=int, default=100)

    data_id_list = nxp.get_dataset(user=request.user, q=query.q, dataset_id=dataset_id)
    data_id_list, num_pages, num = nxp_paginator(data_id_list, page, page_size)
    return json_response({
        'page': page,
        'page_size': page_size,
        'num_pages': num_pages,
        'num': num,
        'data_id_list': data_id_list
    })
