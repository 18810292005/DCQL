from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction
from django.http import HttpRequest
from django.views.generic import View
from apps.account.auth import check_login, check_role
from apps.account.models.users import UserRole, User
from apps.storage.models import MaterialCategory, MaterialProject, MaterialSubject, DataMeta, Template
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_json_field_r, get_param


class CategoryView(View):

    def get(self, request: HttpRequest):
        """
            获取指定的类别的信息
        """
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        category_ids = get_param('ids', allow_none=True, convert_to=list)
        parent_ids = get_param('parent_ids', allow_none=True, convert_to=list)
        levels = get_param('levels', allow_none=True, convert_to=list)
        name_zhs = get_param('name_zhs', allow_none=True, convert_to=list)
        name_ens = get_param('name_ens', allow_none=True, convert_to=list)
        is_leaf = get_param('is_leaf', allow_none=True, convert_to=bool)
        is_public = get_param('is_public', allow_none=True, convert_to=bool)

        _queryset = MaterialCategory.objects.order_by('id').all()
        _queryset = _queryset.filter(id__in=category_ids) if category_ids else _queryset
        _queryset = _queryset.filter(parent_id__in=parent_ids) if parent_ids else _queryset
        _queryset = _queryset.filter(level__in=levels) if levels else _queryset
        _queryset = _queryset.filter(name_zh__in=name_zhs) if name_zhs else _queryset
        _queryset = _queryset.filter(name_en__in=name_ens) if name_ens else _queryset
        _queryset = _queryset.filter(leaf=is_leaf) if is_leaf is not None else _queryset
        _queryset = _queryset.filter(is_public=is_public) if is_public is not None else _queryset

        paginator = Paginator(_queryset, page_size or _queryset.count())
        try:
            _queryset: list[MaterialCategory] = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            _queryset: list[MaterialCategory] = paginator.page(1)
            page = 1
        return json_response({
            'page': page,
            'page_size': page_size,
            'results': [ins.to_dict() for ins in _queryset],
            'total': paginator.count
        })

    def post(self, request: HttpRequest):
        """
            创建类别
        """
        check_login(request) and check_role(request, UserRole.ROOT)
        parent_id = get_json_field_r(request, 'parent_id', int)
        name_zh = get_json_field_r(request, 'name_zh', str)
        name_en = get_json_field_r(request, 'name_en', str)
        is_public = get_json_field_r(request, 'is_public', bool)

        parent: MaterialCategory = MaterialCategory.objects.get(id=parent_id)
        if DataMeta.objects.filter(category=parent).count() != 0:
            raise MGEError.PERMISSION_DENIED("父类别下有数据，不能创建子类别")
        if Template.objects.filter(category=parent).count() != 0:
            raise MGEError.PERMISSION_DENIED("父类别下有模板，不能创建子类别")

        category = MaterialCategory(
            parent=parent,
            name_zh=name_zh,
            name_en=name_en,
            is_public=is_public,
        )
        category.save()
        return json_response(category.to_dict())

    def patch(self, request: HttpRequest):
        """
            修改类别信息
        """
        check_login(request) and check_role(request, UserRole.ROOT)
        id = get_json_field_r(request, 'id', int)
        parent_id = get_json_field_r(request, 'parent_id', int, allow_none=True)
        name_zh = get_json_field_r(request, 'name_zh', str, allow_none=True)
        name_en = get_json_field_r(request, 'name_en', str, allow_none=True)
        is_public = get_json_field_r(request, 'is_public', bool, allow_none=True)

        category: MaterialCategory = MaterialCategory.objects.get(id=id)
        if category.level == 0:
            raise MGEError.PERMISSION_DENIED("根节点默认不能修改，要改的话请前往admin")
        old_parent: MaterialCategory = category.parent
        parent: MaterialCategory = MaterialCategory.objects.get(id=parent_id or category.parent.id)

        with transaction.atomic():
            category.parent = parent
            category.name_zh = name_zh or category.name_zh
            category.name_en = name_en or category.name_en
            category.is_public = is_public if is_public is not None else category.is_public
            category.save()
            if old_parent.children.count() == 0:
                old_parent.leaf = True
                old_parent.save()
        return json_response(category.to_dict())

    def delete(self, request: HttpRequest):
        """
            删除类别
        """
        check_login(request) and check_role(request, UserRole.ROOT)
        id = get_json_field_r(request, 'id', int)

        category: MaterialCategory = MaterialCategory.objects.get(id=id)

        if DataMeta.objects.filter(category=category).count() != 0:
            raise MGEError.PERMISSION_DENIED("存有该分类相关的数据，需要先撤回对应的数据才能删除分类")
        category.delete()
        return json_response()


