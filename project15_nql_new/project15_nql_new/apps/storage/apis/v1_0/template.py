# -*- coding: utf-8 -*-

# @File   : template.py
# @Author : Yuvv
# @Date   : 2017/12/3

from django.db.utils import IntegrityError
from apps.storage.models import Template
from apps.account.auth import check_role, ensure_privacy
from apps.account.models.users import UserRole
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response, load_request_body, get_json_field_r, get_param
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from apps.storage.models.data import DataReviewState
from django.db import transaction
from django.db.models.query import Q
from oauth2_provider.views.generic import ProtectedResourceView


@require_methods_api(['GET', 'POST'])
def templates(request):
    """
    get:  获取所有模版id和title
        params:
            category_id : 按分类进行过滤过滤
    post: 批量添加材料模板（单个模板也通过这种方式提交）
        params: `body.data`字段为待添加模板的dict的列表
            title: str，标题
            category: int，所属材料类别的 id
            abstract: str，摘要信息
            published: boolean, 是否发布
            content: dict，实际内容
        return: 返回 `failed` 和 `succeed` 的列表，
                `succeed`中包含提交成功的 id，`failed`中为提交失败的数据。
    """
    if request.method == 'GET':
        try:
            category_id = get_param('category', convert_to=int, allow_none=True)
            queryset = Template.objects.filter(trashed=False, published=True)
            if category_id:
                result = list(queryset.filter(category_id=category_id).values('id', 'title'))
            else:
                result = list(queryset.values('id', 'title'))
            return json_response({'templates': result, 'total': len(result)})

        except Exception as ex:
            raise MGEError.BAD_DATA(str(ex))
    elif request.method == 'POST':
        check_role(request, UserRole.TEMPLATE_UPLOADER)  # 用户必须具有模板上传者角色
        data = load_request_body(request, list)
        succeed_t = []
        failed_t = []
        errors = []
        for t in data:
            try:
                tpl = Template(title=t['title'], category_id=t.get('category'),
                               abstract=t['abstract'], published=t.get('published', False), user=request.user)
                tpl.set_content(t['content'])
                tpl.save()
                succeed_t.append(str(tpl.id))
            except ValueError as ex:
                errors.append(str(ex))
                failed_t.append(t)
            except IntegrityError:
                errors.append('Title: `%s` is duplicated with existing template.' % t['title'])
                failed_t.append(t)
        if failed_t:
            raise MGEError.BAD_DATA({'failed': failed_t,
                                     'succeed': succeed_t,
                                     'err_detail': errors})
        else:
            return json_response({'failed': failed_t, 'succeed': succeed_t}, status_code=201)


@require_methods_api(['GET', 'PATCH', 'DELETE'])
def template_one(request, tid):
    """
    get: 获取材料模板
        params:
            meta_only: boolean, 是否仅获取元数据部分，不要内容部分，默认 False
        return: 返回所属模板
    patch: 批量添加材料模板
        params: `body.data`字段为待更新模板的dict的列表
            title: str，标题
            category: int，所属材料类别的 id
            abstract: str，摘要信息
            published: boolean, 是否发布
            content: dict，实际内容
        return: 返回更新的模板的 ObjectId
    delete: 删除
        params: 无
        return: 无
    """
    try:
        t = Template.objects.get(id=tid)
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if request.method == 'GET':
            meta_only = request.GET.get('meta_only', False)
            return json_response(t.to_dict(meta_only))
        elif request.method == 'PATCH':
            try:
                check_role(request, UserRole.TEMPLATE_UPLOADER)
                ensure_privacy(request, t.username)
                title = get_json_field_r(request, 'title')
                abstract = get_json_field_r(request, 'abstract')
                content = get_json_field_r(request, 'content')
                published = get_json_field_r(request, 'published', allow_none=True, default=t.published)
                with transaction.atomic():
                    t.title = title
                    t.abstract = abstract
                    t.review_state = DataReviewState.PENDING
                    t.disapprove_reason = None
                    t.published = published
                    t.modify(content)
                return json_response()
            except Exception as e:
                raise MGEError.BAD_TEMPLATE(str(e))
        elif request.method == 'DELETE':
            check_role(request, UserRole.TEMPLATE_ADMIN | UserRole.TEMPLATE_UPLOADER)  # 模板管理员或者模板上传者才可删除
            # ensure_privacy(request, t.username)  # 仅模板所有者可以删除模板
            if t.ref_count > 0:
                raise MGEError.TEMPLATE_REFERENCED
            t.delete()
            return json_response()


class TemplateOauth2View(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        if 'tid' in kwargs:
            try:
                result = Template.objects.get(pk=kwargs['tid'])
                if result.published or request.user.has_role(UserRole.ROOT):
                    return json_response({'template': result.to_dict()})
                else:
                    raise MGEError.BAD_DATA('not published')
            except Template.DoesNotExist as e:
                raise MGEError.BAD_DATA('id not exists')
            except Exception as e:
                raise MGEError.BAD_DATA(str(e))
        else:
            try:
                try:
                    per_page = int(request.GET.get('per_page', 20))
                except ValueError:
                    per_page = 20
                page = request.GET.get('page', 1)
                category = request.GET.get('category', None)
                # private 对超级用户忽略
                private = False if request.user.is_authenticated and request.user.has_role(UserRole.ROOT)\
                    else request.GET.get(
                    'private',
                    False)
                meta_only = request.GET.get('meta_only', False)
                pub_only = request.GET.get('pub_only', True)

                qs = Template.objects.filter(trashed=False)
                if category:
                    qs = qs.filter(category_id=category)
                if private and request.user.is_authenticated:
                    qs = qs.filter(user_id=request.user.username)
                if pub_only is True:
                    qs = qs.filter(published=True)
                #   qs = qs.filter(review_state=DataReviewState.APPROVED)
                paginator = Paginator(qs, per_page=per_page)
                total = paginator.count  # 符合条件的模板总数
                try:
                    result_page = paginator.page(page)
                except (PageNotAnInteger, EmptyPage):
                    result_page = paginator.page(1)
                rs = [t.to_dict(meta_only) for t in result_page]
                # return json_response(rs, total=total)
                return json_response({'templates': rs, 'total': total})
            except Exception as ex:
                raise MGEError.BAD_DATA(str(ex))
