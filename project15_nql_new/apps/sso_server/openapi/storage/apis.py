from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from apps.account.models.users import UserRole
from apps.sso_server.openapi.decorator import open_api_auth
from apps.storage.apis.v1_1.data import _submit_a_data
from apps.storage.apis.v2.data import template_to_dict, data_to_dict
from apps.storage.models import MaterialCategory, MaterialProject, Template, DataMeta
from apps.storage.models.data import DataUploadSourceMap
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, load_request_body
from oauth2_provider.views.generic import ProtectedResourceView
from apps.search.tasks import import_to_es


class TemplateOauth2View(ProtectedResourceView):
    @open_api_auth
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
                private = False if request.user.is_authenticated and request.user.has_role(UserRole.ROOT) \
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
                paginator = Paginator(qs, per_page=per_page)
                total = paginator.count  # 符合条件的模板总数
                try:
                    result_page = paginator.page(page)
                except (PageNotAnInteger, EmptyPage):
                    result_page = paginator.page(1)
                rs = [t.to_dict(meta_only) for t in result_page]
                return json_response({'templates': rs, 'total': total})
            except Exception as ex:
                raise MGEError.BAD_DATA(str(ex))


class MaterialTreeOauth2View(ProtectedResourceView):
    @open_api_auth
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


class MaterialProjectsOauth2View(ProtectedResourceView):
    @open_api_auth
    def get(self, request, *args, **kwargs):
        return json_response([project.to_dict() for project in MaterialProject.objects.all()])


class DataEndpoint(ProtectedResourceView):
    @open_api_auth
    def get(self, request, *args, **kwargs):
        oid = kwargs['oid']
        try:
            data_meta = DataMeta.objects.get(pk=oid)
            template = Template.objects.get(pk=data_meta.template_id)
        except (DataMeta.DoesNotExist, Template.DoesNotExist):
            raise MGEError.NOT_FOUND

        template_dict = template_to_dict(template, False)
        data_dict = data_to_dict(data_meta, False)
        data_dict['template'] = template_dict
        try:
            source = DataUploadSourceMap.objects.get(meta_id=oid)
            data_dict['via'] = source.file.get_url() if source.file else ''
        except DataUploadSourceMap.DoesNotExist:
            pass
        return json_response(data_dict)

    @open_api_auth
    def post(self, request, *args, **kwargs):
        """
        oauth 方式提交完整数据，数据格式同上
        """
        data = load_request_body(request, dict)
        username = request.GET.get('username', None)
        if not request.user.is_anonymous:
            username = request.user.username
        if username is None:
            raise MGEError.BAD_PARAMETER('parameter `username` missing')
        dm = _submit_a_data(data, username)
        if dm.is_public:
            import_to_es.delay(dm.id)
        return json_response(dm.id, status_code=201)
