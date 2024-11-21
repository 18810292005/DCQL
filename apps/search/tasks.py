'''
Description: celery task
Autor: liminghong.dev
Date: 2021-08-07 17:27:46
'''
import logging
import traceback
from celery import shared_task
from django.contrib.auth.models import AnonymousUser

from apps.search.core_v2.es import Manager
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.storage.models.data import DataMeta
from apps.storage.models.template import Template

logger = logging.getLogger('django')


@shared_task
def import_to_es(meta_id_or_list=None):
    if meta_id_or_list is None:
        return
    if isinstance(meta_id_or_list, int):
        meta_id_or_list = [meta_id_or_list]

    Manager.insert(meta_id_or_list)


@shared_task
def import_templates_to_es(templates_id: list):
    for template_id in templates_id:
        try:
            Manager.update_template(Template.objects.get(id=template_id))
        except Exception:
            _e = f'import_templates_to_es(template_id: {template_id}): {traceback.format_exc()}'
            logger.error(_e)


@shared_task
def update_to_es(datameta_id: int, changes: dict):
    try:
        data = DataMeta.objects.get(pk=datameta_id)
        Manager.update_datameta(data, changes)
    except DataMeta.DoesNotExist:
        pass


@shared_task
def delete_datametas(meta_ids: list, template_id='*', opposite=False):
    Manager.delete_datametas(meta_ids, template_id, opposite)


@shared_task
def update_all_es_data():
    Manager.update_all_data()


@shared_task
def heat_control():
    Manager.default_search(
        user=AnonymousUser, template_id='*',
        query=MultiTemplateQueryFactory.produce(dict(text="材料")),
        _source=['id'], from_=0, size=20)
    return
