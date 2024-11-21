import argparse
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q

from apps.task.models import UserTask, TaskState, TaskType
from apps.storage.models.file import TemporaryUploadedFile
from datetime import datetime
from django.utils import timezone


from mgedata.errors.models import MGEError


def check_positive(value):
    check_value = int(value)
    if check_value <= 0:
        raise argparse.ArgumentTypeError(f"{check_value}不是一个正整数")
    return check_value


def export_error_file_from_mged(min_size, max_size, created_at, path: str):
    try:
        created_at = timezone.make_aware(datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S'))
    except ValueError:
        raise MGEError.BAD_PARAMETER('created_at参数格式错误,清遵循%Y-%m-%d %H:%M:%S')

    user_tasks = UserTask.objects.filter(task_type=TaskType.DATA_IMPORT.value).filter(
        Q(state=TaskState.FAILED.value) | Q(state=TaskState.DELETED.value)).filter(created_at__gte=created_at)
    print('正在导出...')
    count, total_size = 0, 0
    for user_task in user_tasks:
        temp: TemporaryUploadedFile = user_task.get_origin_file()
        if temp is None or user_task.mge_exception_message == 'Exception: ':
            continue
        if min_size < temp.size < max_size:
            print(settings.SITE_ADDR + temp.get_url() + '|' + str(
                user_task.id) + '|' + user_task.mge_exception_message + '|' + temp.size_auto, file=open(path, "a"))
            count += 1
            total_size += temp.size
            print(f'已导出{count}条链接..')
    print('导出结束...\n共导出{}条链接，文件总大小为{}MB'.format(count, total_size / 1024 / 1024))


class Command(BaseCommand):
    help = "导出数据库中用户任务失败的文件url，用作mge validate测试"

    def add_arguments(self, parser):
        parser.add_argument('--min', type=check_positive, help='文件大小最小值(Byte)', default=0)
        parser.add_argument('--max', type=check_positive, help='文件大小最大值(Byte)', default=10485760000)
        parser.add_argument('--created', type=str, help='起始时间', default='2021-01-01 12:00:00')
        parser.add_argument('--path', type=str, help='导出的文件路径', default='error_file.txt')

    def handle(self, *args, **options):
        min_size = options['min']
        max_size = options['max']
        created_at = options['created']
        path = options['path']

        if min_size > max_size:
            raise argparse.ArgumentTypeError("输入的文件大小值非法,最小值应该小于最大值")

        export_error_file_from_mged(min_size, max_size, created_at, path)
