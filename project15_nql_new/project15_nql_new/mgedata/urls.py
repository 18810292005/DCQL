"""mgedata URL Configuration
"""
from django.apps import apps
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.utils.translation import get_language
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView
from django.views.i18n import JavaScriptCatalog

from apps.mge.views import set_language, site_index, get_js_resolver, update_history, latest_migrations, \
    latest_core_dump

urlpatterns = [
    path(settings.SITE_BASE_URL + r'admin/', admin.site.urls),

    # view urls
    path(settings.SITE_BASE_URL + r'storage/',
         include(('apps.storage.urls', 'apps.storage'), namespace='storage')),
    path(settings.SITE_BASE_URL + r'account/',
         include(('apps.account.urls', 'apps.account'), namespace='account')),
    path(settings.SITE_BASE_URL + r'service/',
         include(('apps.service.urls', 'apps.service'), namespace='service')),
    path(settings.SITE_BASE_URL + r'search/',
         include(('apps.search.urls', 'apps.search'), namespace='search')),
    path(settings.SITE_BASE_URL + r'analytics/',
         include(('apps.analytics.urls', 'apps.analytics'), namespace='analytics')),
    path(settings.SITE_BASE_URL + r'ticketing/',
         include(('apps.ticketing.urls', 'apps.ticketing'), namespace='ticketing')),
    # path(settings.SITE_BASE_URL + r'task/',
    #      include(('apps.task.urls', 'apps.task'), namespace='task')),
    path(settings.SITE_BASE_URL + r'cert/',
         include(('apps.certificate.urls', 'apps.certificate'), namespace='certificate')),
    # api v1 urls
    path(settings.SITE_BASE_URL + r'api/v1/storage/',
         include(('apps.storage.apis.v1_0.urls', 'apps.storage'), namespace='api_v1_storage')),
    path(settings.SITE_BASE_URL + r'api/v1.1/storage/',
         include(('apps.storage.apis.v1_1.urls', 'apps.storage'), namespace='api_v1_1_storage')),
    path(settings.SITE_BASE_URL + r'api/v1/account/',
         include(('apps.account.apis.v1.urls', 'apps.account'), namespace='api_v1_account')),
    path(settings.SITE_BASE_URL + r'api/v1/service/',
         include(('apps.service.api_v1_urls', 'apps.service'), namespace='api_v1_service')),
    # path(settings.SITE_BASE_URL + r'api/v1/search/',
    #      include(('apps.search.apis.v1_urls', 'apps.search'), namespace='api_v1_search')),
    path(settings.SITE_BASE_URL + r'api/',
         include(('apps.analytics.urls', 'apps.analytics'), namespace='api_analytics')),
    path(settings.SITE_BASE_URL + r'api/v1/ticketing/',
         include(('apps.ticketing.api_v1_urls', 'apps.ticketing'), namespace='api_v1_ticketing')),
    path(settings.SITE_BASE_URL + r'api/v1/task/',
         include(('apps.task.api_v1_urls', 'apps.task'), namespace='api_v1_task')),
    # api v2 urls
    path(settings.SITE_BASE_URL + r'api/v2/storage/',
         include(('apps.storage.apis.v2.urls', 'apps.storage'), namespace='api_v2_storage')),
    path(settings.SITE_BASE_URL + r'api/v2/search/',
         include(('apps.search.apis.v2.urls', 'apps.search'), namespace='api_v2_search')),
    # api v3 urls
    path(settings.SITE_BASE_URL + r'api/v3/storage/',
         include(('apps.storage.apis.v3.urls', 'apps.storage'), namespace='api_v3_storage')),
    path(settings.SITE_BASE_URL + r'api/v3/account/',
         include(('apps.account.apis.v3.urls', 'apps.account'), namespace='api_v3_account')),

    # api v4 urls
    path(settings.SITE_BASE_URL + r'api/v4/storage/',
         include(('apps.storage.apis.v4.urls', 'apps.storage'), namespace='api_v4_storage')),

    # account api v4
    path(settings.SITE_BASE_URL + 'api/v4/account/',
         include(('apps.account.apis.v4.urls', 'apps.account'), namespace='api_v4_account')),

    # certificate api
    path(settings.SITE_BASE_URL + 'api/cert/',
         include(('apps.certificate.apis.urls', 'apps.certificate'), namespace='api_cert')),

    # page view
    path(settings.SITE_BASE_URL + r'',
         site_index, name='site_index'),
    path(settings.SITE_BASE_URL + r'help', TemplateView.as_view(template_name='help.html'), name='site_help'),
    path(settings.SITE_BASE_URL + 'api/history', update_history, name='update_history'),
    path(settings.SITE_BASE_URL + 'api/migrations', latest_migrations),
    path(settings.SITE_BASE_URL + 'api/coredump', latest_core_dump),
    path(settings.SITE_BASE_URL + r'download_client', TemplateView.as_view(template_name='download_client.html'),
         name='download_client'),
    path(settings.SITE_BASE_URL + r'update', TemplateView.as_view(template_name='update.html'), name='update'),
    path(settings.SITE_BASE_URL + r'project_analytics', TemplateView.as_view(template_name='project_analytics.html'),
         name='project_analytics'),

    path(settings.SITE_BASE_URL + r'app_entrance', TemplateView.as_view(template_name='app_entrance.html'),
         name='app_entrance'),
    path(settings.SITE_BASE_URL + r'app_entrance/microscope', TemplateView.as_view(template_name='introductions.html'),
         name='microscope'),
    path(settings.SITE_BASE_URL + r'set-language',
         set_language, name='site_set_language'),
    path(settings.SITE_BASE_URL + r'get-urls',
         get_js_resolver, name='site_urls'),
    path(settings.SITE_BASE_URL + r'jsi18n/',
         cache_page(86400, key_prefix='js18n-%s' % get_language())(JavaScriptCatalog.as_view()),
         name='javascript-catalog'),
    path(settings.SITE_BASE_URL + r'dashboard/', TemplateView.as_view(template_name='dashboard.html'),
         name='dashboard'),
    path(settings.SITE_BASE_URL + r'about/', TemplateView.as_view(template_name='about.html'), name='about'),
    path(settings.SITE_BASE_URL + r'project/', TemplateView.as_view(template_name='project.html'), name='project'),
    path(settings.SITE_BASE_URL + r'download_client', TemplateView.as_view(template_name='download_client.html'),
         name='download_client'),
    path(settings.SITE_BASE_URL + r'account/uploads/', TemplateView.as_view(template_name='upload_history.html'),
         name='upload_history'),
    path(settings.SITE_BASE_URL + r'task/', TemplateView.as_view(template_name='task.html'),
         name='task'),
    path(settings.SITE_BASE_URL + r'search_20/', TemplateView.as_view(template_name='search_20.html'),
         name='search_20'),
    path(settings.SITE_BASE_URL + r'export_data20/', TemplateView.as_view(template_name='export_20.html'),
         name='export_data20'),
    path(settings.SITE_BASE_URL + r'submit_feedback/', TemplateView.as_view(template_name='submit_feedback.html'),
         name='submit_feedback'),
    path(settings.SITE_BASE_URL + r'feedback_detail/', TemplateView.as_view(template_name='feedback_detail.html'),
         name='feedback_detail'),
    path(settings.SITE_BASE_URL + r'account/system', TemplateView.as_view(template_name='system_manage.html'),
         name='system_manage'),
    path(settings.SITE_BASE_URL + r'feedback_list/', TemplateView.as_view(template_name='feedback_list.html'),
         name='feedback_list'),
    path(settings.SITE_BASE_URL + r'expr_result/', TemplateView.as_view(template_name='expr_search_result.html'),
         name='expr_search_result'),
    path(settings.SITE_BASE_URL + r'expr_search/', TemplateView.as_view(template_name='expr_search.html'),
         name='expr_search'),
    # NXP search
    path(settings.SITE_BASE_URL + r'show_data_nxp/', TemplateView.as_view(template_name='show_data_nxp.html'),
         name='show_data_nxp'),
    path(settings.SITE_BASE_URL + r'search_nxp/', TemplateView.as_view(template_name='search_nxp_index.html')),
    path(settings.SITE_BASE_URL + r'api/search/nxp/',
         include(('apps.search.nxp.urls', 'apps.search'), namespace='api_search_nxp')),
]
if apps.is_installed('apps.sso_server'):
    urlpatterns += [
        path(settings.SITE_BASE_URL + 'sso/',
             include(('apps.sso_server.urls', 'apps.sso_server'), namespace='sso_server')),
        path(settings.SITE_BASE_URL + 'oauth2/',
             include('oauth2_provider.urls', namespace='oauth2_provider')),
        path(settings.SITE_BASE_URL + 'openapi/',
             include(('apps.sso_server.openapi.urls', 'apps.sso_server'), namespace='openapi'))
    ]

if apps.is_installed('apps.image_search'):
    urlpatterns += [
        path(settings.SITE_BASE_URL + r'image_search/',
             include(('apps.image_search.urls', 'apps.image_search'), namespace='image_search'))
    ]

if settings.DEBUG:
    from .utils.proxy import big_file_proxy

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path(settings.SITE_BASE_URL + r'external/bigfile/api/<path:path>', big_file_proxy, name='big_file')]
