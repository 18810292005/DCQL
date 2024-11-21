from django.urls import path

from apps.analytics.apis.v1 import views

urlpatterns = [
    # 数据内容包括：数据量、模板数、总访问量、总下载量

    # 总体统计情况
    path(r'', views.index, name="index"),

    # ObjectID为24位HEX
    # 查询某个分类的统计
    # 如果该分类存在子分类，那么需要返回所有子分类的4个数据
    path(r'class/<int:cid>', views.query_class, name='query_class'),

    path(r'new_class', views.new_query_class, name='new_query_class'),

    path(r'top_templates/<int:top_k>', views.top_templates, name="top_templates"),

    path(r'statistics_count', views.statistics_count, name="statistics_count"),

    path(r'user_statistics_count', views.user_statistics_count, name="user_statistics_count")

]
