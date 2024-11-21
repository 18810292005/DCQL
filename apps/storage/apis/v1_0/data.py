# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/11/11


from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import connection, transaction, OperationalError
from django.db.models import Count
from django.db.models.query_utils import Q
from django.utils.functional import cached_property

from apps.search.core_v2.es import Manager
from apps.storage.apis.v2.data import data_to_dict
from apps.storage.models.data import DataMeta, Category
from apps.storage.models.template import Template
from mgedata.utils.general import *
from apps.storage.models.data import DataReviewState


class Fake_Count_Paginator(Paginator):
    '''
    如果计数时间超过 1000 毫秒，数据库将终止查询并引发 OperationError
    
    如果在1000ms的时间内不能完成计算，那么是属于极大数据量的情况（一般为admin用户），这时候直接省去count的计算则会节省大量的时间
    返回fakecount 99999999
    https://gist.github.com/noviluni/d86adfa24843c7b8ed10c183a9df2afe
    
    '''

    @cached_property
    def count(self):
        try:
            with transaction.atomic(), connection.cursor() as cursor:
                cursor.execute('SET LOCAL statement_timeout TO 1000;')
                return super().count
        except OperationalError:
            pass
        return 99999999


@require_methods_api(['GET', 'POST'])
@require_role(UserRole.RESEARCHER)
def data_metas(request):
    """
    get: 获取数据元数据信息
        params:
            page: int，当前想要获取的页数，默认为 1
            per_page: int，每一页的数目，默认为 10
            category: int, 数据所属分类的 id
            private: boolean，是否仅获取当前登录用户的模板，默认 False
            meta_only: boolean，是否仅获取元数据，默认 False
        return: 返回需要的元数据
    post: 批量添加元数据（单个元数据也通过这种方式提交）
        params: `body.data`字段为待添加的元数据的 dict 的列表
            title: str, required，数据标题
            category: int, required，所属类别的 id
            source: dict, required，数据来源，包括`source`,`reference`,`project`,`others`四个字段
            tid: str, required，使用的模板的 ObjectId
            content_id: str, required，数据内容的 ObjectId
            tags: list，数据标签列表（直接给名字就好）
            score: float，数据评分
            doi: str，数据标识
            abstract: str，数据摘要，对数据进行简要介绍
            purpose: str，本数据的目的
        return: 返回 `failed` 和 `succeed` 的列表，
                `succeed`中包含提交成功的 id，`failed`中为提交失败的数据
    """
    if request.method == 'GET':
        try:
            per_page = get_param('per_page', convert_to=int, default=20)
            page = get_param('page', convert_to=int, default=1)
            category = get_param('category', convert_to=int)

            qs = DataMeta.objects.filter(user=request.user).select_related('project', 'subject')
            if category:
                qs = qs.filter(category_id=category)

            paginator = Fake_Count_Paginator(qs, per_page=per_page)
            total = paginator.count  # 符合条件的模板总数
            try:
                result_page = paginator.page(page)
            except (PageNotAnInteger, EmptyPage):
                result_page = paginator.page(1)
            rs = [dm.to_dict(True) for dm in result_page]
            return json_response({'results': rs, 'total': total, 'page': page, 'page_size': per_page})
        except ValueError as ex:
            raise MGEError.BAD_DATA(str(ex))
    elif request.method == 'POST':
        check_role(request, UserRole.RESEARCHER)
        metas = load_request_body(request, list)
        failed_dms = []
        succeed_dms = []
        for meta in metas:
            try:
                dm = DataMeta(title=meta['title'], category_id=meta['category'], template_id=meta['tid'],
                              user_id=request.user.username, source=meta['source'],
                              doi=meta.get('doi'), abstract=meta.get('abstract'), purpose=meta.get('purpose'))
                dm.save()
            except ValueError:
                failed_dms.append(meta)
        if failed_dms:
            raise MGEError.BAD_DATA({'failed': failed_dms, 'succeed': succeed_dms})
        return json_response({'failed': failed_dms, 'succeed': succeed_dms}, status_code=201)


