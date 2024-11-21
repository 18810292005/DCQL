from django.contrib.auth.management.commands import createsuperuser

from apps.account.models import User


class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        super().handle(*args, **options)
        User.objects.filter(is_superuser=True).update(roles=255)
