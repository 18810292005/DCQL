# -*- coding: utf-8 -*-

# @File   : material.py
# @Author : Yuvv
# @Date   : 2017/12/3
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q
from django.utils.translation import gettext as _

from apps.account.auth import require_role
from apps.account.models.users import User, UserRole
from apps.storage.models.material import Category, MaterialProject, CategoryTree, ProjectSubjectMember, MaterialSubject
from mgedata.errors.models import MGEError
from mgedata.utils.general import (
    require_methods_api, json_response, get_param
)


@require_methods_api(['GET'])
def material_categories(request):
    only = CategoryTree.objects.first()
    if not only:
        return json_response([])
    root_cats = only.tree_json['root']
    id_children_map = only.tree_json['id_children_map']
    id_parent_map = only.tree_json['id_parent_map']
    id_depth_map = only.tree_json['id_depth_map']
    res = [
        {
            "id": 0,
            "pid": 0,
            "level": 0,
            "name": "所有分类(dummy)",
            "leaf": False,
            "order": 1
        }
    ]
    cat_id_map = Category.objects.filter(id__in=root_cats).in_bulk()
    for i, root_cat_id in enumerate(root_cats):
        res.append({
            "id": root_cat_id,
            'pid': 0,
            "level": 1,
            "name": cat_id_map[root_cat_id].name_zh,
            "leaf": True if not id_children_map.get(str(root_cat_id)) else False,
            "order": i
        })

    for cat in Category.objects.all().exclude(id__in=root_cats):
        parent_id = id_parent_map.get(str(cat.id))
        res.append({
            "id": cat.id,
            "pid": parent_id or 0,
            "level": id_depth_map.get(str(cat.id), 1),
            "name": cat.name_zh,
            "leaf": True if not id_children_map.get(str(cat.id)) else False,
            "order": 0 if parent_id is None else id_children_map[str(parent_id)].index(cat.id)
        })
    res.sort(key=lambda x: (x['pid'], x['order']))
    return json_response(res)


@require_methods_api(['GET'])
def get_material_project(request, project_id: str):
    try:
        project = MaterialProject.objects.get(pk=project_id)
        return json_response(project.to_dict())
    except MaterialProject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')


# 获取用户创建项目列表，管理员可以查看所有项目信息
@require_methods_api(['GET'])
def get_user_material_projects(request):
    # check_login(request)
    # total=true表示返回所有信息，否则返回用户对应的项目信息
    if request.method == "GET":
        # check_role(request, UserRole.USER_ADMIN)
        total = get_param('total', allow_none=True)
        if total is not None and total == 'True':
            # return json_response([project.to_dict() for project in MaterialProject.objects.all()])
            page = get_param('page', convert_to=int)
            page_size = get_param('page_size', convert_to=int, allow_none=True)
            projects = MaterialProject.objects.order_by('name').all()
            ret = dict()
            ret['total'] = projects.count()
            if page:
                paginator = Paginator(projects, page_size or 3)
                try:
                    projects = paginator.page(page)
                except EmptyPage:
                    projects = paginator.page(paginator.num_pages)
                ret['page'] = page
                ret['page_size'] = page_size
            ret['results'] = list(map(lambda x: x.to_dict(), projects))
            return json_response(ret, items=ret['results'])

        query_set = {}
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int, allow_none=True)
        if request.user.username:
            query_set['username'] = request.user.username
        projects = User.objects.get(username=request.user.username).my_projects.all()
        ret = dict()
        ret['total'] = projects.count()
        if page:
            paginator = Paginator(projects, page_size or 3)
            try:
                projects = paginator.page(page)
            except EmptyPage:
                projects = paginator.page(paginator.num_pages)
            ret['page'] = page
            ret['page_size'] = page_size
        ret['results'] = list(map(lambda x: x.to_dict(), projects))
        return json_response(ret, items=ret['results'])


# 获取所有已创建的项目列表
@require_methods_api(['GET'])
@require_role(UserRole.RESEARCHER)
def get_material_projects(request):
    user: User = request.user

    project_ids = ProjectSubjectMember.objects.filter(
        user=user
    ).values_list('project_id', flat=True).distinct()
    projects = MaterialProject.objects.filter(id__in=project_ids)
    res = []
    for project in projects:
        res.append({"id": project.id, "name": project.name})
    return json_response(res)


@require_methods_api(['GET'])
@require_role(UserRole.RESEARCHER)
def get_material_subjects(request, project_id: str):
    try:
        project = MaterialProject.objects.get(pk=project_id)
        # 参与的课题
        subject_ids_1 = ProjectSubjectMember.objects.filter(
            project=project, user=request.user
        ).values_list('subject_id', flat=True)

        # 项目本身成员可以获取到所有课题
        project_ids = ProjectSubjectMember.objects.filter(
            project=project, subject__isnull=True, user=request.user
        ).values_list('project_id')
        subject_ids_2 = MaterialSubject.objects.filter(
            project_id__in=project_ids
        ).values_list('id', flat=True)
        q1 = Q(id__in=subject_ids_1)
        q2 = Q(id__in=subject_ids_2)

        subjects = MaterialSubject.objects.filter(q1 | q2)
        res = []
        for subject in subjects:
            res.append({"id": subject.id, "name": subject.name})
        return json_response(res)
    except MaterialProject.DoesNotExist:
        raise MGEError.NOT_FOUND(_("项目不存在"))
