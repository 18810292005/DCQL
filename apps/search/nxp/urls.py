from django.urls import path

from apps.search.nxp.views import new_query, aggregate_info_view, DataSetView, dataset_id_list_view

urlpatterns = [
    path('query/', new_query, name='nxp_new_query'),
    path('query/aggregation/<int:query_id>', aggregate_info_view, name='aggregate_info_view'),
    path('query/datasets/<int:datasets_query_id>', DataSetView.as_view(), name='datasets_view'),
    path('query/templates/<int:template_query_id>', DataSetView.as_view(), name='template_view'),
    path('query/datalist/<int:query_id>/<str:dataset_id>', dataset_id_list_view),
]
