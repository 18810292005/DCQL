from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.http import HttpRequest
from django.views import View
from oauth2_provider.models import AccessToken
from oauth2_provider.views import ProtectedResourceView

from apps.account.models.users import UserRole
from apps.sso_server.models import Oauth2OpenApiAuth
from apps.sso_server.openapi.auth import OpenApiAuthState
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_json_field_r, get_param


class OpenApiApply(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        from apps.sso_server.openapi.urls import get_openapi_url_names
        token = Oauth2OpenApiAuth.get_token(request)
        try:
            application = AccessToken.objects.get(token=token).application
        except AccessToken.DoesNotExist:
            raise MGEError.OPEN_API_PERMISSION_DENIED
        api_applications = list(Oauth2OpenApiAuth.objects.filter(application=application).values('api_name', 'state'))

        return json_response(
            data={'api_names': get_openapi_url_names(), 'api_applications': api_applications})

    def post(self, request, *args, **kwargs):
        """
        申请openAPI
        """
        from apps.sso_server.openapi.urls import get_openapi_url_names
        token = Oauth2OpenApiAuth.get_token(request)
        api_name = get_json_field_r(request, 'api_name', required_type=str, allowed=get_openapi_url_names())
        re_apply = get_json_field_r(request, 're_apply', required_type=bool, default=False)

        application = AccessToken.objects.get(token=token).application
        queryset = Oauth2OpenApiAuth.objects.filter(application=application, api_name=api_name)
        open_api = queryset.first()
        if open_api is not None:
            if open_api.state == OpenApiAuthState.REJECT.value and re_apply:
                open_api.state = OpenApiAuthState.PENDING.value
                open_api.save()
            else:
                raise MGEError.OPEN_API_INVALID_REQUEST(
                    f"api:\"{api_name}\"已处于\"{OpenApiAuthState(open_api.state).description}\"状态")
        else:
            open_api = Oauth2OpenApiAuth.objects.create(application=application, api_name=api_name,
                                                        state=OpenApiAuthState.PENDING.value)
        return json_response(data={"api_name": api_name, 'state': open_api.state})


class OpenApiReview(View):
    def get(self, request: HttpRequest):
        if not request.user.is_authenticated or not request.user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED
        page = get_param('page', convert_to=int, default=1)
        page_size = get_param('page_size', convert_to=int, default=10)
        client_id = get_param('client_id', convert_to=str, allow_none=True)
        state = get_param('state', convert_to=int, allowed=[state.value for state in OpenApiAuthState], allow_none=True)
        q = Q()
        if state != None:
            q &= Q(state=state)
        if client_id:
            q &= Q(application__client_id=client_id)
        queryset = Oauth2OpenApiAuth.objects.filter(q)
        paginator = Paginator(queryset.order_by('id'), page_size)
        try:
            open_apis = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            open_apis = paginator.page(1)
        return json_response({'data': [open_api.to_dict() for open_api in open_apis], 'page_count': paginator.num_pages,
                              'current_page': page})

    def post(self, request: HttpRequest):
        if not request.user.is_authenticated or not request.user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED
        apply_id = get_json_field_r(request, 'apply_id', required_type=int)
        state = get_json_field_r(request, 'state', required_type=int,
                                 allowed=[state.value for state in OpenApiAuthState])
        try:
            open_api = Oauth2OpenApiAuth.objects.get(id=apply_id)
            open_api.state = state
            open_api.save()
            return json_response()
        except Oauth2OpenApiAuth.DoesNotExist:
            raise MGEError.NOT_FOUND
