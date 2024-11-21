# -*- coding: utf-8 -*-

# @File   : models.py
# @Author : Yuvv
# @Date   : 2017/12/5


from django.db import models
from django.utils.translation import gettext_lazy as _


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


class UpdateHistory(models.Model):
    class Meta:
        ordering = ('-time',)

    time = models.DateField()
    content = models.TextField()
