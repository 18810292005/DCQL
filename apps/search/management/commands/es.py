'''
Description: 终端命令
Autor: liminghong.dev
Date: 2021-09-14 22:15:49
'''
from django.core.management.base import BaseCommand

from apps.search.core_v2.es import Manager
from apps.storage.models.template import Template, DataMeta


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('cmd', choices=['update_templates', 'delete_templates', 'search_data'])
        parser.add_argument('--datameta_ids', type=int, nargs='+', default=[])
        parser.add_argument('--template_ids', type=int, nargs='+', default=[])
        parser.add_argument('--all', action='store_const', const=True, default=False)
        parser.add_argument('--return_meta_fields', type=str, nargs='+', default=[])

    @staticmethod
    def select_from_mongodb(options):
        template_ids = set(options['template_ids'])
        datameta_ids = set(options['datameta_ids'])
        if options['all']:
            template_ids = set(Template.objects.all().values_list('id', flat=True))
            datameta_ids = set(DataMeta.objects.all().values_list('id', flat=True))
        else:
            datametas = DataMeta.objects.filter(template__id__in=list(template_ids))
            datameta_ids = datameta_ids | set(datametas.values_list('id', flat=True))
        return list(template_ids), list(datameta_ids)

    def update_templates(self, template_ids):
        """
        按照模板同步数据
        """
        for t_id in template_ids:
            _start = 'datas in template_{} start to be inserted'.format(t_id)
            _end = 'datas in template_{} has inserted'.format(t_id)

            self.stdout.write(self.style.SUCCESS(_start))
            Manager.update_template(Template.objects.get(id=t_id))
            self.stdout.write(self.style.SUCCESS(_end))

    def delete_templates(self, template_ids):
        """
        删除模板(索引)以及对应的数据
        """
        Manager.delete_templates(Template.objects.filter(id__in=template_ids))

    def search_data(self, datameta_ids, return_meta_fields):
        _result = Manager.search(dict(id=datameta_ids),
                                 _source=return_meta_fields)
        print(_result)

    def handle(self, *args, **options):
        template_ids, datameta_ids = self.select_from_mongodb(options)
        if options['cmd'] == 'delete_templates':
            self.delete_templates(template_ids)
        if options['cmd'] == 'update_templates':
            self.update_templates(template_ids)
        if options['cmd'] == 'search_data':
            self.search_data(datameta_ids, options['return_meta_fields'])
