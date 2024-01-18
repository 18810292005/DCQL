from django.urls import path, re_path
from django.views.generic import TemplateView
from apps.storage.views import *

urlpatterns = [
    path(r'template/new',
         TemplateView.as_view(template_name='storage/create_template.html'),
         name='create_template'),
    path(r'template/add',
         add_template, name='add_template'),
    path(r'template/<int:tid>/check',
         check_template, name='check_template'),
    path(r'template/<int:tid>/edit',
         edit_template, name='edit_template'),
    path(r'data/new/',
         TemplateView.as_view(template_name='storage/upload_data.html'),
         name='upload_data'),
    path(r'data/add/',
         add_data, name='add_data'),
    path(r'template/review/<int:page>/<int:state>', show_template_review, name='show_template_review'),
    # 编辑数据页面
    path(r'edit_data/<int:did>',
         TemplateView.as_view(template_name='storage/edit_data.html'),
         name='edit_data'),
    # 编辑模板页面
    path(r'edit_template/<int:did>',
         TemplateView.as_view(template_name='storage/edit_template2.html'),
         name='edit_template2'),
    # 查看模板页面
    path(r'check_template/<int:did>',
         TemplateView.as_view(template_name='storage/check_template2.html'),
         name='check_template2'),
    #     path(r'data/<int:did>',
    #          show_data, name='show_data'),
    path(r'data/<int:did>',
         TemplateView.as_view(template_name='storage/show_data2.html'), name='show_data'),
    path(r'export',
         export_data, name='export_data'),
    path("data/review/<str:state>/page/<int:page>", review_data, name='review_data_state'),
    path("data/review/page/<int:page>", review_data, name='review_data_page'),
    path("data/review/", review_data, name='review_data'),
    path(r'data/registerdoi', register_doi, name='register_doi'),
    path(r'data/doilist', show_doi_list, name='doi_list'),
    path(r'data/doilist/detail/<int:did>', show_doi_detail, name='doi_detail'),
    re_path(r'data/doi/(?P<doi>[0-9a-zA-z/.]+)', doi_link, name='doi_link'),
    path(r'data/score', data_score, name='data_score'),
    # new data review
    path(r'data/review2/',
         TemplateView.as_view(template_name='storage/review_data2.html'),
         name='review_data2'),
     #查看模板片段页面
    path(r'check_snippet/<int:did>',
         TemplateView.as_view(template_name='storage/check_snippet.html'),
         name='check_snippet'),
    # 编辑模板片段页面
    path(r'edit_snippet/<int:did>',
         TemplateView.as_view(template_name='storage/edit_snippet.html'),
         name='edit_snippet'),
]
