import datetime
import re
from enum import IntEnum
from io import BytesIO
from pathlib import Path

import openpyxl
from django.conf import settings
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.http import HttpRequest, FileResponse
from django.utils.translation import gettext as _

from apps.account.auth import require_role, login_required_api
from apps.account.excel import read_excel
from apps.account.models.users import UserRole, User
from apps.storage.models.data import DataMeta
from apps.storage.models.material import MaterialProject, MaterialSubject, ProjectSubjectMember
from apps.storage.models.template import Template
from mgedata.errors.models import MGEError, MGEException
from mgedata.utils.general import json_response, require_methods_api, get_param, load_request_body, get_field, \
    get_json_field_r

TEMPLATE_PATH = Path(settings.BASE_DIR) / 'apps/account/template.xlsx'
assert TEMPLATE_PATH.exists()


class _Action(IntEnum):
    DELETE = 0
    DISABLE = 1
    EDIT_ROLE = 2


def _check_projects_subjects(user: User, action: _Action):
    if action == _Action.DELETE:
        err_project = _('用户是一级机构"%(items)s"的负责人，无法删除。如确需删除，请先更改一级机构负责人。')
        err_subject = _('用户是二级机构"%(items)s"的负责人，无法删除。如确需删除，请先更改二级机构负责人。')
    elif action == _Action.DISABLE:
        err_project = _('用户是一级机构"%(items)s"的负责人，无法禁用。如确需禁用，请先更改一级机构负责人。')
        err_subject = _('用户是二级机构"%(items)s"的负责人，无法禁用。如确需禁用，请先更改二级机构负责人。')
    elif action == _Action.EDIT_ROLE:
        err_project = _('用户是一级机构"%(items)s"的负责人，无法修改权限。如确需修改，请先更改一级机构负责人。')
        err_subject = _('用户是二级机构"%(items)s"的负责人，无法修改权限。如确需修改，请先更改二级机构负责人。')
    else:
        raise ValueError(f'Invalid user action: {action}')

    projects = MaterialProject.objects.filter(leader=user).values_list('name', flat=True)
    subjects = MaterialSubject.objects.filter(leader=user).values_list('name', flat=True)
    projects = list(projects)
    subjects = list(subjects)
    if projects:
        raise MGEError.PERMISSION_DENIED(err_project % {'items': ', '.join(projects)})
    if subjects:
        raise MGEError.PERMISSION_DENIED(err_subject % {'items': ', '.join(subjects)})


@require_methods_api(['GET', 'POST'])
@require_role(UserRole.SYS_ADMIN)
def users(request: HttpRequest):
    if request.method == 'GET':
        return get_user_list(request)
    if request.method == 'POST':
        return add_user(request)


def add_user(request: HttpRequest):
    data = load_request_body(request)
    username = get_field(data, 'username', str, allow_none=False)
    password = get_field(data, 'password', str)
    real_name = get_field(data, 'real_name', str)
    email = get_field(data, 'email')
    institution = get_field(data, 'institution')
    role = get_field(data, 'role', int)
    tel = get_field(data, 'tel', str, allow_none=True)
    pattern = r'^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]+$'
    if len(password) <= 3:
        raise MGEError.WEAK_PASSWORD(_("密码长度必须大于3个字符"))
    if not re.search(pattern, password):
        raise MGEError.WRONG_PASSWORD_FORMAT(_("密码格式不正确（3个字符以上，只允许英文、数字、标点，不允许空格）"))
    if role == UserRole.ROOT:
        raise MGEError.PERMISSION_DENIED(_("无法添加role=5的用户"))
    if User.objects.filter(username=username).exists():
        raise MGEError.USER_ALREADY_EXISTS
    if User.objects.filter(email=email).exists():
        raise MGEError.EMAIL_ALREADY_EXISTS

    user = User(
        username=username, password=password, role=role,
        real_name=real_name, email=email, institution=institution,
        tel=tel
    )
    user.set_password(password)
    user.save()
    return json_response()


def get_user_list(request: HttpRequest):
    page = get_param('page', allow_none=True, convert_to=int, default=1)
    page_size = get_param('page_size', allow_none=True, convert_to=int)
    page_size = page_size or 10
    email = get_param('email', allow_none=True, convert_to=str)
    real_name = get_param('real_name', allow_none=True, convert_to=str)
    institution = get_param('institution', allow_none=True, convert_to=str)
    role = get_param('role', convert_to=int, allow_none=True)
    q = Q()
    if email:
        q &= Q(email__icontains=email)
    if real_name:
        q &= Q(real_name__icontains=real_name)
    if institution:
        q &= Q(institution__icontains=institution)
    if role is not None:
        q &= Q(role=role)
    _queryset = User.objects.filter(q).order_by('-date_joined').exclude(role=UserRole.ROOT)

    paginator = Paginator(_queryset, page_size)
    try:
        _queryset: list[User] = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        _queryset: list[User] = paginator.page(1)
        page = 1
    return json_response({
        'page': page,
        'page_size': page_size,
        'items': [ins.to_dict() for ins in _queryset],
        'num_items': paginator.count
    })


@require_role(UserRole.SYS_ADMIN)
@require_methods_api(['GET', 'POST'])
def excel(request: HttpRequest):
    if request.method == 'GET':
        return download_template(request)
    return batch_import(request)


def download_template(request: HttpRequest):
    # 文件名：批量导入用户填写模板-年月日时分秒.xlsx
    now = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    filename = f'批量导入用户填写模板-{now}.xlsx'
    with open(TEMPLATE_PATH, 'rb') as fp:
        data = fp.read()

    return FileResponse(BytesIO(data), filename=filename, as_attachment=True)


