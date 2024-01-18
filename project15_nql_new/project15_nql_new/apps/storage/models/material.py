# -*- coding: utf-8 -*-

# @File   : material.py
# @Author : Yuvv
# @Date   : 2017/12/29
import pytz
from django.db import models, transaction
from django.core.validators import MinValueValidator, MinLengthValidator
from django.utils import timezone
from django.utils.translation import get_language
from django.utils.encoding import smart_text

from apps.account.models import User
from apps.mge.models import PersistentVariables, PVEnum
from django.utils.dateparse import parse_datetime


class MaterialCategoryPublicManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_public=True, hidden=False)


class MaterialCategoryUnhiddenManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(hidden=False)


class MaterialCategory(models.Model):
    """材料类别，分层级树状表示。
    同一父节点下的子节点名字不能相同
    """
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='children', on_delete=models.CASCADE)
    level = models.IntegerField(default=0, validators=(MinValueValidator(0),))
    name_zh = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    leaf = models.BooleanField(default=True)
    doi_prefix = models.CharField(null=True, max_length=255, validators=(MinLengthValidator(3),))
    order = models.IntegerField(default=1)
    # added on 2019-8-24
    is_public = models.BooleanField(default=True)
    hidden = models.BooleanField(default=False)  # 数据库贡献用，在数据分析中隐藏非材料类别
    raw_objects = models.Manager()
    objects = MaterialCategoryUnhiddenManager()
    public_objects = MaterialCategoryPublicManager()

    _leaves_cache = None

    class Meta:
        unique_together = (('parent', 'name_zh'),
                           ('parent', 'name_en'))
        ordering = ('order',)

    def __str__(self):
        return self.name

    @property
    def name(self):
        lang = get_language() or 'zh'
        return getattr(self, 'name_' + lang[:2])

    def delete(self, using=None, keep_parents=False):
        if self.parent is not None:
            if len(self.parent.children.all()) == 1:
                self.parent.leaf = True
                self.parent.save(update_fields=('leaf',))
        super(MaterialCategory, self).delete(using, keep_parents)

    def save(self, *args, **kwargs):
        # MaterialCategory._leaves_cache = None
        if self.parent:
            self.level = self.parent.level + 1
            if self.parent.leaf:
                self.parent.leaf = False
                self.parent.save()
        super(MaterialCategory, self).save(*args, **kwargs)

    def to_dict(self):
        return {'id': self.id,
                'pid': self.parent_id,
                'level': self.level,
                'name': self.name,
                'leaf': self.leaf,
                'order': self.order}

    @property
    def full_path(self):
        full_path = []
        while self.parent is not None:
            full_path.append(self.name)
            self = self.parent
        full_path.reverse()
        return '.'.join(full_path)

    def get_category_leaves(self):
        leaves = []
        children = MaterialCategory.objects.filter(parent_id=self.id, level__gt=1).order_by('order')
        for child in children:
            if child.leaf:
                leaves.append(child)
            else:
                leaves.extend(child.get_category_leaves())
        return leaves

    @staticmethod
    def get_leaves():
        # if MaterialCategory._leaves_cache:
        #     return MaterialCategory._leaves_cache

        all_leaves = []

        for m in MaterialCategory.objects.filter(level=1).order_by('order'):
            if m.leaf:
                all_leaves.append(m)
            else:
                all_leaves.extend(m.get_category_leaves())
        # MaterialCategory._leaves_cache = all_leaves
        return all_leaves

    @property
    def all_leaves(self):
        # if MaterialCategory._leaves_cache:
        #     return MaterialCategory._leaves_cache

        _all_leaves = []

        def _get_leaves(cid):
            leaves = []
            children = MaterialCategory.objects.filter(parent_id=cid, level__gt=1).order_by('order')
            for child in children:
                if child.leaf:
                    leaves.append(child)
                else:
                    leaves.extend(_get_leaves(child.pk))
            return leaves

        if self.leaf:
            return [self]

        _all_leaves.extend(_get_leaves(self.pk))
        return _all_leaves


