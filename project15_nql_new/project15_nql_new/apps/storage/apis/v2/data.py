# -*- coding: utf-8 -*-

# @File   : v2/data.py
# @Author : Jasper0819X
# @Date   : 2018/01/25
from django.core.paginator import Paginator, EmptyPage

from apps.analytics.models import DataCounter
from apps.analytics.tasks import on_view
from apps.service.models import VisitDataRecord
from apps.storage.models import MaterialProject
from apps.storage.models import MaterialSubject
from apps.storage.models.data import DataUploadSourceMap
from apps.storage.tasks import UploadHistoryReviewRevokeTask
from apps.certificate.models.acceptance import Acceptance, AcceptanceState
from apps.task.models import UserTask, TaskType
from mgedata.utils.general import require_methods_api, json_response
from apps.account.auth import UserRole, login_required_api, require_role
from django.http import HttpRequest, JsonResponse
from apps.account.notify import NotificationType, notify
from apps.storage.models import Template, DataMeta
from apps.storage.models.data import UploadHistory, DisapproveReason
from apps.storage.utils.serializers.json import JSONHandler, DataMode
from mgedata.utils.general import get_param
from mgedata.errors.models import MGEError
from mgedata.utils.general import load_request_body, get_json_field_r
from oauth2_provider.views.generic import ProtectedResourceView


def template_to_dict(template: Template, meta_only=True):
    result = template.to_dict()
    if not meta_only:
        result['content'] = template.content
    return result


def data_to_dict(data, meta_only=True):
    result = data.to_dict()
    if not meta_only:
        serializer = JSONHandler(mode=DataMode.WRITE, template=data.template)
        data_dict = serializer.data_to_dict(data)
        result['content'] = data_dict
    try:
        source_helper = DataMeta.SourceHelper.parse(result['source'])
        result['source'] = source_helper.get_source_name()
        result['methods'] = source_helper.get_method_names()
    except Exception as e:
        # 兼容之前的数据
        pass
    return result


@require_methods_api(['GET', 'PATCH'])
def get_data(request: HttpRequest, oid):
    """
    GET
    获取数据的方法
    PATCH
    修改数据的方法
    :param request: http:request
    :param oid: 元数据ID
    :return:
    """
    try:
        data_meta = DataMeta.objects.get(pk=oid)
        template = Template.objects.get(pk=data_meta.template_id)
        user = request.user
        if not data_meta.is_public and not data_meta.has_view_permission(user.username):
            return json_response('数据未公开')
    except (DataMeta.DoesNotExist, Template.DoesNotExist):
        raise MGEError.NOT_FOUND

    if request.method == 'GET':
        # 记录访问数据.
        VisitDataRecord.visit(user, data_meta)
        template_dict = template_to_dict(template, False)
        data_dict = data_to_dict(data_meta, False)
        data_dict['template'] = template_dict
        try:
            source = DataUploadSourceMap.objects.get(meta_id=oid)
            data_dict['via'] = source.file.get_url() if source.file else ''
        except DataUploadSourceMap.DoesNotExist:
            pass
        data_dict['review_state'] = data_meta.review_state
        data_dict['disapprove_reason'] = data_meta.disapprove_reason
        data_dict['version'] = data_meta.sync_version
        data_dict['uploader_institution'] = data_meta.user.institution

        project_id = data_meta.get_project_id()
        if project_id is not None:
            try:
                project = MaterialProject.objects.get(pk=project_id)
                data_dict['project_name'] = project.name
            except MaterialProject.DoesNotExist:
                pass
        data_dict.setdefault('project_name', '')

        subject_id = data_meta.get_subject_id()
        if subject_id is not None:
            try:
                subject = MaterialSubject.objects.get(pk=subject_id)
                data_dict['subject'] = subject.id
                data_dict['subject_name'] = subject.name
            except MaterialSubject.DoesNotExist:
                pass
        data_dict.setdefault('subject', '')
        data_dict.setdefault('subject_name', '')

        DataCounter.objects.filter(ref_id=oid).update(category=data_meta.category)
        on_view(oid)  # 修复查看量统计bug
        # 数据集的引用数
        data_dict["dataset_ref_count"] = data_meta.dataset_ref_count
        return json_response(data_dict)
    else:
        data = load_request_body(request, dict)
        meta = data['meta']
        source = meta.get('source', {})
        meta["reference"] = source.get('reference')
        meta["source"] = ' '.join([DataMeta.SourceHelper.REPRESENTATION_HEADER,
                                   DataMeta.SourceHelper.VERSION_1,
                                   source.get('methods'),
                                   source.get('source'),
                                   DataMeta.SourceHelper.REPRESENTATION_END])
        content = data['content']
        DataCounter.objects.filter(ref_id=oid).update(category=data_meta.category)
        template.modify_data(data_meta, meta_dict=meta, content_dict=content)
        return json_response(data_meta.id)


