from django.urls import path
from apps.storage.apis.v1_0 import *

urlpatterns = [
    # materials
    path(r'material/categories',
         material_categories, name='material_categories'),
    path(r'material/category/<int:cid>',
         material_category_one, name='material_category_one'),
    path(r'material/category/<int:cid>/children',
         material_category_children, name='material_category_children'),
    path(r'material/category/tree',
         material_category_tree, name='material_category_tree'),
    # templates
    path(r'templates',
         templates, name='templates'),
    path(r'template/<int:tid>',
         template_one, name='template_one'),
    path(r'template/data', get_data_from_template_filter_by_user, name='get_data_from_template_filter_by_user'),
    path(r'data/export_data_of_template', export_data_of_template, name='export_data_of_template'),
    # data
    path(r'data/metas',
         data_metas, name='data_metas'),
    path(r'data/meta/<int:mid>',
         data_meta_one, name='data_meta_one'),
    # path(r'uploads/<int:uid>',
    #      get_data_by_uploads, name='get_data_by_uploads'),
    # path(r'data/review/list',
    #      get_data_list, name='get_data_list'),
    # files
    path(r'file/template/<int:tid>/export',
         template_file, name='template_file'),
    path(r'file/upload',
         uploaded_file, name='uploaded_file'),
    path(r'file/verify',
         verify_archive, name='verify_archive'),
    path(r'file/dataset/export',
         data_export, name='data_export'),
    path(r'file/data/content',
         uploaded_data_content_file, name='data_content_file'),
    path(r'file/bigfile/confirm',
         big_file_upload_confirm, name='big_file_confirm'),
    path(r'file/data/content/images', all_data_images, name='data_content_images'),
    path(r'file/data/images/info', all_images_with_meta, name='data_images_info'),
    path(r'data/histories/<int:history_id>', retract_data, name='retract_data'),
    path(r'data/doi/<int:did>', data_doi_single, name='data_doi_single'),  # 注册单条数据的doi
    path(r'data/dois', data_dois, name='data_dois'),  # 注册数据集的doi
    path(r'data/doi/review', doi_review, name='doi_review'),
    path(r'data/score/<int:did>', data_score, name='data_score'),
    path(r'data/templates', get_data_templates, name='get_data_templates'),

    # projects
    path(r'projects', get_material_projects, name='get_material_projects'),
    path(r'projects/<project_id>', get_material_project, name='get_material_project'),
    path(r'projects/<project_id>/subjects', get_material_subjects, name='get_material_subjects'),

    # oauth2
    path(r'o/templates', TemplateOauth2View.as_view(), name='oauth2_templates'),
    path(r'o/templates/<int:tid>', TemplateOauth2View.as_view(), name='oauth2_templates_one'),
    path(r'o/material/category/tree', MaterialTreeOauth2View.as_view(), name='oauth2_material_category_tree'),

    path(r'o/projects/', MaterialProjectsOauth2View.as_view(), name='oauth2_material_projects'),
]
