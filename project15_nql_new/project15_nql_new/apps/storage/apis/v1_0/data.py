# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/11/11


from django.db import transaction
from django.db.models import Count

from apps.storage.apis.v2.data import data_to_dict
from apps.storage.models.data import UploadHistory, DoiRegisterInfo, DataReviewState

from apps.storage.doi.doi import register_doi
from apps.task.models import UserTask, TaskType
from mgedata.errors.models import MGEException
from mgedata.utils.general import *
from apps.account.auth import *
from apps.storage.doi.models import DoiRegisterState
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import connection, transaction, OperationalError
from django.utils.functional import cached_property
from apps.storage.models.data import DataScore
from django.db.models.query_utils import Q
from datetime import datetime
from django.core.exceptions import ValidationError
from apps.search.core_v2.es import Manager
from apps.storage.tasks import FileContentType, UploadHistoryRetractTask
from apps.storage.utils.data_import_export import export_data
from apps.storage.models import DataMeta, Template, MaterialCategory


@login_required_api
@require_POST_api
def export_data_of_template(request: HttpRequest):
    """
    供四川大学使用，误删
    """
    file_type = get_json_field_r(request, 'format', str, allowed=('xlsx', 'json', 'xml'))
    no_attachments = get_json_field_r(request, 'no_attachments', allow_none=True, default=False)
    meta_id_list = get_json_field_r(request, 'meta_id_list', list, allow_none=True)
    tid = get_json_field_r(request, 'template_id', int, allow_none=True)
    if meta_id_list and tid:
        raise MGEError.WRONG_FIELD_TYPE("meta_id_list和template_id只能选择一个")
    if not meta_id_list and not tid:
        raise MGEError.WRONG_FIELD_TYPE("meta_id_list和template_id必须选择一个")
    try:
        file_type = FileContentType[file_type.upper()]
    except Exception:
        file_type = FileContentType.JSON
    if tid:
        try:
            template = Template.objects.get(id=tid)
            meta_list = DataMeta.objects.filter(template=template, is_public=True)
        except Template.DoesNotExist:
            raise MGEError.NOT_FOUND(f"模板{tid}不存在")
    else:
        for meta_id in meta_id_list:
            if not isinstance(meta_id, int):
                raise MGEError.WRONG_FIELD_TYPE("meta_id_list中的元素必须都是整型")
        meta_list = DataMeta.objects.filter(id__in=meta_id_list)
    task = export_data(request.user, meta_list, file_type, no_attachments=no_attachments)
    return json_response({'task_id': task.id})


@login_required_api
@require_POST_api
def export_data_list(request: HttpRequest, tid: int):
    """
    供四川大学使用，误删
    """
    file_type = get_json_field_r(request, 'format', str, allowed=('xlsx', 'json', 'xml'))
    no_attachments = get_json_field_r(request, 'no_attachments', allow_none=True, default=False)
    try:
        file_type = FileContentType[file_type.upper()]
    except Exception:
        file_type = FileContentType.JSON
    try:
        file_type = FileContentType[file_type.upper()]
    except Exception:
        file_type = FileContentType.JSON
    try:
        template = Template.objects.get(id=tid)
        meta_list = DataMeta.objects.filter(template=template, is_public=True)
        task = export_data(request.user, meta_list, file_type, no_attachments=no_attachments)
        return json_response({'task_id': task.id})
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND(f"模板{tid}不存在")


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
            # filter_dois 获取数据是否需要过滤doi
            filter_dois = get_param('doi', convert_to=str)
            # private 对超级用户忽略
            private = False if request.user.is_authenticated and request.user.has_role(
                UserRole.ROOT) else get_param('private', convert_to=bool, default=False)
            meta_only = get_param('meta_only', convert_to=str) in ['true', '1', 't', 'y', 'yes']
            subject = get_param('subject', convert_to=str)

            qs = DataMeta.objects.filter()
            if category:
                qs = qs.filter(category_id=category)
            if private and request.user.is_authenticated:
                qs = qs.filter(user_id=request.user.username)
            if filter_dois == 'true':
                qs = qs.filter(~(Q(doi=None) | Q(doi='')))
            if subject:
                dm_ids = DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_subject_id(subject)
                qs = qs.filter(id__in=dm_ids)
            paginator = Fake_Count_Paginator(qs, per_page=per_page)
            total = paginator.count  # 符合条件的模板总数
            try:
                result_page = paginator.page(page)
            except (PageNotAnInteger, EmptyPage):
                result_page = paginator.page(1)
            rs = [dm.to_dict(meta_only) for dm in result_page]
            return json_response({'results': rs, 'total': total, 'page': page, 'page_size': per_page})
        except ValueError as ex:
            raise MGEError.BAD_DATA(str(ex))
    elif request.method == 'POST':
        check_role(request, UserRole.DATA_UPLOADER)
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