def batch_import(request: HttpRequest):
    file = request.FILES.get('file')
    if not file:
        raise MGEError.FIELD_MISSING("未上传文件")
    data = file.read()
    try:
        openpyxl.load_workbook(BytesIO(data))
    except Exception:
        raise MGEError.BAD_EXCEL(_("不是Excel文件"))

    try:
        imported_users = read_excel(BytesIO(data))
    except MGEException:
        raise
    except Exception:
        raise MGEError.BAD_EXCEL(_('请使用系统提供的Excel文件模板填写'))
    if not imported_users:
        raise MGEError.NO_AVAILABLE_DATA("Excel中没有填写用户信息")
    return json_response({
        'items': [user.to_dict() for user in imported_users],
        'num_items': len(imported_users)
    })


@require_methods_api(['PATCH'])
@require_role(UserRole.SYS_ADMIN)
def toggle_enable(request: HttpRequest, username: str):
    data = load_request_body(request)
    enabled = get_field(data, 'enabled', bool)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    if user.pk == request.user.pk:
        raise MGEError.PERMISSION_DENIED(_("不能修改自己的状态"))
    if not enabled:
        _check_projects_subjects(user, _Action.DISABLE)
        if user.role == UserRole.ROOT:
            raise MGEError.PERMISSION_DENIED(_("不能禁用超级管理员"))
    user.enabled = enabled
    user.save()
    return json_response({'enabled': enabled, 'username': username})


@require_methods_api(['PATCH'])
@require_role(UserRole.SYS_ADMIN)
def edit_role(request: HttpRequest, username: str):
    data = load_request_body(request)
    role = get_field(data, 'role', int)
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    if user.pk == request.user.pk:
        raise MGEError.PERMISSION_DENIED(_("不能修改自己的权限"))
    # if user.role >= UserRole.SYS_ADMIN and request.user.role != UserRole.ROOT:
    #     raise MGEError.PERMISSION_DENIED(_("不能修改管理员的权限"))
    try:
        role = UserRole(role)
    except ValueError:
        raise MGEError.INVALID_FIELD_VALUE(_("角色（role=%s）不存在") % str(role))
    if role == UserRole.ROOT:
        raise MGEError.PERMISSION_DENIED(_("无法将用户设置为超级管理员"))
    if role < UserRole.DATA_ADMIN:
        _check_projects_subjects(user, _Action.EDIT_ROLE)
    user.role = role
    user.save()
    return json_response({'role': role, 'username': username})


@require_role(UserRole.SYS_ADMIN)
@require_methods_api(['DELETE'])
def delete_user(request: HttpRequest, username: str):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    if user.pk == request.user.pk:
        raise MGEError.PERMISSION_DENIED(_("不能删除自己"))
    if user.role == UserRole.ROOT:
        raise MGEError.PERMISSION_DENIED(_("无法删除超级管理员"))
    _check_projects_subjects(user, _Action.DELETE)
    if DataMeta.objects.filter(user=user).count():
        raise MGEError.CANNOT_DELETE_USER(_("用户已提交数据，请先删除用户的数据。"))
    if Template.objects.filter(user=user).count():
        raise MGEError.CANNOT_DELETE_USER(_("用户已创建模板，请先删除用户的模板。"))
    if ProjectSubjectMember.objects.filter(user=user).count():
        raise MGEError.CANNOT_DELETE_USER(_("用户已加入机构，请先移出机构。"))
    user.delete()
    return json_response()


@require_role(UserRole.SYS_ADMIN)
@require_methods_api(['PATCH'])
def edit_password(request: HttpRequest, username: str):
    data = load_request_body(request)
    password = get_field(data, 'password', str)
    if len(password) <= 3:
        raise MGEError.WEAK_PASSWORD(_("密码长度必须大于3个字符"))
    pattern = r'^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]+$'
    if not re.search(pattern, password):
        raise MGEError.WRONG_PASSWORD_FORMAT(_("密码格式不正确（3个字符以上，只允许英文、数字、标点，不允许空格）"))
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    user.set_password(password)
    user.save()
    return json_response()


@login_required_api
@require_methods_api(['PATCH'])
def edit_password_personal(request: HttpRequest):
    username = request.user
    data = load_request_body(request)
    old_password = get_field(data, 'old_password', str)
    password = get_field(data, 'password', str)
    if len(password) <= 3:
        raise MGEError.WEAK_PASSWORD(_("密码长度必须大于3个字符"))
    pattern = r'^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]+$'
    if not re.search(pattern, password):
        raise MGEError.WRONG_PASSWORD_FORMAT(_("密码格式不正确（3个字符以上，只允许英文、数字、标点，不允许空格）"))
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    if not user.check_password(old_password):
        raise MGEError.WRONG_PASSWORD(_("原密码错误"))
    user.set_password(password)
    user.save()
    return json_response()


@require_methods_api(['PATCH'])
@require_role(UserRole.SYS_ADMIN)
def edit_user_base_info(request: HttpRequest, username: str):
    real_name = get_json_field_r(request, 'real_name', allow_none=True)
    email = get_json_field_r(request, 'email', allow_none=True)
    institution = get_json_field_r(request, 'institution', allow_none=True)
    tel = get_json_field_r(request, 'tel', allow_none=True)
    try:
        user = User.objects.get(username=username)
        if real_name:
            user.real_name = real_name
        if email:
            user.email = email
        if institution:
            user.institution = institution
        if tel:
            user.tel = tel
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND(_('用户"%s"不存在') % username)
    user.save()
    return json_response()
