# -*- coding: utf-8 -*-
from uuid import uuid4

# @File   : material.py
# @Author : Yuvv
# @Date   : 2017/12/29
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import get_language
from django.utils.translation import gettext as _

from apps.account.models import User
from mgedata.errors.models import MGEError


class Category(models.Model):
    """数据类别，分层级树状表示。
    """
    name_zh = models.CharField(max_length=255, db_index=True, unique=True)
    name_en = models.CharField(max_length=255, db_index=True, null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def name(self):
        lang = get_language() or 'zh'
        return getattr(self, 'name_' + lang[:2])


    @property
    def ref_templates_count(self):
        return self.template_set.count()

    @property
    def ref_templates(self):
        return [t.to_dict(meta_only=True) for t in self.template_set.all()]


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }


def default_tree_json():
    return {
        'root': [],  # 一级分类的ID列表
        'id_children_map': {},  # key是分类的ID，value是分类的子分类的ID列表，要添加子分类的话写这个字段
        'tree': [],  # 树形结构，每个元素包含id和children两个字段，递归，由id_children_map和root生成，只读，除了generate_tree方法，不要写
        'id_parent_map': {},  # key是分类的ID，value是分类的父分类的ID，用于删除分类的时反向查询父分类，只读，除了generate_tree方法，不要写
        'id_depth_map': {}  # key是分类的ID，value是分类的深度，只读，除了generate_tree方法，不要写
    }


