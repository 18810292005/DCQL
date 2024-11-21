# # -*- coding: utf-8 -*-
#
# # @File   : admin.py
# # @Author : Yuvv
# # @Date   : 2017/12/5
#
# from django.contrib import admin
#
# from .models import UpdateHistory, DatabaseBackup
#
#
# @admin.register(UpdateHistory)
# class UpdateHistoryAdmin(admin.ModelAdmin):
#     list_display = ('time', 'content')
#
#
# @admin.register(DatabaseBackup)
# class DatabaseBackupAdmin(admin.ModelAdmin):
#     list_display = ('db_type', 'back_date')
#     list_filter = ('db_type', 'back_date')
#     ordering = ('-back_date',)
#     readonly_fields = ('file',)
#     actions = [core_dump_now]