@require_methods_api(['DELETE'])
def retract_data(request, history_id):
    try:
        with transaction.atomic():
            history = UploadHistory.objects.select_for_update().get(pk=history_id)
            if history.review_state == DataReviewState.APPROVED:
                raise MGEError.BAD_REQUEST("数据已审核通过，撤回失败!")
            ensure_privacy(request, history.user_id)
            if len(history.meta_id_list) < UploadHistory.MAX_RETRACT_DATA_SYNC_NUM:
                history.retract_data()
            else:
                UserTask.add_task(request.user, UploadHistoryRetractTask().s(history.id),
                                  TaskType.UPLOAD_HISTORY_RETRACT)
            return json_response()
    except UploadHistory.DoesNotExist:
        return json_response(MGEError.NOT_FOUND)
    except MGEException as e:
        raise e


@require_methods_api(['GET', 'PATCH'])
def data_doi_single(request, did):
    """
       get: 通过did获取数据id
          params: 无
          return：返回数据的doi
       patch: 为现有的数据注册doi号
          params: `body.data`字段为注册doi时所需要的注册信息的 dict
              title:str, 数据标题
              contributor： str, 数据的责任者
              project: str, 数据所属的项目
          return: 新添加的doi号
    """
    try:
        data = DataMeta.objects.get(id=did)
    except DataMeta.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == 'GET':
            return json_response(data.doi)
        elif request.method == 'PATCH':
            if data.doi:
                raise MGEError.DOI_ALREADY_EXISTS
            try:
                ensure_privacy(request, data.username)
                check_role(request, UserRole.DATA_UPLOADER)
                dataset_title = get_json_field_r(request, 'title', str)
                dataset_contributor = get_json_field_r(request, 'contributor', str)
                project = get_json_field_r(request, 'project', str)
                data_ids = [did]
                doi_register_info = DoiRegisterInfo(title=dataset_title, contributor=dataset_contributor,
                                                    project=project, data_ids=data_ids, applicant=request.user.username)
                doi_register_info.save()
                return json_response()
            except ValueError as ex:
                raise MGEError.BAD_DATA(str(ex))


@require_methods_api(['PATCH', 'POST'])
def data_dois(request):
    """
       patch: 为一个数据集添加 doi 号,数据集下所有的 doi都是相同的号
         params: `body.data` 字段为待注册数据集的必要信息及数据id 列表
            title: str, 数据集的标题
            contributor: str, 数据集的责任者
            project: str,  数据集的所属的项目
            datas: list, 数据集中数据的id的list
         return: 新添加的数据的doi号
    """
    if request.method == 'PATCH':
        try:
            title = get_json_field_r(request, 'title', str)
            contributor = get_json_field_r(request, 'contributor', str)
            project = get_json_field_r(request, 'project', str)
            data_ids = get_json_field_r(request, 'datas', list)
            check_role(request, UserRole.DATA_UPLOADER)
            for id in data_ids:
                try:
                    data = DataMeta.objects.get(id=id)
                    ensure_privacy(request, data.username)
                    if data.doi:
                        raise MGEError.DOI_ALREADY_EXISTS
                except DataMeta.DoesNotExist:
                    raise MGEError.NOT_FOUND
            doi_register_info = DoiRegisterInfo(title=title, contributor=contributor,
                                                project=project, data_ids=data_ids,
                                                applicant=request.user.username)
            doi_register_info.save()
            return json_response()
        except ValueError as ex:
            raise MGEError.BAD_DATA(str(ex))
    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            template_id = body.get('template_id')
            if template_id:
                data_ids = list(
                    DataMeta.objects.filter(Q(template__id=template_id), Q(doi='') | Q(doi=None),
                                            Q(user=request.user)).values_list(
                        'id', flat=True))
                if data_ids:
                    data_leader = DataMeta.objects.get(id=data_ids[0])
                    DoiRegisterInfo.objects.create(title=data_leader.title,
                                                   contributor=request.user.username,
                                                   project='NKRDP',
                                                   data_ids=data_ids,
                                                   applicant=request.user.username)
                    return json_response()
                else:
                    raise MGEError.BAD_DATA("该模板下数据均已有doi，请勿重复申请")
            else:
                raise MGEError.BAD_DATA("template_id not found")
        except Exception as e:
            raise MGEError.BAD_DATA(str(e))


