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

    # 查询某一条数据的下载量和访问量
    path(r'data/<int:did>', views.query_data, name='query_data'),
    path(r'template/<int:tid>', views.query_template, name='query_template'),

    # 趋势数据，按月份给出趋势（4种）

    # 某个分类的趋势
    path(r'trend/<int:cid>', views.trend_of_class, name='trend_of_class'),
    path(r'projects/<str:pid>/stat', views.trend_of_project, name='trend_of_project'),
    path(r'projects/<str:pid>/subjects/<str:sid>/stat', views.trend_of_subject, name='trend_of_subject'),

    # 获取所有项目(有数据的)信息
    path(r'projects/info', views.all_projects_info, name='all_projects_info'),
    # 下载所有项目（有数据的）信息
    path(r'projects/downloadinfo', views.download_all_projects_info, name='download_all_projects_info'),
]
