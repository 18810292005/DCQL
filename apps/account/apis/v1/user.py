import hashlib

from django.conf import settings
from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http import HttpRequest, JsonResponse
from django.middleware.csrf import get_token
from django.http import HttpRequest
from django.urls import reverse
from django.utils.translation import gettext as _

from apps.account.auth import is_the_same_user
from apps.account.models.notifications import Notification
from apps.account.models.users import User, AccountAction, UserRole
from apps.account.notify import send_reset_password_email, send_email
from apps.storage.models.material import MaterialSubject, ProjectSubjectMember, MaterialProject
from mgedata.errors.models import MGEException, MGEError
from mgedata.utils.captcha import generate_challenge
from mgedata.utils.general import (
    login_required_api,
    require_methods_api, require_GET_api, require_POST_api, require_PATCH_api,
    get_json_field_r, get_param, json_response, load_request_body, get_field
)


def _send_verification_email(user):
    pass
    # token = user.generate_token(AccountAction.VERIFY_EMAIL)
    # link = 'http://%s%s' % (
    #     GlobalRequestMiddleware.get_current_request().get_host(), reverse('account:verify_email') + '?token=' + token)
    # send_verification_email(user, link)

@require_GET_api
def new_token(request: HttpRequest):
    csrftoken = get_token(request)
    response = JsonResponse({"code": MGEError.SUCCESS.code, "data": {"csrftoken": csrftoken}})
    response.set_cookie("csrftoken", csrftoken, httponly=True, max_age=1209600)
    return response


@require_methods_api(["POST", "DELETE"])
def session_api(request: HttpRequest):
    """
    POST: 登录
        username: 用户名
        password: 密码
    DELETE: 注销
    """
    if request.method == "POST":
        username_or_email = get_json_field_r(request, 'user', str)
        password = get_json_field_r(request, 'password', str)

        if 'HTTP_X_FORWARDED_FOR' in request.META.keys():
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']

        user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
        if user:
            if user.check_password(password) or settings.DEBUG:
                if not request.user.is_authenticated:
                    if not user.enabled:
                        raise MGEError.USER_DISABLED
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                    # LoginHistory.objects.create(user=user, ip=get_remote_ip())
                return json_response({'user': user.username, 'email': user.email})
            else:
                raise MGEError.WRONG_PASSWORD
        else:
            raise MGEError.USER_NOT_FOUND
    else:
        ret_data = {}
        if request.user.is_authenticated:
            ret_data['username'] = request.user.username
            ret_data['email'] = request.user.email
        logout(request)
        return json_response(ret_data)


@require_POST_api
def send_email_captcha(request: HttpRequest):
    username_or_email = get_json_field_r(request, 'user', str)
    user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
    if not user:
        raise MGEError.USER_NOT_FOUND
    else:
        challenge = generate_challenge()
        md5 = hashlib.md5()
        md5.update(challenge.encode())
        request.session['captcha_response'] = md5.hexdigest()
        title = '登录验证码'
        content = challenge
        send_email(user, title, content)
        return json_response()


@require_POST_api
def login_for_captcha(request: HttpRequest):
    username_or_email = get_json_field_r(request, 'user', str)
    captcha_response = get_json_field_r(request, 'captcha_response', str, allow_none=True, default="").upper()
    user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()

    if not user:
        raise MGEError.USER_NOT_FOUND
    md5 = hashlib.md5()
    md5.update(captcha_response.encode())
    if request.session.get('captcha_response') != md5.hexdigest():
        raise MGEError.WRONG_CAPTCHA
    else:
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return json_response({'user': user.username, 'email': user.email})


@require_POST_api
def login_for_token(request: HttpRequest):
    username_or_email = get_json_field_r(request, 'user', str)
    password = get_json_field_r(request, 'password', str)
    user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
    if user:
        if user.check_password(password):
            token = user.generate_token(AccountAction.LOGIN)
            return json_response({'token': token})
        else:
            raise MGEError.WRONG_PASSWORD
    else:
        raise MGEError.USER_NOT_FOUND


@require_POST_api
@login_required_api
def refresh_login_status(request: HttpRequest):
    if not request.user.is_authenticated:
        raise MGEError.USER_NOT_FOUND

    username = request.user.username
    email = request.user.email
    user = User.objects.filter(Q(username=username) | Q(email=email)).first()
    logout(request)
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return json_response({'user': username, 'email': email})


