# -*- coding: utf-8 -*-
import json

from django.db.models import Q
from django.http import HttpRequest

# @File   : template.py
# @Author : Yuvv
# @Date   : 2017/12/3

from apps.account.auth import ensure_privacy, require_role
from apps.account.models.users import UserRole, User
from apps.storage.models.data import DataReviewState
from apps.storage.models.template import Template, TemplateFieldEnum
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response, get_param, get_page_info
from mgedata.utils.pagination import MyPaginator


@require_methods_api(['GET'])
def templates(request):
    """
    旧接口，仅保留获取分类下模板列表的功能
    """
    if request.method == 'GET':
        try:
            category_id = get_param('category', convert_to=int, allow_none=True)
            queryset = Template.objects.filter(published=True, review_state=DataReviewState.APPROVED)
            queryset = queryset.filter(
                Q(public=True) |
                Q(reviewer__username=request.user.username)
            )
            if category_id:
                result = list(queryset.filter(category_id=category_id).values('id', 'title'))
            else:
                result = list(queryset.values('id', 'title'))
            return json_response({'templates': result, 'total': len(result)})
        except Exception as ex:
            raise MGEError.BAD_DATA(str(ex))


@require_role(UserRole.RESEARCHER)
@require_methods_api(['GET', 'DELETE'])
def template_one(request, tid):
    """
    旧接口，仅保留获取和删除功能
    """
    try:
        t = Template.objects.get(id=tid)
        if t.public is False:
            if t.reviewer and t.reviewer.username != request.user.username:
                raise Template.DoesNotExist
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == 'GET':
            meta_only = request.GET.get('meta_only', False)
            template_meta = dict(t.to_dict(meta_only))
            template_meta["review_state"] = t.review_state
            template_meta["has_data"] = True if t.ref_count > 0 else False
            return json_response(template_meta)
        ensure_privacy(request, t.username)  # 仅模板所有者可以删除模板
        if t.ref_count > 0:
            raise MGEError.TEMPLATE_REFERENCED
        t.delete()
        return json_response()


@require_methods_api(['GET'])
@require_role(UserRole.DATA_ADMIN)
def template_management_list(request: HttpRequest):
    page, page_size = get_page_info(request)
    title_or_abstract = get_param('title_or_abstract', allow_none=True)
    category_id = get_param('category_id', convert_to=int, allow_none=True)
    category_id = None if category_id == 0 else category_id
    state = get_param('review_state', convert_to=int, allow_none=True)
    q = Q(published=True)
    if title_or_abstract is not None:
        q &= Q(title__icontains=title_or_abstract) | Q(abstract__icontains=title_or_abstract)
    if category_id is not None:
        q &= Q(category_id=category_id)
    try:
        state = DataReviewState(state)
    except ValueError:
        state = None
    if state is not None:
        q &= Q(review_state=state)
    queryset = Template.objects.filter(q).select_related('category', 'reviewer', 'user')
    queryset = queryset.filter(
        Q(public=True) |
        Q(reviewer__username=request.user.username)
    )
    paginator = MyPaginator(queryset, page_size)
    res = []
    template: Template
    for template in paginator.page(page):
        res.append(
            {
                'title': template.title,
                'id': template.id,
                'review_state': template.review_state,
                'reviewer': template.reviewer_id,
                'reviewer_real_name': template.reviewer.real_name if template.reviewer else None,
                'real_name': template.user.real_name,
                'pub_date': template.pub_date,
                'abstract': template.abstract,
                'disapprove_reason': template.disapprove_reason,
                'category_name': template.category.name,
                'ref_count': template.ref_count,
                'public': template.public,
            }
        )
    return json_response({
        'results': res,
        'count': paginator.count,
        'page_size': paginator.per_page,
    })


@require_methods_api(['GET'])
def template_get_fields(request: HttpRequest, template_id):
    fields = Template.objects.get(id=template_id).fields
    user = User.objects.get(username=request.user.username)
    t = Template.objects.get(id=template_id)
    # 审核员权限可以查看模板、本人可以查看本人的模板，非本人模板只可以看审核通过的公开模板
    if user and (user.role >= UserRole.DATA_ADMIN
                 or user.username == t.user.username
                 or (user.username != t.user.username
                     and t.review_state == DataReviewState.APPROVED
                     and t.public is True)):
        pass
    else:
        raise MGEError.PERMISSION_DENIED("无权限，审核员权限可以查看模板、本人可以查看本人的模板，非本人模板只可以看审核通过的公开模板")
    def get_field_hierarchy(field):
        if field.parent_field != None:
            field_dict = {
                "Name": field.field_name if field.parent_field.field_type != TemplateFieldEnum.ARRAY else "0",
                "type": field.field_type,
                "sub_fields": []
            }
        else:
            field_dict = {
                "Name": field.field_name,
                "type": field.field_type,
                "sub_fields": []
            }
        if field.sub_fields:
            if field.field_type == TemplateFieldEnum.ARRAY:
                for sub_field in field.sub_fields:
                    field_dict["sub_fields"].append(get_field_hierarchy(sub_field))
            else:
                for sub_field in field.sub_fields:
                    field_dict["sub_fields"].append(get_field_hierarchy(sub_field))
        return field_dict

    fields_json = []
    for field in fields:
        fields_json.append(get_field_hierarchy(field))

    fields_json_str = json.dumps(fields_json, indent=4, ensure_ascii=False)


    return json_response(json.loads(fields_json_str))
