from enum import Enum

from django.conf import settings
from django.db import models
from django.shortcuts import reverse
from django.utils.translation import gettext_noop as _, gettext


class NotificationType(Enum):
    """
    消息类型枚举，值是消息的整型id（id要存入数据库）和其具体内容，使用%(object1)s, %(object2)s和%(object3)s作为占位符。
    """
    SYSTEM = 0, "",
    EMAIL_NEEDS_VERIFYING = 1, _("A confirmation email has been sent to your email address: %(object1)s, please " +
                                 "click the link in it to verify your account.")
    NEW_TICKET_REPLY_FROM_ADMIN = 2, _("Your ticket %(object1)s has a new reply.")
    NEW_TICKET_FROM_USER = 3, _("%(object1)s has opened a new ticket %(object2)s.")
    NEW_TICKET_REPLY_FROM_USER = 4, _("Ticket %(object1)s has a new reply from %(object2)s.")
    TICKET_CLOSED = 5, _("Admin closed your ticket %(object1)s.")
    TASK_SUCCEEDED = 6, _('Your task \"%(object1)s\" has been done.')
    TASK_FAILED = 7, _('Your task \"%(object1)s\" failed... :(')
    TEMPLATE_APPROVED = 8, _('Your template \"%(object1)s\" has been approved.')
    TEMPLATE_DISAPPROVED = 9, _('Your template \"%(object1)s\" has been disapproved.')
    DATA_APPROVED = 10, _("Your data has been approved. ")
    DATA_DISAPPROVED = 11, _("Your data has been disapproved. ")
    EVALUATION_PENDING = 12, _(
        "You have been assigned to evaluate %(object1)s \"%(object2)s\". Please finish evaluating before %(object3)s. ")
    EVALUATION_ACCEPTED = 13, _("Your %(object1)s \"%(object2)s\" has been accepted!")
    EVALUATION_FAILED = 14, _("Your %(object1)s \"%(object2)s\" has failed. ")
    EVALUATION_LEADER_PENDING = 15, _(
        "All experts have evaluated %(object1)s \"%(object2)s\". Please give your evaluation. ")
    NEW_ACCEPTANCE_REQUEST = 16, _(
        "You have been assigned as the expert leader of a new acceptance request. "
        "Please assign experts and make your evaluation.")
    DATA_RETRACT = 17, _("Your data uploaded at %(object1)s has been retracted. ")
    DATA_REVIEW_REVOKE = 18, _("Your data uploaded at %(object1)s has been set to pending review. ")

    @property
    def html(self):
        if self in (NotificationType.DATA_APPROVED, NotificationType.DATA_DISAPPROVED):
            if self == NotificationType.DATA_APPROVED:
                state = "approved"
            else:
                state = 'disapproved'
            return self.value[1] + _('Click <a href="%(url)s">here</a> for details.') % {
                'url': reverse('account:upload_history_state',
                               kwargs={'state': state, 'page': 1})}
        else:
            return gettext(self.value[1])

    @property
    def is_important(self):
        return self in (
            NotificationType.EVALUATION_ACCEPTED,
            NotificationType.EVALUATION_FAILED,
            NotificationType.EVALUATION_PENDING,
            NotificationType.EVALUATION_LEADER_PENDING
        )


class SystemNotification(models.Model):
    title = models.TextField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        from .users import User
        if self.id is not None:
            Notification.objects.filter(system=self).delete()
        super().save(*args, **kwargs)
        notifications = []
        for username in User.objects.all().values_list('username', flat=True):
            notifications.append(
                Notification(notification_type=NotificationType.SYSTEM.value[0], system=self, recipient_id=username,
                             important=True))
        Notification.objects.bulk_create(notifications)


class Notification(models.Model):
    class Meta:
        ordering = ('-timestamp',)

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications', on_delete=models.CASCADE)
    unread = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now=True)
    notification_type = models.IntegerField()
    object1 = models.TextField(null=True, blank=True)
    object2 = models.TextField(null=True, blank=True)
    object3 = models.TextField(null=True, blank=True)
    important = models.BooleanField(default=False)
    system = models.ForeignKey(SystemNotification, null=True, on_delete=models.CASCADE)

    def to_string(self):
        if self.notification_type == NotificationType.SYSTEM.value[0]:
            return self.system.content
        return _notification_map[self.notification_type].html % {'object1': gettext(self.object1 or ""),
                                                                 'object2': gettext(self.object2 or ""),
                                                                 'object3': gettext(self.object3 or "")}

    @property
    def content(self):
        return self.to_string()

    def __unicode__(self):
        return self.to_string()

    def __repr__(self):
        return self.to_string()

    def to_dict(self):
        return {'id': self.pk,
                'unread': self.unread,
                'timestamp': self.timestamp,
                'important': self.important,
                'content': self.to_string()}

    @property
    def string(self):
        return self.to_string()


_notification_map = {x.value[0]: x for x in NotificationType.__members__.values()}
