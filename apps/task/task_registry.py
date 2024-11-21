# -*- coding: utf-8 -*-

# @File   : task_registry
# @Author : Harold Chen
# @Date   : 2018/5/8

import logging
import pickle
from datetime import datetime

from celery import current_app as app
from celery import states
from celery.contrib.abortable import AbortableTask, AbortableAsyncResult
from celery.exceptions import Ignore
from celery.signals import after_task_publish, task_prerun
from django.db import transaction
from django.utils.timezone import now

from apps.task.models import TaskState, UserTask

_task_registry = {}

logger = logging.getLogger('django')


class _MGETaskMetaclass(type):
    def __new__(mcs, name, bases, attrs):
        new_class = type.__new__(mcs, name, bases, attrs)
        instance = new_class()
        app.tasks.register(instance)
        _task_registry[instance.name] = new_class
        return new_class


class MGEBaseTask(AbortableTask, metaclass=_MGETaskMetaclass):

    @property
    def task_description(self):  # 任务的描述，是什么任务，比如"数据导出"
        raise NotImplementedError

    @property
    def name(self):
        return f'{self.__class__.__module__}.{self.__class__.__name__}'

    def on_success(self, retval, task_id, args, kwargs):
        with transaction.atomic():
            try:
                task = UserTask.objects.select_for_update().get(celery_id=task_id)
                if task.state == TaskState.RUNNING.value:
                    task.result = retval
                    task.state = TaskState.SUCCESS.value
                    task.save()
                else:
                    self.on_success_but_revoked()
            except UserTask.DoesNotExist:
                return

    def on_success_but_revoked(self):
        """
        任务执行完成，但是任务已经被取消时调用。
        （因为celery默认不会取消正在执行的任务，可能需要完成之后再回滚）
        :return:
        """
        return

    def on_failure(self, exc, task_id, args, kwargs, error_info):
        with transaction.atomic():
            try:
                task = UserTask.objects.select_for_update().get(celery_id=task_id)
            except UserTask.DoesNotExist:
                return
            if task.state == TaskState.RUNNING.value or task.state == TaskState.PENDING.value:
                task.exc = pickle.dumps(exc)
                task.state = TaskState.FAILED.value
                task.save()

    def run(self, *args, **kwargs):
        if self.request_stack is None:
            return
        celery_id = self.request.id
        with transaction.atomic():
            try:
                task = UserTask.objects.select_for_update().get(celery_id=celery_id)
            except UserTask.DoesNotExist:
                return
            task.state = TaskState.RUNNING.value
            task.started_at = now()
            task.save()
            self.update_progress(0)

    def update_progress(self, percentage: float, block=False, extra: str = None, log_extra=False):
        if extra and log_extra:
            logger.info(extra)
        if self is None or self.request_stack is None or self.request is None or self.request.id is None:
            return  # 同步调用时无法更新状态，直接返回
        if self.is_aborted():
            self.on_abort()
            return
        eta = -1  # None 为正在计算, -1为阻塞状态，让用户耐心等待
        now_timestamp = datetime.now().timestamp()
        old_state = AbortableAsyncResult(self.request.id).result
        old_progress = 0
        old_timestamp = 0
        old_eta = None
        if isinstance(old_state, dict):
            old_progress = old_state['percentage']
            old_timestamp = old_state['timestamp']
            old_eta = old_state['eta']
        if block:
            percentage = old_progress
        if not block:
            # 可以计算剩余时间
            if old_timestamp > 0 and old_eta != -1:
                delta_time = now_timestamp - old_timestamp
                # 防止间隔时间果断造成不准确
                if delta_time < 0.1:
                    return
                else:
                    delta_progress = (percentage - old_progress)
                    if delta_progress > 0:
                        # 根据delta时间内的处理进度计算剩余时间
                        eta = int(delta_time / delta_progress * (1 - percentage))
                    else:
                        eta = old_eta
            else:
                eta = None
        meta = {'percentage': percentage, 'timestamp': now_timestamp, 'eta': eta, 'extra': extra}
        self.update_state(state=TaskState.RUNNING.value, meta=meta)

    def on_abort(self):
        with transaction.atomic():
            self.update_state(state=states.REVOKED)
        raise Ignore


@after_task_publish.connect
def task_sent_handler(sender=None, headers=None, body=None, **kwargs):
    task = app.tasks.get(sender)
    backend = task.backend if task else app.backend
    info = headers if 'task' in headers else body
    task_id = info['id']
    backend.store_result(task_id, None, TaskState.PENDING.value)


@task_prerun.connect
def task_prerun_handler(task_id, task, *args, **kwargs):
    if isinstance(task, MGEBaseTask):
        task.update_progress(0)
