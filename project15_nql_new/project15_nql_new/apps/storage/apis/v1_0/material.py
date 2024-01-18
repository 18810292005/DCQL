# -*- coding: utf-8 -*-

# @File   : material.py
# @Author : Yuvv
# @Date   : 2017/12/3
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q
from django.db.utils import IntegrityError
from apps.account.auth import check_login, check_role
from apps.account.models.users import UserRole, User
from apps.analytics.misc import AnalyticsInfo
from apps.storage.models import MaterialCategory, MaterialProject, MaterialSubject
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response, load_request_body, patch_resource, \
    get_json_field_r, get_param
from oauth2_provider.views.generic import ProtectedResourceView

@require_methods_api(['GET', 'POST'])
def material_categories(request):
    """获取材料分类
    get: 获取一级节点或叶节点
        params: 两个参数仅能设置一个，若同时设置，则返回 root ，若不设置，则返回所有分类。
            root: bool，获取一级节点（根节点）
            leaf: bool，获取叶节点
        return: 所需对象列表
    post: 批量提交材料分类
        params: `request.body` 应为 list，包含所有待提交对象的 dict，dict 的参数如下
            pid: str，父节点的 id
            name_en: str，分类英文名称
            name_zh: str，分类中文名称
        return: 返回 `failed` 和 `succeed` 的列表，
                `succeed`中包含提交成功的 id，`failed`中为提交失败的数据。
    """
    if request.method == 'GET':
        qs = MaterialCategory.objects.all()
        if not request.user.is_anonymous:
            qs = (qs.filter(is_public=True) |
                  qs.filter(is_public=False)
                  .filter(id__in=request.user.authorized_private_categories.values_list('category_id', flat=True)))
        else:
            qs = qs.filter(is_public=True)

        if request.GET.get('root', False):
            qs = qs.filter(level=0)
        elif request.GET.get('leaf', False):
            qs = qs.filter(leaf=True)
        else:
            qs = qs.all()
        rs = [mc.to_dict() for mc in qs.order_by('level', 'order')]
        return json_response(rs)
    elif request.method == 'POST':
        check_role(request, UserRole.ROOT)  # 仅有 root 用户能更改分类
        cls = load_request_body(request, list)
        failed_cls = []
        succeed_cls = []
        for c in cls:
            try:
                mc = MaterialCategory(parent_id=c.get('pid'),
                                      name_en=c.get('name_en'),
                                      name_zh=c.get('name_zh'))
                mc.save()
                succeed_cls.append(str(mc.id))
            except IntegrityError:
                failed_cls.append(c)

        if failed_cls:
            raise MGEError.BAD_DATA({'failed': failed_cls,
                                     'succeed': succeed_cls})
        return json_response({'failed': failed_cls, 'succeed': succeed_cls},
                             status_code=201)


@require_methods_api(['GET', 'PATCH', 'DELETE'])
def material_category_one(request, cid):
    """通过 cid 获取单个材料分类
    get: 获取对应 cid 的材料分类
        params: 无
        return: 所需对象
    patch: 更新对应 cid 的材料分类
        params: `request.body`字段为 dict
            pid: str，父节点的 ObjectId，24位字符
            name_en: str，分类英文名称
            name_zh: str，分类中文名称
        return: 返回 id 值
    delete: 删除对应 cid 的材料分类（会同时删除其所有子节点）
        params: 无
        return: 无
    """
    try:
        qs = MaterialCategory.objects.all()  # objects only return public category
        if not request.user.is_anonymous:
            qs = (qs.filter(is_public=True) |
                  qs.filter(is_public=False)
                  .filter(id__in=request.user.authorized_private_categories.values_list('category_id', flat=True)))
        else:
            qs = qs.filter(is_public=True)
        mc = qs.get(id=cid)
    except MaterialCategory.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == 'GET':
            return json_response(mc.to_dict())
        elif request.method == 'PATCH':
            check_role(request, UserRole.ROOT)  # 仅有 root 用户能更改分类
            try:
                data = load_request_body(request, dict)
                mc, changed_fields = patch_resource(mc, ('pid', 'name_zh', 'name_en'), data,
                                                    {'pid': lambda o, f, v: setattr(o, 'parent_id', v)})
                mc.save(update_fields=changed_fields)
                return json_response(mc.id, status_code=201)
            except IntegrityError as ex:
                raise MGEError.BAD_DATA(str(ex))
        elif request.method == 'DELETE':
            check_role(request, UserRole.ROOT)  # 仅有 root 用户能更改分类
            mc.delete()
            return json_response()


