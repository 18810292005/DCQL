from django.conf import settings
from django.core.mail import send_mail
from django.db.models import QuerySet
from django.utils.translation import gettext_lazy as _

from .models.notifications import NotificationType, Notification
from .models.users import User


def notify(recipients, n_type: NotificationType, object1=None, object2=None, object3=None):
    if isinstance(recipients, (QuerySet, list)):
        for user in recipients:
            n = Notification(recipient=user, notification_type=n_type.value[0], object1=object1,
                             object2=object2, object3=object3, important=n_type.is_important)
            n.save()
    else:
        n = Notification(recipient=recipients, notification_type=n_type.value[0], object1=object1,
                         object2=object2, object3=object3, important=n_type.is_important)
        n.save()


def notify_email_verifying(recipients):
    if isinstance(recipients, (QuerySet, list)):
        for user in recipients:
            n = Notification(recipient=user, notification_type=NotificationType.EMAIL_NEEDS_VERIFYING.value[0],
                             object1=user.email)
            n.save()
    else:
        n = Notification(recipient=recipients, notification_type=NotificationType.EMAIL_NEEDS_VERIFYING.value[0],
                         object1=recipients.email)
        n.save()


def send_verification_email(recipient, link):
    if not isinstance(recipient, User):
        raise ValueError
    subject = _('Activate Your Account')
    message = _('Please click the following link to verify your email address.') + '\n' + link
    send_mail(subject, message, from_email=settings.DEFAULT_FROM_EMAIL, recipient_list=[recipient.email])
    notify_email_verifying(recipient)


def send_email(recipient, title, content):
    if not isinstance(recipient, User):
        raise ValueError
    subject = title
    message = content
    send_mail(subject, message, from_email=settings.DEFAULT_FROM_EMAIL, recipient_list=[recipient.email])


def send_reset_password_email(recipient, link):
    from .models.users import User
    from django.conf import settings
    if not isinstance(recipient, User):
        raise ValueError
    subject = _('Reset Your Password')
    message = _('Please click the following link to reset your password.') + '\n' + link
    send_mail(subject, message, from_email=settings.DEFAULT_FROM_EMAIL, recipient_list=[recipient.email])