class MaterialMethod(models.Model):
    name_zh = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='children', null=True, blank=True)

    @property
    def name(self):
        lang = get_language() or 'zh'
        return getattr(self, 'name_' + lang[:2])

    def to_tree(self):
        return {
            'id': self.id,
            'name': self.name,
            'children': [child.to_tree() for child in self.children.all()]
        }

    @staticmethod
    def make(material_methods, parent=None):
        with transaction.atomic():
            for method in material_methods:
                ins = MaterialMethod.objects.create(
                    name_zh=method['name_zh'],
                    name_en=method['name_en'],
                    parent=parent)
                MaterialMethod.make(method.get('children', []), ins)

    def __str__(self):
        return self.name_zh


class MaterialTag(models.Model):
    """材料标签，记录标签名称和引用计数。引用计数由系统进行统计，无需显式添加或删除。

    `name`:  标签名称
    `count`: 引用计数，初始值为1，即包含这个标签的数据的数目
    """
    name = models.CharField(max_length=32, unique=True)
    count = models.IntegerField(default=1, validators=(MinValueValidator(0),))

    class Meta:
        ordering = ('-count',)

    def __str__(self):
        return self.name

    def to_dict(self):
        return {'id': self.id,
                'name': self.name,
                'count': self.count}

    @staticmethod
    def add(name: str):
        """
        如果已经存在则将引用计数+1，否则直接添加一个新标签
        :param name: 标签名称
        :type name: str
        :return: 返回添加或修改后的标签
        :rtype: MaterialTag
        """
        name = smart_text(name).strip()
        mt = None
        try:
            mt = MaterialTag.objects.get(name=name)
            MaterialTag.inc_count(mt)
        except MaterialTag.DoesNotExist:
            if name:
                mt = MaterialTag.objects.create(name=name)
                mt.save()
        finally:
            return mt

    @staticmethod
    def inc_count(tag):
        """
        将`tag`的引用计数 + 1（更新到数据库）
        :param tag: 待更新的标签实例或标签名称
        :type tag: MaterialTag, str
        :return: None
        """
        if isinstance(tag, str):
            tag = tag.strip()
            try:
                tag = MaterialTag.objects.get(name=tag)
            except MaterialTag.DoesNotExist:
                MaterialTag.objects.create(name=tag)
                return
        if not isinstance(tag, MaterialTag):
            raise ValueError('`tag` must be an instance of `MaterialTag` or tag name.')
        tag.count += 1
        tag.save()

    @staticmethod
    def dec_count(tag):
        """
        将`tag`的引用计数 - 1（更新到数据库）
        :param tag: 待更新的标签实例或标签名称
        :type tag: MaterialTag, str
        :return: None
        """
        if isinstance(tag, str):
            tag = tag.strip()
            tag = MaterialTag.objects.get_or_create(name=tag)  # 这里不存在直接创建也没事，正好减为 0
        if not isinstance(tag, MaterialTag):
            raise ValueError('`tag` must be an instance of `MaterialTag` or tag name.')
        count = max(0, tag.count - 1)
        tag.count = count
        tag.save()


