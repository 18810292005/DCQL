# -*- coding: utf-8 -*-

# @File   : data_import_export
# @Author : Harold Chen
# @Date   : 2018/3/18
import os
import shutil
from typing import Union, List

from django.conf import settings
from django.db import models

from apps.storage.models.data import DataMeta
from apps.storage.models.file import FileContentType, TemporaryDataTemplate, TemporaryUploadedFile
from apps.storage.models.template import Template
from apps.storage.tasks import DataImportTask, DataExportTask
from apps.task.models import UserTask, TaskType
from mgedata.utils.general import mkdtemp
from .serializers.common import DataMode
from .serializers.excel import ExcelHandler
from .serializers.json import JSONHandler
from .serializers.xml import XMLHandler


def generate_data_template(template_id, file_format: FileContentType):
    template = Template.objects.get(id=template_id)
    # try:
    #     return TemporaryDataTemplate.objects.get(template=template, content_type=file_format.value)
    # except TemporaryDataTemplate.DoesNotExist:
    #     pass
    if file_format == FileContentType.JSON:
        handler = JSONHandler(DataMode.TEMPLATE, template=template)
    elif file_format == FileContentType.XLSX:
        handler = ExcelHandler(DataMode.TEMPLATE, template=template)
    else:
        handler = XMLHandler(DataMode.TEMPLATE, template=template)
    handler.generate_template()
    temp_dir = mkdtemp()
    filename = handler.save(temp_dir)
    fp = None
    try:
        fp = open(os.path.join(temp_dir, filename), 'rb')
        return TemporaryDataTemplate.add(fp, template=template, content_type=file_format, filename=filename,
                                         randomize=False)
    finally:
        if fp:
            fp.close()
        shutil.rmtree(temp_dir)


def export_data(user, meta_or_list: Union[str, int, DataMeta, List[Union[str, int, DataMeta]]],
                file_format: FileContentType, excluded_fields=(), included_fields=(), flat=False,
                asynchronous=True, ocpmdm=False, filename=None, no_attachments=False) -> Union[UserTask, str]:
    """
    导出数据
    :param meta_or_list: 需要导出的数据，可以是一个DataMeta对象或者DataMeta列表，或着DataMeta的ID或者ID列表
    :param file_format: 导出格式
    :return: TemporaryExportedFile
    """

    if isinstance(meta_or_list, (str, int)):
        meta_id_list = [str(meta_or_list)]
    elif isinstance(meta_or_list, DataMeta):
        meta_id_list = [meta_or_list.id]
    elif isinstance(meta_or_list, models.QuerySet):
        meta_id_list = list(meta_or_list.values_list('id', flat=True))
    elif isinstance(meta_or_list, list):
        meta_id_list = meta_or_list
    else:
        meta_id_list = []

    if asynchronous:
        return UserTask.add_task(user,
                                 DataExportTask().s(user.username, meta_id_list, file_format, flat=flat,
                                                    excluded_fields=excluded_fields,
                                                    included_fields=included_fields,
                                                    no_attachments=no_attachments), TaskType.DATA_EXPORT)
    else:
        return DataExportTask().run(user.username, meta_id_list, file_format, flat=flat, asynchronous=asynchronous,
                                    excluded_fields=excluded_fields,
                                    included_fields=included_fields,
                                    no_attachments=no_attachments)['url']


def import_data(fp, file_format: FileContentType, uploaded_by, upload_filetype="OTHERS",
                template_id=-1, verify_only=False, sync=False) -> UserTask:
    temp_file = TemporaryUploadedFile.add(fp, content_type=file_format, filename=fp.name)
    if not os.path.exists(temp_file.get_system_path(absolute=True)):
        temp_file.delete()
        temp_file = TemporaryUploadedFile.add(fp, content_type=file_format, filename=fp.name)

    if verify_only:
        task_type = TaskType.DATA_IMPORT_VERIFY
    else:
        task_type = TaskType.DATA_IMPORT
    #
    # if settings.DEBUG:
    #     return DataImportTask().run(temp_file.id, file_format, uploaded_by.username, upload_filetype=upload_filetype,
    #                                 verify_only=verify_only)
    if not sync:
        return UserTask.add_task(uploaded_by, DataImportTask().s(temp_file.id, file_format, uploaded_by.username,
                                                                 upload_filetype=upload_filetype,
                                                                 verify_only=verify_only),
                                 task_type)
    return DataImportTask().run(temp_file.id, file_format, uploaded_by.username, upload_filetype=upload_filetype,
                                verify_only=verify_only)
