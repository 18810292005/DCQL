# -*- coding: utf-8 -*-

# @File   : tasks.py
# @Author : Yuvv
# @Date   : 2017/12/22


from __future__ import absolute_import, unicode_literals

import os
import shutil
import uuid
from datetime import datetime, timedelta
from os.path import abspath
from os.path import dirname
from pathlib import Path
from subprocess import check_call, CalledProcessError
from tempfile import mkdtemp, TemporaryDirectory

import mongoengine as me
from celery import shared_task
from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.files import File
from django.core.management import call_command
from patoolib import create_archive

from apps.mge.models import DatabaseBackup
from apps.search.tasks import update_all_es_data
from apps.storage.models.material import Category, MaterialProject, MaterialSubject
from apps.storage.models.template import Template, DataMeta
from mgedata.utils.compress_zip import zip_compress

logger = get_task_logger(__name__)


def update_subject_trend(date):
    subjects = MaterialSubject.objects.all()
    for s in subjects:
        trend = SubjectTrend.get_unique(s)
        trend.record[str(date)] = SubjectCounter.get_unique(s).to_list()
        trend.save(update_fields=('record',))


def update_project_trend(date):
    projects = MaterialProject.objects.all()
    for p in projects:
        trend = ProjectTrend.get_unique(p)
        trend.record[str(date)] = trend.stat()
        trend.save(update_fields=('record',))


@shared_task
def make_test_data():
    call_command('metadump')


@shared_task
def beat_per_day():
    """每天执行一次的任务"""
    # 删除已经超时的数据/数据集文件
    now = datetime.now()

    # 更新 trend 中的模板量、数据量
    date = now.year * 100 + now.month
    classes = Category.objects.filter(leaf=True)
    for c in classes:
        template_count = Template.objects.filter(category=c).count()
        data_count = DataMeta.objects.filter(category=c).count()

        counter = ClassCounter.get_unique(c)
        trend = ClassTrend.get_unique(c)
        trend.record[str(date)] = [
            counter.views,
            counter.downloads,
            template_count,
            data_count
        ]
        trend.save(update_fields=('record',))

    update_subject_trend(date)
    update_project_trend(date)
    # 清除缓存数据
    tmp_dir = mkdtemp()  # 创建一个备份临时文件夹，postgres 操作结束后删除
    # 备份 mongodb 中的数据
    mongo_settings = me.connection._connection_settings['default']
    try:
        check_call([
            'mongodump',
            '--host', mongo_settings['host'][0],
            '--port', str(mongo_settings['port']),
            '-d', mongo_settings['name'],
            '-u', mongo_settings['username'],
            '-p', mongo_settings['password'],
            '--gzip',
            '-o', tmp_dir
        ])
    except CalledProcessError as ex:
        print(ex)
    else:
        arc_path = os.path.join(tmp_dir, 'mongo-back.tar.gz')
        create_archive(arc_path,
                       (os.path.join(tmp_dir, mongo_settings['name']),))
        # md5_sum = get_md5_checksum(arc_path)
        db_back_file = DatabaseBackup(db_type='m')
        with open(arc_path, 'rb') as f:
            db_back_file.file.save(str(uuid.uuid4()) + '.tar.gz', File(f))
        db_back_file.save()

    # 备份 postgresql 中的数据
    pg_settings = settings.DATABASES['default']
    os.putenv('PGPASSWORD', pg_settings['PASSWORD'])
    try:
        back_path = os.path.join(tmp_dir, 'pg-dump')
        check_call([
            'pg_dump',
            '-h', pg_settings['HOST'],
            '-p', str(pg_settings['PORT']),
            '-d', pg_settings['NAME'],
            '-U', pg_settings['USER'],
            '-w', '-Fd',
            '-f', back_path
        ])
    except CalledProcessError as ex:
        print(ex)
    else:
        arc_path = os.path.join(tmp_dir, 'pg-dump.tar.gz')
        create_archive(arc_path,
                       (back_path,))
        # md5_sum = get_md5_checksum(arc_path)
        db_back_file = DatabaseBackup(db_type='p')
        with open(arc_path, 'rb') as f:
            db_back_file.file.save(str(uuid.uuid4()) + '.tar.gz', File(f))
        db_back_file.save()
    finally:
        os.unsetenv('PGPASSWORD')

    # 备份migrations文件
    source_path = dirname((dirname(abspath(__file__))))
    arc_path = os.path.join(tmp_dir, 'apps_migrations.zip')
    zip_compress(source_path, arc_path, filter='migrations', exclude='__pycache__')
    db_back_file = DatabaseBackup(db_type='g')
    with open(arc_path, 'rb') as f:
        db_back_file.file.save(str(uuid.uuid4()) + '.zip', File(f))
    db_back_file.save()

    # 删除临时文件
    shutil.rmtree(tmp_dir)

    # 判断私有数据是否到时间公开
    qs = DataMeta.objects.filter(public_date__lt=now).exclude(public_range='public')
    count = qs.update(public_range='public')
    logger.info(f'新增公开数据总数为 :{count}')

    update_all_es_data.delay()


@shared_task
def beat_per_week():
    """每周执行一次的任务"""
    # # 删除一个月前的数据库备份文件
    now = datetime.now()
    for back_file in DatabaseBackup.objects.filter(back_date__lt=now - timedelta(days=30)):
        back_file.file.delete(False)
        back_file.delete()
    dump_test_data()


def dump_test_data():
    with TemporaryDirectory() as temp_dir:
        temp_dir = Path(temp_dir)
        call_command('metadump', '-o', temp_dir)
        rec = DatabaseBackup(db_type='d')
        with open(temp_dir / 'dump.zip', 'rb') as fp:
            rec.file.save(f'metadump_{datetime.now().timestamp()}.zip', fp)
        rec.save()
