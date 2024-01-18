# -*- coding: utf-8 -*-

# @File   : tasks
# @Author : Harold Chen
# @Date   : 2018/7/17
import os
from celery import shared_task
from apps.storage.models.file import DataContentImage
from .utils.sift_delivery import settings
from .utils.sift_delivery.main import insert_img, init
from mgedata.settings import MEDIA_ROOT
import logging

logger = logging.getLogger('django')


@shared_task
def insert_images_v2():
    """
    insert无法并发，采用定时的方法，每隔1小时把DataContentImage中未insert的图片执行insert
    使用全局变量来保证两个定时任务不同时执行
    """
    if settings.INSERTED:  # 如果上一个任务已经完成
        try:
            settings.INSERTED = False  # 任务间隔1小时，不会来的太快
            dataContentImage = DataContentImage.objects.filter(inserted=0)
            for dci in dataContentImage:
                try:
                    insert_img(init(), os.path.join(MEDIA_ROOT, dci.file))
                    dci.inserted = 1
                    dci.save()
                    logger.info('插入图片' + str(dci.file))
                except Exception as e:
                    dci.inserted = -1
                    dci.save()
                    logger.error('insert_image_v2_task:{}'.format(e))
        except Exception as e:
            logger.error('insert_image_v2_task:{}'.format(e))
        settings.INSERTED = True
