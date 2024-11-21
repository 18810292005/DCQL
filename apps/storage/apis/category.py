from django.http import HttpRequest
from django.utils.translation import gettext as _

from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.storage.models.material import CategoryTree, Category
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, load_request_body, get_field, require_methods_api


@require_methods_api(['GET', 'POST', 'PATCH'])
def category_tree(request: HttpRequest):
    if request.method == 'GET':
        query = request.GET.get('query', None)
        v, tree = CategoryTree.get_tree(query=query)

        return json_response({'version': v, 'children': tree})
    elif request.method == 'POST':
        return add_category(request)
    return reconstruct_tree(request)


@require_methods_api(['POST'])
@require_role(UserRole.SYS_ADMIN)
def add_category(request: HttpRequest):
    data = load_request_body(request)
    version = get_field(data, 'version', required_type=str)
    name = get_field(data, 'name', required_type=str)
    parent_id = get_field(data, 'parent_id', required_type=int, allow_none=True)
    v, cat = CategoryTree.add_category(version=version, name_zh=name, parent_id=parent_id)
    return json_response({'name': cat.name_zh, 'id': cat.id})


@require_methods_api(['DELETE'])
@require_role(UserRole.SYS_ADMIN)
def delete_category(request: HttpRequest, cat_id: int):
    data = load_request_body(request)
    version = get_field(data, 'version', required_type=str)
    CategoryTree.delete_category(version=version, cat_id=cat_id)
    return json_response({'id': cat_id})


@require_methods_api(['PATCH', 'DELETE'])
@require_role(UserRole.SYS_ADMIN)
def rename_or_delete_category(request: HttpRequest, cat_id: int):
    if request.method == 'DELETE':
        return delete_category(request, cat_id)
    data = load_request_body(request)
    name = get_field(data, 'name', required_type=str)
    if Category.objects.filter(name_zh=name).exists():
        raise MGEError.ALREADY_EXISTS(_('领域分类"%s"已经存在，请更换名称') % name)
    Category.objects.filter(pk=cat_id).update(name_zh=name)
    return json_response({'id': cat_id, 'name': name})


@require_methods_api(['PATCH'])
@require_role(UserRole.SYS_ADMIN)
def reconstruct_tree(request: HttpRequest):
    data = load_request_body(request)
    version = get_field(data, 'version', required_type=str)
    children = get_field(data, 'children', required_type=list)
    CategoryTree.reconstruct(version=version, root_children=children)
    new_v, tree = CategoryTree.get_tree()
    return json_response({'version': new_v, 'children': tree})
