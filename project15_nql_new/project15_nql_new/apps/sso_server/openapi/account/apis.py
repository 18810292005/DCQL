from django.http import HttpRequest
from oauth2_provider.decorators import protected_resource

from apps.account.auth import login_required_api
from apps.sso_server.openapi.decorator import open_api_auth
from mgedata.utils.general import json_response


@protected_resource(['read'])
@open_api_auth
@login_required_api
def oauth2_user_info(request: HttpRequest):
    return json_response(request.user.get_third_part_info())
