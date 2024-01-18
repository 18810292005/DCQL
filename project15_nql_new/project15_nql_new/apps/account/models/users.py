from enum import Enum, IntEnum
import os
from typing import Union, Iterable, List
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from mgedata.errors.models import MGEError
import math
from django.contrib.postgres.fields import ArrayField


class UserRole(IntEnum):
    """
    用户角色，使用二进制位设置。
    用户可以有多种角色，如果用户的角色是12（二进制是1100）
    则其具有TEMPLATE_UPLOADER和TEMPLATE_ADMIN两种角色
    """
    COMBINATION = 0x0
    ROOT = 0x00001
    VERIFIED = 0x0002
    TEMPLATE_UPLOADER = 0x0004
    TEMPLATE_ADMIN = 0x0008
    DATA_UPLOADER = 0x0010
    DATA_ADMIN = 0x0020
    DOI_ADMIN = 0x0040
    USER_ADMIN = 0x080
    THIRD_APPLICATION = 0x0100

    @property
    def description(self):
        return [_('Super Admin'), _('Verified User'), _('Template Uploader'), _('Template Admin'),
                _('Data Uploader'), _('Data Admin'), _('DOI Admin'), _('User Admin'), _('Third Application')][
            int(math.log(self.value, 2))]

    @staticmethod
    def _from_combination(value, from_and):
        new = UserRole.COMBINATION
        new._value_ = value
        new._is_from_and = from_and
        return new

    def __init__(self, *args, **kwargs):
        IntEnum.__init__(*args, **kwargs)
        self._is_from_and = False

    def __and__(self, other):
        if not isinstance(other, UserRole) and isinstance(other, int):
            return UserRole._from_combination(self.value & other, from_and=True)
        elif not isinstance(other, UserRole):
            raise NotImplementedError
        return UserRole._from_combination(from_and=True, value=self.value & other.value)

    def __or__(self, other):
        if not isinstance(other, UserRole) and isinstance(other, int):
            return UserRole._from_combination(self.value | other, from_and=False)
        elif not isinstance(other, UserRole):
            raise NotImplementedError
        return UserRole._from_combination(from_and=False, value=self.value | other.value)

    @property
    def is_from_and(self):
        return self._is_from_and

    @staticmethod
    def settable_roles():
        for role in UserRole:
            if role not in (UserRole.COMBINATION, UserRole.ROOT, UserRole.VERIFIED):
                yield role

    @staticmethod
    def get_all_roles():
        roles = []
        id = 0
        for role in UserRole:
            name = UserRole.get_zh_name(role.name)
            if name:  # 忽略combination
                roles.append({
                    "code": settings.SYSTEM_NUMBER + settings.USER_ROLE_ORDER['userRole'] + "%03d" % role.value,
                    "name": name,
                    "id": str(id),
                })
                id += 1
        # 合并roleforacceptance
        # for role in UserRolesForAcceptance:
        #     roles.append({
        #         "code": settings.SYSTEM_NUMBER + settings.USER_ROLE_ORDER[
        #             'userRoleForAcceptance'] + "%03d" % role.value,
        #         "name": role.name_string,
        #         "id": str(id),
        #     })
        #     id += 1
        return roles

    @staticmethod
    def get_zh_name(name: str) -> str:
        en_zh = {
            "ROOT": "超级管理员",
            "TEMPLATE_UPLOADER": "模板上传",
            "TEMPLATE_ADMIN": "模板管理员",
            "DATA_UPLOADER": "数据上传",
            "DATA_ADMIN": "数据管理员",
            "DOI_ADMIN": "DOI管理员",
            "USER_ADMIN": "用户管理员"
        }
        return en_zh.get(name)


