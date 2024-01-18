from apps.storage.models.file import DataContentImage
from django.core.management.base import BaseCommand
from apps.image_search.utils.sift_delivery.main import train
import logging
logger = logging.getLogger('django')


class Command(BaseCommand):
    help = 'Start train'

    def add_arguments(self, parser):
        # 注意：train_dir应为_fs的上级目录（具体还需依照DataContentImage）
        parser.add_argument('train_dir', nargs='?', type=str)

    def handle(self, *args, **options):
        try:
            self.stdout.write(self.style.SUCCESS(options['train_dir']))
            train_dir = options['train_dir']
            train(train_dir)
            dataContentImage = DataContentImage.objects.all()
            for dci in dataContentImage:
                dci.inserted = 1
            self.stdout.write(self.style.SUCCESS('Successfully trained'))
        except Exception as e:
            dataContentImage = DataContentImage.objects.all()
            for dci in dataContentImage:
                dci.inserted = 0
            logger.error('train_error:{}'.format(e))
