from django.core.management.base import BaseCommand
from apps.storage.models import UploadHistory


class Command(BaseCommand):
    """
    根据id撤回数据
    """

    def add_arguments(self, parser):
        parser.add_argument('id', help='需要撤回的历史id')

    def handle(self, *args, **options):
        history_id = int(options['id'])
        h = UploadHistory.objects.get(pk=history_id)
        h.retract_data()
