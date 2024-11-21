from enum import IntEnum

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from mgedata.errors.models import MGEError


class UserRole(IntEnum):
    # COMBINATION = 0x0
    # ROOT = 0x00001
    # VERIFIED = 0x0002
    # TEMPLATE_UPLOADER = 0x0004
    # TEMPLATE_ADMIN = 0x0008
    # DATA_UPLOADER = 0x0010
    # DATA_ADMIN = 0x0020
    # DOI_ADMIN = 0x0040
    # USER_ADMIN = 0x080
    # THIRD_APPLICATION = 0x0100
    """
    高级权限包括所有低级权限
    """
    GUEST = 0  # 访客，只可查看公开数据
    RESEARCHER = 1  # 科研人员，可创建模板、上传数据，但是公开数据必须经过数据管理员审核，只能修改自己的模板和数据
    DATA_ADMIN = 2  # 数据管理员，可审核数据和模板
    SYS_ADMIN = 3  # 系统管理员，可以修改领域分类、管理用户
    ROOT = 4  # 超级管理员，可以修改任何模板和数据，只能有一个

    @property
    def description(self):
        return {
            UserRole.GUEST: _('访客'),
            UserRole.RESEARCHER: _('科研人员'),
            UserRole.DATA_ADMIN: _('数据审核员'),
            UserRole.SYS_ADMIN: _('系统管理员'),
            UserRole.ROOT: _('超级管理员')
        }[self]


class User(AbstractUser):
    REQUIRED_FIELDS = ['email', 'tel', 'real_name']
    username = models.CharField(_('用户名'), validators=[UnicodeUsernameValidator()],
                                max_length=100, primary_key=True)
    real_name = models.CharField(_('真实姓名'), max_length=255, db_index=True)
    email = models.EmailField(_('Email address'), unique=True, db_index=True)
    email_verified = models.BooleanField(_("Email verified"), default=True)
    institution = models.TextField(_('Institution'), blank=True, db_index=True)
    role = models.IntegerField(default=UserRole.GUEST.value)
    tel = models.CharField(max_length=15, blank=True, null=True)
    enabled = models.BooleanField(default=True)
    last_online = models.DateTimeField(null=True, blank=True)
    first_name = None
    last_name = None

    def has_role(self, role: UserRole):
        return self.role >= role

    def generate_token(self, account_action):
        """
        生成操作token
        :param account_action: 账户操作类型，AccountAction枚举类型
        :return: token
        """
        from mgedata.utils.general import generate_token
        d = {'username': self.username, 'action': account_action}
        if account_action == AccountAction.RESET_PASSWORD:
            d['salt'] = hash(str(self.last_login) + self.password)
        elif account_action == AccountAction.VERIFY_EMAIL:
            d['email'] = self.email
        return generate_token(d)

    def verify_token(self, token, account_action):
        """
        验证操作token，token中记录的用户名和用户本身一致，
        并且操作类型也和请求一致时才认为token有效。
        :param token: token
        :param account_action: token中本应包含的操作类型
        :return: token是否有效
        """
        from mgedata.utils.general import decode_token
        d = decode_token(token)
        if d is None:
            return None
        if d['username'] == self.username and d['action'] == account_action:
            changed = False
            if account_action == AccountAction.VERIFY_EMAIL:
                if self.email_verified or d.get('email', None) != self.email:
                    return None
                self.email_verified = True
                changed = True
            if account_action == AccountAction.RESET_PASSWORD:
                if d.get('salt', None) != hash(str(self.last_login) + self.password):
                    return None
            if changed:
                self.save()
            return d
        else:
            return None

    def old_role_value(self) -> list[int]:
        return [2,
                3,
                4,
                5,
                6,
                7,
                8]

    def to_dict(self, fields=None):
        if not fields:
            fields = ['username', 'institution', 'email', 'email_verified',
                      'real_name', 'tel', 'enabled', 'role', 'date_joined']
        d = self._to_dict_with_fields(*fields)

        # 兼容旧页面
        d['roles'] = self.old_role_value()
        return d
        # d['managed_categories'] = [{
        #     'name': categories.category.name,
        #     'id': categories.category.id
        # } for categories in self.managed_categories.all()]

    def full_clean(self, exclude=None, validate_unique=True):
        """
        包装django的full_clean，验证email和username的有效性，
        如果无效，转换成对应的MGEException
        :param exclude:
        :param validate_unique:
        :return:
        """
        try:
            super().full_clean(exclude=exclude, validate_unique=validate_unique)
        except ValidationError as e:
            if 'email' in e.message_dict:
                raise MGEError.BAD_EMAIL("无效的邮箱")
            elif 'username' in e.message_dict:
                raise MGEError.BAD_USERNAME("无效的用户名")
            else:
                raise

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def unread_count(self):
        # Notification Model中指定了related_name，所以有notification属性
        return self.notifications.filter(unread=True).count()

    @classmethod
    def user_from_token(cls, token):
        from mgedata.utils.general import decode_token
        d = decode_token(token)
        if d is None:
            return None
        username = d.get('username', '')
        try:
            return cls.objects.get(username=username)
        except cls.DoesNotExist:
            return None

    def _to_dict_with_fields(self, *args):
        d = {}
        for arg in args:
            d[arg] = getattr(self, arg)
        return d


class LoginHistory(models.Model):
    """
    登陆历史
    """
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    ip = models.CharField(max_length=16)


class AccountAction(IntEnum):
    """
    账户操作枚举，用于token验证
    """
    LOGIN = 0
    VERIFY_EMAIL = 1
    RESET_PASSWORD = 2
    DELETE = 3
