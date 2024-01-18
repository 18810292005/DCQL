# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/11/11

import mongoengine as me
from pymongo.errors import DocumentTooLarge

from mgedata.errors.models import MGEError


class DataContent(me.DynamicDocument):
    """数据内容类，具体字段不确定"""

    _meta_id = me.IntField(min_value=0, required=True, db_field='_meta_id')
    _tid = me.IntField(min_value=0, required=True, db_field='_tid')

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

    def delete(self, *args, **kwargs):
        """删除同时检查各个字段，删除各字段内容"""
        for field_cls in (DataFieldTable, DataFieldContainer, DataFieldTableRow):
            field_cls.objects(_meta_id=self._meta_id).delete()
        super(DataContent, self).delete(*args, **kwargs)

    @property
    def get_meta_id(self):
        return self._meta_id

    @property
    def get_t_id(self):
        return self._tid

    @property
    def get_id(self):
        return self.id

    @property
    def get_owner_id(self):
        return None


class DataFieldTableRow(me.DynamicDocument):
    """表格字段实际存储的每一行的内容"""

    _meta_id = me.IntField(min_value=0, required=True, db_field='_meta_id')
    _tid = me.IntField(min_value=0, required=True, db_field='_tid')
    _owner_id = me.ObjectIdField(db_field='_owner_id')
    _path = me.StringField(db_field='_path')
    _row_num = me.IntField(db_field='_row_num')
    _root_owner_id = me.ObjectIdField(db_field='_root_owner_id')
    _element_num = me.IntField(db_field='_element_num')
    meta = {
        'indexes': [
            '_meta_id',
            '_tid',
            '_owner_id',
            '_path',
            '_row_num',
        ],
    }

    def save(self, *args, **kwargs):
        try:
            super(DataFieldTableRow, self).save(*args, **kwargs)
        except DocumentTooLarge:
            raise MGEError.EXCEED_MAX_VALIDATE_FILE_SIZE

    @property
    def get_meta_id(self):
        return self._meta_id

    @property
    def get_owner_id(self):
        return self._owner_id

    @property
    def get_id(self):
        return self.id

    @property
    def get_t_id(self):
        return self._tid


class DataFieldTable(me.Document):
    """表格型数据

    `title`: 表格标题（table 标签的 title 部分，并非字段名）
    `head`:  列标题（表头）
    """
    _meta_id = me.IntField(min_value=0, required=True, db_field='_meta_id')
    _tid = me.IntField(min_value=0, required=True, db_field='_tid')
    _owner_id = me.ObjectIdField(db_field='_owner_id')
    _path = me.StringField(db_field='_path')
    _root_owner_id = me.ObjectIdField(db_field='_root_owner_id')
    _element_num = me.IntField(db_field='_element_num')
    rows = me.ListField(me.ObjectIdField())
    row_count = me.IntField()
    title = me.StringField()
    head = me.ListField(field=me.StringField())

    meta = {
        'indexes': [
            '_meta_id',
            '_tid',
            '_owner_id',
            '_path',
            'row_count',
        ],
    }

    @property
    def get_meta_id(self):
        return self._meta_id

    @property
    def get_owner_id(self):
        return self._owner_id

    @property
    def get_id(self):
        return self.id

    @property
    def get_t_id(self):
        return self._tid


class DataFieldContainer(me.DynamicDocument):
    """容器型数据，内容不确定"""

    _meta_id = me.IntField(min_value=0, required=True, db_field='_meta_id')
    _tid = me.IntField(min_value=0, required=True, db_field='_tid')
    _owner_id = me.ObjectIdField(db_field='_owner_id')
    _path = me.StringField(db_field='_path')
    _root_owner_id = me.ObjectIdField(db_field='_root_owner_id')
    _element_num = me.IntField(db_field='_element_num')

    meta = {
        'indexes': [
            '_meta_id',
            '_tid',
            '_owner_id',
            '_path',
        ],
    }

    def save(self, *args, **kwargs):
        try:
            super(DataFieldContainer, self).save(*args, **kwargs)
        except DocumentTooLarge:
            raise MGEError.EXCEED_MAX_VALIDATE_FILE_SIZE

    @property
    def get_meta_id(self):
        return self._meta_id

    @property
    def get_owner_id(self):
        return self._owner_id

    @property
    def get_id(self):
        return self.id

    @property
    def get_t_id(self):
        return self._tid