class CategoryTree(models.Model):
    """
    分类树，只有一条记录，如果有多条记录，只有最新的一条记录有效
    """
    version = models.UUIDField()
    tree_json = models.JSONField(
        default=default_tree_json
    )

    class Meta:
        ordering = ('-id',)

    @staticmethod
    def get_tree(query=None) -> tuple[str, list]:
        if query is not None:
            query = str(query).strip()
        only = CategoryTree.objects.first()
        if not only:
            only = CategoryTree.objects.create(version=uuid4(), tree_json=default_tree_json())
        lang = get_language() or 'zh'
        if 'zh' in lang:
            lang_key = 'name_zh'
        else:
            lang_key = 'name_en'
        id_cat_map = {}
        for cat in Category.objects.all():
            id_cat_map[str(cat.id)] = cat
        tree = only.tree_json['tree']
        iter_stack = tree[:]
        while iter_stack:
            cur_dict = iter_stack.pop()
            cat = id_cat_map.get(str(cur_dict['id']))
            if not cat:
                continue
            cur_dict['name'] = getattr(cat, lang_key)
            cur_dict['ref_templates_count'] = cat.ref_templates_count
            cur_dict['ref_templates'] = cat.ref_templates
            iter_stack.extend(cur_dict['children'])
        if query:
            def _recursive(cur):
                # 如果这个分类本身命中且有子分类，返回这个分类及其所有子分类:
                # 如果这个分类没有命中，但是其子分类命中，则返回这个分类，命中的子分类及该子分类的所有子分类
                if query in cur['name']:
                    return True
                new_children = []
                for child in cur['children']:
                    hit = _recursive(child)
                    if hit:
                        new_children.append(child)
                if new_children:
                    cur['children'] = new_children
                    return True
                return False

            new_tree = []
            for root_child in tree:
                if _recursive(root_child):
                    new_tree.append(root_child)
            tree = new_tree

        return str(only.version), tree

    @staticmethod
    def reconstruct(version, root_children: list) -> 'CategoryTree':
        """
        仅用于调整层级或者顺序
        """
        version = str(version)
        found_ids = set()
        id_cat_map = Category.objects.all().in_bulk()
        id_children_map = {}

        def _recursive(cur):
            children = cur.get('children', [])
            cur_id = cur['id']
            found_ids.add(cur_id)
            if cur_id not in id_cat_map:
                raise MGEError.NOT_FOUND(_("Category does not exist. (ID=%s)") % cur_id)
            for child in children:
                id_children_map.setdefault(str(cur_id), []).append(child['id'])
                _recursive(child)

        with transaction.atomic():
            only = CategoryTree.objects.select_for_update().first()
            if not only:
                only = CategoryTree.objects.create(version=version, tree_json=default_tree_json())
            elif version != str(only.version):
                raise MGEError.CATEGORY_CONFLICT(
                    _("其他用户修改了本页面上的数据，请刷新后重新修改")
                )
            new_root_children = []
            for root_child in root_children:
                _recursive(root_child)
                new_root_children.append(root_child['id'])

            if set(id_cat_map.keys()) != found_ids:
                missing = set(id_cat_map.keys()) - found_ids
                missing = [str(x) for x in missing]
                raise MGEError.MALFORMED_CATEGORY_TREE(
                    _('分类树种没有包括所有已有分类，请刷新页面后重试。（缺少下列分类: %s）') % ', '.join(missing))
            only.tree_json['root'] = new_root_children
            only.tree_json['id_children_map'] = id_children_map
            only.generate_tree()
            only.version = uuid4()
            only.save()
        return only

    @staticmethod
    def add_category(version, name_zh, parent_id=None, name_en=None) -> tuple[str, Category]:
        """
        添加分类，如果`parent_id`为`None`，则添加一级分类，否则添加子分类，`version`用于乐观锁
        """

        version = str(version)
        if parent_id is not None:
            parent = Category.objects.filter(id=parent_id).first()
            if not parent:
                raise MGEError.NOT_FOUND(_("Parent category does not exist. (ID=%s)") % parent_id)
            parent_id = str(parent_id)  # json中的key必须是str，如果不是PG会自动转为str

        with transaction.atomic():
            only = CategoryTree.objects.select_for_update().first()
            if not only:
                only = CategoryTree.objects.create(version=uuid4(), tree_json=default_tree_json())

            if version != str(only.version):
                raise MGEError.CATEGORY_CONFLICT(
                    _("其他用户修改了本页面上的数据，请刷新后重新修改")
                )
            if Category.objects.filter(name_zh=name_zh).exists():
                raise MGEError.ALREADY_EXISTS(_('领域分类"%s"已经存在，请更换名称') % name_zh)
            cat = Category.objects.create(name_zh=name_zh, name_en=name_en)
            new_tree = only.tree_json.copy()
            if parent_id is None:
                new_tree['root'].append(cat.id)
            else:
                new_tree['id_children_map'].setdefault(parent_id, []).append(cat.id)
            only.tree_json = new_tree
            only.version = uuid4()
            only.generate_tree()
            only.save()
        return str(only.version), cat

    @staticmethod
    def delete_category(version, cat_id: int):
        from apps.storage.models.template import Template
        version = str(version)

        with transaction.atomic():
            only = CategoryTree.objects.select_for_update().first()
            if not only:
                return
            if version != str(only.version):
                raise MGEError.CATEGORY_CONFLICT(
                    _("其他用户修改了本页面上的数据，请刷新后重新修改")
                )

            id_children_map = only.tree_json['id_children_map']
            candidates = []

            def _recursive_remove(cur_id):
                candidates.append(cur_id)
                children = id_children_map.pop(str(cur_id), [])
                candidates.extend(children)
                for child_id in children:
                    _recursive_remove(child_id)

            _recursive_remove(cat_id)
            templates = Template.objects.filter(category_id__in=candidates)
            if templates.exists():
                # 有模板的分类不能删除
                failed_category_ids = list(templates.values_list('category_id', flat=True))
                id_cat_map = Category.objects.filter(id__in=failed_category_ids).in_bulk()
                names = []
                for failed_id in failed_category_ids:
                    cat = id_cat_map.get(failed_id)
                    if cat:
                        names.append(cat.name_zh)
                names = list(set(names))
                names_str = ', '.join(names)
                raise MGEError.DELETE_FORBIDDEN(
                    _('以下分类存在模板: %s。请先删除分类下的模板。') % names_str
                )
            Category.objects.filter(id__in=candidates).delete()
            new_tree = only.tree_json.copy()

            parent_id = new_tree['id_parent_map'].get(str(cat_id))
            if not parent_id:
                try:
                    new_tree['root'].remove(cat_id)
                except ValueError:
                    raise MGEError.NOT_FOUND(_('一级分类(ID=%s)不存在') % str(cat_id))
            else:
                new_tree['id_children_map'][str(parent_id)].remove(cat_id)

            only.tree_json = new_tree
            only.version = uuid4()
            only.generate_tree()
            only.save()

    @staticmethod
    def sub_cats_getter():
        only = CategoryTree.objects.first()
        id_children_map = only.tree_json.get('id_children_map')
        root_children = only.tree_json.get('root', [])

        def getter(cat_id: int = None, recursive=False) -> list[int]:
            if not only:
                return []
            if not cat_id:
                res = root_children[:]
                for child in root_children:
                    res.extend(id_children_map.get(str(child), []))
            else:
                res = id_children_map.get(str(cat_id), [])
            if not recursive:
                return res

            stack = res[:]
            while stack:
                cur = stack.pop()
                children = id_children_map.get(str(cur), [])
                res.extend(children)
                stack.extend(children)
            return res

        return getter

    def generate_tree(self):
        """
        根据children和id_children_map生成树形结构，只有添加、删除或者调整分类层级的时候才调用
        """
        id_children_map = self.tree_json['id_children_map']
        children_set = set()  # 检测某个分类是否出现多次
        id_parent_map = {}
        id_depth_map = {}

        def _recursive(cur_id: int, depth):
            if cur_id in children_set:
                cat = Category.objects.filter(id=cur_id).first()
                if not cat:
                    raise MGEError.NOT_FOUND(_("Category does not exist. (ID=%s)") % cur_id)
                raise MGEError.MALFORMED_CATEGORY_TREE(_('Category "%s" appears multiple times. )') % cat.name_zh)
            id_depth_map[str(cur_id)] = depth
            children_set.add(cur_id)
            children = id_children_map.get(str(cur_id), [])
            new_children = []
            res = {
                'id': cur_id,
                'children': new_children
            }
            for child in children:
                id_parent_map[str(child)] = cur_id
                new_children.append(_recursive(child, depth + 1))
            return res

        new_tree = []
        for root_child in self.tree_json['root']:
            new_tree.append(_recursive(root_child, depth=1))
        self.tree_json['tree'] = new_tree
        self.tree_json['id_parent_map'] = id_parent_map
        self.tree_json['id_depth_map'] = id_depth_map

    @staticmethod
    def pretty_print_tree():
        def print_tree(p: dict, last=True, header='', is_root=False):
            elbow = "└──"
            pipe = "│  "
            tee = "├──"
            blank = "   "
            if is_root:
                print(p['name'])
            else:
                print(header + (elbow if last else tee) + p['name'])
            children = p['children']
            for i, c in enumerate(children):
                print_tree(c, header=header + (blank if last else pipe), last=i == len(children) - 1)

        _, tree = CategoryTree.get_tree()
        print_tree({'name': '所有分类', 'children': tree}, is_root=True)


