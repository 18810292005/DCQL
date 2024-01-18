# -*- coding: utf-8 -*-

# @File   : esimport
# @Author : Harold Chen
# @Date   : 2018/7/19

from django.core.management.base import BaseCommand
from apps.search.tasks import import_to_es


class Command(BaseCommand):
    def handle(self, *args, **options):
        import_to_es.delay()
