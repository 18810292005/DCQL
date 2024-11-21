import copy
import pickle
from datetime import timedelta
from enum import IntEnum, Enum
from typing import Optional, Union

import celery.states as states
from celery.canvas import Signature
from celery.contrib.abortable import AbortableAsyncResult
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db import transaction
from django.shortcuts import reverse
from django.utils.html import format_html
from django.utils.translation import gettext
from django.utils.translation import gettext as _

from apps.account.models.users import User
from apps.storage.models.file import TemporaryUploadedFile
from mgedata.errors.models import MGEError, MGEException


class TaskType(IntEnum):
    DATA_EXPORT = 1
    DATA_IMPORT = 2
    G_PHASE = 3  # deprecated
    OCPMDM = 4  # deprecated
    CERTIFICATE = 5
    EXPORT_FOR_CERTIFICATE = 6
    DATA_IMPORT_VERIFY = 7
    UPLOAD_HISTORY_REVIEW_REVOKE = 8
    UPLOAD_HISTORY_RETRACT = 9
    # System Tasks
    GENERIC_SYSTEM = 9999
    ES_IMPORT = 10000
    IMAGE_SEARCH_FEATURE_GENERATE = 10001
    CERTIFICATE_UPDATE = 10002
    CERTIFICATE_REBUILD = 10003
    CERTIFICATE_REBUILD_FULL = 10004

    @property
    def idempotent(self) -> bool:  # 能进行重试的任务
        if self in (
                TaskType.DATA_EXPORT, TaskType.CERTIFICATE, TaskType.EXPORT_FOR_CERTIFICATE,
                TaskType.CERTIFICATE_UPDATE, TaskType.DATA_IMPORT_VERIFY, TaskType.CERTIFICATE_REBUILD,
                TaskType.CERTIFICATE_REBUILD_FULL):
            return True
        return False

    @property
    def description(self) -> str:
        if self == TaskType.DATA_EXPORT:
            return '数据导出'
        elif self == TaskType.DATA_IMPORT:
            return '数据导入'
        elif self == TaskType.OCPMDM:
            return _('Data Export to OCPMDM')
        elif self == TaskType.IMAGE_SEARCH_FEATURE_GENERATE:
            return _("Images' Features Generating")
        elif self == TaskType.ES_IMPORT:
            return _("ElasticSearch Importing")
        elif self == TaskType.CERTIFICATE:
            return _("Certificate Issuing")
        elif self == TaskType.EXPORT_FOR_CERTIFICATE:
            return _("Certificate Data Check")
        elif self == TaskType.UPLOAD_HISTORY_REVIEW_REVOKE:
            return _("Dataset Review Withdrawn")
        elif self == TaskType.UPLOAD_HISTORY_RETRACT:
            return _("Dataset Withdrawn")
        elif self == TaskType.DATA_IMPORT_VERIFY:
            return _("数据校验")
        else:
            return ' '.join(self.name.split('_')).capitalize()

    def result_to_html(self, result_dict):
        if self == TaskType.DATA_EXPORT or self == TaskType.EXPORT_FOR_CERTIFICATE:
            text = gettext("Click To Download")
            return f"""
            <a href="{result_dict["url"]}">
            {text}
            </a>
            """
        elif self == TaskType.DATA_IMPORT:
            return gettext("%(data_count)s data") % {'data_count': result_dict['data_count']}
        elif self == TaskType.G_PHASE:
            text = gettext("Click To Download")
            return f"""
                <a href="{result_dict["prediction_url"]}">
                {text}
                </a>
                """
        elif self == TaskType.OCPMDM:
            return gettext(
                "Successfully exported data to OCPMDM. Please go to <a href=\"%(url)s\">OCPMDM</a> to proceed. "
                "(Filename: %(filename)s)") % {'url': 'https://ocpmdm.mgedata.cn',
                                               'filename': result_dict or ''
                                               }
        elif self == TaskType.CERTIFICATE:
            return gettext("<a href=\"%(url)s\">Click to view the certificate</a>") % {
                'url': reverse('certificate:certificate_pdf', args=[result_dict])}
        elif self == TaskType.UPLOAD_HISTORY_REVIEW_REVOKE:
            return gettext(
                "The data uploaded by user %(upload_user)s at %(time)s has been set to pending review. ") % {
                'upload_user': result_dict['upload_user'], 'time': result_dict['time']}
        elif self == TaskType.UPLOAD_HISTORY_RETRACT:
            return gettext("%(data_count)s data ") % {'data_count': result_dict['data_count']}
        else:
            return ""

    def html_arguments_description(self, task_signature: Signature):
        pass


