from django.core.management.base import BaseCommand
from django.db.models import Count

from apps.storage.models.data import DataMeta, UploadHistory


class Command(BaseCommand):
    """
    将没有上传历史的数据打包整合 按照上传者形成新的上传历史
    """

    def handle(self, *args, **options):
        queryset = DataMeta.objects.filter(add_time__lte="2018-05-17")
        users = queryset.values("user_id").annotate(counts=Count("user_id")).order_by("user_id")
        # old_upload_history = UploadHistory.objects.filter(time__lte="2018-05-17").delete() # 删除旧的遗留记录 感觉没必要
        res_ls = []
        for user in users:
            user_id = user['user_id']
            user_queryset = queryset.filter(user_id=user_id)
            time = user_queryset.first().add_time
            meta_list = [x.id for x in user_queryset]
            count = user_queryset.count()
            category_id = user_queryset.first().category_id  # 在数据库里查明这段数据的材料分类id根据用户完全相同
            res_ls.append(UploadHistory(**{
                "user_id": user_id,
                "time": time,
                "meta_id_list": meta_list,
                "count": count,
                "category_id": category_id,
            }))

        ls = UploadHistory.objects.bulk_create(res_ls)
        print(ls)
        print(queryset.count())
