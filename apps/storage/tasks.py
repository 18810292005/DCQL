# -*- coding: utf-8 -*-

# @File   : tasks.py
# @Author : Harold Chen
# @Date   : 2018/1/17

from __future__ import absolute_import, unicode_literals

import logging
import os
import shutil
import pytz
from django.conf import settings
from django.db import models
from django.db import transaction
from django.utils import timezone
from django.utils.translation import gettext as _
from patoolib import extract_archive
from patoolib.util import PatoolError

from apps.account.models import User
from apps.search.core_v2.es import insert_meta_with_ids, delete_meta_with_ids
from apps.storage.models.data import (DataMeta, DataStatistic, BatchUploadHistory)
from apps.storage.models.file import FileContentType, TemporaryExportedFile
from apps.storage.models.file import TemporaryUploadedFile
from apps.storage.models.template import Template, TemplateDataStatistic
from apps.storage.utils.serializers import (
    DataMode, JSONHandler, ExcelHandler, XMLHandler, FlatJSONWriter, FlatExcelWriter, CSVWriter
)
from apps.storage.utils.serializers.common import ParsingError
from apps.task.task_registry import MGEBaseTask
from mgedata.errors.models import MGEError, MGEException
from mgedata.task_log import mge_task_log
from mgedata.utils.general import mkdtemp, mge_make_archive

logger = logging.getLogger('django')


