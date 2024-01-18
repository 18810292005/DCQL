import json
import logging

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import transaction
from django.http import HttpResponse, HttpRequest
from django.views import View

from apps.account.auth import login_required_api
from apps.account.models.users import UserRole
from apps.storage.models.data import DataSet, DataMeta, ArticleReference
from apps.storage.models.data import DoiRegisterInfo, DoiRegisterState
from mgedata.utils.general import check_role, require_methods_api, get_param
from mgedata.utils.general import json_response, get_json_field_r, MGEError

logger = logging.getLogger('django')


@login_required_api
@require_methods_api(['POST', 'GET', 'PATCH', 'DELETE'])
def dataset_api(request, id=None):
    if request.method == 'POST':
        try:
            contributor = get_json_field_r(request, field='contributor', required_type=str)
            title = get_json_field_r(request, field='title', required_type=str)
            project = get_json_field_r(request, field='project', required_type=str)
            data_ids = get_json_field_r(request, field='data_ids', required_type=list)

            queryset = DataMeta.objects.filter(id__in=data_ids).filter(user=request.user)
            if queryset.count() == 0:
                raise MGEError.BAD_DATA("数据集中数据不能为空")
            with transaction.atomic():
                dataset = DataSet(contributor=contributor, title=title, project=project, user=request.user)
                dataset.save()
                for data_meta in queryset:
                    if data_meta.dataset is not None:
                        raise MGEError.DATASET_ALREADY_EXISTS(
                            f"数据id为\"{data_meta.id}\"的数据存在于数据集\"{data_meta.dataset.title}\"中")
                    data_meta.dataset = dataset
                    data_meta.save()
        except Exception as e:
            logger.error('dataset_post:{}'.format(e))
            raise MGEError.BAD_DATA(str(e))
        return json_response({'id': dataset.pk})
    elif request.method == 'GET':
        if id is not None:
            try:
                dataset = DataSet.objects.get(pk=id)
                if dataset.user != request.user:
                    return HttpResponse(status=403)
                content = dataset.to_dict()
                content['username'] = content['user_id']
                del content['user_id']
                datas = DataMeta.objects.filter(dataset=dataset)
                if len(datas) > 0:
                    doi = datas[0].doi
                    content['doi'] = doi
                data_ids = []
                for d in datas:
                    data_ids.append(d.pk)
                # 分页
                page_size = request.GET.get('page_size', 10)
                paginator = Paginator(data_ids, page_size)  # 每页显示10条
                page = request.GET.get('page', 1)  # 默认第1页
                try:
                    contacts = paginator.page(page)
                except PageNotAnInteger:
                    # 如果请求的页数不是整数，返回第一页。
                    contacts = paginator.page(1)
                except EmptyPage:
                    # 如果请求的页数不在合法的页数范围内，返回结果的最后一页。
                    contacts = paginator.page(paginator.num_pages)
                content['data_ids'] = contacts.object_list
                content['page'] = contacts.number
                content['page_size'] = page_size
                content['total'] = paginator.count
            except Exception as e:
                logger.error('dataset_get:{}'.format(e))
                raise MGEError.BAD_DATA(str(e))
            return json_response(data=content)
        else:
            queryset = DataSet.objects.filter(user=request.user)
            page_size = request.GET.get('page_size', 10)
            paginator = Paginator(queryset, page_size)  # 每页显示10条
            page = request.GET.get('page', 1)  # 默认第1页
            try:
                contacts = paginator.page(page)
            except PageNotAnInteger:
                # 如果请求的页数不是整数，返回第一页。
                contacts = paginator.page(1)
            except EmptyPage:
                # 如果请求的页数不在合法的页数范围内，返回结果的最后一页。
                contacts = paginator.page(paginator.num_pages)
            return json_response(data={
                'results': [ins.to_dict() for ins in contacts],
                'page': contacts.number,
                'page_size': page_size,
                'total': paginator.count
            })
    elif request.method == 'PATCH':
        try:
            body = json.loads(request.body).copy()
            body['user'] = request.user
            dataset = DataSet.objects.get(pk=id)
            dataset.update(body)
        except Exception as e:
            logger.error('dataset_patch:{}'.format(e))
            raise MGEError.BAD_DATA(str(e))
        return json_response()
    elif request.method == 'DELETE':
        try:
            dataset = DataSet.objects.get(pk=id)
            if dataset.user != request.user:
                return HttpResponse(status=403)
            dataset.delete()
        except Exception as e:
            logger.error('dataset_delete:{}'.format(e))
            raise MGEError.BAD_DATA(str(e))
        return json_response()