@login_required_api
@require_methods_api(["GET", "POST", "DELETE"])
def subject_users(request: HttpRequest, subject_id: str):
    """
      GET: 获取课题成员列表信息（需要至少用户管理员权限）
        Parameter:
            page: int, 返回的页码数量
            page_size: int, 分页的大小
        return：
            results:list[dict],课题成员信息的列表信息
            page:int,页码
            page_size:int,页面大小
            total:int,用户总数
      POST: 添加课题成员（从平台内部选择）
      DELETE：删除课题成员

      """
    if request.method == "POST":
        user = get_param('username')
        try:
            user = User.objects.get(username=user)
        except User.DoesNotExist:
            raise MGEError.USER_NOT_FOUND(f"用户{user}不存在")
        subject_lists = user.my_subjects.all()
        project_id = MaterialSubject.objects.get(id=subject_id).project_id
        if not User.objects.filter(username=user).exists():
            raise MGEError.USER_NOT_FOUND
        elif subject_lists.filter(id=subject_id).exists():
            raise MGEError.USER_ALREADY_EXISTS
        for sub in subject_lists:
            if sub.project_id == project_id:
                raise MGEError.BAD_DATA
        try:
            subject = MaterialSubject.objects.get(id=subject_id)
            subject.user.add(user)
            return json_response()
        except MGEException as e:
            raise e
        except ValidationError as e:
            raise e

    elif request.method == "GET":
        # check_role(request, UserRole.USER_ADMIN)
        query_set = {}
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int, allow_none=True)
        if subject_id:
            query_set['id'] = subject_id
        users = MaterialSubject.objects.order_by('username').get(id=subject_id).user.all()
        ret = dict()
        ret['total'] = users.count()
        if page:
            paginator = Paginator(users, page_size or 3)
            try:
                users = paginator.page(page)
            except EmptyPage:
                users = paginator.page(paginator.num_pages)
            ret['page'] = page
            ret['page_size'] = page_size
        ret['results'] = list(map(lambda x: x.to_dict(), users))
        return json_response(ret, items=ret['results'])
    elif request.method == "DELETE":
        u_name = get_param('username')
        subject = MaterialSubject.objects.get(id=subject_id)
        subject_members = subject.user
        if not User.objects.filter(username=u_name).exists():
            raise MGEError.USER_NOT_FOUND
        elif MaterialSubject.objects.filter(user=subject_members).exists():
            raise MGEError.USER_ALREADY_EXISTS

        member = subject_members.get(username=u_name)
        subject.user.remove(member)

        return json_response()


