from django.urls import reverse
from django.utils.translation import ugettext as _

from apps.account.models.users import UserRole
from mgedata.test import MGETestCase
from mgedata.test.utils.http_tools import HttpTools
from mgedata.test.utils.mailbox import MailBox


class TestUserApi(MGETestCase):

    def postSetUp(self):
        self.urls = {'login': reverse('api_v1_account:session_api'),
                     'logout': reverse('api_v1_account:session_api'),
                     'captcha': reverse('api_v1_account:get_captcha'),
                     'user_list': reverse('api_v1_account:user_list'),
                     'user_info': reverse('api_v1_account:user_info'),
                     'user_resource': reverse('api_v1_account:user_resource', kwargs={'username': 'test'}),  # api前面要加 /
                     'reset_password_request': reverse('api_v1_account:reset_password_request'),
                     'reset_password': reverse('api_v1_account:reset_password'),
                     'resend_verification_email': reverse('api_v1_account:resend_verification_email'),
                     'user_permissions': reverse('api_v1_account:user_permissions', kwargs={'username': 'test'})
                     }
        return

    def test_user_login_logout(self):
        data = self.get_login_info()
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['user'], 'test')
        self.assertEquals(data['data']['email'], 'xx@xx.cn')

        data = self.get_logout_info()
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['username'], 'test')
        self.assertEquals(data['data']['email'], 'xx@xx.cn')
        return

    def test_user_list(self):
        HttpTools.login(self.client)
        data = {'username': 'test1',
                'password': 'test1',
                'real_name': 'test1',
                'email': 'aa@aa.cn',
                'institution': 'ustb'
                }
        MailBox.record_mails_number()
        data = HttpTools.post(client=self.client, url=self.urls['user_list'], data=data)
        self.assertEquals(data['code'], 0)
        self.assertEquals(MailBox.get_mails_increased_number(), 1)
        self.assertEquals(MailBox.get_latest_mail().subject, _('Activate Your Account'))
        self.get_logout_info()

        HttpTools.login_as_root_user(self.client)
        data = {'email': 'cc@cc.cn',
                'real_name': 'supertest',
                'institution': 'ustb',
                'page': 1
                }
        data = HttpTools.get(client=self.client, url=self.urls['user_list'], data=data)
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['extra']['items'][0]['username'], 'supertest')
        self.assertEquals(self.get_logout_info()['data']['username'], 'supertest')
        return

    def test_user_info(self):
        HttpTools.login(self.client)
        data = HttpTools.get(client=self.client, url=self.urls['user_info'])
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['username'], 'test')
        self.assertEquals(data['data']['email'], 'xx@xx.cn')
        self.assertEquals(data['data']['institution'], 'ustb')
        self.assertEquals(data['data']['real_name'], 'test')
        return

    def test_user_resource(self):
        HttpTools.login(self.client)
        data = HttpTools.get(client=self.client, url=self.urls['user_resource'])
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['username'], 'test')
        self.assertEquals(data['data']['email'], 'xx@xx.cn')
        self.assertEquals(data['data']['institution'], 'ustb')
        self.assertEquals(data['data']['real_name'], 'test')

        MailBox.record_mails_number()
        data = HttpTools.patch(client=self.client, url=self.urls['user_resource'],
                               data={'email': 'yy@yy.cn', 'new_password': 'test2'})
        self.assertEquals(data['code'], 0)  # TODO 返回信息太少 无法同时修改邮件和其他信息
        self.assertEquals(MailBox.get_mails_increased_number(), 1)
        self.assertEquals(MailBox.get_latest_mail().subject, _("Activate Your Account"))

        # TODO api中delete方法没有实现
        return

    def test_reset_password_request(self):
        MailBox.record_mails_number()
        data = HttpTools.post(client=self.client, url=self.urls['reset_password_request'], data={'email': 'xx@xx.cn'})
        self.assertEquals(MailBox.get_mails_increased_number(), 1)
        self.assertEquals(MailBox.get_latest_mail().subject, _('Reset Your Password'))
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data'],
                          _("An email has been sent to %(object1)s. "
                            "Please click the link in it to reset your password") % {'object1': 'xx@xx.cn'})

    def test_reset_password(self):
        HttpTools.post(client=self.client, url=self.urls['reset_password_request'], data={'email': 'xx@xx.cn'})
        token = MailBox.get_latest_token()
        data = HttpTools.patch(client=self.client, url=self.urls['reset_password'],
                               data={'token': token, 'new_password': '123456'})
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data'], _('Your password has been reset.'))
        return

    def test_resend_verification_email(self):
        HttpTools.login(client=self.client)
        MailBox.record_mails_number()
        data = HttpTools.post(client=self.client, url=self.urls['resend_verification_email'])
        self.assertEquals(MailBox.get_mails_increased_number(), 1)
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data'],
                          _("An email has been sent to %(object1)s. Please click the link in it to verify "
                            "your email address.")
                          % {'object1': 'xx@xx.cn'})
        self.assertEquals(MailBox.get_latest_mail().subject, _("Activate Your Account"))
        return

    def test_user_permissions(self):
        HttpTools.create_root_user()
        HttpTools.email_verify(username='supertest')
        HttpTools.email_verify(username='test')
        HttpTools.login_as_root_user(self.client)
        data = HttpTools.get(client=self.client, url=self.urls['user_permissions'])
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['roles'], (UserRole.DATA_UPLOADER | UserRole.VERIFIED).value)

        data = {'roles': UserRole.TEMPLATE_UPLOADER | UserRole.VERIFIED}
        data = HttpTools.patch(client=self.client, url=self.urls['user_permissions'], data=data)
        self.assertEquals(data['code'], 0)
        self.assertEquals(data['data']['roles_set'], UserRole.TEMPLATE_UPLOADER | UserRole.VERIFIED)
        return

    def get_login_info(self):
        data = {'user': 'test',
                'password': 'test',
                'captcha_response': 'test'}
        return HttpTools.post(client=self.client, url=self.urls['login'], data=data)

    def get_logout_info(self):
        return HttpTools.delete(client=self.client, url=self.urls['logout'])