class MaterialProject(models.Model):
    id = models.CharField(max_length=128, null=False, primary_key=True)
    name = models.CharField(max_length=512, null=False)
    leader = models.CharField(max_length=128, null=False)  # 仅仅是负责人的姓名，deprecated!
    leader_fk = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='projects')
    institution = models.CharField(max_length=512, null=False)
    leader_contact_method = models.CharField(max_length=512, null=False)
    responsible_expert = models.CharField(max_length=512, null=False)
    responsible_expert_institution = models.CharField(max_length=512, null=False)
    # 新增project与users多对多依赖
    members = models.ManyToManyField(User, related_name='my_projects')
    # 新增project的创建时间
    created_time = models.DateTimeField(default=timezone.now)
    # 版本号（同步用版本号来更新）
    version = models.CharField(max_length=128, default='')
    syn = models.BooleanField(default=False)

    # 应提交的数据量
    quota_data_count = models.IntegerField(default=0)
    quota_data_size = models.IntegerField(default=0)
    quota_category = models.TextField(null=True)
    quota_papers = models.IntegerField(default=0)
    quota_patents = models.IntegerField(default=0)
    quota_standards = models.IntegerField(default=0)

    CLJY = 'CJ'
    NMKJ = 'NJ'
    XNYC = 'XC'
    ZNDW = 'ZW'
    LZTK = 'LK'
    SHJS = 'SJ'
    LYZY = 'LZ'
    SWYY = 'SY'
    ZLXJ = 'ZX'
    ZXZZ = 'ZZ'
    GJZL = 'GZ'
    LSJZ = 'LJ'

    AREA_IN_PROJECTS_CHOICES = (
        (CLJY, '材料基因工程关键技术与支撑平台'),
        (NMKJ, '纳米科技'),
        (XNYC, '新能源汽车'),
        (ZNDW, '智能电网技术与装备'),
        (LZTK, '量子调控与量子信息'),
        (SHJS, '深海关键技术与装备重点专项'),
        (LYZY, '林业资源培育及高效利用技术创新'),
        (SWYY, '生物医用材料研发与组织器官修复替代重点专项'),
        (ZLXJ, '战略先进电子材料'),
        (ZXZZ, '增材制造与激光制造'),
        (GJZL, '国家质量基础的共性技术研究与应用'),
        (LSJZ, '绿色建筑及建筑工业化重点专项')
    )
    projects_area = models.CharField(
        max_length=512,
        choices=AREA_IN_PROJECTS_CHOICES,
        default=CLJY,
        null=True
    )

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'leader_contact_method': self.leader_contact_method,
            'responsible_expert': self.responsible_expert,
            'created_time': self.created_time,
            'subjects': [sub.to_dict() for sub in self.materialsubject_set.all()]
            # 'subjects': [sub.to_dict_members() for sub in self.materialsubject_set.all()]
        }

    def to_dict2(self) -> dict:
        return {
            'id': self.id,
            'projects_area': self.projects_area,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'subjects': [sub.to_dict2() for sub in self.materialsubject_set.all()]
        }
    
    def to_dict_members(self) -> dict:
        return {
            'id': self.id,
            'projects_area': self.projects_area,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'leader_contact_method': self.leader_contact_method,
            'responsible_expert': self.responsible_expert,
            'created_time': self.created_time,
            'subjects': [sub.to_dict() for sub in self.materialsubject_set.all()],
            'members': [memb.to_dict() for memb in self.members.all()],
            'members_count': self.members.count()
        }

    def get_leader_and_members_username(self) -> list:
        usernames = [member.username for member in self.members.all()]
        if self.leader_fk.username not in usernames:
            usernames.append(self.leader_fk.username)
        return usernames

    @staticmethod
    def filter_with_leader(user):
        q = models.Q(leader=user.real_name) | models.Q(leader_fk=user)
        return MaterialProject.objects.filter(q)

    @staticmethod
    def make(material_projects):
        with transaction.atomic():
            for p in material_projects:
                project_model, _ = \
                    MaterialProject.objects.update_or_create(id=p['id'],
                                                             name=p['name'],
                                                             leader=p['leader'],
                                                             institution=p['institution'],
                                                             leader_contact_method=p['leader_contact_method'],
                                                             responsible_expert=p['responsible_expert'],
                                                             )
                for s in p['subjects']:
                    MaterialSubject.objects.update_or_create(id=s['id'],
                                                             project=project_model,
                                                             name=s['name'],
                                                             institution=s['institution'],
                                                             leader=s['leader'],
                                                             leader_contact_method=s['leader_contact_method'])

    @staticmethod
    def make_for_syn(material_projects, version):
        with transaction.atomic():
            from apps.search.core_v2.es import Manager as ESManager
            for p in material_projects:
                # 更新和创建
                defaults = dict(
                    name=p['name'],
                    syn=True,
                    created_time=pytz.timezone("Asia/Shanghai").localize(
                        parse_datetime(p["cctCreate"]),
                        is_dst=None
                    ),
                )
                if p["leaderMail"] is not None:
                    defaults["leader"] = p["leaderName"]
                    defaults["leader_fk"] = User.get_or_make_for_sso(
                        real_name=p["leaderName"], email=p["leaderMail"], username=p["leaderMail"].split('@')[0]
                    )
                    defaults["leader_contact_method"] = p["leaderMail"],
                project_model, _ = \
                    MaterialProject.objects.update_or_create(
                        defaults=defaults,
                        id=p['number']
                    )
                # 更新和创建subject
                for s in p['mgeTopicList']:
                    defaults = dict(
                        project=project_model,
                        name=s['name'],
                        syn=True,
                        created_time=pytz.timezone("Asia/Shanghai").localize(
                            parse_datetime(s["cctCreateStr"]),
                        ),
                    )
                    if s["topicLeaderMail"] is not None:
                        defaults["leader"] = s["topicLeaderName"]
                        defaults["leader_fk"] = User.get_or_make_for_sso(
                            real_name=s["topicLeaderName"],
                            email=s["topicLeaderMail"],
                            username=s["topicLeaderMail"].split('@')[0]
                        )
                        defaults["leader_contact_method"] = s["topicLeaderMail"],
                    MaterialSubject.objects.update_or_create(
                        defaults=defaults,
                        id=s['number'],
                    )
                # 删除subject
                ms_list = MaterialSubject.objects.filter(syn=False, project=project_model)
                for ms in ms_list:
                    res = ESManager.search(dict(subject=[ms.id]), _source=False)
                    total = res['hits']['total']['value']
                    if total == 0:
                        ms.delete()
                MaterialSubject.objects.filter(project=project_model).update(syn=False)
            # 删除
            mp_list = MaterialProject.objects.filter(syn=False)
            for mp in mp_list:
                res = ESManager.search(dict(project=[mp.id]), _source=False)
                total = res['hits']['total']['value']
                if total == 0:
                    mp.delete()
            MaterialProject.objects.all().update(syn=False)
            if version is not None:
                PersistentVariables.set_variable(PVEnum.MATERIAL_PROJECT_VERSION.value, version)


