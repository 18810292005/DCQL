from django.core import mail


class MailBox:
    mails_record_number = 0

    @classmethod
    def record_mails_number(cls):
        cls.mails_record_number = len(mail.outbox)
        return

    @classmethod
    def get_mails_increased_number(cls):
        return len(mail.outbox) - cls.mails_record_number

    @classmethod
    def get_latest_mail(cls):
        return mail.outbox[len(mail.outbox) - 1]

    @classmethod
    def get_mail(cls, number):
        if number >= len(mail.outbox):
            return mail.outbox[0]
        return mail.outbox[number]

    @classmethod
    def get_latest_token(cls):
        body = cls.get_latest_mail().body
        return body[body.find('token=') + len('token='):]