@require_role(UserRole.DOI_ADMIN)
@require_methods_api(['GET', 'PATCH'])
def doi_review(request):
    """
    patch: 修改所有注册信息的注册信息的list
      params:
        uccess: 通过申请的 DoiRegisterInfo 的id 的list
        failed: 未通过申请的 DoiRegisterInfo 的 id 的lists
        return: 无
    get: 获取待更新的列表(暂未实现)
      params:
         page:int 当前想要获取的页数, 默认为1
         per_page: int ,每一页的数目，默认为10个
    """
    if request.method == 'PATCH':
        try:
            body = json.loads(request.body)
            # success_list = get_json_field_r(request, 'success', list)
            # failed_list = get_json_field_r(request, 'failed', list)
            success_list = body.get('success', [])
            failed_list = body.get('failed', [])
            for id in success_list:
                try:
                    doi_reg = DoiRegisterInfo.objects.get(id=id)  # 获取到相应的 DoiRegisterInfo 对象
                    if doi_reg.status == DoiRegisterState.UNAUDITED:  # 只有在未审核才能进行注册
                        data_ids = doi_reg.data_ids  # 获取到待注册doi 的 数据id
                        dataset_datas = []
                        for data_id in data_ids:
                            try:
                                data = DataMeta.objects.get(id=data_id)
                                if data.doi:
                                    raise MGEError.DOI_ALREADY_EXISTS
                            except DataMeta.DoesNotExist:
                                pass
                            else:
                                dataset_datas.append(data)
                        if len(dataset_datas) == 1:
                            register_doi(doi_reg.title, dataset_datas[0], doi_reg.contributor, doi_reg.project)
                        else:
                            register_doi(doi_reg.title, dataset_datas, doi_reg.contributor, doi_reg.project)
                        doi_reg.status = DoiRegisterState.APPROVED
                        doi_reg.save()
                    else:
                        raise MGEError.DOI_REGISTER_STATE_ERROR

                except DoiRegisterInfo.DoesNotExist:
                    raise MGEError.NOT_FOUND
            for id in failed_list:
                try:
                    doi_reg = DoiRegisterInfo.objects.get(id=id)
                    doi_reg.status = DoiRegisterState.NOT_APPROVED
                    doi_reg.save()
                except DoiRegisterInfo.DoesNotExist:
                    raise MGEError.NOT_FOUND
            return json_response()
        except ValueError as ex:
            raise MGEError.BAD_DATA(str(ex))


@login_required_api
@require_methods_api(['POST'])
def data_score(request, did):
    '''

    :param request:
    :param did: 要评分的数据ID
    :return:
    '''
    if request.method == 'POST':
        try:
            # 同一个用户 对同一个数据再次评分 更新现有数据
            data = DataMeta.objects.get(id=did)
            score = get_json_field_r(request, 'score', int)
            # score_info = load_request_body(request, dict)
            data_score = DataScore.objects.filter(
                Q(data_id__exact=did) & Q(user_id__exact=request.user.username)).first()
            if data_score is None:  # 数据库中当前没有 该用户关于该数据的评分 --> 新添加一条记录
                single_score = DataScore(user_id=request.user.username, data_id=data.id,
                                         score=score)
                single_score.full_clean()
                single_score.save()
            else:  # 该用户已经对该数据进行评分 ---> 更新现有数据 不添加记录
                data_score.score = score
                data_score.time = datetime.now()
                data_score.full_clean()
                data_score.save()
            # 需要更新该数据的评分信息  计算总的平均数
            total_score = 0
            count = 0
            data_all_score = DataScore.objects.filter(data_id=did).all()
            for score in data_all_score:
                total_score = total_score + score.score
                count = count + 1
            data.score = total_score / count
            # 更新一下现有的数据
            data.save()
            return json_response()

        except DataMeta.DoesNotExist:
            raise MGEError.NOT_FOUND
        except ValueError:
            raise MGEError.BAD_DATA
        except ValidationError:
            raise MGEError.BAD_DATA


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
        template_dict['category_full_path'] = MaterialCategory.objects.get(id=template_dict['category_id']).full_path
    return json_response(template_set)


@require_methods_api(['GET'])
@login_required_api
def get_data_from_template_filter_by_user(request):
    """
    获取模版下指定用户上传所有数据
    Args:
        template_id:int 模版id
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
        paginator = Paginator(data_meta_set, page_size)
        try:
            data_meta_set = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            data_meta_set = paginator.page(paginator.num_pages)

        data_full_result = []
        for data_meta in data_meta_set:
            data_dict = data_to_dict(data_meta)
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
