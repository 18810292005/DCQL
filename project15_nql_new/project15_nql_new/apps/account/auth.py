from functools import wraps

from django.http import HttpRequest

from mgedata.errors.models import MGEError
from .models.users import UserRole, User, UserRolesForAcceptanceModel, UserRolesForAcceptance
from typing import Union, List
from django.contrib.auth.decorators import login_required


def ensure_privacy(request: HttpRequest, user: Union[str, User], is_api=True, error_detail=None):
    """
    使用此函数检测user是否为当前登录的用户，保证只能由user指定的用户访问，如果不是user，中断请求返回错误信息
    :param user: 可以为用户的username，也可以为一个User对象
    :return: None
    """
    if isinstance(user, str):
        username = user
    elif isinstance(user, User):
        username = user.username
    else:
        username = None
    if username != request.user.username:
        raise MGEError.PERMISSION_DENIED(error_detail)


def is_the_same_user(request: HttpRequest, user: Union[str, User]):
    if isinstance(user, str):
        username = user
    elif isinstance(user, User):
        username = user.username
    else:
        raise ValueError('user应该为User类型对象或用户名字符串')
    return username == request.user.username


def login_required_api(func):
    @wraps(func)
    def real_func(request: HttpRequest, *args, **kwargs):
        if not request.user.is_authenticated:
            raise MGEError.UNAUTHORIZED
        return func(request, *args, **kwargs)

    return real_func


def check_login(request: HttpRequest, is_api=True):
    if not request.user.is_authenticated:
        raise MGEError.UNAUTHORIZED


def has_role(user, roles: UserRole):
    if hasattr(user, User.has_role.__name__):
        return user.has_role(roles)


def require_role(required_roles: UserRole, is_api=True):
    def inner(func):
        @wraps(func)
        def real_func(request: HttpRequest, *args, **kwargs):
            if not request.user.is_authenticated:
                if not is_api:
                    return login_required(func)(request, *args, **kwargs)
                raise MGEError.UNAUTHORIZED
            elif request.user.has_role(required_roles | UserRole.ROOT):
                return func(request, *args, **kwargs)
            else:
                raise MGEError.PERMISSION_DENIED

        return real_func

    return inner

def require_role_for_rfw(required_roles: UserRole, is_api=True):
    '''
    为restframework视图方法提供权限验证
    '''
    def inner(func):
        @wraps(func)
        def real_func(viewset, request: HttpRequest, *args, **kwargs):
            if request.user.has_role(required_roles | UserRole.ROOT):
                return func(viewset, request, *args, **kwargs)
            else:
                raise MGEError.PERMISSION_DENIED
        return real_func

    return inner

def check_role(request, required_roles: UserRole, is_api=True) -> None:
    """
    检测用户是否有某种（某几种）角色，若没有抛出异常，终止响应
    可以使用位运算符号进行角色的与或操作。
    例如：
    UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN 表示要求用户是二者之一
    UserRole.TEMPLATE_ADMIN & UserRole.DATA_ADMIN 表示要求用户二者都具有
    :param request: HttpRequest对象
    :param required_roles: 要求用户所具有的角色
    :param is_api: 是否在API中使用本方法
    :return: 无
    """
    if not request.user.is_authenticated or not request.user.has_role(required_roles | UserRole.ROOT):
        raise MGEError.PERMISSION_DENIED


def require_acceptance_roles(roles: Union[int, List[UserRolesForAcceptance]]):
    if isinstance(roles, int):
        roles = [roles]
    else:
        roles = [role.value for role in roles]

    def decorator(func):
        @wraps(func)
        def inner(request: HttpRequest, *args, **kwargs):
            try:
                check_login(request)
                user_roles = UserRolesForAcceptanceModel.objects.get(user=request.user)
                if not request.user.is_root and not set(roles).issubset(set(user_roles.roles)):
                    raise MGEError.PERMISSION_DENIED("没有参与验收的权限")
            except UserRolesForAcceptanceModel.DoesNotExist:
                raise MGEError.PERMISSION_DENIED("没有参与验收的权限")
            return func(request, *args, **kwargs)

        return inner

    return decorator


def require_one_of_acceptance_roles(roles: Union[int, List[UserRolesForAcceptance]]):
    """
    具有roles只一即可
    """
    if isinstance(roles, int):
        roles = [roles]
    else:
        roles = [x.value for x in roles]

    def decorator(func):
        @wraps(func)
        def inner(request: HttpRequest, *args, **kwargs):
            try:
                check_login(request)
                user_roles = UserRolesForAcceptanceModel.objects.get(user=request.user)
                if not request.user.is_root and not set(roles) & set(user_roles.roles):
                    raise MGEError.PERMISSION_DENIED("没有参与验收的权限")
            except UserRolesForAcceptanceModel.DoesNotExist:
                raise MGEError.PERMISSION_DENIED("没有参与验收的权限")
            return func(request, *args, **kwargs)

        return inner

    return decorator
