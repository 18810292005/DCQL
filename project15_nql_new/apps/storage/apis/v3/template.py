from django.db import transaction
from django.db.models import Q, Count
from rest_framework import viewsets
from rest_framework.decorators import action
from apps.storage.models import Template, Snippet, MaterialMethod, MaterialCategory, MaterialMethodTemplateRelation
from .serializers import TemplateSerializer, SnippetSerializer
from mgedata.utils.general import get_field, MGEError, json_response, get_param_value
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from apps.account.models import User
from ...models.template import TemplateFieldEnum
from apps.account.auth import require_role_for_rfw
from apps.account.models.users import UserRole

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

            raise MGEError.BAD_DATA('The snippet with the title %(snippet_name) already exists' % {'snippet_name': snippet_name})

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

            raise MGEError.BAD_DATA('The snippet with the title %(snippet_name) already exists' % {'snippet_name': snippet_name})

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

        queryset = Snippet.objects.filter(user=request.user)
        page = self.paginate_queryset(queryset)
        data = [d.to_dict() for d in page]
        result = {'total': queryset.count(), 'results': data}
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

    @require_role_for_rfw(UserRole.TEMPLATE_UPLOADER)
    def create(self, request):
        title = get_field(request.data, 'title', required_type=str)
        abstract = get_field(request.data, 'abstract', required_type=str)
        category_id = get_field(request.data, 'category', required_type=int)
        method_id = get_field(request.data, 'method', required_type=int)
        published = get_field(request.data, 'published', required_type=bool, default=True)
        content = get_field(request.data, 'content', required_type=dict)
        identifier = get_field(request.data, 'identifier', required_type=str)
        if Template.objects.filter(title=title).count() > 0:
            raise MGEError.BAD_DATA('The template with the title %(title) already exists' % {'title': title})
        if identifier not in content.keys():
            raise MGEError.INVALID_TEMPLATE_IDENTIFIER(f'知识图谱标签:\"{identifier}\"不存在于第一级容器中')
        if content[identifier]['t'] != TemplateFieldEnum.STRING.value or content[identifier]['r'] is not True:
            raise MGEError.INVALID_TEMPLATE_IDENTIFIER(f'知识图谱标签:\"{identifier}\"应属于必填字符串型')
        Template.validate_content(content)
        try:
            category = MaterialCategory.objects.get(pk=category_id)
            method = MaterialMethod.objects.get(pk=method_id)
            ins = Template.objects.create(title=title,
                                          abstract=abstract,
                                          category=category,
                                          published=published,
                                          content=content,
                                          user=request.user,
                                          constraints={'identifier': identifier}
                                          )
            MaterialMethodTemplateRelation.objects.create(method=method, template=ins)
            return json_response(ins.id, status_code=201)
        except (MaterialCategory.DoesNotExist, MaterialMethod.DoesNotExist) as e:
            raise MGEError.BAD_DATA(str(e))

    def filter_queryset(self, queryset):
        review_state = get_param_value('review_state', self.request.query_params.get('review_state'),
                                       convert_to=int, allowed=['0', '1', '2'], allow_none=True)
        if review_state != None:
            queryset = queryset.filter(review_state=review_state)

        category = get_param_value('category', self.request.query_params.get('category'),
                                   convert_to=int, allow_none=True)
        if category:
            queryset = queryset.filter(category_id=category)

        method = get_param_value('method', self.request.query_params.get('method'), convert_to=int, allow_none=True)
        if method:
            queryset = queryset.filter(method_rel__method_id=method)

        private = get_param_value('private', self.request.query_params.get('private'), convert_to=bool, allow_none=True)
        if private and not self.request.user.is_anonymous:
            queryset = queryset.filter(user=self.request.user)

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
        queryset = self.filter_queryset(self.get_queryset())

        query = self.request.query_params.get('query', None)
        if query is not None:
            queryset = queryset.filter(title__contains=query)

        templates = self.paginate_queryset(queryset)
        templates = Template.objects.filter(pk__in=[t.pk for t in templates])
        templates = templates.select_related('user', 'category', 'method_rel__method', 'reviewer')
        templates = templates.prefetch_related('templaterecommend_set')
        
        serializer = self.get_serializer(templates, many=True)
        return json_response(self.get_paginated_response(serializer.data).data)

    @require_role_for_rfw(UserRole.TEMPLATE_UPLOADER)
    def partial_update(self, request, pk):
        title = get_field(request.data, 'title', required_type=str, allow_none=True)
        abstract = get_field(request.data, 'abstract', required_type=str, allow_none=True)
        category_id = get_field(request.data, 'category', required_type=int, allow_none=True)
        method_id = get_field(request.data, 'method', required_type=int, allow_none=True)
        published = get_field(request.data, 'published', required_type=bool, allow_none=True)
        content = get_field(request.data, 'content', required_type=dict, allow_none=True)

        try:
            # template = Template.objects.get(pk=id)
            template = self.get_object()

            with transaction.atomic():
                if title:
                    template.title = title
                if abstract:
                    template.abstract = abstract
                if category_id:
                    template.category = MaterialCategory.objects.get(pk=category_id)
                if method_id:
                    method = MaterialMethod.objects.get(pk=method_id)
                    # if template.method_rel is None:
                    #     template.method_rel = MaterialMethodTemplateRelation.objects.create(template=template,
                    #                                                                         method=method)
                    # else:
                    #     template.method_rel.method = method
                    try:
                        mmtr = MaterialMethodTemplateRelation.objects.get(template=template)
                        mmtr.method = method
                        mmtr.save()
                    except MaterialMethodTemplateRelation.DoesNotExist:
                        MaterialMethodTemplateRelation.objects.create(template=template, method=method)
                if published:
                    template.published = published
                if content:
                    template.modify(content)
                template.save()
            return json_response(template.to_dict())

        except (Template.DoesNotExist, MaterialCategory.DoesNotExist, MaterialMethod.DoesNotExist) as e:
            raise MGEError.BAD_DATA("Template Does not exist")

    @require_role_for_rfw(UserRole.TEMPLATE_UPLOADER)
    @action(methods=['post'], detail=False, url_path='list_create', url_name='list-create')
    def list_create(self, request):
        data = get_field(request.data, 'data', required_type=list)

        for index, value in enumerate(data):
            try:
                title = value["title"]
                abstract = value["abstract"]
                category_id = value["category"]
                method_id = value["method"]
                published = value["published"]
                content = value["content"]
                identifier = value["identifier"] ## 由于一些老模板没有identifier字段，和前端约定如果identifier不存在则传回空字符串
            except KeyError as e:
                raise MGEError.BAD_TEMPLATE(f"第{index + 1}条数据"+str(e)+"字段不存在")
            if Template.objects.filter(title=title).count() > 0:
                raise MGEError.BAD_DATA('The template with the title %(title) already exists' % {'title': title})
            if identifier == "":
                data[index]["content"]["知识图谱标签"] = {
                    "r": True,
                    "t": 1,
                    "misc": {}
                }

                data[index]["content"]["_ord"].append("知识图谱标签")
                data[index]["identifier"] = "知识图谱标签"
                identifier = "知识图谱标签"
                content = data[index]["content"]
            if identifier not in content.keys():
                raise MGEError.INVALID_TEMPLATE_IDENTIFIER(f'第{index + 1}条数据知识图谱标签字段:\"{identifier}\"不存在于第一级容器中')
            if content[identifier]['t'] != TemplateFieldEnum.STRING.value or content[identifier]['r'] is not True:
                raise MGEError.INVALID_TEMPLATE_IDENTIFIER(f'第{index + 1}条数据知识图谱标签字段:\"{identifier}\"应属于必填字符串型')
            
            
            Template.validate_content(content)
            try:
                category = MaterialCategory.objects.get(pk=category_id)
                method = MaterialMethod.objects.get(pk=method_id)
            except (MaterialCategory.DoesNotExist, MaterialMethod.DoesNotExist) as e:
                raise MGEError.BAD_DATA(str(e))

        t_lists = []
        for index, value in enumerate(data):
            title = value["title"]
            abstract = value["abstract"]
            category_id = value["category"]
            method_id = value["method"]
            published = value["published"]
            content = value["content"]
            identifier = value["identifier"]

            category = MaterialCategory.objects.get(pk=category_id)
            method = MaterialMethod.objects.get(pk=method_id)

            ins = Template.objects.create(title=title,
                                          abstract=abstract,
                                          category=category,
                                          published=published,
                                          content=content,
                                          user=request.user,
                                          constraints={'identifier': identifier}
                                          )
            MaterialMethodTemplateRelation.objects.create(method=method, template=ins)
            t_lists.append(ins.id)

        return json_response(t_lists, status_code=201)