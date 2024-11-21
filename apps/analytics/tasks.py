from django.db import transaction
from django.db.models import F
from django.utils import timezone

from apps.storage.models.data import DataMeta, DataStatistic
from apps.storage.models.template import TemplateDataStatistic


def on_view(data_meta: DataMeta):
    now = timezone.now().date()
    with transaction.atomic():
        num_updated = DataStatistic.objects.filter(
            meta=data_meta, day=now
        ).update(num_views=F('num_views') + 1)
        if num_updated == 0:
            DataStatistic.objects.bulk_create([
                DataStatistic(meta=data_meta, day=timezone.now(), num_views=1, template_id=data_meta.template_id)
            ], ignore_conflicts=True)
        num_updated = TemplateDataStatistic.objects.filter(
            template_id=data_meta.template_id, day=now
        ).update(num_views=F('num_views') + 1)
        if num_updated == 0:
            TemplateDataStatistic.objects.bulk_create([
                TemplateDataStatistic(template_id=data_meta.template_id, day=now, num_views=1)
            ], ignore_conflicts=True)


def on_download(data_meta: DataMeta):
    now = timezone.now().date()
    with transaction.atomic():
        num_updated = DataStatistic.objects.filter(
            meta=data_meta, day=now
        ).update(num_downloads=F('num_downloads') + 1)
        if num_updated == 0:
            DataStatistic.objects.bulk_create([
                DataStatistic(meta=data_meta, day=now, num_downloads=1, template_id=data_meta.template_id)
            ], ignore_conflicts=True)
        num_updated = TemplateDataStatistic.objects.filter(
            template_id=data_meta.template_id, day=now
        ).update(num_downloads=F('num_downloads') + 1)
        if num_updated == 0:
            TemplateDataStatistic.objects.bulk_create([
                TemplateDataStatistic(template_id=data_meta.template_id, day=now, num_downloads=1)
            ], ignore_conflicts=True)
