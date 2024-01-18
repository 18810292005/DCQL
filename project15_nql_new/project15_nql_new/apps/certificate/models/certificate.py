import base64
from typing import Optional, Union

from django.contrib.postgres.fields import JSONField
from django.db import models

from apps.storage.models import MaterialProject, Template, MaterialCategory, MaterialSubject
from mgedata.errors.models import MGEError


# Create your models here.

def sizeof_fmt(num, suffix='B'):
    for unit in ['', 'K', 'M', 'G', 'T']:
        if abs(num) < 1024.0:
            return "%3.2f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)


class Certificate(models.Model):
    class Meta:
        ordering = ('-issue_time',)

    ps_id = models.CharField(max_length=128)  # 项目或者课题编号
    issue_time = models.DateTimeField()  # 证书生成时间，证书生成时手动指定时间，不使用自动添加
    expired = models.BooleanField(default=False)
    expired_time = models.DateTimeField(null=True)
    key = models.CharField(max_length=50, null=True, blank=False)  # 查看时使用的key
    is_project = models.BooleanField()  # True为项目，False为课题
    research = JSONField(default=dict)  # 科研成果，从各个科研成果模板数据中获取并保存
    research_private = JSONField(default=dict)
    data_count = models.BigIntegerField(default=0)  # 公开数据条数
    field_count = models.BigIntegerField(default=0)  # 公开数据字段个数
    table_count = models.BigIntegerField(default=0)  # 公开数据表格数量
    image_count = models.BigIntegerField(default=0)  # 公开数据图片个数
    file_count = models.BigIntegerField(default=0)  # 公开数据文件个数
    data_size = models.BigIntegerField(default=0)  # 公开数据总大小
    data_count_private = models.BigIntegerField(default=0)  # 私有数据条数
    field_count_private = models.BigIntegerField(default=0)  # 私有数据字段个数
    table_count_private = models.BigIntegerField(default=0)  # 私有数据表格数量
    image_count_private = models.BigIntegerField(default=0)  # 私有数据图片个数
    file_count_private = models.BigIntegerField(default=0)  # 私有数据文件个数
    data_size_private = models.BigIntegerField(default=0)  # 私有数据总大小

    def prepare_template(self):
        for field in ('data_count', 'field_count', 'table_count', 'image_count', 'file_count'):
            count = getattr(self, field)
            private = getattr(self, field + '_private')
            total = count + private
            field_string = str(total)
            if private:
                field_string += f' ({private})'
            setattr(self, field + '_str', field_string)
        data_size_str = sizeof_fmt(self.data_size + self.data_size_private)
        if self.data_size_private:
            data_size_str += f' ({sizeof_fmt(self.data_size_private)})'
        setattr(self, 'data_size_str', data_size_str)

    @property
    def encoded_key(self):
        return base64.urlsafe_b64encode(self.key.encode()).decode()

    def get_project_or_subject(self) -> Union[MaterialSubject, MaterialProject]:
        if self.is_project:
            table = MaterialProject
        else:
            table = MaterialSubject
        try:
            return table.objects.get(id=self.ps_id)
        except table.DoesNotExist:
            name = "项目" if self.is_project else "课题"
            raise MGEError.NOT_FOUND(f"{name}{self.ps_id}不存在")

    @staticmethod
    def get_newest_cert(ps_id: str) -> Optional['Certificate']:
        """
        获取编号为ps_id的项目或者课题的最新的汇交证明
        """
        try:
            return Certificate.objects.filter(ps_id=ps_id, expired=False).first()
        except Certificate.DoesNotExist:
            return None

    @staticmethod
    def create_cert_for_debug(ps_id: str, is_project: bool):
        from apps.certificate.tasks import CertificateIssuingTask
        from django.conf import settings
        settings.DEBUG = True
        return CertificateIssuingTask().run(ps_id, is_project)


class TemplateStatistic(models.Model):
    certificate = models.ForeignKey(Certificate, on_delete=models.CASCADE)  # 所属证明
    template = models.ForeignKey(Template, on_delete=models.PROTECT, null=True)  # 模板
    category = models.ForeignKey(MaterialCategory, on_delete=models.PROTECT, null=True)  # 模板分类
    data_count = models.BigIntegerField(default=0)  # 公开数据数据条数
    field_count = models.BigIntegerField(default=0)  # 公开数据字段个数
    table_count = models.BigIntegerField(default=0)  # 公开数据表格数量
    image_count = models.BigIntegerField(default=0)  # 公开数据图片个数
    file_count = models.BigIntegerField(default=0)  # 公开数据文件个数
    data_size = models.BigIntegerField(default=0)  # 公开数据总大小
    data_count_private = models.BigIntegerField(default=0)  # 私有数据条数
    field_count_private = models.BigIntegerField(default=0)  # 私有数据字段个数
    table_count_private = models.BigIntegerField(default=0)  # 私有数据表格数量
    image_count_private = models.BigIntegerField(default=0)  # 私有数据图片个数
    file_count_private = models.BigIntegerField(default=0)  # 私有数据文件个数
    data_size_private = models.BigIntegerField(default=0)  # 私有数据总大小

    def prepare_template(self):
        for field in ('data_count', 'field_count', 'table_count', 'image_count', 'file_count'):
            count = getattr(self, field)
            private = getattr(self, field + '_private')
            total = count + private
            field_string = str(total)
            if private:
                field_string += f' ({private})'
            setattr(self, field + '_str', field_string)
        data_size_str = sizeof_fmt(self.data_size + self.data_size_private)
        if self.data_size_private:
            data_size_str += f' ({sizeof_fmt(self.data_size_private)})'
        setattr(self, 'data_size_str', data_size_str)
