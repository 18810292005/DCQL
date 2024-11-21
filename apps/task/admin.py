from django.contrib import admin

from .models import *


def bulk_cancel(modeladmin, request, queryset):
    for task in queryset:
        task.cancel()


bulk_cancel.short_description = '取消任务'


def bulk_retry(modeladmin, request, queryset):
    for task in queryset:
        task.retry()


bulk_retry.short_description = '重新运行'


@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'created_at', 'started_at', 'user_id', 'type_description', 'state_description', 'progress_for_admin',
        'exceptions_message', 'show_result', 'download_file')
    list_filter = ('created_at', 'state', 'task_type')
    search_fields = ('user__username', 'user__real_name', 'id', 'state', 'task_type')
    actions = [bulk_cancel, bulk_retry]

    def exceptions_message(self, obj):
        return obj.mge_exception

    def show_result(self, obj):
        if obj.result_html:
            return format_html(obj.result_html)

    show_result.short_description = '结果'

    def download_file(self, obj: UserTask):
        if obj.task_type == TaskType.DATA_IMPORT or obj.task_type == TaskType.DATA_IMPORT_VERIFY:
            temp = obj.get_origin_file()
            if temp is not None:
                return format_html("<a href='{url}'>{temp_id}</a>", url=temp.get_url(), temp_id=temp.id)
            return None

    exceptions_message.short_description = "exception_message"
    download_file.short_description = "原文件下载"
