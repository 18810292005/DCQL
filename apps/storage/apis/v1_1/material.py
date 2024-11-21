from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction
from django.http import HttpRequest
from django.utils.translation import gettext as _
from django.views.generic import View

from apps.account.auth import check_login
from apps.account.models.users import UserRole, User
from apps.storage.models.material import MaterialProject, MaterialSubject, ProjectSubjectMember
from apps.storage.models.template import DataMeta
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_json_field_r, get_param


class ProjectView(View):

    def get(self, request: HttpRequest):
        """
            获取指定的项目信息
        """
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        page_size = page_size or 10
        project_ids = get_param('ids', allow_none=True, convert_to=list)
        leader_names = get_param('leader_names', allow_none=True, convert_to=list)

        _queryset = MaterialProject.objects.order_by('id').all().select_related('leader')
        _queryset = _queryset.filter(id__in=project_ids) if project_ids else _queryset
        _queryset = _queryset.filter(leader_id__in=leader_names) if leader_names else _queryset

        paginator = Paginator(_queryset, page_size)
        try:
            _queryset: list[MaterialProject] = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            _queryset: list[MaterialProject] = paginator.page(1)
            page = 1

        _queryset = list(_queryset)
        project_id_map = {project.id: project for project in _queryset}
        project_id_users_map = {}
        for record in ProjectSubjectMember.objects.filter(
                project_id__in=[project.id for project in _queryset],
                subject__isnull=True
        ).select_related('user'):
            project_id_users_map.setdefault(record.project_id, set()).add(record.user)

        user_set: set
        for project_id, user_set in project_id_users_map.items():
            user_set.remove(project_id_map[project_id].leader)

        return json_response({
            'page': page,
            'page_size': page_size,
            'results': [ins.to_dict_members(project_id_users_map) for ins in _queryset],
            'total': paginator.count
        })

    def post(self, request: HttpRequest):
        """
            创建项目
        """
        check_login(request)
        project_id = get_json_field_r(request, 'id', str)
        name = get_json_field_r(request, 'name', str)
        # water_mark = get_json_field_r(request, 'water_mark', int, default=0, allow_none=True)

        user: User = request.user
        if MaterialProject.objects.filter(id=project_id).exists():
            raise MGEError.ALREADY_EXISTS(_("一级机构编号%s已存在" % project_id))

        project = MaterialProject(
            id=project_id,
            name=name,
            leader=user,
            # waterMark=water_mark
        )

        with transaction.atomic():
            project.add_members([user])
            project.save()
        return json_response()

    def patch(self, request: HttpRequest):
        """
            修改项目信息
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        new_id = get_json_field_r(request, 'new_id', str, allow_none=False)
        name = get_json_field_r(request, 'name', str, allow_none=True)
        # water_mark = get_json_field_r(request, 'water_mark', int, default=0, allow_none=True)
        leader_username = get_json_field_r(request, 'leader_name', str, allow_none=True)
        member_usernames = get_json_field_r(request, 'members_name', list, allow_none=True)
        member_usernames = member_usernames or []
        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=id)

        if user.role < UserRole.SYS_ADMIN:
            raise MGEError.PERMISSION_DENIED("需要系统管理员权限")
        if id != new_id:
            if MaterialProject.objects.filter(id=new_id).exists():
                raise MGEError.ALREADY_EXISTS(_("一级机构编号%s已存在" % new_id))
            with transaction.atomic():
                project = MaterialProject.objects.get(id=id)
                new_project = MaterialProject()
                for field in MaterialProject._meta.fields:
                    if field.name != 'id':  # 跳过主键字段
                        setattr(new_project, field.name, getattr(project, field.name))
                new_project.id = new_id
                new_project.save()
                datameta = DataMeta.objects.filter(project=id)
                for data in datameta:
                    data.project = new_project
                    data.save()
                subject = MaterialSubject.objects.filter(project=id)
                for sub in subject:
                    sub.project = new_project
                    sub.save()
                member = ProjectSubjectMember.objects.filter(project=id)
                for mb in member:
                    mb.project = new_project
                    mb.save()
                project.delete()
                id = new_id
        project: MaterialProject = MaterialProject.objects.get(id=id)

        leader = project.leader
        if leader_username:
            leader: User = User.objects.filter(username=leader_username).first()
            if not leader:
                raise MGEError.USER_NOT_FOUND(_('用户%s不存在') % leader_username)
        project.leader = leader
        if leader.role < UserRole.DATA_ADMIN:
            raise MGEError.PERMISSION_DENIED("机构负责人必须是数据审核员或系统管理员")
        if not leader.enabled:
            raise MGEError.PERMISSION_DENIED("机构负责人账号必须是启用状态")
        members = list(User.objects.filter(username__in=member_usernames))
        project.name = name or project.name
        # project.waterMark = water_mark
        with transaction.atomic():
            project.replace_members([user, leader] + members)
            project.save()
        return json_response()

    def delete(self, request: HttpRequest):
        """
            删除项目
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)

        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=id)

        if user.role < UserRole.SYS_ADMIN:
            raise MGEError.PERMISSION_DENIED("需要系统管理员权限")
        if DataMeta.objects.filter(project=project).exists():
            raise MGEError.PERMISSION_DENIED("机构下存在数据，无法删除。如确需删除，请先删除所有的机构下的所有数据。")
        if MaterialSubject.objects.filter(project=project).exists():
            raise MGEError.PERMISSION_DENIED("请先删除一级机构下的所有二级机构")
        project.delete()
        return json_response()


