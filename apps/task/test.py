# -*- coding: utf-8 -*-

# @File   : test
# @Author : Harold Chen
# @Date   : 2018/5/8

from apps.task.models import UserTask, TaskType
from apps.account.models.users import User
from apps.task.task_registry import MGEBaseTask
from time import sleep


class TestTask(MGEBaseTask):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._t = 1

    def run(self, x, y):
        print(x + y)
        sleep(10)
        # return x + y

    def result_to_dict(self, result):
        return result

    def on_success(self, retval, task_id, args, kwargs):
        print(self._t)


def t():
    UserTask.add_task(User.objects.get(username='harold'), TestTask().s(1, 2), task_type=TaskType.DATA_IMPORT)
