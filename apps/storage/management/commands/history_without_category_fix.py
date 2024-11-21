from django.core.management.base import BaseCommand
from apps.storage.models.data import DataMeta, UploadHistory


class Command(BaseCommand):
    """
    修复没有分类的上传历史 并清理掉数据为空的上传历史
    """

    def handle(self, *args, **options):
        queryset = UploadHistory.objects.filter(category=None)
        for history in queryset:
            meta_list = history.meta_id_list
            first_data_id = meta_list[0]
            qs = DataMeta.objects.filter(id=first_data_id)
            if len(qs) == 0:
                history.source = None
                history.delete()
            else:
                qs = qs.first()
                history.category_id = qs.category_id
                history.save()
        print(queryset.count())
