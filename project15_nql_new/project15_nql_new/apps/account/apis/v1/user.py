from django.conf import settings
from django.contrib.auth import login, logout
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction
from django.db.models import Prefetch, Q
from django.http import HttpRequest, HttpResponse
from django.urls import reverse
from django.utils.translation import ugettext as _
from oauth2_provider.decorators import protected_resource
from oauth2_provider.views.generic import ProtectedResourceView

from apps.account.auth import check_login, require_role, is_the_same_user, ensure_privacy
from apps.account.models.notifications import Notification
from apps.account.models.users import User, UserRole, AccountAction, AdminMaterialCategory
from apps.account.notify import send_verification_email, send_reset_password_email
from apps.storage.models.file import ImageUsage
from apps.storage.models.material import MaterialCategory, MaterialSubject
from apps.ticketing.models import Ticket
from mgedata.errors.models import MGEException, MGEError
from mgedata.utils.general import (
    GlobalRequestMiddleware, login_required_api,
    require_methods_api, require_GET_api, require_POST_api, require_PATCH_api,
    get_json_field_r, get_param, json_response, get_remote_ip
)


def _send_verification_email(user):
    token = user.generate_token(AccountAction.VERIFY_EMAIL)
    link = 'http://%s%s' % (
        GlobalRequestMiddleware.get_current_request().get_host(), reverse('account:verify_email') + '?token=' + token)
    send_verification_email(user, link)


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
        captcha_response = get_json_field_r(request, 'captcha_response', str).upper()

        if 'HTTP_X_FORWARDED_FOR' in request.META.keys():
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        if not settings.DEBUG and ip not in settings.WHITE_LIST:
            if 'captcha_response' in request.session:
                answer = request.session['captcha_response']
                del request.session['captcha_response']
            else:
                answer = None
            if answer is None or answer != captcha_response:
                raise MGEError.WRONG_CAPTCHA

        users = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email))
        if users:
            user = users[0]
            if user.check_password(password):
                if not request.user.is_authenticated:
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


@require_GET_api
def generate_captcha(request: HttpRequest):
    from mgedata.utils.captcha import generate_challenge
    challenge = generate_challenge()
    request.session['captcha_response'] = challenge
    from mgedata.utils.captcha import captcha_image
    out = captcha_image(challenge)
    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    response['Content-length'] = out.tell()
    return response


# 获取用户创建课题列表，包含用户参与的和负责的所有课题
@require_methods_api(['GET'])
def get_user_material_subjects(request, username: str):
    check_login(request)
    # user = User.objects.get(username=request.user.username)
    if request.method == 'GET':
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int, allow_none=True)
        subjects = User.objects.get(username=username).materialsubject_set.all()

        ret = dict()
        ret['total'] = subjects.count()
        print(subjects.count())
        if page:
            paginator = Paginator(subjects, page_size or 3)
            try:
                subjects = paginator.page(page)
            except EmptyPage:
                subjects = paginator.page(paginator.num_pages)
            ret['page'] = page
            ret['page_size'] = page_size
        ret['results'] = list(map(lambda x: x.to_dict_members(), subjects))
        return json_response(ret, items=ret['results'])


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
        username = get_json_field_r(request, 'username', str)
        password = get_json_field_r(request, 'password', str)
        real_name = get_json_field_r(request, 'real_name', str)
        email = get_json_field_r(request, 'email')
        institution = get_json_field_r(request, 'institution')
        ip = get_remote_ip()
        if User.objects.filter(username=username).exists():
            raise MGEError.USER_ALREADY_EXISTS
        if User.objects.filter(email=email).exists():
            raise MGEError.EMAIL_ALREADY_EXISTS

        try:
            user = User(username=username, password=password,
                        real_name=real_name, email=email, institution=institution,
                        register_ip=ip)
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
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        email = get_param('email', allow_none=True, convert_to=str)
        real_name = get_param('real_name', allow_none=True, convert_to=str)
        institution = get_param('institution', allow_none=True, convert_to=str)
        query = get_param('query')

        _queryset = User.objects.order_by('username').select_related('userrolesforacceptancemodel')
        _queryset = _queryset.prefetch_related(Prefetch(
            'managed_categories',
            queryset=AdminMaterialCategory.objects.all().select_related('category')
        ))
        _queryset = _queryset.filter(email=email) if email else _queryset
        _queryset = _queryset.filter(real_name=real_name) if real_name else _queryset
        _queryset = _queryset.filter(institution=institution) if institution else _queryset
        if query:
            _queryset = _queryset.filter(
                Q(real_name__contains=query) | Q(username__contains=query) | Q(institution__contains=query))

        paginator = Paginator(_queryset, page_size or _queryset.count())
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
                old_status = user.email_verified
                old_email = user.email
                user.email = email
                user.email_verified = False
                try:
                    _send_verification_email(user)
                    user.save()
                    return json_response()
                except MGEException:
                    user.email = old_email
                    user.email_verified = old_status
                    user.save()
                    raise
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
    return json_response({'notifications': n_list, 'page_size': page_size, 'pages': paginator.num_pages, 'total': paginator.count})


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


