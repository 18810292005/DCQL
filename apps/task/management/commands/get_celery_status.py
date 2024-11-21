from django.core.management.base import BaseCommand
from apps.task.models import UserTask, TaskState


class Command(BaseCommand):
    def handle(self, *args, **options):
        qs = UserTask.objects.filter(state=TaskState.RUNNING.value)
        print('正在运行中的任务:')
        print('--------------------------------------------------------------------')
        for q in qs.values('celery_id', 'user', 'created_at', 'started_at', 'task_type', 'state'):
            print(q)
        print('--------------------------------------------------------------------')
        print(f'一共{qs.count()}个任务')