class User(AbstractUser):
    REQUIRED_FIELDS = ['email', 'tel', 'real_name']
    username = models.CharField(_('Username'), validators=[UnicodeUsernameValidator()],
                                max_length=100, primary_key=True)
    real_name = models.CharField(_('Real name'), max_length=254)
    email = models.EmailField(_('Email address'), unique=True)
    email_verified = models.BooleanField(_("Email verified"), default=False)
    institution = models.TextField(_('Institution'), blank=True)
    register_ip = models.CharField(_('Register IP'), max_length=16, blank=True)
    roles = models.IntegerField(_('Roles'), default=UserRole.DATA_UPLOADER)
    tel = models.CharField(_('Telephone'), max_length=15, blank=True)
    # subject = models.ForeignKey('storage.MaterialSubject', null=True, on_delete=models.CASCADE)
    first_name = None
    last_name = None

    # token = models.CharField(max_length=500, default='')

    class AvatarSize(Enum):
        LARGE = (200, 200)
        NORMAL = (100, 100)
        SMALL = (30, 30)


    @property
    def projects_list(self) -> list:
        from apps.storage.models.material import MaterialProject # 循环引用
        a = [x.id for x in self.my_projects.all()]
        append_list = MaterialProject.objects.filter(leader_fk = self).values_list("id", flat=True)
        new_list = list(set(a).union(set(append_list)))

        return new_list

    @property
    def subjects_list(self) -> list:
        from apps.storage.models.material import MaterialSubject # 循环引用
        a = [x.id for x in self.my_subjects.all()]
        append_list = MaterialSubject.objects.filter(leader_fk = self).values_list("id", flat=True)
        new_list = list(set(a).union(set(append_list)))
        return new_list

    def set_roles(self, roles: Union[int, Iterable[UserRole]]) -> int:
        if self.has_role(UserRole.ROOT):
            return UserRole.ROOT
        if not self.email_verified:
            return self.roles
        new_role = 0
        if isinstance(roles, int):
            for role in UserRole.settable_roles():
                new_role |= role.value & roles
        else:
            settable_roles = set(UserRole.settable_roles()) & set(roles)
            for role in settable_roles:
                new_role |= role.value
        User.objects.filter(pk=self.pk).update(roles=new_role)
        return new_role

    @property
    def roles_components(self) -> List[UserRole]:
        if self.has_role(UserRole.ROOT):
            return list(UserRole.settable_roles())
        components = []
        for role in UserRole:
            if int(role) & self.roles:
                components.append(role)
        return components

    def has_role(self, required_roles: UserRole):
        """
        返回用户是否有某种（某几种）角色。
        可以使用位运算符号进行角色的与或操作。
        例如：
        UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN 表示要求用户是二者之一
        UserRole.TEMPLATE_ADMIN & UserRole.DATA_ADMIN 表示要求用户二者都具有
        :param required_roles: 要求用户所具有的角色
        :return: bool 是否拥有给定的角色
        """
        if not isinstance(required_roles, UserRole):
            raise ValueError("required_roles must be UserRole")
        if self.roles & UserRole.ROOT.value:
            return True
        if required_roles.is_from_and:
            return (required_roles.value & self.roles) == required_roles.value
        else:
            return bool(required_roles.value & self.roles)

    def has_role_for_acceptance(self, role: 'UserRolesForAcceptance') -> bool:
        try:
            return UserRolesForAcceptanceModel.objects.get(user=self).has_role(role)
        except UserRolesForAcceptanceModel.DoesNotExist:
            return False

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
                self.roles = self.roles | UserRole.VERIFIED.value
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

    def to_dict(self):  # TODO 不同角色看到的内容不同？
        d = self._to_dict_with_fields('username', 'institution',
                                      'email', 'email_verified',
                                      'real_name', 'tel')

        d['roles'] = [int(math.log(role.value, 2)) for role in self.roles_components]
        d['managed_categories'] = [{
            'name': categories.category.name,
            'id': categories.category.id
        } for categories in self.managed_categories.all()]
        try:
            d['roles_for_acceptance'] = self.userrolesforacceptancemodel.roles
        except UserRolesForAcceptanceModel.DoesNotExist:
            d['roles_for_acceptance'] = []
        return d

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
                raise MGEError.BAD_EMAIL
            elif 'username' in e.message_dict:
                raise MGEError.BAD_USERNAME
            else:
                raise

    def save(self, *args, **kwargs):
        if self.email_verified:
            self.roles |= UserRole.VERIFIED
        self.full_clean()
        super().save(*args, **kwargs)

    def set_avatar(self, fp):
        from PIL import Image
        image = Image.open(fp)
        w, h = image.size
        if w > h:
            diff = int((w - h) / 2)
            image = image.crop((diff, 0, w - diff, h))
        else:
            diff = int((h - w) / 2)
            image = image.crop((0, diff, w, h - diff))
        if image.mode not in ("RGB",):
            image = image.convert("RGB")
        image = image.resize(User.AvatarSize.LARGE.value, Image.ANTIALIAS)
        image.save(self._avatar_path(User.AvatarSize.LARGE))
        image2 = image.resize(User.AvatarSize.NORMAL.value, Image.ANTIALIAS)
        image2.save(self._avatar_path(User.AvatarSize.NORMAL))
        image3 = image.resize(User.AvatarSize.SMALL.value, Image.ANTIALIAS)
        image3.save(self._avatar_path(User.AvatarSize.SMALL))

    def get_avatar(self, size=AvatarSize.NORMAL):
        try:
            with open(self._avatar_path(size), 'rb') as f:
                return f.read()
        except IOError:
            return None

    def get_avatar_uri(self, size=AvatarSize.SMALL):
        path = self._avatar_path(size)
        filename = os.path.basename(path)
        if os.path.exists(path):
            return os.path.join(settings.MEDIA_URL, 'avatars', self.username[0], filename)
        filename = 'default' + filename[-7:]
        return os.path.join(settings.MEDIA_URL, 'avatars', filename)

    @property
    def get_large_avatar_uri(self, size=AvatarSize.LARGE):
        return self.get_avatar_uri(size)

    @property
    def get_normal_avatar_uri(self, size=AvatarSize.NORMAL):
        return self.get_avatar_uri(size)

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

    def get_third_part_info(self) -> dict:
        from mgedata.utils.general import build_full_url
        return {
            'username': self.username,
            'nickname': self.real_name,
            'email': self.email,
            'avatar': build_full_url(self.get_large_avatar_uri),
            'tel': self.tel,
            'institution': self.institution,
            'is_active': self.is_active,
        }

    @property
    def is_root(self):
        return self.roles & UserRole.ROOT

    @property
    def roles_for_template(self):
        if self.roles & UserRole.ROOT:
            return {x.name: x.value for x in UserRole.settable_roles()}
        return {x.name: self.roles & x.value for x in UserRole.settable_roles()}

    def _avatar_path(self, size=AvatarSize.NORMAL):
        if isinstance(size, str):
            size = size.lower()
        if size == User.AvatarSize.LARGE or size == 'large':
            suffix = 'lg'
        elif size == User.AvatarSize.NORMAL or size == 'normal':
            suffix = 'nm'
        else:
            suffix = 'sm'
        filename = '%s_%s.jpg' % (self.username, suffix)
        avatar_dir = os.path.join(settings.AVATAR_DIR, filename[0])
        if not os.path.exists(avatar_dir):
            os.makedirs(avatar_dir)
        return os.path.join(avatar_dir, filename)

    def _to_dict_with_fields(self, *args):
        d = {}
        for arg in args:
            d[arg] = getattr(self, arg)
        return d

    def can_review_data_category(self, category_id):
        if self.has_role(UserRole.ROOT):
            return True
        if self.has_role(UserRole.DATA_ADMIN):
            if AdminMaterialCategory.objects.filter(user=self, category_id=category_id).count():
                return True

    @staticmethod
    def filter_with_role(role: UserRole):
        return User.objects.extra(where=[f'roles & {role.value} <> 0 or roles & {UserRole.ROOT.value} <> 0'])

    @staticmethod
    def make_for_sso(email, username=None, real_name=None, **kwargs):
        if username is None:
            username = "mgeUser"
        if real_name is None:
            real_name = username
        if "institution" in kwargs.keys():
            institution = kwargs["institution"]
        else:
            institution = ''
        uname = username
        for i in range(len(User.objects.all()) + 100):
            if len(User.objects.filter(username=username)) == 0:  # 如果用户名不重复
                user = User.objects.create(
                    username=username,
                    real_name=real_name,
                    email=email,
                    email_verified=True,  # 不需要邮箱验证了
                    institution=institution,
                    # password=make_password(str(hash(time.localtime())))
                    # 由于邮箱不能使用，不能修改密码，所以先默认密码为123456
                    password=make_password("ustb@micl"),
                    # 权限是默认值
                )
                return user
            else:
                username = uname + str(i)

    @staticmethod
    def get_or_make_for_sso(email, username=None, real_name=None, **kwargs):
        try:
            user = User.objects.get(email=email)
            return user
        except User.DoesNotExist:
            return User.make_for_sso(email=email, username=username, real_name=real_name, **kwargs)


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


