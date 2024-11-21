from django.core.management.base import BaseCommand
from apps.storage.models.data import DataMeta, UploadHistory


class Command(BaseCommand):
    """
    清理掉没有数据的上传历史记录
    """

    def handle(self, *args, **options):
        queryset = UploadHistory.objects.all()
        total_count = queryset.count()
        percent_count = total_count // 10
        current_count = 0
        delete_list = []
        print("total_count is:")
        print(total_count)
        for history in queryset:
            meta_list = history.meta_id_list
            qs = DataMeta.objects.filter(id__in=meta_list)
            if qs.count() != len(meta_list):
                if qs.count() == 0:
                    delete_list.append(history.id)
                    # history.source = None
                    # history.delete()
                else:
                    ls = [x['id'] for x in qs.values('id')]
                    history.meta_id_list = ls
                    history.save()
            current_count += 1
            if current_count % percent_count == 0:
                print(current_count / total_count)
        print("delete history count is:")
        print(len(delete_list))
        UploadHistory.objects.filter(id__in=delete_list).update(source=None)
        UploadHistory.objects.filter(id__in=delete_list).delete()
        print("finished count is:")
        print(queryset.count())
