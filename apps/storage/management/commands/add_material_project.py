from django.core.management.base import BaseCommand

from mgedata.test.utils.sample.material import projects as material_projects

from apps.storage.models.material import MaterialProject, MaterialSubject


class Command(BaseCommand):
    def handle(self, *args, **options):
        MaterialSubject.objects.all().delete()
        MaterialProject.objects.all().delete()
        MaterialProject.make(material_projects)