class MaterialSubject(models.Model):
    id = models.CharField(max_length=128, null=False, primary_key=True)
    name = models.CharField(max_length=512, null=False)
    leader = models.CharField(max_length=128, null=False)  # 仅仅是负责人的姓名，deprecated!
    leader_fk = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='subjects')
    institution = models.CharField(max_length=512, null=False)
    leader_contact_method = models.CharField(max_length=512, null=False)
    project = models.ForeignKey(MaterialProject, on_delete=models.CASCADE)
    user = models.ManyToManyField(User, related_name='my_subjects')
    # 新增创建课题时间
    created_time = models.DateTimeField(default=timezone.now)
    # user = models.ManyToManyField(User, through='MaterialSubjectUser')
    syn = models.BooleanField(default=False)
    # 应提交的数据量
    quota_data_count = models.IntegerField(default=0)
    quota_data_size = models.IntegerField(default=0)
    quota_category = models.TextField(blank=True, default='')
    quota_papers = models.IntegerField(default=0)
    quota_patents = models.IntegerField(default=0)
    quota_standards = models.IntegerField(default=0)

    @staticmethod
    def filter_with_leader(user):
        q = models.Q(leader=user.real_name) | models.Q(leader_fk=user)
        return MaterialSubject.objects.filter(q)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'leader_contact_method': self.leader_contact_method
        }

    def to_dict2(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
        }

    def to_dict3(self) -> dict:
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution
        }

    def to_dict4(self) -> dict:
        return {
            'id': self.id,
            'project_area': self.project.projects_area,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'leader_contact_method': self.leader_contact_method
        }

    def to_dict_members(self) -> dict:
        return {
            'id': self.id,
            'project_id': self.project_id,
            'project_area': self.project_id,
            'name': self.name,
            'leader': self.leader,
            'leader_fk': self.leader_fk.username,
            'institution': self.institution,
            'leader_contact_method': self.leader_contact_method,
            'created_time': self.created_time,
            'members': [memb.to_dict() for memb in self.user.all()],
            'members_count': self.user.count()
        }

    def get_leader_and_members_username(self) -> list:
        usernames = [member.username for member in self.user.all()]
        if self.leader_fk.username not in usernames:
            usernames.append(self.leader_fk.username)
        return usernames
