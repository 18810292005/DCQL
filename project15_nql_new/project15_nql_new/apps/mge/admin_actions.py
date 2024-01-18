# -*- coding: utf-8 -*-

# @File   : admin_actions.py
# @Author : Yuvv
# @Date   : 2018/1/7

from apps.mge.tasks import make_test_data


def make_published(modeladmin, request, queryset):
    queryset.update(published=True)


def make_trashed(modeladmin, request, queryset):
    queryset.update(trashed=True)


def force_revoke_task(modeladmin, request, queryset):
    from celery.result import AsyncResult

    if request.user.is_superuser:
        for result in queryset.all():
            AsyncResult(result.id).revoke(terminate=True)


def core_dump_now(modelamin, request, queryset):
    make_test_data.delay()


make_published.short_description = '发布选中的内容'
make_trashed.short_description = '将选中内容放入回收站'
core_dump_now.short_description = '执行核心数据dump'
force_revoke_task.short_description = '强制停止任务'
