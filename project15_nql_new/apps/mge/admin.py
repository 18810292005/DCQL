# -*- coding: utf-8 -*-

# @File   : admin.py
# @Author : Yuvv
# @Date   : 2017/12/5

from django.contrib import admin

from .admin_actions import core_dump_now
from .models import RequestInformation, UpdateHistory, DatabaseBackup


@admin.register(RequestInformation)
class RequestInformationAdmin(admin.ModelAdmin):
    list_display = ('username', 'ip', 'url', 'method', 'body', 'params', 'time')
    ordering = ('-time',)


@admin.register(UpdateHistory)
class UpdateHistoryAdmin(admin.ModelAdmin):
    list_display = ('time', 'content')


@admin.register(DatabaseBackup)
class DatabaseBackupAdmin(admin.ModelAdmin):
    list_display = ('db_type', 'back_date')
    list_filter = ('db_type', 'back_date')
    ordering = ('-back_date',)
    readonly_fields = ('file',)
    actions = [core_dump_now]