@require_methods_api(['GET'])
def material_category_children(request, cid):
    """通过 cid 获取该分类下一层级的子类
    get: 获取所有子节点（数量不做限制）
        params: 无
        return: 所需子节点列表
    """
    qs = MaterialCategory.objects.all()
    if not request.user.is_anonymous:
        qs = (qs.filter(is_public=True) |
              qs.filter(is_public=False)
              .filter(id__in=request.user.authorized_private_categories.values_list('category_id', flat=True)))
    else:
        qs = qs.filter(is_public=True)
    mcs = [mc.to_dict() for mc in qs.filter(parent_id=cid)]
    return json_response(mcs)


@require_methods_api(['GET'])
def material_category_tree(request):
    """获取材料分类树形结构，返回结构如下：
    [
      {"id": 1,
       "name": "category 1",
       "children": []
      },
      {"id": 2,
       "name": "category2",
       "children": [{"_id": "5a275921d0fd9d2d08e1c24f",
                     "name": "material class1",
                     "children": []
                    }]
      },
      ......
    ]
    """
    qs = MaterialCategory.objects.all()  # objects only return public category
    if not request.user.is_anonymous:
        qs = (qs.filter(is_public=True) |
              qs.filter(is_public=False)
              .filter(id__in=request.user.authorized_private_categories.values_list('category_id', flat=True)))
    else:
        qs = qs.filter(is_public=True)

    def get_children(cid):
        children = [{"id": it.id,
                     "name": it.name,
                     "children": get_children(it.id)} for it in
                    qs.filter(parent_id=cid, level__gt=1).order_by('order')]
        return children

    rs = [{"id": it.id,
           "name": it.name,
           "children": get_children(it.id)} for it in
          qs.filter(level=1).order_by('order')]  # 0 级为全局根节点
    return json_response(rs)


class MaterialTreeOauth2View(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        qs = MaterialCategory.objects.all()  # objects only return public category
        if not request.user.is_anonymous:
            qs = (qs.filter(is_public=True) |
                  qs.filter(is_public=False)
                  .filter(id__in=request.user.authorized_private_categories.values_list('category_id', flat=True)))
        else:
            qs = qs.filter(is_public=True)

        def get_children(cid):
            children = [{"id": it.id,
                         "name": it.name,
                         "children": get_children(it.id)} for it in
                        qs.filter(parent_id=cid, level__gt=1).order_by('order')]
            return children

        rs = [{"id": it.id,
               "name": it.name,
               "children": get_children(it.id)} for it in
              qs.filter(level=1).order_by('order')]  # 0 级为全局根节点
        return json_response(rs)


@require_methods_api(['GET'])
def get_material_project(request, project_id: str):
    try:
        project = MaterialProject.objects.get(pk=project_id)
        return json_response(project.to_dict())
    except MaterialProject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')


# 项目API的搜索API
@require_methods_api(['GET'])
def material_project_query(request):
    if request.method == 'GET':
        query_set = {}
        leader = get_param('leader', allow_none=True)
        name = get_param('name', allow_none=True)
        created_time = get_param('created_time', allow_none=True)
        query = get_param('query')
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int, allow_none=True)
        if leader:
            query_set['leader'] = leader
        if name:
            query_set['name'] = name
        if created_time:
            query_set['created_time'] = created_time
        projects = MaterialProject.objects.order_by('id').filter(**query_set)
        if query:
            projects = projects.filter(
                Q(leader__contains=query) | Q(name__contains=query) | Q(created_time__year__contains=query)
            )
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