@require_methods_api(["GET", "POST"])
def user_list(request: HttpRequest):
    """
    GET: 获取用户列表
    POST: 注册

    :param request:
    :return:
    """
    if request.method == "POST":
        data = load_request_body(request)
        username = get_field(data, 'username', str)
        password = get_field(data, 'password', str)
        real_name = get_field(data, 'real_name', str)
        email = get_field(data, 'email')
        institution = get_field(data, 'institution')
        role = get_field(data, 'role', int)
        tel = get_field(data, 'tel', str, allow_none=True)
        if role == UserRole.ROOT:
            raise MGEError.PERMISSION_DENIED(_("无法添加role=5的用户"))
        if User.objects.filter(username=username).exists():
            raise MGEError.USER_ALREADY_EXISTS
        if User.objects.filter(email=email).exists():
            raise MGEError.EMAIL_ALREADY_EXISTS

        try:
            user = User(
                username=username, password=password, role=role,
                real_name=real_name, email=email, institution=institution,
                tel=tel
            )
            user.email_verified = True
            user.set_password(password)
            user.save()
            # _send_verification_email(user)
            return json_response()
        except MGEException as e:
            raise e
        except ValidationError as e:
            raise e

    elif request.method == "GET":
        # check_role(request, UserRole.USER_ADMIN)
        page = get_param('page', allow_none=True, convert_to=int, default=None)
        page_size = get_param('page_size', allow_none=True, convert_to=int, default=None)
        email = get_param('email', allow_none=True, convert_to=str)
        real_name = get_param('real_name', allow_none=True, convert_to=str)
        institution = get_param('institution', allow_none=True, convert_to=str)
        new = get_param('new', allow_none=True, default=False)
        query = get_param('query')
        new = True if new == "true" else False
        _queryset = User.objects.order_by('username').exclude(role=UserRole.ROOT)
        _queryset = _queryset.filter(email=email) if email else _queryset
        _queryset = _queryset.filter(real_name=real_name) if real_name else _queryset
        _queryset = _queryset.filter(institution=institution) if institution else _queryset
        if query:
            _queryset = _queryset.filter(
                Q(real_name__contains=query) | Q(username__contains=query) | Q(institution__contains=query))

        paginator = Paginator(_queryset, page_size or _queryset.count())
        if not new:
            try:
                _queryset: list[User] = paginator.page(page)
            except (PageNotAnInteger, EmptyPage):
                _queryset: list[User] = paginator.page(1)
                page = 1
            return json_response({
                'page': page,
                'page_size': page_size,
                'results': [ins.to_dict() for ins in _queryset],
                'total': paginator.count
            })
        else:
            user_dict = {}
            for record in _queryset:
                user_dict[record.username] = {}
                user_dict[record.username]['user'] = record.to_dict()
                user_dict[record.username]["project"] = {"project_id": [], "project_name": []}
                user_dict[record.username]["subject"] = {"subject_id": [], "subject_name": []}
            for record in ProjectSubjectMember.objects.filter(
                    project_id__in=[project.id for project in MaterialProject.objects.all()],
                    subject__isnull=True
            ).select_related('user'):
                if record.user.username in list(user_dict):
                    user_dict[record.user.username]["project"]["project_id"].append(record.project.id)
                    user_dict[record.user.username]["project"]["project_name"].append(record.project.name)
            for record in ProjectSubjectMember.objects.filter(
                    subject_id__in=[subject.id for subject in MaterialSubject.objects.all()],
            ).select_related('user'):
                if record.user.username in list(user_dict):
                    user_dict[record.user.username]["subject"]["subject_id"].append(record.subject.id)
                    user_dict[record.user.username]["subject"]["subject_name"].append(record.subject.name)
            user_lists = []
            for user in user_dict:
                user_lists.append(user_dict[user])
            if page and page_size:
                paginator = Paginator(user_lists, page_size)
                page_obj = list(paginator.get_page(page))
                return json_response({
                    'page': page,
                    'page_size': page_size,
                    'results': page_obj,
                    'total': paginator.count
                })
            else:
                return json_response({
                    'page': 1,
                    'page_size': None,
                    'results': user_lists,
                    'total': paginator.count
                })


@login_required_api
@require_GET_api
def user_info(request: HttpRequest):
    user = request.user
    ret = request.user.to_dict()
    ret['unread_count'] = request.user.unread_count()
    notifications = []
    for notification in Notification.objects.filter(unread=True, important=True, recipient=user):
        notifications.append(notification.to_dict())
    ret['notifications'] = notifications
    ret['help'] = []
    user_obj = User.objects.get(username=request.user.username)
    if user_obj:
        if user_obj.role >= UserRole.GUEST:
            ret['help'].append({"权限管理": "/help/roles/"})
        if user_obj.role >= UserRole.RESEARCHER:
            ret['help'].append({"创建模板与数据": "/help/research/"})
        if user_obj.role >= UserRole.DATA_ADMIN:
            ret['help'].append({"审核模板与数据": "/help/review/"})
        if user_obj.role >= UserRole.SYS_ADMIN:
            ret['help'].append({"管理文档": "/help/manage/"})
    return json_response(ret)


@login_required_api
@require_methods_api(["GET", "PATCH", "DELETE"])
def user_resource(request: HttpRequest, username: int):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.NOT_FOUND
    if request.method == "GET":
        return json_response(user.to_dict())
    elif request.method == "PATCH":
        if is_the_same_user(request, user):  # 用户自己更新个人信息
            """
                修改email
            """
            email = get_json_field_r(request, 'email', str)
            if email and user.email != email:
                if User.objects.filter(email=email).count() > 0:
                    raise MGEError.EMAIL_ALREADY_EXISTS
                user.email = email
                user.save()
                return json_response()
            """
            修改密码及其他信息
            """
            new_password = get_json_field_r(request, 'new_password', str, allow_none=True)
            if new_password:
                old_password = get_json_field_r(request, 'old_password', str)
                if user.check_password(old_password):
                    user.set_password(new_password)
                else:
                    raise MGEError.WRONG_PASSWORD

            institution = get_json_field_r(request, 'institution', str, allow_none=True)
            real_name = get_json_field_r(request, 'real_name', str, allow_none=True)
            tel = get_json_field_r(request, 'tel', str, allow_none=True)
            if tel:
                user.tel = tel
            if institution:
                user.institution = institution
            if real_name:
                user.real_name = real_name
            user.save()
            return json_response()

        else:
            # """
            # 管理员审核用户
            # """
            # check_role(request, UserRole.USER_ADMIN)
            # if user.role == UserRole.VERIFIED_USER:
            #     raise MGEError.PERMISSION_DENIED
            # verified = get_json_field_r(request, 'verified', bool)
            # if verified:
            #     user.role = UserRole.VERIFIED_USER
            #     user.save()
            # else:
            #     # TODO 给用户发送审核失败的通知？
            #     pass
            # return json_response()
            raise MGEError.PERMISSION_DENIED

    if request.method == "DELETE":
        # TODO 添加删除用户功能
        return json_response()


