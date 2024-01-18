# -*- coding: utf-8 -*-
'''
Description: 相关数据库表
Autor: liminghong.dev
Date: 2021-08-07 17:27:21
'''

from django.db import models
from django.contrib.postgres.fields import JSONField


class Query(models.Model):
    user = models.ForeignKey('account.User',
                             on_delete=models.SET_NULL,
                             null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    q = JSONField()
    download = JSONField()
