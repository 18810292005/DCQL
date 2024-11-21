from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import timezone

from django.db import transaction
from django.db.models import Q
from django.utils.translation import gettext as _
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from apps.account.auth import require_role_for_rfw
from apps.account.models.users import UserRole
from apps.storage.models.material import Category
from apps.storage.models.template import Template, Snippet
from mgedata.utils.general import get_field, MGEError, json_response, get_param_value, get_param
from .serializers import TemplateSerializer, SnippetSerializer
from ...models.data import DataReviewState, DataMeta


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class SnippetViewSet(viewsets.GenericViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer

    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def create(self, request):
        snippet_name = get_field(request.data, 'snippet_name', required_type=str)
        content = get_field(request.data, 'content', required_type=dict)
        if len(snippet_name.strip()) == 0:
            raise MGEError.BAD_DATA("片段名称不能为空")
        if Snippet.objects.filter(snippet_name=snippet_name).filter(user=request.user).count() > 0:
            raise MGEError.ALREADY_EXISTS(_('模板片段"%s"已经存在') % snippet_name)

        Snippet.validate_content(content)
        ins = Snippet.objects.create(snippet_name=snippet_name,
                                     content=content,
                                     user=request.user
                                     )

        return json_response(ins.id, status_code=201)

    def partial_update(self, request, pk):
        snippet_name = get_field(request.data, 'snippet_name', required_type=str)
        content = get_field(request.data, 'content', required_type=dict)
        if len(snippet_name.strip()) == 0:
            raise MGEError.BAD_DATA("片段名称不能为空")
        Snippet.validate_content(content)
        q = ~Q(id=pk)
        q &= Q(snippet_name=snippet_name)
        if Snippet.objects.filter(q).filter(user=request.user).count() > 0:
            raise MGEError.BAD_DATA(
                'The snippet with the title %(snippet_name) already exists' % {'snippet_name': snippet_name})

        try:
            snippet = self.get_object()

            with transaction.atomic():
                snippet.snippet_name = snippet_name
                snippet.content = content
                snippet.save()
            return json_response(snippet.id, status_code=201)
        except Exception as e:
            raise MGEError.BAD_DATA("snippet 不存在")

    def list(self, request, *args, **kwargs):
        page = get_param("page", allow_none=True, default=None)
        page_size = get_param("page_size", allow_none=True, default=None)
        title = get_param("title", allow_none=True)
        if title:
            queryset = Snippet.objects.filter(user=request.user, snippet_name__icontains=title)
        else:
            queryset = Snippet.objects.filter(user=request.user)
        datas = self.paginate_queryset(queryset)
        data = [d.to_dict() for d in datas]
        if page and page_size:
            paginator = Paginator(data, per_page=page_size)
            try:
                res = paginator.page(page)
            except (EmptyPage, PageNotAnInteger):
                raise MGEError.NOT_FOUND
            result = {'total': queryset.count(), 'results': list(res), "page_size": page_size, "page": page}
            return json_response(result)
        else:
            result = {'total': queryset.count(), 'results': data, "page_size": None, "page": None}
            return json_response(result)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return json_response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        snippet = self.get_object()
        if request.user != snippet.user:
            raise MGEError.PERMISSION_DENIED("你没有权限删除该片段")
        snippet.delete()
        return json_response(snippet.id)


class TemplateViewSet(viewsets.GenericViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    @require_role_for_rfw(UserRole.RESEARCHER)
    def create(self, request):
        title = get_field(request.data, 'title', required_type=str)
        abstract = get_field(request.data, 'abstract', required_type=str)
        category_id = get_field(request.data, 'category', required_type=int)
        published = get_field(request.data, 'published', required_type=bool, default=True)
        content = get_field(request.data, 'content', required_type=dict)
        public = get_field(request.data, 'public', required_type=bool, default=True, allow_none=True)
        if Template.objects.filter(title=title).count() > 0:
            raise MGEError.ALREADY_EXISTS(_('系统中已经存在名为 %s 的模板') % title)
        Template.validate_content(content)
        try:
            category = Category.objects.get(pk=category_id)
            ins = Template.objects.create(title=title,
                                          abstract=abstract,
                                          category=category,
                                          published=published,
                                          content=content,
                                          user=request.user,
                                          public=public,
                                          review_state=DataReviewState.APPROVED if not public else DataReviewState.PENDING,
                                          reviewer=request.user if not public else None,
                                          review_time=timezone.now() if not public else None,
                                          )
            return json_response(ins.id, status_code=201)
        except Category.DoesNotExist as e:
            raise MGEError.BAD_DATA(str(e))

    def filter_queryset(self, queryset):
        review_state = get_param_value('review_state', self.request.query_params.get('review_state'),
                                       convert_to=int, allowed=['0', '1', '2'], allow_none=True)

        if review_state != None:
            queryset = queryset.filter(review_state=review_state)
        else:
            queryset = queryset.filter(Q(review_state=DataReviewState.APPROVED) | Q(user=self.request.user))

        category = get_param_value('category', self.request.query_params.get('category'),
                                   convert_to=int, allow_none=True)
        if category:
            queryset = queryset.filter(category_id=category)


        order = get_param_value('order', self.request.query_params.get('order'), convert_to=str,
                                allowed=['pub_date', '-pub_date'],
                                allow_none=True)
        queryset = queryset.order_by(order) if order else queryset.order_by('id')

        contains_data_only = get_param_value('contains_data_only', self.request.query_params.get(
            'contains_data_only'), convert_to=bool, allow_none=True)

        res_queryset = queryset

        if contains_data_only:
            for q in queryset:
                if q.ref_count <= 0:
                    res_queryset = res_queryset.exclude(id=q.id)

        return res_queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return json_response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(published=True)

        query = self.request.query_params.get('query', None)
        if query is not None:
            queryset = queryset.filter(title__contains=query)

        templates = self.paginate_queryset(queryset)
        templates = Template.objects.filter(pk__in=[t.pk for t in templates])
        templates = templates.select_related('user', 'category', 'reviewer')

        serializer = self.get_serializer(templates, many=True)
        return json_response(self.get_paginated_response(serializer.data).data)

    @require_role_for_rfw(UserRole.RESEARCHER)
    def partial_update(self, request, pk):
        title = get_field(request.data, 'title', required_type=str, allow_none=True)
        abstract = get_field(request.data, 'abstract', required_type=str, allow_none=True)
        category_id = get_field(request.data, 'category', required_type=int, allow_none=True)
        published = get_field(request.data, 'published', required_type=bool, allow_none=True)
        content = get_field(request.data, 'content', required_type=dict, allow_none=True)
        public = get_field(request.data, 'public', required_type=bool, allow_none=True)

        try:
            template = self.get_object()
            # 创建了数据，那就不能改 public 字段
            # 没创建数据，而且是本人的模板，可以改
            if public is not None and public != template.public:
                if DataMeta.objects.filter(tid=template.id).count() > 0:
                    raise MGEError.BAD_PARAMETER("已经创建了数据，无法更改public字段。")
                else:
                    if template.user.username != request.user.username:
                        raise MGEError.BAD_PARAMETER("不是你的模板，无法更改public字段。")
            with transaction.atomic():
                if title:
                    template.title = title
                if abstract:
                    template.abstract = abstract
                if category_id:
                    template.category = Category.objects.get(pk=category_id)
                if content:
                    template.modify(content)

                template.published = published
                if public is True:
                    template.review_state = DataReviewState.PENDING
                    template.reviewer = None
                    template.review_time = None
                if public is not None and public != template.public:
                    # 私有默认审核过了，所以如果改成公有需要重新审核。如果公有改私有那就直接审核通过。
                    if public is False:
                        template.review_state = DataReviewState.APPROVED
                        template.reviewer = request.user
                        template.review_time = timezone.now()
                    else:
                        template.review_state = DataReviewState.PENDING
                        template.reviewer = None
                        template.review_time = None
                    template.public = public
                template.save()
            return json_response(template.to_dict())

        except (Template.DoesNotExist, Category.DoesNotExist) as e:
            raise MGEError.BAD_DATA("Template Does not exist")
