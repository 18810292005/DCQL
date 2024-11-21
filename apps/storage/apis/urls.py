from django.urls import path

from apps.storage.apis import review, category, my, templates

urlpatterns = [
    # 材料分类
    path(r'categories/', category.category_tree, name='category_tree'),
    path(r'categories/<int:cat_id>/', category.rename_or_delete_category, name='category_tree'),

    # 审核数据
    path('review/datalist/', review.review_data_list, name='review_list'),
    path('review/datalist/batch/', review.batch_review_data, name='batch_review_data'),
    path('review/datalist/<int:meta_id>/', review.review_data, name='review_data'),

    # 审核模板
    path('review/templates/', review.review_template_list, name='review_template_list'),
    path('review/templates/batch/', review.batch_review_template, name='batch_review_template'),
    path('review/templates/<int:tid>/', review.review_template, name='review_template'),

    # 我的数据列表
    path('mydata/', my.my_data_list, name='my_data_list'),
    # 单条删除
    path('mydata/delete/', my.batch_delete_data, name='delete_my_data'),
    # 批量删除
    path('mydata/batch_delete/', my.batch_delete_data, name='batch_delete_data'),
    # 我的模板列表
    path('mytemplates/', my.my_template_list, name='my_template_list'),

    # 模板
    path(r'templates/<int:tid>/', templates.get_template, name='get_template'),
]