class AdminMaterialCategory(models.Model):
    """
    数据与模板管理员对于材料分类的审核权限
    """
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='managed_categories')
    granter = models.ForeignKey(to=User, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(to='storage.MaterialCategory', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class AuthorityOfPrivateMaterialCategory(models.Model):
    """
    对于私有分类的访问权限
    """
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name='authorized_private_categories')
    category = models.ForeignKey(to='storage.MaterialCategory', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class UserRolesForAcceptance(IntEnum):
    """
    | 角色                    | 职能                           | 是否北科大实现，否则南大通用实现 |
    | ----------------------- | ------------------------------ | -------------------------------- |
    | 评价组长 (大概只有一个) | 修改专家角色，决定是否验收通过 | 是                               |
    | 专家                    | 基本角色，等待分配，无具体职能 | 否                               |
    | 项目结题专家组长        | 决定是否结题                   | 否                               |
    | 项目结题专家            | ？                             | 否                               |
    | 数据汇交验收专家        | 负责数据汇交验收               | 是                               |
    | 项目负责人              | 负责申请验收                   | 否                               |
    | 课题负责人              | 负责申请验收                   | 否                               |
    | 管理员                  | ？                             | 否                               |
    | 普通成员                | ？                             | 否                               |
    """
    GroupLeader = 0  # 评价组长
    Expert = 1  # 专家
    ProjectConcludeExpertGroupLeader = 2  # 项目结题专家组长
    ProjectConcludeExpert = 3  # 项目结题专家
    AcceptanceExpert = 4  # 数据汇交验收专家
    ProjectLeader = 5  # 项目负责人
    SubjectLeader = 6  # 课题负责人
    Admin = 7  # 管理员
    Member = 8  # 普通成员

    @property
    def name_string(self):
        return ("评价组长", "专家",
                "项目结题专家组长", "项目结题专家",
                "汇交验收专家", "项目负责人", "课题负责人",
                "管理员", "普通成员")[self.value]

    @staticmethod
    def choices():
        list = []
        for item in UserRolesForAcceptance:
            list.append((item.value, item.name_string))
        return tuple(list)


class UserRolesForAcceptanceModel(models.Model):
    user = models.OneToOneField(to=User, on_delete=models.CASCADE, primary_key=True)
    roles = ArrayField(models.IntegerField(), default=list,
                       help_text="验收角色可选值为: <br/>" + '<br/>'.join(
                           [f'{i.value}: {i.name_string}' for i in UserRolesForAcceptance]))

    def full_clean(self, exclude=None, validate_unique=True):
        for role in self.roles:
            try:
                UserRolesForAcceptance(role)
            except ValueError:
                raise ValidationError(f"{role}不是有效的验收角色")
        super().full_clean(exclude, validate_unique)

    @property
    def get_roles(self) -> List[int]:
        return self.roles

    def has_role(self, required_role: int) -> bool:
        if required_role in self.roles:
            return True
        else:
            return False

    @staticmethod
    def get_all_acceptance_experts() -> List[User]:
        urfams = UserRolesForAcceptanceModel.objects.filter(
            roles__contains=[UserRolesForAcceptance.AcceptanceExpert.value]
        )
        return [urfam.user for urfam in urfams]