class SubjectView(View):

    def get(self, request: HttpRequest):
        """
            获取指定的课题信息
        """
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        page_size = get_param('page_size', allow_none=True, convert_to=int)
        page_size = page_size or 10
        subject_ids = get_param('ids', allow_none=True, convert_to=list)
        project_ids = get_param('project_ids', allow_none=True, convert_to=list)
        leader_names = get_param('leader_names', allow_none=True, convert_to=list)

        _queryset = MaterialSubject.objects.order_by('id').all().select_related('leader', 'project')
        _queryset = _queryset.filter(id__in=subject_ids) if subject_ids else _queryset
        _queryset = _queryset.filter(project_id__in=project_ids) if project_ids else _queryset
        _queryset = _queryset.filter(leader_id__in=leader_names) if leader_names else _queryset

        paginator = Paginator(_queryset, page_size)
        try:
            _queryset: list[MaterialSubject] = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            _queryset: list[MaterialSubject] = paginator.page(1)
            page = 1

        subjects = list(_queryset)
        subject_id_map = {subject.id: subject for subject in subjects}
        subject_id_users_map = {}
        for record in ProjectSubjectMember.objects.filter(
                subject_id__in=[subject.id for subject in subjects]
        ).select_related('user'):
            subject_id_users_map.setdefault(record.subject_id, set()).add(record.user)
        for subject_id, user_set in subject_id_users_map.items():
            user_set.remove(subject_id_map[subject_id].leader)
        return json_response({
            'page': page,
            'page_size': page_size,
            'results': [ins.to_dict_members(subject_id_users_map) for ins in _queryset],
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
        # water_mark = get_json_field_r(request, 'water_mark', int, default=0, allow_none=True)

        user: User = request.user
        project: MaterialProject = MaterialProject.objects.get(id=project_id)
        if MaterialSubject.objects.filter(id=id).exists():
            raise MGEError.ALREADY_EXISTS(_("二级机构编号%s已存在" % project_id))
        # if project.waterMark:
        #     water_mark = True
        subject = MaterialSubject(
            id=id,
            name=name,
            leader=user,
            project=project,
            # waterMark=water_mark
        )
        users = [r.user for r in ProjectSubjectMember.objects.filter(
            project=subject.project, subject__isnull=True
        ).select_related('user')]
        with transaction.atomic():
            subject.add_members([user, project.leader])
            # 项目管理成员也加进来
            subject.add_members(users)
            subject.save()
        return json_response()

    def patch(self, request: HttpRequest):
        """
            修改课题信息
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)
        new_id = get_json_field_r(request, 'new_id', str, allow_none=False)
        name = get_json_field_r(request, 'name', str, allow_none=True)
        leader_name = get_json_field_r(request, 'leader_name', str, allow_none=True)
        members_name = get_json_field_r(request, 'members_name', list, allow_none=True)
        # water_mark = get_json_field_r(request, 'water_mark', int, default=0, allow_none=True)
        user: User = request.user
        if user.role < UserRole.SYS_ADMIN:
            raise MGEError.PERMISSION_DENIED("需要系统管理员权限")
        if id != new_id:
            if MaterialSubject.objects.filter(id=new_id).exists():
                raise MGEError.ALREADY_EXISTS(_("二级机构编号%s已存在" % new_id))

            with transaction.atomic():
                subject = MaterialSubject.objects.get(id=id)
                new_subject = MaterialSubject()
                for field in MaterialSubject._meta.fields:
                    if field.name != 'id':  # 跳过主键字段
                        setattr(new_subject, field.name, getattr(subject, field.name))
                new_subject.id = new_id
                new_subject.save()
                datameta = DataMeta.objects.filter(subject=id)
                for data in datameta:
                    data.subject = new_subject
                    data.save()
                member = ProjectSubjectMember.objects.filter(subject=id)
                for mb in member:
                    mb.subject = new_subject
                    mb.save()
                subject.delete()
                id = new_id
        subject: MaterialSubject = MaterialSubject.objects.get(id=id)

        leader = subject.leader
        if leader_name:
            leader = User.objects.filter(username=leader_name).first()
            if not leader:
                raise MGEError.NOT_FOUND(_("用户%s不存在") % leader_name)
            if leader.role < UserRole.DATA_ADMIN:
                raise MGEError.PERMISSION_DENIED("机构负责人必须是数据审核员或系统管理员")
            if not leader.enabled:
                raise MGEError.PERMISSION_DENIED("机构负责人账号必须是启用状态")
        subject.leader = leader
        members = User.objects.filter(username__in=members_name) if members_name else []

        subject.name = name or subject.name
        subject.leader = leader
        # subject.waterMark = water_mark
        users = [r.user for r in ProjectSubjectMember.objects.filter(
            project=subject.project, subject__isnull=True
        ).select_related('user')]
        with transaction.atomic():
            subject.replace_members(list(set([user, leader] + list(members))))
            subject.add_members(users)
            subject.save()
        return json_response()

    def delete(self, request: HttpRequest):
        """
            删除课题
        """
        check_login(request)
        id = get_json_field_r(request, 'id', str)

        user: User = request.user
        subject: MaterialSubject = MaterialSubject.objects.get(id=id)

        if user.role < UserRole.SYS_ADMIN:
            raise MGEError.PERMISSION_DENIED("需要系统管理员权限")
        if DataMeta.objects.filter(subject=subject).exists():
            raise MGEError.PERMISSION_DENIED("机构下存在数据，无法删除。如果确需删除，请先删除该二级机构下的所有数据。")
        subject.delete()
        return json_response()
