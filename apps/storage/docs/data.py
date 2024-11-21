# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/11/11

import mongoengine as me
from pymongo.errors import DocumentTooLarge

from mgedata.errors.models import MGEError


class DataContent(me.Document):
    """数据内容类，具体字段不确定"""

    _meta_id = me.IntField(min_value=0, required=True, db_field='_meta_id')
    _tid = me.IntField(min_value=0, required=True, db_field='_tid')
    data = me.DictField(required=True)

    meta = {
        'indexes': [
            '_meta_id',
            '_tid',
        ],
    }

    def save(self, *args, **kwargs):
        try:
            super(DataContent, self).save(*args, **kwargs)
        except DocumentTooLarge:
            raise MGEError.EXCEED_MAX_VALIDATE_FILE_SIZE