class MaterialProject(models.Model):
    id = models.CharField(max_length=128, null=False, primary_key=True)
    name = models.CharField(max_length=512, null=False)
    leader = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='projects')
    # 新增project与users多对多依赖
    members = models.ManyToManyField(User, related_name='my_projects')
    # 新增project的创建时间
    created_time = models.DateTimeField(default=timezone.now)
    # 一级机构数据水印
    waterMark = models.IntegerField(default=0)

    class Meta:
        ordering = ('id',)

    @property
    def description(self):
        return f'{self.name}（{self.id}）'

    def to_dict(self) -> dict:
        res = {
            'id': self.id,
            'name': self.name,
            'leader': self.leader.real_name,
            'leader_fk': self.leader.username if self.leader is not None and isinstance(self.leader,
                                                                                        User) else None,
            'created_time': self.created_time,
            # 'waterMark': self.waterMark
        }
        return res

    def to_dict2(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'leader': self.leader.real_name,
            'leader_fk': self.leader.username if self.leader is not None and isinstance(self.leader,
                                                                                        User) else None,
            'leader_contact_method': self.leader.email,
            'institution': self.leader.institution,
            # 'water_mark': self.waterMark
        }

    def to_dict_members(self, project_id_users_map: dict[str, list[User]]) -> dict:
        members = project_id_users_map.get(self.id, [])
        members = [member.to_dict(['username', 'real_name']) for member in members]
        return {
            'id': self.id,
            'name': self.name,
            'leader': self.leader.real_name,
            'leader_fk': self.leader.username if self.leader is not None and isinstance(self.leader,
                                                                                        User) else None,
            'created_time': self.created_time,
            'members': members,
            'members_count': len(members),
            'leader_contact_method': self.leader.email,
            'institution': self.leader.institution,
            # 'water_mark': self.waterMark
        }

    def replace_members(self, members: list[User]):
        with transaction.atomic():
            ProjectSubjectMember.objects.filter(project=self, subject__isnull=True).delete()
            bulk = [
                ProjectSubjectMember(user=member, project=self) for member in members
            ]
            ProjectSubjectMember.objects.bulk_create(bulk, ignore_conflicts=True)

    def add_members(self, members: list[User]):
        with transaction.atomic():
            bulk = [
                ProjectSubjectMember(user=member, project=self) for member in members
            ]
            ProjectSubjectMember.objects.bulk_create(bulk, ignore_conflicts=True)


