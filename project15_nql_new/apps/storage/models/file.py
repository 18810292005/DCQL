# -*- coding: utf-8 -*-

import hashlib
# @File   : file.py
# @Author : Harold Chen
# @Date   : 2018/03/18
import os
from datetime import datetime
from enum import IntEnum

from django.conf import settings
from django.db import models


class FileContentType(IntEnum):
    OTHERS = 0
    JSON = 1
    XML = 2
    XLSX = 3
    IMAGE = 4
    ARCHIVE = 5
    CSV = 6

    @property
    def default_extension(self):
        if self == FileContentType.JSON:
            return '.json'
        elif self == FileContentType.XML:
            return '.xml'
        elif self == FileContentType.XLSX:
            return '.xlsx'
        elif self == FileContentType.IMAGE:
            return '.jpg'
        elif self == FileContentType.CSV:
            return '.csv'
        else:
            return ''

    @property
    def is_xlsx(self):
        return self == FileContentType.XLSX

    @property
    def is_json(self):
        return self == FileContentType.JSON

    @property
    def is_xml(self):
        return self == FileContentType.XML

    @property
    def is_image(self):
        return self == FileContentType.IMAGE

    @property
    def is_csv(self):
        return self == FileContentType.CSV


class AbstractFile(models.Model):
    class Meta:
        abstract = True
        indexes = [models.Index(fields=['file']), models.Index(fields=['created_at'])]

    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(max_length=1024, upload_to='_fs/%Y/%m/%d/')
    hash_value = models.CharField(max_length=254, null=True)
    size = models.BigIntegerField(default=0)
    real_file_id = models.CharField(max_length=254, null=True)

    def get_url(self, absolute=False):
        if absolute:
            return settings.SITE_ADDR + settings.MEDIA_URL + self.file.name
        return settings.MEDIA_URL + self.file.name

    def get_system_path(self, absolute=False):
        if absolute:
            return os.path.join(settings.MEDIA_ROOT, self.file.name)
        else:
            return self.file.name

    @property
    def filename(self):
        return os.path.basename(self.file.name)

    @property
    def size_auto(self):
        if self.size < 1024:
            return f"{self.size}B"
        elif self.size < 1024 * 1024:
            return "%.2fKB" % (self.size / 1024)
        elif self.size < 1024 * 1024 * 1024:
            return "%.2fMB" % (self.size / 1024 / 1024)
        return "%.2fGB" % (self.size / 1024 / 1024 / 1024)

    def resize(self):
        try:
            self.size = os.stat(self.get_system_path(absolute=True)).st_size
            self.save()
        except FileNotFoundError:
            return

    @classmethod
    def add(cls, fp, content_type=None, filename=None, randomize=True, **kwargs):
        fp.seek(0)
        m = hashlib.md5()
        while True:
            data = fp.read(1024)
            if not data:
                break
            m.update(data)
        hash_value = m.hexdigest()
        size = fp.tell()
        fp.seek(0)

        if filename:
            basename, ext = os.path.splitext(filename)
            if not ext and content_type:
                ext = content_type.default_extension
            if randomize:
                new_filename = f'{basename}.{datetime.now().strftime("%Y%m%d%H%M%S")}{ext}'
            else:
                new_filename = filename
        else:
            if content_type:
                ext = content_type.default_extension
            else:
                ext = ''
            new_filename = f'{datetime.now().strftime("%Y%m%d%H%M%S")}{ext}'
        instance = cls(hash_value=hash_value, size=size, **kwargs)
        # if isinstance(instance, DataContentImage):
        #     instance.real_file_id = RealFile.add(instance.pk, fp, "image/jpeg")
        # elif isinstance(instance, DataContentFile):
        #     instance.real_file_id = RealFile.add(instance.pk, fp, "application/octet-stream")
        fp.seek(0)
        instance.file.save(new_filename, fp)
        return instance


class UploadedSourceFile(AbstractFile):
    uploaded_by = models.CharField(max_length=255, null=True)
    file = models.FileField(max_length=1024, upload_to='_fs/source/%Y/%m/%d/')


class TemporaryExportedFile(AbstractFile):
    file = models.FileField(max_length=1024, upload_to='_fs/exported/%Y/%m/%d/')


class TemporaryDataTemplate(AbstractFile):
    template = models.ForeignKey('storage.Template', on_delete=models.CASCADE)
    file = models.FileField(max_length=1024, upload_to='_fs/data_template/%Y/%m/%d/')


class TemporaryUploadedFile(AbstractFile):
    file = models.FileField(max_length=1024, upload_to='_fs/temporary_uploaded/%Y/%m/%d/')


class DataContentFile(AbstractFile):
    file = models.FileField(max_length=1024, upload_to='_fs/data_files/%Y/%m/%d/')


class DataContentImage(AbstractFile):
    file = models.ImageField(max_length=1024, upload_to='_fs/data_images/%Y/%m/%d/')
    inserted = models.IntegerField(default=0)
    """
    0: 未插入
    1: 插入成功
    -1: 插入失败
    """

    class Meta:
        indexes = [
            models.Index(fields=('file',))
        ]


class FileUsage(models.Model):
    meta = models.ForeignKey('storage.DataMeta', on_delete=models.CASCADE)
    file = models.ForeignKey(DataContentFile, on_delete=models.CASCADE)

    class Meta:
        unique_together = [['meta', 'file']]


class ImageUsage(models.Model):
    meta = models.ForeignKey('storage.DataMeta', on_delete=models.CASCADE)
    file = models.ForeignKey(DataContentImage, on_delete=models.CASCADE)

    class Meta:
        unique_together = [['meta', 'file']]