@require_role(UserRole.DATA_ADMIN)
@require_methods_api(["PATCH"])
def review_upload_history(request: HttpRequest, history_id):
    approved = get_json_field_r(request, 'approved', bool)
    reasons = None
    reason = None
    if not approved:
        reasons = get_json_field_r(request, 'reasons', list, allow_none=True)
        if reasons:
            for r in reasons:
                try:
                    DisapproveReason(r)
                except ValueError:
                    raise MGEError.WRONG_FIELD_TYPE("Invalid value " + str(r))
        reason = get_json_field_r(request, 'reason', str, allow_none=True)
        if reason is None and reasons is None:
            raise MGEError.WRONG_FIELD_TYPE
    try:
        history = UploadHistory.objects.get(id=history_id)
    except UploadHistory.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if not request.user.can_review_data_category(history.category_id):
            raise MGEError.PERMISSION_DENIED
        history.approve_data(reviewer=request.user, approved=approved, reasons=reasons, reason=reason)
        n_type = NotificationType.DATA_APPROVED if approved else NotificationType.DATA_DISAPPROVED
        notify(history.user, n_type)
        return json_response()


@require_role(UserRole.DATA_ADMIN)
@require_methods_api(["PATCH"])
def revoke_review_upload_history(request: HttpRequest, history_id):
    try:
        history = UploadHistory.objects.get(id=history_id)
        if not request.user.can_review_data_category(history.category_id):
            raise MGEError.PERMISSION_DENIED
        data_meta_id = history.meta_id_list[0]
        data_meta = DataMeta.objects.get(pk=data_meta_id)
        subject_id = data_meta.get_subject_id()
        project_id = data_meta.get_project_id()
        try:
            subject_acceptance = Acceptance.objects.get(ps_id=subject_id)
        except Acceptance.DoesNotExist:
            subject_acceptance = None
        try:
            project_acceptance = Acceptance.objects.get(ps_id=project_id)
        except Acceptance.DoesNotExist:
            project_acceptance = None

        if subject_acceptance:
            if subject_acceptance.state != AcceptanceState.FAILED:
                raise MGEError.PERMISSION_DENIED("项目或课题正在验收，或已完成验收，无法撤回")

        if project_acceptance:
            if project_acceptance.state != AcceptanceState.FAILED:
                raise MGEError.PERMISSION_DENIED("项目或课题正在验收，或已完成验收，无法撤回")

        if len(history.meta_id_list) < UploadHistory.MAX_REVOKE_REVIEW_DATA_SYNC_NUM:
            history.revoke_data_review_status()
        else:
            UserTask.add_task(request.user, UploadHistoryReviewRevokeTask().s(history.id),
                              TaskType.UPLOAD_HISTORY_REVIEW_REVOKE)
        notify(history.user, NotificationType.DATA_RETRACT, history.time, history_id)
        return json_response()
    except UploadHistory.DoesNotExist:
        raise MGEError.NOT_FOUND


