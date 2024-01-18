# -*- coding: utf-8 -*-

# @File   : clear_cache.py
# @Author : Yuvv
# @Date   : 2018/1/4

from django.core.management.base import BaseCommand
from django.core.cache import cache


class Command(BaseCommand):
    def handle(self, *args, **options):
        cache.clear()
        print('cache cleared!')
