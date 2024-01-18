# -*- coding: utf-8 -*-

# @File   : file.py
# @Author : Yanghaoyu
# @Date   : 2019/4/9

from mongoengine import *


class RealFile(Document):
    file = FileField()
    abstract_file_id = IntField()

    @classmethod
    def add(cls, pk, file, content_type=''):
        file.seek(0)
        instance = cls(abstract_file_id=pk)
        instance.file.put(file, content_type=content_type)
        instance.save()
        return instance.pk

    @classmethod
    def get(cls, id):
        instances = cls.objects.filter(pk=id)[:1]
        if len(instances) < 1:
            return None
        instance = instances.first()
        return instance
