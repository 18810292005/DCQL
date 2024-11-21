from django.conf import settings  # noqa
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.storage.models.data import DataStatistic, DataMeta
from apps.storage.models.template import TemplateDataStatistic, Template


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        _map = {}
        with transaction.atomic():
            TemplateDataStatistic.objects.all().delete()
            for template_id in Template.objects.values_list('id', flat=True):
                meta_stats = DataStatistic.objects.filter(template_id=template_id)
                meta_id_stat_map = {}
                for meta_stat in meta_stats:
                    meta_id_stat_map[meta_stat.meta_id] = meta_stat
                for meta in DataMeta.objects.filter(template_id=template_id).only('id', 'add_time'):
                    key = (meta.add_time.date(), template_id)
                    _map.setdefault(key, [0, 0, 0])
                    stat = meta_id_stat_map.get(meta.id)
                    if stat:
                        _map[key][0] += stat.num_views
                        _map[key][1] += stat.num_downloads
                    _map[key][2] += 1
            for (day, template_id), (num_views, num_downloads, num_data) in _map.items():
                TemplateDataStatistic.objects.create(day=day, template_id=template_id, num_views=num_views,
                                                     num_downloads=num_downloads, num_new_data=num_data)
