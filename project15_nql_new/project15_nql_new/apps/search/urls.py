from django.urls import re_path
from django.views.generic import TemplateView

urlpatterns = [
    re_path(r'^expr$', TemplateView.as_view(template_name='search/expr.html'), name='expr'),
    re_path(r'^$', TemplateView.as_view(template_name='search/index.html'), name='index'),
]
