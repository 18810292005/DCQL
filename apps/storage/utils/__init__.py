# -*- coding: utf-8 -*-

# @File   : __init__.py
# @Author : Yuvv
# @Date   : 2018/1/6

from enum import IntEnum


class DBAction(IntEnum):
    CREATE = 0
    READ = 1
    UPDATE = 2
    DELETE = 3

    @property
    def is_create(self):
        return self.value == DBAction.CREATE

    @property
    def is_read(self):
        return self.value == DBAction.READ

    @property
    def is_update(self):
        return self.value == DBAction.UPDATE

    @property
    def is_delete(self):
        return self.value == DBAction.DELETE
