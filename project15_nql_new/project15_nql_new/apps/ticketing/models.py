from enum import IntEnum
from datetime import datetime
from django.db import models
from django.conf import settings
from django.utils.translation import ugettext as _

from apps.account.models.users import User
from apps.account.notify import notify
from apps.account.models.notifications import NotificationType
from django.shortcuts import reverse


class TicketType(IntEnum):
    PERMISSION_REQUEST = 1
    TEMPLATE = 2
    DATA = 3
    SUGGESTION = 4

    @staticmethod
    def to_choices():
        ticket_type_list = []
        for name in TicketType._member_names_:
            e = TicketType.__getattr__(name)
            ticket_type_list.append({'name': e.description, 'value': e.value})
        return ticket_type_list

    @property
    def description(self):
        if self == TicketType.PERMISSION_REQUEST:
            return _("Permissions Request")
        elif self == TicketType.TEMPLATE:
            return _("Template")
        elif self == TicketType.DATA:
            return _("Data")
        elif self == TicketType.SUGGESTION:
            return _("Suggestion")


class Ticket(models.Model):
    class Meta:
        ordering = ["-created_at"]

    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True)
    content = models.TextField()
    t_type = models.IntegerField()
    status = models.IntegerField(choices=((1, _('Open')), (2, _('Closed')), (3, _('Ended'))), default=1)
    new_user_reply = models.BooleanField(default=True)
    new_admin_reply = models.BooleanField(default=False)

    def user_reply(self, content):
        TicketReply(ticket=self, from_user=self.created_by, content=content).save()
        self.new_user_reply = True
        self.save()

    def admin_reply(self, admin: User, content):
        TicketReply(ticket=self, from_user=admin, content=content).save()
        self.new_admin_reply = True
        self.save()
        notify(self.created_by, NotificationType.NEW_TICKET_REPLY_FROM_ADMIN, object1=self.html_title)

    def get_replies(self):
        ticket_reply = TicketReply.objects.filter(ticket=self)
        return ticket_reply

    def close_ticket(self):
        self.status = 2
        self.ended_at = datetime.now()
        self.new_admin_reply = False
        self.new_user_reply = False
        self.save()
        notify(self.created_by, NotificationType.TICKET_CLOSED, object1=self.html_title)

    def finish_ticket(self):
        self.status = 3
        self.ended_at = datetime.now()
        self.new_admin_reply = False
        self.new_user_reply = False
        self.save()

    def to_dict(self):
        username = self.created_by.to_dict()["username"]
        realname = self.created_by.to_dict()["real_name"]
        res = {
            "id": self.id,
            "title": self.title,
            "created_by": username,
            "real_name": realname,
            "created_at": self.created_at,
            "ended_at": self.ended_at,
            "content": self.content,
            "t_type": self.t_type,
            "status": self.status,
            "new_user_reply": self.new_user_reply,
            "new_admin_reply": self.new_admin_reply
        }
        return res

    @property
    def topic(self):
        return TicketType(self.t_type).description

    @property
    def url(self):
        return reverse('ticketing:show_ticket', kwargs={'ticket_id': self.id})

    @property
    def html_title(self):
        return '<a href="%s">%s</a>' % (self.url, self.title)


class TicketReply(models.Model):
    class Meta:
        ordering = ["created_at"]

    ticket = models.ForeignKey(to=Ticket, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    from_user = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()

    def to_dict(self):
        username = self.from_user.to_dict()["username"]
        res = {
            "id": self.id,
            "ticket": self.ticket.id,
            "created_at": self.created_at,
            "from_user":username,
            "content": self.content
        }
        return res


class TicketFile(models.Model):
    file_field = 'file'  # fixme: 文件名是否需要重写（ 要 !
    ticket = models.ForeignKey(to=Ticket, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    filename = models.CharField(max_length=255)
    owner = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)

    class Meta:
        abstract = True

    def get_url(self, full=False):
        url = settings.MEDIA_URL + getattr(self, self.file_field).name
        if full:
            return settings.SITE_ADDR + url
        return url


class TicketAttachment(TicketFile):
    file = models.FileField(upload_to='_fs/%Y/%m/%d/')


class TicketImage(TicketFile):
    file_field = 'image'
    image = models.ImageField(upload_to='_img/%Y/%m/%d/')