@require_methods_api(["GET"])
@login_required_api
def get_upload_history_data_metas(request: HttpRequest, history_id):
    """查看某条上传历史下的数据"""
    page = get_param('page', convert_to=int, default=1)
    page_size = get_param('page_size', convert_to=int, default=10)
    meta_id_only = get_param('meta_id_only', convert_to=bool, default=False)
    try:
        upload_history = UploadHistory.objects.get(id=history_id)
        if request.user != upload_history.user and not request.user.can_review_data_category(
                upload_history.category_id):
            raise MGEError.PERMISSION_DENIED
        upload_history_meta_ids = upload_history.meta_id_list
        data_metas_count = len(upload_history_meta_ids)
        if meta_id_only:
            return JsonResponse({'data_meta_ids': upload_history_meta_ids, 'total': data_metas_count})
        paginator = Paginator(DataMeta.objects.filter(id__in=upload_history_meta_ids), page_size)
        page_count = paginator.num_pages
        try:
            data_metas = paginator.page(page)
        except EmptyPage:
            page = 1
            data_metas = paginator.page(page)
        results = []
        for data_meta in data_metas:
            data_meta_dict = data_to_dict(data_meta)
            results.append(data_meta_dict)
        return JsonResponse({'page_count': page_count, 'current_page': page, 'total': data_metas_count,
                             'results': results})
    except UploadHistory.DoesNotExist:
        raise MGEError.NOT_FOUND


@require_role(UserRole.DATA_ADMIN)
@require_methods_api(["PATCH"])
def review_data(request: HttpRequest, meta_id):
    approved = get_json_field_r(request, 'approved', bool)
    reasons = None
    reason = None
    if not approved:
        reasons = get_json_field_r(request, 'reasons', list, allow_none=True)
        if reasons:
            for r in reasons:
                try:
                    DisapproveReason(r)
                except ValueError:
                    raise MGEError.WRONG_FIELD_TYPE("Invalid value " + str(r))
        reason = get_json_field_r(request, 'reason', str, allow_none=True)
        if reason is None and reasons is None:
            raise MGEError.WRONG_FIELD_TYPE
    try:
        meta = DataMeta.objects.get(id=meta_id)
    except UploadHistory.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if not request.user.can_review_data_category(meta.category_id):
            raise MGEError.PERMISSION_DENIED
        if approved:
            meta.approve(reviewer=request.user)
            n = NotificationType.DATA_APPROVED
        else:
            meta.disapprove(reviewer=request.user, reasons=reasons, reason=reason)
            n = NotificationType.DATA_DISAPPROVED
        notify(meta.user, n)

        return json_response()


class DataEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        oid = kwargs['oid']
        try:
            data_meta = DataMeta.objects.get(pk=oid)
            template = Template.objects.get(pk=data_meta.template_id)
        except (DataMeta.DoesNotExist, Template.DoesNotExist):
            raise MGEError.NOT_FOUND

        template_dict = template_to_dict(template, False)
        data_dict = data_to_dict(data_meta, False)
        data_dict['template'] = template_dict
        try:
            source = DataUploadSourceMap.objects.get(meta_id=oid)
            data_dict['via'] = source.file.get_url() if source.file else ''
        except DataUploadSourceMap.DoesNotExist:
            pass
        return json_response(data_dict)


"""
导出某个分类下面的所有数据，并且指定用户名
在没有正式添加这个功能之前，用来给需要导出大量数据的用户后台手动导出
"""


@require_role(UserRole.ROOT)
@require_methods_api(["GET"])
def export_data_of_category_admin(request: HttpRequest):
    from apps.storage.utils.data_import_export import export_data_of_category, FileContentType, MaterialCategory
    from apps.account.models.users import User
    username = get_param('username', allow_none=False)
    category_id = get_param('category_id', allow_none=False)
    file_format = get_param('type', allow_none=False, allowed=('xlsx', 'json', 'xml')).upper()
    file_format = FileContentType[file_format]
    try:
        user = User.objects.get(username=username)
        category = MaterialCategory.objects.get(pk=category_id)
    except (User.DoesNotExist, MaterialCategory.DoesNotExist):
        raise MGEError.NOT_FOUND
    else:
        task = export_data_of_category(user, category=category, file_format=file_format)
        return json_response({'task_id': task.id})
