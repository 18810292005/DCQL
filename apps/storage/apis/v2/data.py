# -*- coding: utf-8 -*-

# @File   : v2/data.py
# @Author : Jasper0819X
# @Date   : 2018/01/25
from django.db import transaction
from django.http import HttpRequest, FileResponse

from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.analytics.tasks import on_view
from apps.search.core_v2.es import insert_meta_with_ids
from apps.storage.models.material import MaterialProject, MaterialSubject
from apps.storage.models.template import Template, DataMeta
from apps.storage.utils.serializers.json import JSONHandler, DataMode
from mgedata.errors.models import MGEError
from mgedata.utils.general import load_request_body
from mgedata.utils.general import require_methods_api, json_response


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
    return result


@require_methods_api(['GET', 'PATCH'])
@require_role(UserRole.RESEARCHER)
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
        if not data_meta.can_view(user):
            return json_response('数据未公开')
    except (DataMeta.DoesNotExist, Template.DoesNotExist):
        raise MGEError.NOT_FOUND

    if request.method == 'GET':
        # 记录访问数据.
        template_dict = template_to_dict(template, False)
        data_dict = data_to_dict(data_meta, False)
        data_dict['template'] = template_dict
        data_dict['via'] = ''
        data_dict['review_state'] = data_meta.review_state
        data_dict['disapprove_reason'] = data_meta.disapprove_reason
        data_dict['uploader_institution'] = data_meta.user.institution

        project_id = data_meta.get_project_id()
        if project_id is not None:
            try:
                project = MaterialProject.objects.get(pk=project_id)
                data_dict['project_name'] = project.name
                # data_dict["project_water_mark"] = project.waterMark
            except MaterialProject.DoesNotExist:
                pass
        data_dict.setdefault('project_name', '')

        subject_id = data_meta.get_subject_id()
        if subject_id is not None:
            try:
                subject = MaterialSubject.objects.get(pk=subject_id)
                data_dict['subject'] = subject.id
                data_dict['subject_name'] = subject.name
                # data_dict['subject_water_mark'] = subject.waterMark
            except MaterialSubject.DoesNotExist:
                pass
        data_dict.setdefault('subject', '')
        data_dict.setdefault('subject_name', '')
        data_dict['username'] = data_meta.username
        on_view(data_meta)
        # data_dict["water_mark"] = data_dict["water_mark"] or data_dict["subject_water_mark"] or data_dict["project_water_mark"]
        # if request.user.username != data_meta.user.username and data_dict["water_mark"]:
        #     return json_response(data_dict)
        # else:
        #     return json_response(data_dict)
        return json_response(data_dict)
        # 数据集的引用数
        # data_dict["dataset_ref_count"] = data_meta.dataset_ref_count

    else:
        data = load_request_body(request, dict)
        meta = data['meta']
        content = data['content']
        if user.role != UserRole.ROOT and user != data_meta.user:
            raise MGEError.PERMISSION_DENIED
        with transaction.atomic():
            template.modify_data(data_meta, meta_dict=meta, content_dict=content)
            insert_meta_with_ids([data_meta.id])

        return json_response(data_meta.id)
