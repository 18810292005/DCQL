from django.conf import settings
from apps.account.models.notifications import SystemNotification
from django.http import HttpRequest
from django.template import RequestContext
from apps.account.models.users import UserRole


def site_settings(request):
    ret = {}

    # base_url部分
    base_url = settings.SITE_BASE_URL
    if base_url == '' or base_url[0] != '/':
        base_url = '/' + base_url
    ret['BASE_URL'] = base_url

    # 第三方入口
    enable_entrance = settings.ENABLE_ENTRANCE
    ret['ENABLE_ENTRANCE'] = enable_entrance

    return ret


def inject_media_url(request):
    return {'media_url': settings.MEDIA_URL}


def inject_user_roles(request):
    """
    使得django template中可以直接使用UserRole
    :param request:
    :return:
    """
    return dict(UserRole=UserRole.__members__)
