from django.core.management.base import BaseCommand

from mgedata.test.utils.sample.material import methods as material_methods

from apps.storage.models.material import MaterialMethod


class Command(BaseCommand):
    def handle(self, *args, **options):
        MaterialMethod.objects.all().delete()
        MaterialMethod.make(material_methods)