# 数据集doi审核
class DatasetDoiReview(View):

    def get(self, request: HttpRequest):
        check_role(request, UserRole.DOI_ADMIN)
        try:
            state = request.GET.get('state')
            if state and state.isdigit():
                state = int(state)
            if state and state in DoiRegisterState._value2member_map_:
                doi_register_info_list = DoiRegisterInfo.objects.filter(status=state)
            else:
                doi_register_info_list = DoiRegisterInfo.objects.all()
            page_size = request.GET.get('page_size', 10)
            paginator = Paginator(doi_register_info_list, page_size)  # 每页显示10条
            page = request.GET.get('page', 1)  # 默认第1页
            try:
                contacts = paginator.page(page)
            except PageNotAnInteger:
                # 如果请求的页数不是整数，返回第一页。
                contacts = paginator.page(1)
            except EmptyPage:
                # 如果请求的页数不在合法的页数范围内，返回结果的最后一页。
                contacts = paginator.page(paginator.num_pages)
            return json_response(data={
                'results': [ins.to_dict() for ins in contacts],
                'page': contacts.number,
                'page_size': page_size,
                'total': paginator.count
            })
        except Exception as e:
            raise MGEError.BAD_DATA(str(e))


class DatasetReference(View):

    def get(self, request: HttpRequest):
        """
            获取某篇文章的所有引用数据集
        """
        article_doi = get_param('article_doi', allow_none=True)
        dataset_id = get_param('dataset_id', allow_none=True)
        page_size = get_param('page_size', allow_none=True, convert_to=int, default=10)
        page = get_param('page', allow_none=True, convert_to=int, default=1)
        try:
            if article_doi is not None:
                article = ArticleReference.objects.get(doi=article_doi)
                dataset_queryset = article.dataset_set.all()
            elif dataset_id is not None:
                dataset = DataSet.objects.get(id=dataset_id)
                dataset_queryset = dataset.article_ref.all()
            else:
                return json_response()
            paginator = Paginator(dataset_queryset, page_size)
            try:
                contacts = paginator.page(page)
            except PageNotAnInteger:
                # 如果请求的页数不是整数，返回第一页。
                contacts = paginator.page(1)
            except EmptyPage:
                # 如果请求的页数不在合法的页数范围内，返回结果的最后一页。
                contacts = paginator.page(paginator.num_pages)
            return json_response(data={
                'results': [ins.to_dict() for ins in contacts],
                'page': contacts.number,
                'page_size': page_size,
                'total': paginator.count
            })
        except (ArticleReference.DoesNotExist, DataSet.DoesNotExist):
            return json_response(data={"results": []})
        except Exception as e:
            raise MGEError.BAD_DATA(str(e))

    def post(self, request: HttpRequest):
        """
            数据集的引用。申请对某一个数据集ids列表的引用
        """
        title = get_json_field_r(request, field='article_title', required_type=str)
        author = get_json_field_r(request, field='article_author', required_type=str)
        abstract = get_json_field_r(request, field='article_abstract', required_type=str)
        doi = get_json_field_r(request, field='article_doi', required_type=str)
        article_url = get_json_field_r(request, field='article_url', required_type=str)
        dataset_id_list = get_json_field_r(request, field='dataset_id', required_type=list)

        dataset_queryset = DataSet.objects.filter(pk__in=list(set(dataset_id_list))).all()

        article, created = ArticleReference.objects.get_or_create(
            doi=doi,
            defaults={"title": title, "author": author, "abstract": abstract, "article_url": article_url},
        )
        id_list = []
        for dataset in dataset_queryset:
            dataset.article_ref.add(article)
            id_list.append(dataset.id)
        return json_response(data={
            "article_doi": article.doi,
            "dataset_ids": id_list
        })

    def delete(self, request: HttpRequest):
        """
        删除多对多关系，如引用错了
        """
        article_doi = get_json_field_r(request, field='article_doi', required_type=str)
        dataset_id_list = get_json_field_r(request, field='dataset_id', required_type=list)

        article = ArticleReference.objects.filter(doi=article_doi).first()
        if not article:
            raise MGEError.BAD_DOI

        dataset_queryset = DataSet.objects.filter(pk__in=dataset_id_list).all()
        for dataset in dataset_queryset:
            dataset.article_ref.remove(article)
        return json_response()
