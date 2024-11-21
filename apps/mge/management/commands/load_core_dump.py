from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.account.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('db_json_file')

    def handle(self, *args, **options):
        if User.objects.count() > 1000:
            return
        call_command('loaddata', options['db_json_file'] + ['--ignorenonexistent'])