class DataImportTask(MGEBaseTask):

    @property
    def task_description(self):
        return "数据汇交"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._meta_id_list = []
        self._to_be_revoked = []
        self._template_id = None

    def run(self, temporary_uploaded_file_id, file_format, uploaded_by,
            upload_filetype='OTHERS', verify_only=False):
        super().run()
        file_format = FileContentType(file_format)  # file_format被celery传递时会被专为int，要转回来
        mge_task_log("开始数据汇交", {"temporary_uploaded_file_id": temporary_uploaded_file_id,
                                      "file_format": file_format, "uploaded_by": uploaded_by,
                                      "verify_only": verify_only})
        try:
            temp_file = TemporaryUploadedFile.objects.get(id=temporary_uploaded_file_id)
            temp_file.file.seek(0)
            fp = temp_file.file
            fp.name = temp_file.filename
        except (TemporaryUploadedFile.DoesNotExist, FileNotFoundError):
            raise MGEError.TASK_FILE_EXPIRED

        def _unarchive_files(archive_fp):
            mge_task_log("开始解压", {"filename": archive_fp.name})
            tmp_dir = mkdtemp()
            # 如果extract_archive不识别压缩包，下面的改成这句：tmp_archive_file_path = os.path.join(tmp_dir, archive_fp.name)
            tmp_archive_file_path = os.path.join(tmp_dir, 'original_archive')
            tmp_unarchived_dir_path = os.path.join(tmp_dir, 'unarchived')
            os.mkdir(tmp_unarchived_dir_path)
            mge_task_log("开始移动压缩文件到", {"filepath": tmp_archive_file_path})
            with open(tmp_archive_file_path, 'wb') as f:  # 暂存用户上传的文件
                shutil.copyfileobj(archive_fp, f)
            try:
                extract_archive(tmp_archive_file_path, outdir=tmp_unarchived_dir_path)
                target_file = None

                for root, dirs, files in os.walk(tmp_unarchived_dir_path):
                    # skip __MACOSX
                    try:
                        dirs.remove('__MACOSX')
                    except ValueError:
                        pass
                    if target_file:
                        break
                    try:
                        files.remove('.DS_Store')
                    except ValueError:
                        pass
                    for f in files:
                        basename, ext = os.path.splitext(f)
                        try:  # 如果源压缩包名字是中文，名字是cp437格式编码的会存在乱码,需要重命名文件
                            new_filename = basename.encode('cp437').decode('gbk') + ext
                        except Exception:
                            new_filename = basename + ext  # 如果不是cp437编码,不做处理
                        new_filename = new_filename.strip()  # 去除文件名开头结尾空格
                        source_file_path = os.path.join(root, f)
                        target_file_path = os.path.join(root, new_filename)
                        os.rename(source_file_path, target_file_path)
                        ext = ext.upper()
                        # if ext in ('.XLSX', '.JSON', '.XML'):
                        if ext in ('.XLSX', '.JSON',):
                            target_file = root
                    if files and not target_file:
                        raise MGEError.NO_VALID_FILE
                if target_file is None:
                    raise MGEError.NO_VALID_FILE
                return target_file

            except PatoolError as ex:
                shutil.rmtree(tmp_dir)
                mge_task_log("PatoolError", {"error": ex}, level=logging.ERROR)
                logger.error(ex)
                raise MGEError.BAD_ARCHIVE

        def _filter_files(output_path: str) -> dict:
            """
            用户上传的文件分类，分为XLSX，JSON，XML文件
            :param output_path: 文件的所在文件夹路径
            :return:
            """
            file_names = os.listdir(output_path)
            xlsx_candidates = []
            json_candidates = []
            xml_candidates = []
            for sub_filename in file_names:
                basename, ext = os.path.splitext(sub_filename)
                ext = ext.upper()
                if ext == '.XLSX':
                    if basename.startswith('~'):  # 过滤excel临时文件
                        continue
                    xlsx_candidates.append(sub_filename)
                elif ext == '.JSON':
                    json_candidates.append(sub_filename)
                # elif ext == '.XML':
                #     xml_candidates.append(sub_filename)

            if len(xlsx_candidates) == 0 and len(json_candidates) == 0 and len(xml_candidates) == 0:
                raise MGEError.NO_VALID_FILE
            if len(xlsx_candidates) > 1 or len(json_candidates) > 1 or len(xml_candidates) > 1:
                raise MGEError.TOO_MANY_FILE_CANDIDATES
            if len(xlsx_candidates) + len(json_candidates) + len(xml_candidates) > 1:
                raise MGEError.TOO_MANY_FILE_CANDIDATES

            return {
                FileContentType.XLSX: xlsx_candidates,
                FileContentType.JSON: json_candidates,
                FileContentType.XML: xml_candidates
            }

        if file_format == FileContentType.ARCHIVE:
            try:
                temp_dir = _unarchive_files(fp)
            except PatoolError as e:
                logger.error(e)
                raise MGEError.BAD_ARCHIVE
        else:
            temp_dir = mkdtemp()
            temp_file_path = os.path.join(temp_dir, fp.name)
            with open(temp_file_path, 'wb') as temp_fp:
                shutil.copyfileobj(fp, temp_fp)

        try:
            candidates = _filter_files(temp_dir)
            count = 0
            total_count = len(candidates[FileContentType.XLSX]) + len(candidates[FileContentType.XML]) + len(
                candidates[FileContentType.JSON])
            if len(candidates) == 0:
                raise MGEError.NO_AVAILABLE_DATA

            def progress_handler(percentage, block=False):
                self.update_progress((percentage + count) / total_count, block)

            mge_task_log("开始数据读取")
            for f_format, filename_list in candidates.items():
                for filename in filename_list:
                    if f_format.is_xlsx and (upload_filetype == "EXCEL" or upload_filetype == "OTHERS"):
                        handler = ExcelHandler(DataMode.READ, verify_only=verify_only)
                    elif f_format.is_json and (upload_filetype == "JSON" or upload_filetype == "OTHERS"):
                        handler = JSONHandler(DataMode.READ, verify_only=verify_only)
                    elif f_format.is_xml and (upload_filetype == "XML" or upload_filetype == "OTHERS"):
                        handler = XMLHandler(DataMode.READ, verify_only=verify_only)
                    self._meta_id_list.extend(
                        handler.read_data(os.path.join(temp_dir, filename), file_dir=temp_dir, uploaded_by=uploaded_by,
                                          progress_handler=progress_handler)
                    )
                    count += 1
            if not self._meta_id_list and not verify_only:
                raise MGEError.NO_AVAILABLE_DATA
            if not verify_only:
                self._template_id = DataMeta.importing_objects.filter(pk=self._meta_id_list[0]).first().template_id
                with transaction.atomic():
                    upload_history = BatchUploadHistory.objects.create(
                        user_id=uploaded_by
                    )
                    DataMeta.importing_objects.filter(id__in=self._meta_id_list).update(
                        importing=False,
                        batch_upload_history=upload_history
                    )
                    mge_task_log("开始同步到es", {"meta_id_list": self._meta_id_list, "count": len(self._meta_id_list)})
                    temp_file.delete()
                    insert_meta_with_ids(self._meta_id_list)
                    temp_file.file.delete()
                return {'data_count': len(self._meta_id_list), 'meta_id_list': self._meta_id_list}
        except ParsingError as e:
            if not verify_only:
                DataMeta.importing_objects.filter(id__in=self._meta_id_list).delete()
            delete_meta_with_ids(self._meta_id_list)
            raise MGEError.BAD_DATA(e.message)
        except ValueError as e:
            if not verify_only:
                DataMeta.importing_objects.filter(id__in=self._meta_id_list).delete()
            delete_meta_with_ids(self._meta_id_list)
            raise MGEError.BAD_DATA(str(e))
        except MGEException as e:
            if not verify_only:
                DataMeta.importing_objects.filter(id__in=self._meta_id_list).delete()
            delete_meta_with_ids(self._meta_id_list)
            raise e
        except Exception as e:
            if not verify_only:
                DataMeta.importing_objects.filter(id__in=self._meta_id_list).delete()
            delete_meta_with_ids(self._meta_id_list)
            raise MGEError.PARSE_FAILED("解析失败，请确认填写正确，或尝试重新下载填写模板。")
        finally:
            if not verify_only:
                self._to_be_revoked = self._meta_id_list[:]
            self._meta_id_list.clear()
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.error(e)

    def on_success_but_revoked(self):
        if self._to_be_revoked:
            with transaction.atomic():
                DataMeta.objects.filter(id__in=self._to_be_revoked).delete()
                # 不考虑跨零点的任务
                beijing_tz = pytz.timezone(settings.TIME_ZONE)
                now_date = timezone.now()
                beijing_now = now_date.astimezone(beijing_tz)
                now_date = beijing_now.date()
                TemplateDataStatistic.objects.filter(
                    template_id=self._template_id, day=now_date
                ).select_for_update().update(
                    num_new_data=models.F('num_new_data') - len(self._to_be_revoked)
                )


