from functools import wraps

from django.http import HttpRequest
from oauth2_provider.models import AccessToken

from apps.sso_server.models import Oauth2OpenApiAuth
from apps.sso_server.openapi.auth import OpenApiAuthState
from mgedata.errors.models import MGEError


# oauth2 token校验器,用于校验token是否有效
def token_validator(func):
    @wraps(func)
    # 保持原函数名不变
    def wrapper(*args, **kwargs):
        request = args[0] if isinstance(args[0], HttpRequest) else args[1]
        AUTH_VALUE_HEADER = 'Bearer '
        authorization_header = request.headers.get('Authorization')
        if authorization_header is None:
            raise MGEError.OPEN_API_PERMISSION_DENIED("token缺失,请在header中填写token [Authorization] [token]")
        token = authorization_header[len(AUTH_VALUE_HEADER):]
        try:
            AccessToken.objects.get(token=token)
        except AccessToken.DoesNotExist:
            raise MGEError.OPEN_API_PERMISSION_DENIED("token不存在或已失效")
        res = func(*args, **kwargs)
        return res

    return wrapper


# oauth2 openapi装饰器,用于校验token是否有效,是否有权使用对应openapi
def open_api_auth(func):
    @wraps(func)
    # 保持原函数名不变
    def wrapper(*args, **kwargs):
        from apps.sso_server.openapi.urls import get_url_name_by_path
        request = args[0] if isinstance(args[0], HttpRequest) else args[1]
        AUTH_VALUE_HEADER = 'Bearer '
        authorization_header = request.headers.get('Authorization')
        if authorization_header is None:
            raise MGEError.OPEN_API_PERMISSION_DENIED("token缺失,请在header中填写token [Authorization] [token]")
        token = authorization_header[len(AUTH_VALUE_HEADER):]
        api_name = get_url_name_by_path(request.get_full_path().replace('/openapi/', '').split('?')[0])
        if api_name is None:
            raise MGEError.BAD_REQUEST("open api 未找到或已失效")
        try:
            application = AccessToken.objects.get(token=token).application
            api_auth = Oauth2OpenApiAuth.objects.get(application=application, api_name=api_name)
            if api_auth.state != OpenApiAuthState.APPROVE.value:
                raise MGEError.OPEN_API_PERMISSION_DENIED(f"您不具备使用\"{api_auth.api_name}\"的权限")
        except AccessToken.DoesNotExist:
            raise MGEError.OPEN_API_PERMISSION_DENIED("token不存在或已失效")
        except Oauth2OpenApiAuth.DoesNotExist:
            raise MGEError.OPEN_API_PERMISSION_DENIED(f"请申请api\"{api_name}\"的使用权限")

        res = func(*args, **kwargs)
        return res

    return wrapper