class TaskState(Enum):
    PENDING = states.PENDING
    RUNNING = 'RUNNING'
    SUCCESS = states.SUCCESS
    FAILED = states.FAILURE
    CANCELLED = states.REVOKED
    DELETED = 'DELETED'

    def __eq__(self, other):
        return self.value == other

    @property
    def description(self):
        if self == TaskState.PENDING:
            return _("等待中")
        elif self == TaskState.RUNNING:
            return _("正在运行")
        elif self == TaskState.SUCCESS:
            return _("成功")
        elif self == TaskState.FAILED:
            return _("失败")
        elif self == TaskState.CANCELLED:
            return _("已取消")
        elif self == TaskState.DELETED:
            return _("已删除")


class UserTask(models.Model):
    """用户提交的任务"""

    class Meta:
        ordering = ['-created_at']

    celery_id = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    signature = JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    task_type = models.IntegerField(choices=[(task_type.value, task_type.name) for task_type in TaskType])
    exc = models.BinaryField(null=True)
    result = JSONField(null=True)
    state = models.CharField(max_length=50, blank=False, default=TaskState.PENDING.value,
                             choices=[(task_state.value, task_state.name) for task_state in TaskState])

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._r: Union[AbortableAsyncResult, None] = None  # celery 运行结果

    @property
    def type_description(self) -> str:
        return TaskType(self.task_type).description

    @property
    def waiting_count_description(self) -> str:
        if self.state != TaskState.PENDING.value or self.id is None:
            return ""
        count = UserTask.objects.filter(id__lt=self.id,
                                        state__in=(TaskState.PENDING.value, TaskState.RUNNING.value)).count()
        if count == 0:
            return _("排队中。如长时间无响应请联系管理员。")
        return _("%(count)s tasks ahead") % {'count': count}

    @property
    def eta(self) -> str:
        if self.state == TaskState.RUNNING.value:
            r = self._r.result if self._r else None
            if isinstance(r, dict):
                eta = r.get('eta')
                if eta is None:
                    return "正在计算"
                if eta == -1:
                    return "进度可能长时间不会更新，请耐心等待"
                if eta <= 0:
                    return "即将完成"
                return str(timedelta(seconds=eta))

    @property
    def state_description(self):
        return TaskState(self.state).description

    @property
    def progress_string(self):
        progress = self.get_progress()
        if progress > 1:
            return "99.9%"
        return '%.1f' % (progress * 100)

    @property
    def progress_for_admin(self):
        extra = ''
        res = ''
        self.refresh_state()
        r = self._r.result if self._r else None
        if isinstance(r, dict):
            if r.get('extra'):
                extra = r["extra"]
        if self.eta:
            res = f"{self.progress_string}%, ETA: {self.eta}"
        elif self.state == TaskState.RUNNING.value:
            res = f"{self.progress_string}%"
        if not res and not extra:
            return
        if not res and extra:
            return extra
        elif not extra and res:
            return res
        return format_html(f'{res}<br/>{extra}')

    @property
    def exception(self) -> Optional[Exception]:
        if self.exc:
            exception = pickle.loads(self.exc)
            return exception

    @property
    def mge_exception(self) -> Optional[MGEException]:
        e = self.exception
        if not e:
            return None
        if isinstance(e, MGEException):
            return e
        return MGEError.UNKNOWN_ERROR(secret_detail=str(e))

    @property
    def mge_exception_message(self):
        if self.mge_exception is None:
            return ''
        if self.mge_exception.error_detail:
            return self.mge_exception.error_detail
        return self.mge_exception.msg

    @property
    def result_html(self):
        if self.result:
            return TaskType(self.task_type).result_to_html(self.result)

    @staticmethod
    def add_task(user: User, task_signature: Signature, task_type: TaskType, asynchronous=True):
        task_signature.freeze()
        task_queryset = UserTask.objects.filter(user=user, signature__args=task_signature.args,
                                                signature__kwargs=task_signature.kwargs, task_type=task_type,
                                                state__in=[TaskState.PENDING.value, TaskState.RUNNING.value])
        if task_queryset.count() > 0:
            raise MGEError.TASK_IS_STILL_RUNNING("您有其他相同的任务正在运行，请等待其结束后再试", data={'task_id': task_queryset.first().id})
        task = UserTask(user=user, celery_id=task_signature.id,
                        signature=task_signature, task_type=task_type)
        task.save()
        if asynchronous:
            if task_type == TaskType.DATA_IMPORT or task_type == TaskType.DATA_EXPORT:
                task_signature.apply_async()
            else:
                task_signature.apply_async(queue='verify')
        else:
            task_signature.apply()
        return task

    def to_dict(self):
        self.refresh_state()
        r = self._r
        return {
            'id': self.id,
            'task_id': self.celery_id,
            'created_at': self.created_at,
            'state': r.state if r else self.state,
            'result': self.result,
            'progress': self.get_progress(),
            'eta': self.eta,
            'waiting_count': self.waiting_count_description,
            'exception': self.mge_exception_message if self.state == TaskState.FAILED.value else None,
            'task_type': self.type_description
        }

    def refresh_state(self):
        if self.id is None:
            return
        with transaction.atomic():
            task = UserTask.objects.select_for_update().get(id=self.id)
            task_type = TaskState(task.state)
            if task_type in (TaskState.CANCELLED, TaskState.FAILED, TaskState.SUCCESS, TaskState.DELETED):
                return
            r = AbortableAsyncResult(id=task.celery_id)
            self._r = r
            self.state = r.state

    def get_progress(self) -> float:
        r = self._r
        if r is not None and r.state == TaskState.RUNNING.value:
            r = copy.deepcopy(r.result)
            return isinstance(r, dict) and r.get('percentage') or 0
        if self.state == TaskState.SUCCESS.value:
            return 1
        return 0

    def cancel(self):
        with transaction.atomic():
            task = UserTask.objects.select_for_update().get(pk=self.pk)
            task.refresh_state()
            if task.state == TaskState.RUNNING.value or task.state == TaskState.PENDING.value:
                task.state = TaskState.CANCELLED.value
                if task._r:
                    task._r.revoke()
                    task._r.abort()
                task.save()

    def retry(self) -> Optional[str]:
        with transaction.atomic():
            task = UserTask.objects.select_for_update().get(pk=self.pk)
            task.refresh_state()
            task_state = TaskState(task.state)
            task.state = TaskState.PENDING.value
            r = task._r
            if task.state == TaskState.SUCCESS and not task_state.idempotent:
                return
            if r:
                r.revoke()
                r.abort()
            s = Signature.from_dict(task.signature)
            s.options.pop('task_id')
            s.freeze()
            task.state = TaskState.PENDING.value
            task.exc = None
            task.result = None
            task.celery_id = s.id
            task.save()
            if task.task_type in (TaskType.DATA_IMPORT.value, TaskType.DATA_EXPORT.value):
                s.apply_async()
            else:
                s.apply_async(queue='verify')
            return s.id

    def delete(self, *args, **kwargs):
        self.cancel()
        super().delete(*args, **kwargs)

    def get_origin_file(self) -> Union[TemporaryUploadedFile, None]:
        temp_id = self.signature.get('args', [0])[0]
        try:
            temp = TemporaryUploadedFile.objects.get(id=temp_id)
            return temp
        except TemporaryUploadedFile.DoesNotExist:
            return None
