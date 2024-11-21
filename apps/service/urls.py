from django.urls import re_path
from django.views.generic import TemplateView


urlpatterns = [
    re_path(r'^sub/$', TemplateView.as_view(template_name='service/sub.html'), name='service_sub'),
    re_path(r'^sub/recommend/$', TemplateView.as_view(template_name='service/recommend.html'),
            name='service_recommend'),
]