@require_methods_api(["GET", "POST"])
def user_avatar(request: HttpRequest, username):
    if request.method == "POST":
        ensure_privacy(request, username)
        avatar = request.FILES.get('avatar')
        if avatar is None:
            raise MGEError.FIELD_MISSING(_('Part name "avatar" required'))
        else:
            request.user.set_avatar(avatar.file)
            return json_response()
    else:
        size = get_param('size', allowed=['large', 'small', 'normal'], allow_none=True)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise MGEError.RESOURCE_NOT_FOUND
        avatar = user.get_avatar(size=size)
        if avatar is None:
            # 返回默认头像
            if isinstance(size, str):
                size = size.lower()
            if size == User.AvatarSize.LARGE or size == 'large':
                suffix = 'lg'
            elif size == User.AvatarSize.NORMAL or size == 'normal':
                suffix = 'nm'
            else:
                suffix = 'sm'
            filename = '%s_%s.jpg' % (settings.AVATAR_DIR + "/default", suffix)
            try:
                with open(filename, 'rb') as fp:
                    return HttpResponse(fp.read(), content_type='image/jpeg')
            except FileNotFoundError:
                raise MGEError.NOT_FOUND
        else:
            return HttpResponse(avatar, content_type='image/jpeg')


@require_POST_api
@login_required_api
def resend_verification_email(request: HttpRequest):
    if request.user.email_verified:
        raise MGEError.EMAIL_ALREADY_VERIFIED
    _send_verification_email(request.user)
    s = _("An email has been sent to %(object1)s. Please click the link in it to verify your email address.")
    return json_response(s % {'object1': request.user.email})


@protected_resource(['read'])
@login_required_api
def oauth2_user_info(request: HttpRequest):
    return json_response(request.user.get_third_part_info())


class UserImageCount(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        username = request.GET.get('username', None)
        count = ImageUsage.objects.filter(meta__user_id=username).distinct('file').count()
        return json_response({'count': count})


@require_role(UserRole.USER_ADMIN)
@require_methods_api(["GET", "PATCH"])
def user_permissions(request: HttpRequest, username: str):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == "GET":
            return json_response({'roles': user.roles})
        else:
            d = {}
            if not user.has_role(UserRole.ROOT) and (is_the_same_user(request, username) or not user.email_verified):
                raise MGEError.PERMISSION_DENIED  # 不能为自己设置权限。邮箱未验证的用户也无法设置权限
            roles = user.set_roles(get_json_field_r(request, 'roles', int))
            d['roles_set'] = roles
            if roles & (UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN).value or user.has_role(UserRole.ROOT):
                categories = get_json_field_r(request, 'categories', list, allow_none=True)
                if categories is not None:  # 必须区分None和空
                    try:
                        categories = [int(x) for x in categories]
                    except (ValueError, TypeError):
                        raise MGEError.WRONG_FIELD_TYPE('categories must be list of int')
                    categories = MaterialCategory.objects.filter(pk__in=categories)
                    filtered = []
                    for c in categories:
                        if not c.leaf:
                            raise MGEError.PERMISSION_DENIED(f"Category {c.name} is not leaf!")
                        filtered.append(c)
                    with transaction.atomic():
                        amc_list = []
                        for c in filtered:
                            amc_list.append(AdminMaterialCategory(user=user, granter=request.user, category=c))
                        AdminMaterialCategory.objects.filter(user=user).delete()
                        AdminMaterialCategory.objects.bulk_create(amc_list)
                    d['categories'] = [x.id for x in filtered]
                ticket_id = get_json_field_r(request, 'ticket_id', int, allow_none=True)
                if ticket_id:
                    ticket = Ticket.objects.filter(pk=ticket_id).first()
                    if ticket:
                        ticket.finish_ticket()
            else:
                AdminMaterialCategory.objects.filter(user=user).delete()
            return json_response(d)
