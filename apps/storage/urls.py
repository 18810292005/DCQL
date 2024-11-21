from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path(r'template/new',
         TemplateView.as_view(template_name='storage/create_template.html'),
         name='create_template'),
    path(r'data/new/',
         TemplateView.as_view(template_name='storage/upload_data.html'),
         name='upload_data'),
    # 编辑数据页面
    path(r'edit_data/<int:did>',
         TemplateView.as_view(template_name='storage/edit_data.html'),
         name='edit_data'),
    # 编辑模板页面
    path(r'edit_template/<int:did>',
         TemplateView.as_view(template_name='storage/edit_template.html'),
         name='edit_template2'),
    # 查看模板页面
    path(r'check_template/<int:did>',
         TemplateView.as_view(template_name='storage/check_template.html'),
         name='check_template2'),
    path(r'data/<int:did>',
         TemplateView.as_view(template_name='storage/show_data.html'), name='show_data'),
    path(r'export', TemplateView.as_view(template_name='storage/export_data.html'), name='export_data'),

    # 查看模板片段页面
    path(r'check_snippet/<int:did>',
         TemplateView.as_view(template_name='storage/check_snippet.html'),
         name='check_snippet'),
    # 编辑模板片段页面
    path(r'edit_snippet/<int:did>',
         TemplateView.as_view(template_name='storage/edit_snippet.html'),
         name='edit_snippet'),
]
