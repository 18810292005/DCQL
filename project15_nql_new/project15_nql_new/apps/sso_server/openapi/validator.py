from django.core.exceptions import ValidationError


def validate_open_api_name(name):
    from apps.sso_server.openapi.urls import get_openapi_url_names
    if name not in get_openapi_url_names():
        raise ValidationError("open api 不存在或已过期")