@require_methods_api(["POST"])
def reset_password_request(request: HttpRequest):  # /users/password/reset_request
    try:
        user = User.objects.get(email=get_json_field_r(request, 'email', str))
        token = user.generate_token(AccountAction.RESET_PASSWORD)
        link = 'http://%s%s' % (
            request.get_host(),
            reverse('account:reset_password') + '?token=' + token)
        s = _("An email has been sent to %(object1)s. Please click the link in it to reset your password")
        send_reset_password_email(user, link)
        return json_response(s % {'object1': user.email})
    except User.DoesNotExist:
        raise MGEError.USER_NOT_FOUND


@require_PATCH_api
def reset_password(request: HttpRequest):
    token = get_json_field_r(request, 'token', str)
    new_password = get_json_field_r(request, 'new_password', str)
    user = User.user_from_token(token)
    if not user or not user.verify_token(token, AccountAction.RESET_PASSWORD):
        raise MGEError.BAD_TOKEN
    user.set_password(new_password)
    user.save()
    return json_response(_('Your password has been reset.'))


@require_methods_api(["GET"])
@login_required_api
def notification_list(request: HttpRequest):
    page = get_param('page', convert_to=int, default=1)
    page_size = get_param('page_size', convert_to=int, default=10)
    n_type = get_param('type', allowed=['read', 'unread'], allow_none=True)
    n_list = request.user.notifications.all()
    if n_type is not None:
        unread = False if n_type == 'read' else True

        if unread:
            n_list = request.user.notifications.filter(unread=True)
            n_list.update(unread=False)
        else:
            n_list = request.user.notifications.filter(unread=False)

    paginator = Paginator(n_list, page_size)

    try:
        n_list = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        n_list = []
    n_list = [x.to_dict() for x in n_list]
    return json_response(
        {'notifications': n_list, 'page_size': page_size, 'pages': paginator.num_pages, 'total': paginator.count})


@require_methods_api(["GET", "DELETE", "PATCH"])
@login_required_api
def notification_resource(request: HttpRequest, n_id):
    from apps.account.models.notifications import Notification
    try:
        notification = request.user.notifications.get(pk=n_id)
        if request.method == "GET":
            return json_response(notification.to_dict())
        elif request.method == 'DELETE':
            notification.delete()
        else:  # 已读
            notification.unread = False
            notification.save()
        return json_response()
    except Notification.DoesNotExist:
        raise MGEError.RESOURCE_NOT_FOUND


@require_POST_api
@login_required_api
def resend_verification_email(request: HttpRequest):
    if request.user.email_verified:
        raise MGEError.EMAIL_ALREADY_VERIFIED
    _send_verification_email(request.user)
    s = _("An email has been sent to %(object1)s. Please click the link in it to verify your email address.")
    return json_response(s % {'object1': request.user.email})


@require_POST_api
def register_user(request: HttpRequest):
    """
    只能注册游客
    role = UserRole.GUEST
    """
    data = load_request_body(request)
    username = get_field(data, 'username', str)
    password = get_field(data, 'password', str)
    real_name = get_field(data, 'real_name', str)
    email = get_field(data, 'email')
    institution = get_field(data, 'institution')
    role = UserRole.GUEST
    if User.objects.filter(username=username).exists():
        raise MGEError.USER_ALREADY_EXISTS
    if User.objects.filter(email=email).exists():
        raise MGEError.EMAIL_ALREADY_EXISTS

    user = User(
        username=username, password=password, role=role,
        real_name=real_name, email=email, institution=institution
    )
    user.set_password(password)
    user.save()
    return json_response()
