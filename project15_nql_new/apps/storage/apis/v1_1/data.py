# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/12/10
import datetime

from django.shortcuts import render
from django.utils import timezone
from oauth2_provider.views.generic import ProtectedResourceView

from apps.account.auth import check_login, check_role
from apps.account.models import User
from apps.account.models.users import UserRole
from apps.account.auth import require_role
from apps.storage.models import MaterialProject, MaterialSubject
from apps.storage.models.platform import Platforms
from apps.storage.models.template import Template
from apps.storage.models.data import UploadHistory, DataMeta
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, require_methods_api, load_request_body
from apps.search.tasks import import_to_es
from django.db import transaction
from django.conf import settings
from apps.storage.utils.serializers.common import ParsingError


def _submit_a_data(json_data, uploaded_by, platform_code=0) -> DataMeta:
    meta = json_data.get('meta', None)
    if meta is None:
        raise MGEError.FIELD_MISSING('`meta` field required.')
    if not isinstance(meta, dict):
        raise MGEError.BAD_DATA('`meta` must be an dict.')

    source = meta.get('source', {})
    if not isinstance(source, dict):
        raise MGEError.BAD_DATA("\"source\" should be a dict")

    if source.get('methods') is None or source.get('source') is None:
        raise MGEError.BAD_DATA("\"source\" or \"methods\" is None")

    meta["reference"] = source.get('reference')
    meta["source"] = ' '.join([DataMeta.SourceHelper.REPRESENTATION_HEADER,
                               DataMeta.SourceHelper.VERSION_1,
                               source.get('methods'),
                               source.get('source'),
                               DataMeta.SourceHelper.REPRESENTATION_END])

    content = json_data.get('content', None)
    if content is None:
        raise MGEError.FIELD_MISSING('`content` field required.')
    if not isinstance(content, dict):
        raise MGEError.BAD_DATA('`content` must be an dict.')
    try:
        template = Template.objects.get(pk=meta.get('tid'))
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND(f"模板不存在(id={meta.get('tid')})")
    try:
        with transaction.atomic():
            dm = template.add_data(meta, content, uploaded_by=uploaded_by, check_uploaded_files=True)
            dm.platform_belong = platform_code
            dm.save()
            h = UploadHistory(user_id=uploaded_by, meta_id_list=[dm.id], via_file=False,
                              count=1, category=template.category, platform_belong=platform_code)
            h.save()
    except ParsingError as e:
        raise MGEError.BAD_DATA(e.message)
    except ValueError as e:
        raise MGEError.BAD_DATA(str(e))
    return dm


@require_role(UserRole.DATA_UPLOADER)
@require_methods_api(['POST'])
def data_full(request):
    """
    提交一个完整数据
    post:
        params: request.body 部分为包含数据全部字段的 dict，dict 包括 meta 和 content 两部分
            meta 部分要包含 category(id) 和 tid 字段
        return: 成功则返回对应提交成功的 DataMeta 的 id
    """
    data = load_request_body(request, dict)
    dm = _submit_a_data(data, request.user.username)
    if dm.is_public:
        import_to_es.delay(dm.id)
    return json_response(dm.id, status_code=201)


@require_methods_api(['POST'])
def data_full_direct(request):
    """
    提交完整数据，不需要验证，但是必须要有对应的用户
    """
    # 生产
    if not settings.DEBUG:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        if ip not in settings.WHITE_LIST:
            return json_response(f"请求ip不在白名单中, ip :{ip}", status_code=403)
    # 开发
    body = load_request_body(request, dict)
    user_email = body.get('email', None)
    platform_code = body.get('platform_code', None)

    if platform_code is None:
        return json_response("汇交平台编号缺失", status_code=403)
    elif Platforms.verify_platform_code(platform_code) is not True:
        return json_response("汇交平台编号不正确", status_code=403)

    if user_email is None:
        return json_response("邮箱字段缺失", status_code=403)
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return json_response("用户不存在", status_code=403)
    try:
        data = body['data']
    except KeyError:
        return json_response(status_code=400)

    dm = _submit_a_data(data, user.username, platform_code)

    if dm.is_public:
        import_to_es.delay(dm.id)
    return json_response(dm.id, status_code=201)


@require_methods_api(['GET', 'POST'])
def subject_bulk_update(request):
    """
    按用户名批量更新课题信息
    Args:
        project：项目编号
        subject：课题编号
        username：用户名
    Returns:
        count：更新总数
        username：用户名
    """
    if request.method == "GET":
        context = {}
        projects = MaterialProject.objects.order_by('id').all()
        context['project_ids'] = projects.values_list('id', flat=True)
        context['project'] = []
        for project in projects:
            project_dict = {project.id: list(project.materialsubject_set.values_list('id', flat=True))}
            context['project'].append(project_dict)

        return render(request, 'storage/bulk_update_subjects.html', context=context)
    if request.method == "POST":
        check_role(request, UserRole.ROOT)

        project_id = request.POST.get('project_id')
        subject_id = request.POST.get('subject_id')
        username = request.POST.get('username')
        delta_day = request.POST.get('delta_day')
        try:
            project = MaterialProject.objects.get(id=project_id)
            subject = MaterialSubject.objects.get(id=subject_id)
            user = User.objects.get(username=username)
            if subject.project != project:
                raise MGEError.BAD_DATA('项目{}不再课题{}下'.format(subject_id, project_id))

            if delta_day != '':
                start_day = datetime.datetime.now(tz=timezone.utc) - datetime.timedelta(days=int(delta_day))
                queryset = DataMeta.objects.filter(user=user).filter(add_time__gte=start_day)
            else:
                queryset = DataMeta.objects.filter(user=user)
            count = queryset.update(other_info={'project': project_id, 'subject': subject_id})
            meta_id_list = [data_meta.id for data_meta in queryset]
            import_to_es.delay(meta_id_list)
            return render(request, 'storage/bulk_update_subjects.html', {'count': count, 'username': user.username})
        except MaterialProject.DoesNotExist:
            raise MGEError.NOT_FOUND(f"项目{project_id}不存在")
        except MaterialSubject.DoesNotExist:
            raise MGEError.NOT_FOUND(f"课题{subject_id}不存在")
        except User.DoesNotExist:
            raise MGEError.NOT_FOUND(f"用户{username}不存在")


class DataEndpoint(ProtectedResourceView):

    def post(self, request, *args, **kwargs):
        """
        oauth 方式提交完整数据，数据格式同上
        """
        data = load_request_body(request, dict)
        username = request.GET.get('username', None)
        if not request.user.is_anonymous:
            username = request.user.username
        if username is None:
            raise MGEError.BAD_PARAMETER('parameter `username` missing')
        dm = _submit_a_data(data, username)
        if dm.is_public:
            import_to_es.delay(dm.id)
        return json_response(dm.id, status_code=201)
