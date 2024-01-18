import re

from django.urls import path

from apps.sso_server.openapi.account.apis import oauth2_user_info
from apps.sso_server.openapi.apis import OpenApiApply, OpenApiReview
from apps.sso_server.openapi.storage.apis import DataEndpoint
from apps.sso_server.openapi.storage.apis import TemplateOauth2View, MaterialTreeOauth2View, MaterialProjectsOauth2View
from apps.sso_server.openapi.storage.sync_data import sync_data
from apps.sso_server.openapi.task.apis import oauth2_one_task, oauth2_tasks_list

urlpatterns = [
    # application
    path("api/apply", OpenApiApply.as_view(), name='api_oauth2_apply'),
    path("api/review", OpenApiReview.as_view(), name='api_oauth2_review'),

    # task
    path("api/tasks/<int:task_id>", oauth2_one_task, name='oauth2_one_task'),
    path("api/tasks/list", oauth2_tasks_list, name='oauth2_tasks_list'),
]

openapi_urlpatterns = [
    # account
    path("user/info", oauth2_user_info, name='openapi_oauth2_user_info'),

    # storage
    path(r'templates', TemplateOauth2View.as_view(), name='openapi_oauth2_templates'),
    path(r'templates/<int:tid>', TemplateOauth2View.as_view(), name='openapi_oauth2_templates_one'),
    path(r'material/category/tree', MaterialTreeOauth2View.as_view(), name='openapi_oauth2_material_category_tree'),
    path(r'projects/', MaterialProjectsOauth2View.as_view(), name='openapi_oauth2_material_projects'),
    path('data/full', DataEndpoint.as_view(), name='openapi_oauth2_data_full'),
    path('data/full/<int:oid>', DataEndpoint.as_view(), name='openapi_oauth2_data_full_one'),

    # sync
    path('data/sync', sync_data, name='openapi_oauth2_sync_data'),
]

urlpatterns += openapi_urlpatterns


def get_openapi_url_names():
    return [url_pattern.name for url_pattern in openapi_urlpatterns]


def get_url_name_by_path(path: str):
    r_pattern = re.compile(r"<URLPattern '(.+)' \[name='(.+)']")
    ret = {}
    for open_api_url in openapi_urlpatterns:
        url_path, name = re.search(r_pattern, str(open_api_url)).groups()
        ret[url_path] = name
    return ret.get(path, None)
