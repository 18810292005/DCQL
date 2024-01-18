import json
import time

from django.http import HttpRequest, HttpResponse
from django.utils.deprecation import MiddlewareMixin

from mgedata.errors.models import MGEError
from apps.service.models import VisitRecord, VisitApiRecord
from apps.account.models.users import UserRole


class UserVisitsMiddleware(MiddlewareMixin):
    """Updates the OnlineUserActivity database whenever an authenticated user makes an HTTP request."""

    @staticmethod
    def process_request(request: HttpRequest):
        request.start_time = time.time()
        request.temp_request_body = request.body
        user = request.user
        if request.get_full_path().startswith('/oauth2/applications'):
            if user.is_authenticated and user.has_role(UserRole.ROOT | UserRole.THIRD_APPLICATION):
                return
            raise MGEError.PERMISSION_DENIED
        if not user.is_authenticated:
            return
        if request.get_full_path().startswith('/api'):
            return
        VisitRecord.visit(user)

    @staticmethod
    def process_response(request: HttpRequest, response: HttpResponse):
        if hasattr(request, 'start_time'):
            execute_ms_time = (time.time() - request.start_time) * 1000
            if execute_ms_time > 2500:
                username = request.user.username if request.user.is_authenticated else "匿名用户"
                visit = VisitApiRecord.objects.create(username=username, path=request.get_full_path(),
                                                      cost_time=execute_ms_time,
                                                      method=request.method)
                if request.content_type == 'application/json' and request.method == 'POST':
                    visit.body = json.loads(request.temp_request_body.decode())
                    visit.save()
        return response
