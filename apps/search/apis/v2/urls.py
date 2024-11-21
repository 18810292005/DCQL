from django.urls import path
from apps.search.apis.v2 import views


urlpatterns = [
    path('query/', views.QueryList.as_view({'post': 'create'}), name='query_list'),
    path('query/<int:pk>', views.QueryDetail.as_view(), name='query_total'),
    path('newquery/<int:pk>', views.QueryDetail.as_view(), name='query_total'),
    path('query/<int:pk>/<int:template_id>', views.QueryTemplateDetail.as_view(), name='query_template_detail'),
    path('query/<int:pk>/download', views.QueryDownload.as_view({'get': 'retrieve'}), name='query_download'),
    path('query/<int:pk>/<int:template_id>/download', views.QueryDownloadTemplate.as_view(),
         name='query_download_template'),
    path('querys/<int:pk>/<str:key>', views.QueryDetails.as_view(), name='query_details'),
    path('querys/', views.QueryDetails.as_view(), name='create_ids_key'),
]