class DataExportTask(MGEBaseTask):
    @property
    def task_description(self):
        return "数据导出"

    def run(self, username, meta_id_list, file_format: FileContentType, excluded_fields=(), included_fields=(),
            no_attachments=False, flat=False, asynchronous=True):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return MGEError.USER_NOT_FOUND("username不存在")

        super().run()
        file_format = FileContentType(file_format)  # file_format被celery传递时会被专为int，要转回来
        if len(meta_id_list) == 0:
            raise MGEError.NO_AVAILABLE_DATA

        tid_handler_map = {}
        tid_list = [x['template_id'] for x in
                    DataMeta.objects.filter(pk__in=meta_id_list).values('template_id').order_by(
                        'template_id').distinct()]
        if not tid_list:
            raise MGEError.NO_AVAILABLE_DATA
        elif len(tid_list) > 1 and (excluded_fields or included_fields):
            raise MGEError.UNSUPPORTED_FIELDS_FILTERING(_("Multiple templates involved"))
        for tid in tid_list:
            template = Template.objects.get(id=tid)
            if excluded_fields or included_fields:
                template.filter_fields(excluded_fields=excluded_fields, included_fields=included_fields)
            if file_format == FileContentType.XLSX:
                if flat:
                    handler = FlatExcelWriter(template=template)
                else:
                    handler = ExcelHandler(DataMode.WRITE, template=template, no_attachments=no_attachments)
            elif file_format == FileContentType.JSON:
                if flat:
                    handler = FlatJSONWriter(template=template, with_headers=True)
                else:
                    handler = JSONHandler(DataMode.WRITE, template=template, no_attachments=no_attachments)
            elif file_format == FileContentType.XML:
                handler = XMLHandler(DataMode.WRITE, template=template, no_attachments=no_attachments)
            elif file_format == FileContentType.CSV:
                handler = CSVWriter(template=template)
            else:
                handler = None  # NEVER
            tid_handler_map[tid] = handler

        if isinstance(meta_id_list, models.QuerySet):
            meta_list = meta_id_list
            total_count = meta_list.count()
        elif len(meta_id_list) > 0 and isinstance(meta_id_list[0], DataMeta):
            meta_list = meta_id_list
            total_count = len(meta_list)
        else:
            meta_list = DataMeta.objects.filter(id__in=meta_id_list)
            total_count = len(meta_list)

        current_count = 0

        for meta in meta_list:
            handler = tid_handler_map[meta.template_id]
            handler.write_data(meta)
            current_count += 1
            if current_count % 3 == 0:
                # 每3条数据更新一次进度
                self.update_progress(current_count / total_count)
        # if len(tid_handler_map) == 1:
        #     handler = list(tid_handler_map.values())[0]
        #     fp = BytesIO()
        #     filename = handler.save(fp)
        #     return {
        #         'url': TemporaryExportedFile.add(fp, content_type=file_format, filename=filename,
        #                                          randomize=False).get_url()}

        temp_dir = None
        try:
            temp_dir = mkdtemp()
            file_dir = os.path.join(temp_dir, 'files')
            os.makedirs(file_dir, exist_ok=True)
            archive_name = f'{timezone.now().strftime("%Y%m%d%H%M%S")}'
            archive = os.path.join(temp_dir, archive_name)
            self.update_progress(-1, block=True)
            for tid, handler in tid_handler_map.items():
                handler.save(file_dir).replace('/', '／').replace('\\', '＼')
            mge_make_archive(archive, 'zip', root_dir=file_dir)
            archive += '.zip'
            archive_name += '.zip'

            with transaction.atomic():
                # 更新数据下载量
                today = timezone.now().date()
                data_stats = []
                template_stats = []
                for data in meta_list:
                    data_stats.append(
                        DataStatistic(meta_id=data.id, day=today, num_downloads=1, template_id=data.template_id)
                    )
                    template_stats.append(
                        TemplateDataStatistic(template_id=data.template_id, day=today, num_downloads=1)
                    )
                DataStatistic.objects.bulk_create(data_stats, ignore_conflicts=True)
                TemplateDataStatistic.objects.bulk_create(template_stats, ignore_conflicts=True)
                DataStatistic.objects.filter(meta_id__in=meta_id_list, day=today).update(
                    num_downloads=models.F('num_downloads') + 1
                )
                TemplateDataStatistic.objects.filter(template_id__in=tid_list, day=today).update(
                    num_downloads=models.F('num_downloads') + 1
                )

            with open(archive, 'rb') as f:
                return {'url': TemporaryExportedFile.add(f, content_type=FileContentType.ARCHIVE, filename=archive_name,
                                                         randomize=False).get_url()}

        finally:
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.error(e)