class ProjectView(View):

    def get(self, request: HttpRequest):
        """
            获取指定的项目信息
        """
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        project_ids = get_param('ids', allow_none=True, convert_to=list)
        leader_names = get_param('leader_names', allow_none=True, convert_to=list)

        _queryset = MaterialProject.objects.order_by('id').all()
        _queryset = _queryset.filter(id__in=project_ids) if project_ids else _queryset
        _queryset = _queryset.filter(leader_fk__in=leader_names) if leader_names else _queryset

        paginator = Paginator(_queryset, page_size or _queryset.count())
        try:
            _queryset: list[MaterialProject] = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            _queryset: list[MaterialProject] = paginator.page(1)
            page = 1
        return json_response({
            'page': page,
            'page_size': page_size,
            'results': [ins.to_dict_members() for ins in _queryset],
            'total': paginator.count
        })

    def post(self, request: HttpRequest):
        """
            创建项目
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        name = get_json_field_r(request, 'name', str)
        responsible_expert = get_json_field_r(request, 'responsible_expert', str)
        responsible_expert_institution = get_json_field_r(request, 'responsible_expert_institution', str)

        user: User = request.user
        if MaterialProject.objects.filter(id=id).exists():
            raise MGEError.BAD_DATA('该项目id {} 已有用户定义'.format(id))

        project = MaterialProject(
            id=id,
            name=name,
            leader=user.real_name,
            leader_fk=user,
            institution=user.institution,
            leader_contact_method=user.email,
            responsible_expert=responsible_expert,
            responsible_expert_institution=responsible_expert_institution,
        )
        project.save()
        project.members.set([user])
        return json_response(project.to_dict2())

    def patch(self, request: HttpRequest):
        """
            修改项目信息
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        name = get_json_field_r(request, 'name', str, allow_none=True)
        leader_name = get_json_field_r(request, 'leader_name', str, allow_none=True)
        members_name = get_json_field_r(request, 'members_name', list, allow_none=True)
        responsible_expert = get_json_field_r(request, 'responsible_expert', str, allow_none=True)
        responsible_expert_institution = get_json_field_r(
            request, 'responsible_expert_institution', str, allow_none=True)

        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=id)
        if project.leader_fk != user and not user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED("没有权限修改该项目")

        leader: User = User.objects.get(username=leader_name or project.leader_fk)
        members = User.objects.filter(username__in=members_name) if members_name else []

        project.name = name or project.name
        project.leader = leader.real_name
        project.leader_fk = leader
        project.institution = leader.institution
        project.leader_contact_method = leader.email
        project.responsible_expert = responsible_expert or project.responsible_expert
        project.responsible_expert_institution = responsible_expert_institution or project.responsible_expert_institution
        project.save()
        project.members.set(list(set([user, leader]+list(members))))
        return json_response(project.to_dict2())

    def delete(self, request: HttpRequest):
        """
            删除项目
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)

        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=id)

        if project.leader_fk != user and not user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED("没有权限删除该项目")
        if DataMeta.OtherInfoHelper.get_data_meta_count_filter_by_project_id(project.id) != 0:
            raise MGEError.PERMISSION_DENIED("存有该项目相关的数据，需要先撤回对应的数据才能删除项目")
        project.delete()
        return json_response()


class SubjectView(View):

    def get(self, request: HttpRequest):
        """
            获取指定的课题信息
        """
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        subject_ids = get_param('ids', allow_none=True, convert_to=list)
        project_ids = get_param('project_ids', allow_none=True, convert_to=list)
        leader_names = get_param('leader_names', allow_none=True, convert_to=list)

        _queryset = MaterialSubject.objects.order_by('id').all()
        _queryset = _queryset.filter(id__in=subject_ids) if subject_ids else _queryset
        _queryset = _queryset.filter(project_id__in=project_ids) if project_ids else _queryset
        _queryset = _queryset.filter(leader_fk__in=leader_names) if leader_names else _queryset

        paginator = Paginator(_queryset, page_size or _queryset.count())
        try:
            _queryset: list[MaterialSubject] = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            _queryset: list[MaterialSubject] = paginator.page(1)
            page = 1
        return json_response({
            'page': page,
            'page_size': page_size,
            'results': [ins.to_dict_members() for ins in _queryset],
            'total': paginator.count
        })

    def post(self, request: HttpRequest):
        """
            创建课题
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        name = get_json_field_r(request, 'name', str)
        project_id = get_json_field_r(request, 'project_id', str)

        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=project_id)
        if MaterialSubject.objects.filter(id=id).exists():
            raise MGEError.BAD_DATA('该课题id {} 已有用户定义'.format(id))

        subject = MaterialSubject(
            id=id,
            name=name,
            leader=user.real_name,
            leader_fk=user,
            institution=user.institution,
            leader_contact_method=user.email,
            project=project,
        )
        subject.save()
        subject.user.set([user])
        return json_response(subject.to_dict2())

    def patch(self, request: HttpRequest):
        """
            修改课题信息
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        name = get_json_field_r(request, 'name', str, allow_none=True)
        leader_name = get_json_field_r(request, 'leader_name', str, allow_none=True)
        members_name = get_json_field_r(request, 'members_name', list, allow_none=True)

        user: User = request.user
        subject: MaterialSubject = MaterialSubject.objects.get(id=id)
        if subject.leader_fk != user and not user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED("没有权限修改该课题")

        leader: User = User.objects.get(username=leader_name or subject.leader_fk)
        members = User.objects.filter(username__in=members_name) if members_name else []

        subject.name = name or subject.name
        subject.leader = leader.real_name
        subject.leader_fk = leader
        subject.institution = leader.institution
        subject.leader_contact_method = leader.email
        subject.save()
        subject.user.set(list(set([user, leader]+list(members))))
        return json_response(subject.to_dict2())

    def delete(self, request: HttpRequest):
        """
            删除课题
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)

        user: User = request.user
        subject: MaterialSubject = MaterialSubject.objects.get(id=id)

        if subject.leader_fk != user and not user.has_role(UserRole.ROOT):
            raise MGEError.PERMISSION_DENIED("没有权限删除该课题")
        if len(DataMeta.OtherInfoHelper.get_template_id_list_filter_by_subject_id(subject.id)) != 0:
            raise MGEError.PERMISSION_DENIED("存有该课题相关的数据，需要先撤回对应的数据才能删除项目")
        subject.delete()
        return json_response()
