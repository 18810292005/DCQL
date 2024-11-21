from django.urls import re_path, path, include
from django.views.generic import TemplateView

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='analytics/index.html'), name='index'),

    path(r'v1/analytics/',
         include(('apps.analytics.apis.v1.urls', "apps.analytics.apis.v1"), namespace='api_v1_analytics')),
]