# 项目API的增删改查
@require_methods_api(['GET', 'PUT', 'PATCH', 'DELETE'])
def specific_material_project(request, project_id: str):
    """具体材料项目
        get: 查看具体某一个项目
            params: 无
            return: 所需对象dict，该dict包含所查看的项目和所属于该项目的所有课题列表
        post: 新建一个project
        put: 全局修改项目
            params: `request.body` 应为 dict，包含所有待提交对象的修改属性，dict 的参数如下
                id: str, projects的项目编号，具有唯一性
                projects_area : list, projects所属的材料领域专项
                name : str, projects的名称
                institution : str, projects的牵头单位
                leader : str, projects的负责人
                leader_contact_method：str, projects负责人的联系方式
                responsible_expert：str, projects的责任专家
                responsible_expert_institution：str, projects责任专家的所属机构
            return: 返回更新以后的project对象
        patch: 局部修改项目
            params: 'request.body' 应为dict，包含待修改对象的部分属性
            returns: 返回更新以后的project对象
        delete：删除项目
            params: 无
            return: 无
        """
    try:
        project = MaterialProject.objects.get(pk=project_id)
    except MaterialProject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')
    else:
        if request.method == 'GET':
            return json_response(project.to_dict())
        elif request.method == 'PUT':
            try:
                check_login(request)
                id = get_json_field_r(request, 'id')
                # 1.如何修改projects_area
                projects_area = get_json_field_r(request, 'projects_area', allow_none=True)
                name = get_json_field_r(request, 'name')
                leader = get_json_field_r(request, 'leader')
                institution = get_json_field_r(request, 'institution')
                leader_contact_method = get_json_field_r(request, 'leader_contact_method')
                responsible_expert = get_json_field_r(request, 'responsible_expert')
                responsible_expert_institution = get_json_field_r(request, 'responsible_expert_institution')
                project2 = MaterialProject(id=id, projects_area=projects_area, name=name, leader=leader,
                                           institution=institution, leader_contact_method=leader_contact_method,
                                           responsible_expert=responsible_expert,
                                           responsible_expert_institution=responsible_expert_institution)
                project2.save()
                project.delete()
                return json_response(project2.id, status_code=201)
            except Exception as e:
                raise MGEError.BAD_DATA(str(e))
        elif request.method == 'PATCH':
            try:
                check_login(request)
                data = load_request_body(request, dict)
                project, changed_fields = patch_resource(project, ('projects_area', 'name', 'institution', 'leader'),
                                                         data,
                                                         {'projects_area': lambda o, f, v: setattr(o, 'projects_area',
                                                                                                   v)})
                project.save(update_fields=changed_fields)
                return json_response(project.id, status_code=201)
            except Exception as e:
                raise MGEError.BAD_DATA(str(e))
        elif request.method == 'DELETE':
            # check_login(request)
            project.delete()
            return json_response()


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
def get_material_projects(request):
    # check_login(request)
    if request.method == "GET":
        # check_role(request, UserRole.USER_ADMIN)
        projects = MaterialProject.objects.order_by('id').all()
        ret = []
        for project in projects:
            # 如果是项目则显示，否则不显示
            if len(project.id) == AnalyticsInfo.project_id_legal_length:
                ret.append({"id": project.id, "name": project.name})
        return json_response(ret)


# 查看具体某一个课题API
@require_methods_api(['GET'])
def get_specific_material_subject(request, subject_id: str):
    try:
        subject = MaterialSubject.objects.get(pk=subject_id)
        return json_response(subject.to_dict2())
    except MaterialProject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{subject_id} does not exist')


