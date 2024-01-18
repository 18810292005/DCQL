# -*- coding: utf-8 -*-

# @File   : models.py
# @Author : Yuvv
# @Date   : 2017/12/5


from enum import Enum

from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db import transaction
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

class DatabaseBackup(models.Model):
    """数据库备份文件"""
    db_type = models.CharField(
        max_length=32, choices=(
            ('m', 'mongodb'),
            ('p', 'postgresql'),
            ('g', 'migrations'),
            ('d', 'dump for local dev')
        )
    )
    back_date = models.DateField(auto_now=True)
    file = models.FileField(upload_to='_fs/%Y/%m/%d/')

    class Meta:
        verbose_name = _('Database Backup File')
        verbose_name_plural = _('Database Backup Files')

    def delete(self, using=None, keep_parents=False):
        super().delete(using, keep_parents)
        self.file.delete()


class RequestInformation(models.Model):
    url = models.CharField(max_length=500)
    params = JSONField(default=dict)
    body = JSONField(default=dict)
    username = models.CharField(max_length=500)
    ip = models.CharField(max_length=256)
    method = models.CharField(max_length=100)
    time = models.DateTimeField(default=timezone.now)


class PVEnum(Enum):
    SYSTEM_ID = 'system_id'
    MATERIAL_PROJECT_VERSION = 'material_project_version'
    MATERIAL_PROJECT_LOCK = 'material_project_lock'


class PersistentVariables(models.Model):
    """
    把一些变量持久化到数据库
    """
    system_id = models.CharField(max_length=1024, default='d442f93723f94d0f93a1db4b2ce5c930')
    material_project_version = models.IntegerField(default=0)
    material_project_lock = models.BooleanField(default=True)

    @staticmethod
    def keys():
        return [e.value for e in PVEnum]

    @staticmethod
    def get_variable(key: str):
        if key in PersistentVariables.keys():
            if len(PersistentVariables.objects.all()) == 0:
                PersistentVariables.objects.create()
            pv = PersistentVariables.objects.order_by('id')[0]
            if hasattr(pv, key):
                return getattr(pv, key)
        return None

    @staticmethod
    def set_variable(key, value):
        if key in PersistentVariables.keys():
            if len(PersistentVariables.objects.all()) == 0:
                with transaction.atomic():
                    pv = PersistentVariables.objects.create()
                    setattr(pv, key, value)
                    pv.save()
                return True
            else:
                pv = PersistentVariables.objects.order_by('id')[0]
                setattr(pv, key, value)
                pv.save()
                return True
        return False


class UpdateHistory(models.Model):
    class Meta:
        ordering = ('-time',)

    time = models.DateField()
    content = models.TextField()
