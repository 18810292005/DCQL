import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.storage.models.template import Template
from django.conf import settings


class Command(BaseCommand):
    """
    从线上导入指定模版信息到开发/本地服务器
    用于检查用户上传错误
    """

    def add_arguments(self, parser):
        parser.add_argument('id', help='需要插入的模版id')

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise Exception("仅开发环境使用")
        template_id = int(options['id'])
        request_url = f'http://mged.nmdms.ustb.edu.cn/api/v1/storage/template/{template_id}'
        result = requests.get(request_url).json()
        if result['code'] != 0:
            print('错误信息：', result['msg'])
        else:
            template_dict = result['data']
            template = Template.objects.filter(title=template_dict['title'])
            with transaction.atomic():
                if template.count() > 0:
                    template.delete()
                template = Template.objects.create(title=template_dict['title'],
                                                   abstract=template_dict['abstract'], content=template_dict['content'])
                print(f'数据库中存储的template_id为:{template.id}')