@require_methods_api(['GET', 'PATCH', 'DELETE'])
def data_meta_one(request, mid):
    """
    get: 通过 mid 获取数据元数据
        params:
            meta_only: boolean, 是否仅需元数据，为 true 时请设置为 ('true', '1', 't', 'y', 'yes')
        return: 返回数据元数据
    patch:
        params: `body.data`字段为待更新的元数据的 dict
            title: str, required，数据标题
            category: int, required，所属类别的 id
            source: dict, required，数据来源，包括`source`,`reference`,`project`,`others`四个字段
            tid: str, required，使用的模板的 ObjectId
            content: dict, required，数据内容部分
            keywords: list，数据标签列表（直接给名字就好）
            score: float，数据评分
            doi: str，数据标识
            abstract: str，数据摘要，对数据进行简要介绍
            purpose: str，本数据的目的
        return: 返回更新后的元数据的 ObjectId
    delete: 通过 mid 删除数据元数据
        params: 无
        return: 无
    """
    try:
        dm = DataMeta.objects.get(id=mid)
    except DataMeta.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == 'GET':
            meta_only = request.GET.get('meta_only') in ('true', '1', 't', 'y', 'yes')
            return json_response(dm.to_dict(meta_only))
        elif request.method == 'PATCH':
            try:
                data = load_request_body(request, dict)
                ensure_privacy(request, dm.username)  # 仅用户自己能修改数据
                dmt, changed_fields = patch_resource(dm, ('title', 'category', 'abstract', 'published', 'content',
                                                          'source', 'keywords', 'doi', 'abstract', 'purpose'),
                                                     data, {'category': lambda o, f, v: setattr(o, 'category_id', v),
                                                            'content': lambda o, f, v: setattr(o, 'dc_id', v)})
                dm.save(update_fields=changed_fields)
                Manager.insert([dm.id])
                return json_response(dm.id, status_code=201)
            except ValueError as ex:
                raise MGEError.BAD_DATA(str(ex))
        elif request.method == 'DELETE':
            if getattr(dm, 'doi') is not None and len(getattr(dm, 'doi')) != 0:
                raise MGEError.DOI_DATA_DELETE_ERROR
            else:
                ensure_privacy(request, dm.username)  # 仅用户自己能删除数据
                meta_id = dm.id
                dm.delete()
                return json_response()


@require_GET_api
@login_required_api
def get_data_templates(request: HttpRequest):
    """
    获取当前用户所有数据的模版列表
    :param request:
    :return:
    """
    user = request.user
    query_set = DataMeta.objects.filter(user=user)
    query_set = query_set.values('template__id', 'template__title', 'category_id').annotate(
        data__count=Count('template')).order_by('category_id')
    template_set = list(query_set)
    for template_dict in template_set:
        template_dict['category_full_path'] = Category.objects.get(id=template_dict['category_id']).name_zh
    return json_response(template_set)


@require_methods_api(['GET'])
@login_required_api
def get_data_from_template_filter_by_user(request):
    """
    获取模版下指定用户上传所有数据
    Args:
        template_id:int 模版id
        review_state:int 审核状态
        user_emails:list 用户邮箱(允许为None),以','进行分割
        doi_exist:boolean 按是否存在doi筛选
        page:int 页数(允许为None,默认最后一页)
        page_size:int 每页大小(允许为None，默认每页10条数据)
    Returns:
        result:list 数据集合
        total: 数据总数
    """
    template_id = get_param('template_id', convert_to=int, allow_none=False)
    user_emails = get_param('user_emails', convert_to=list, allow_none=True)
    doi_exist = get_param('doi_exist', convert_to=bool, allow_none=True)
    page = get_param('page', convert_to=int, allow_none=True, default=1)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=10)
    state = get_param('review_state', convert_to=int)
    try:
        state = DataReviewState(state)
    except ValueError:
        state = None

    try:
        template = Template.objects.get(id=template_id)
        data_meta_set = DataMeta.objects.filter(template=template)
        if user_emails is not None:
            users_username = []
            for email in user_emails:
                users_username.append(User.objects.get(email=email).username)
            data_meta_set = data_meta_set.filter(user_id__in=users_username)
        if doi_exist is not None:
            if doi_exist:
                data_meta_set = data_meta_set.exclude(Q(doi='') | Q(doi=None))
            else:
                data_meta_set = data_meta_set.filter(Q(doi='') | Q(doi=None))
        if state is not None:
            data_meta_set = data_meta_set.filter(review_state=state)

        paginator = Paginator(data_meta_set, page_size)
        try:
            data_meta_set = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            data_meta_set = paginator.page(paginator.num_pages)

        data_full_result = []
        for data_meta in data_meta_set:
            data_dict = data_to_dict(data_meta)
            data_dict["review_state"] = data_meta.review_state
            data_dict["time"] = data_meta.add_time
            data_full_result.append(data_dict)

        return json_response(data={
            'results': data_full_result,
            'page': data_meta_set.number,
            'page_size': page_size,
            'page_count': paginator.num_pages
        })
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    except User.DoesNotExist:
        raise MGEError.NOT_FOUND
