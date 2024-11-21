from collections import OrderedDict

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MgePageNumberPagination(PageNumberPagination):
    """
    因为DRF自带的分页器不带page_size参数
    所以使用我们自定义的分页器，同时支持page_size参数控制分页大小
    """
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_size', self.get_page_size(self.request)),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))


class MyPaginator:
    def __init__(self, object_list, per_page, orphans=0,
                 allow_empty_first_page=True):
        self._paginator = Paginator(
            object_list, per_page, orphans,
            allow_empty_first_page
        )

    def page(self, page):
        try:
            queryset = self._paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            queryset = self._paginator.page(1)
        return queryset

    @property
    def num_pages(self):
        return self._paginator.num_pages

    @property
    def count(self):
        return self._paginator.count

    @property
    def per_page(self):
        return self._paginator.per_page