class MaterialSubject(models.Model):
    id = models.CharField(max_length=128, null=False, primary_key=True)
    name = models.CharField(max_length=512, null=False)
    leader = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='subjects')
    project = models.ForeignKey(MaterialProject, on_delete=models.CASCADE)
    # 二级机构水印
    waterMark = models.IntegerField(default=0)
    # 新增创建课题时间
    created_time = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ('id',)

    @property
    def description(self):
        return f'{self.name}（{self.id}）'

    @staticmethod
    def filter_with_leader(user):
        q = models.Q(leader=user.real_name) | models.Q(leader_fk=user)
        return MaterialSubject.objects.filter(q)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'project_id': self.project_id,
            'project_name': self.project.name,
            'name': self.name,
            'leader': self.leader.real_name,
            'leader_fk': self.leader.username if self.leader is not None and isinstance(self.leader,
                                                                                        User) else None,
            'leader_contact_method': self.leader.email,
            'institution': self.leader.institution,
            # 'water_mark': self.waterMark,
        }

    def to_dict_members(self, subject_id_members_map: dict[str, list[User]]) -> dict:
        members = subject_id_members_map.get(self.id, [])
        members = [member.to_dict(['username', 'real_name']) for member in members]

        return {
            'id': self.id,
            'project_id': self.project_id,
            'project_area': self.project_id,
            'project_name': self.project.name,
            'name': self.name,
            'leader': self.leader.real_name,
            'leader_fk': self.leader.username if self.leader is not None and isinstance(self.leader,
                                                                                        User) else None,
            'created_time': self.created_time,
            'members': members,
            'members_count': len(members),
            'leader_contact_method': self.leader.email,
            'institution': self.leader.institution,
            # 'water_mark': self.waterMark
        }

    def replace_members(self, members: list[User]):
        with transaction.atomic():
            ProjectSubjectMember.objects.filter(subject=self).delete()
            bulk = [
                ProjectSubjectMember(subject=self, user=member, project_id=self.project_id) for member in members
            ]
            ProjectSubjectMember.objects.bulk_create(bulk, ignore_conflicts=True)

    def add_members(self, members: list[User]):
        with transaction.atomic():
            bulk = [
                ProjectSubjectMember(subject=self, user=member, project_id=self.project_id) for member in members
            ]
            ProjectSubjectMember.objects.bulk_create(bulk, ignore_conflicts=True)


class ProjectSubjectMember(models.Model):
    project = models.ForeignKey(MaterialProject, on_delete=models.CASCADE)
    subject = models.ForeignKey(MaterialSubject, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('project', 'subject', 'user')
