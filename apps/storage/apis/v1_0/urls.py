from django.urls import path
from apps.storage.apis.v1_0 import *
from apps.storage.apis.v1_0.material import get_material_projects
from apps.storage.apis.v1_0.file import batch_data_export, batch_uploaded_file
from apps.storage.apis.v1_0.template import template_management_list, template_get_fields

urlpatterns = [
    # materials
    path(r'material/categories',
         material_categories, name='material_categories'),
    # templates
    path(r'templates',
         templates, name='templates'),
    path(r'template/<int:tid>',
         template_one, name='template_one'),
    path(r'template/data', get_data_from_template_filter_by_user, name='get_data_from_template_filter_by_user'),
    path(r'template/management', template_management_list, name='template_management_list'),
    path(r'template/get_fields/<int:template_id>', template_get_fields, name='template_get_fields'),
    # data
    path(r'data/metas',
         data_metas, name='data_metas'),
    path(r'data/meta/<int:mid>',
         data_meta_one, name='data_meta_one'),
    # files
    path(r'file/template/<int:tid>/export',
         template_file, name='template_file'),
    path(r'file/upload',
         uploaded_file, name='uploaded_file'),
    path(r'file/batch_upload',
         batch_uploaded_file, name='batch_data_export'),
    path(r'file/verify',
         verify_archive, name='verify_archive'),
    path(r'file/dataset/export',
         data_export, name='data_export'),
    path(r'file/dataset/batch_export',
         batch_data_export, name='data_export'),
    path(r'file/data/content',
         uploaded_data_content_file, name='data_content_file'),
    path(r'file/bigfile/confirm',
         big_file_upload_confirm, name='big_file_confirm'),
    path(r'file/data/content/images', all_data_images, name='data_content_images'),
    path(r'file/data/images/info', all_images_with_meta, name='data_images_info'),
    path(r'data/templates', get_data_templates, name='get_data_templates'),

    # projects
    path(r'projects', get_material_projects, name='get_material_projects'),
    path(r'projects/<project_id>', get_material_project, name='get_material_project'),
    path(r'projects/<project_id>/subjects', get_material_subjects, name='get_material_subjects'),

]