# 课题API的增删改查
@require_methods_api(['GET', 'PUT', 'PATCH', 'DELETE'])
def specific_material_subject(request, project_id: str, subject_id: str):
    """具体材料课题
        get: 查看具体某一个课题
            params: 无
            return: 所需对象dict，该dict包含所查看的课题对象
        put: 全局修改课题
            params: `request.body` 应为 dict，包含所有待提交对象的修改属性，dict 的参数如下
                id: str, subject的课题编号，具有唯一性
                name : str, subject的名称
                institution : str, subject的牵头单位
                leader : str, subject的牵头负责人
                leader_contact_method：str, subject负责人的联系方式
                #project_id: str, subject所属的project id
            return: 返回更新以后的subject对象
        patch: 局部修改项目
            params: 'request.body' 应为dict，包含待修改对象的部分属性
            returns: 返回更新以后的subject对象
        delete：删除项目
            params: 无
            return: 无
        """
    try:
        subject = MaterialSubject.objects.get(pk=subject_id)
    except MaterialSubject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{subject_id} does not exist')
    else:
        if request.method == 'GET':
            return json_response(subject.to_dict3())
        elif request.method == 'PUT':
            try:
                check_login(request)
                id = get_json_field_r(request, 'id')
                project_id = get_json_field_r(request, 'project_id')
                name = get_json_field_r(request, 'name')
                leader = get_json_field_r(request, 'leader')
                institution = get_json_field_r(request, 'institution')
                leader_contact_method = get_json_field_r(request, 'leader_contact_method')
                subject2 = MaterialSubject(id=id, project_id=project_id, name=name, leader=leader,
                                           institution=institution, leader_contact_method=leader_contact_method)
                subject2.save()
                # 创建新的subject，然后删除旧的subject
                subject.delete()

                return json_response(subject2.id, status_code=201)
            except Exception as e:
                raise MGEError.BAD_DATA(str(e))
        elif request.method == 'PATCH':
            try:
                check_login(request)
                data = load_request_body(request, dict)
                subject, changed_fields = patch_resource(subject, ('subject_id', 'name', 'leader', 'institution'), data,
                                                         {'subject_id': lambda o, f, v: setattr(o, 'id', v)})
                subject.save(update_fields=changed_fields)
                return json_response(subject.id, status_code=201)
            except Exception as e:
                raise MGEError.BAD_DATA(str(e))
        elif request.method == 'DELETE':
            check_login(request)
            subject.delete()
            return json_response()


# 新建项目子课题API
@require_methods_api(['POST'])
def create_material_subjects(request, project_id: str):
    # check_login(request)
    try:
        id = get_json_field_r(request, 'id')
        name = get_json_field_r(request, 'name')
        leader = get_json_field_r(request, 'leader')
        institution = get_json_field_r(request, 'institution')
        leader_contact_method = get_json_field_r(request, 'leader_contact_method', allow_none=True)
        subject = MaterialSubject()
        subject.id = id
        subject.name = name
        subject.leader = leader
        subject.institution = institution
        if leader_contact_method is not None:
            subject.leader_contact_method = leader_contact_method
        subject.project_id = project_id
        # subject.project = MaterialProject.objects.get(pk=project_id)
        subject.save()
        # MaterialSubjectUser.objects.create(subject=subject, user=request.user)
    except Exception as e:
        raise MGEError.BAD_DATA(str(e))
    return json_response(subject.to_dict2())


@require_methods_api(['GET'])
def get_material_subjects(request, project_id: str):
    try:
        project = MaterialProject.objects.get(pk=project_id)
        return json_response(project.to_dict()['subjects'])
    except MaterialProject.DoesNotExist:
        raise MGEError.BAD_PARAMETER(f'{project_id} does not exist')


# 课题API的搜索API
@require_methods_api(['GET'])
def material_subject_query(request):
    if request.method == 'GET':
        query_set = {}
        leader = get_param('leader', allow_none=True)
        name = get_param('name', allow_none=True)
        created_time = get_param('created_time', allow_none=True)
        query = get_param('query')
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int, allow_none=True)
        if leader:
            query_set['leader'] = leader
        if name:
            query_set['name'] = name
        if created_time:
            query_set['created_time'] = created_time
        subjects = MaterialSubject.objects.order_by('id').filter(**query_set)
        if query:
            subjects = subjects.filter(
                Q(leader__contains=query) | Q(name__contains=query) | Q(created_time__year__contains=query)
            )
        ret = dict()
        ret['total'] = subjects.count()
        if page:
            paginator = Paginator(subjects, page_size or 3)
            try:
                subjects = paginator.page(page)
            except EmptyPage:
                subjects = paginator.page(paginator.num_pages)
            ret['page'] = page
            ret['page_size'] = page_size
        ret['results'] = list(map(lambda x: x.to_dict_members(), subjects))
        return json_response(ret, items=ret['results'])


class MaterialProjectsOauth2View(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return json_response([project.to_dict() for project in MaterialProject.objects.all()])
