from django.shortcuts import render
from django.views.decorators.http import require_http_methods, require_GET
from apps.storage.models.file import DataContentImage, ImageUsage
import os
from django.core.files.base import ContentFile
from apps.storage.models.file import TemporaryUploadedFile
from .utils.sift_delivery.main import search_img, init
from mgedata.settings import MEDIA_ROOT
import logging

logger = logging.getLogger('django')

'''
图像检索以图搜图
首先get得到用户上传的图片信息，调用miweb匹配算法搜索MiWebImgFeaturePoint表格，搜索出前100张最相似的图片，得到图片id
根据图片id搜索 DataContentImage 表格获得图片url
同时根据图片id搜索ImageUsage 表格获得DataMeta_id
最后根据DataMeta id搜索DataMeta表格获得相应数据项
以上三个操作根据三表联查实现
需要注意的是一张图片可能对应多个数据项，为多对多查询
最后放回json
'''


@require_GET
def index(request):
    return render(request, template_name='search/results.html')


# @require_http_methods(['GET', 'POST'])
# def image_search(request):
#     context = dict()
#     per_page = 10
#     context['total'] = 0
#     context['meta_list'] = []
#     context['page_count'] = 0
#     context['current_page'] = 1
#     page = request.POST.get('page', 1)
#     # sort_by_string = request.POST.get('sort')
#     # if sort_by_string:
#     #     try:
#     #         sort_by = QuerySortField(sort_by_string)
#     #     except ValueError:
#     #         sort_by = None
#     # else:
#     #     sort_by = None
#     # ascending = request.POST.get('order') == 'asc'
#     image_ids = []
#     meta_list = []
#     image = request.FILES.get('image')
#     if image is not None:
#         hasher = md5()
#         while True:
#             b = image.read(8096)
#             if not b:
#                 break
#             hasher.update(b)
#         image.seek(0)
#         hashed = hasher.hexdigest()
#         image_ids = get_cache(hashed)
#         if image_ids is None:
#             src = Image.open(image)
#             img = np.asarray(src)
#             query_image = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
#             compare_results = com(query_image, featureName="sift")
#             image_ids = []
#             for result in compare_results:
#                 image_object = result[1]
#                 image_ids.append(image_object)
#         #
#         # if sort_by:
#         #     res = ImageUsage.objects.filter(file_id__in=image_ids).select_related('meta', 'file')
#         #     res = res.order_by(('' if ascending else '-') + 'meta__' + sort_by.sql_name)
#         # else:
#         #     clauses = ' '.join(['WHEN file_id=%s THEN %s' % (pk, i) for i, pk in enumerate(image_ids)])
#         #     ordering = 'CASE %s END' % clauses
#         #     res = ImageUsage.objects.filter(file_id__in=image_ids).extra(
#         #         select={'ordering': ordering}, order_by=('ordering',)).select_related('meta', 'file')
#         clauses = ' '.join(['WHEN file_id=%s THEN %s' % (pk, i) for i, pk in enumerate(image_ids)])
#         ordering = 'CASE %s END' % clauses
#         res = ImageUsage.objects.filter(file_id__in=image_ids).extra(
#             select={'ordering': ordering}, order_by=('ordering',)).select_related('meta', 'file')
#
#         paginator = Paginator(res, per_page)
#         try:
#             result_page = paginator.page(page)
#         except (EmptyPage, PageNotAnInteger):
#             result_page = paginator.page(1)
#
#         meta_list = []
#         for image_usage in result_page:
#             meta = dict()
#             meta['image_url'] = image_usage.file.get_url()
#             meta['meta_data'] = image_usage.meta.to_dict()
#             meta_list.append(meta)
#
#     context['total'] = len(image_ids)
#     context['page_count'] = int(len(image_ids) / per_page) + 1
#     context['current_page'] = page
#     context['meta_list'] = meta_list
#     # context['sort_by'] = None if sort_by is None else sort_by.value
#     # context['sort_order'] = 'asc' if ascending else 'desc'
#     return render(request, 'image_search/results.html', context=context)\
# @require_http_methods(['GET', 'POST'])

@require_http_methods(['GET', 'POST'])
def image_search(request):
    """
    新的图片检索，希望以后可以修改为api
    :param request:
    :return:
    """
    context = dict()
    per_page = 10
    context['total'] = 0
    context['meta_list'] = []
    context['page_count'] = 0
    context['current_page'] = 1
    try:
        # test= request.POST['g']
        page = int(request.POST.get('page', 1))
        image = request.FILES.get('image', None)
        if image is not None:  # 暂时不用缓存
            # 先把图片暂存，因为检索算法要用到url
            cf = ContentFile(image.read())
            uploaded = TemporaryUploadedFile.add(fp=cf, filename=image.name)
            uploaded.save()
            # 使用新算法
            d, url_list = search_img(init(), os.path.join(MEDIA_ROOT, str(uploaded.file)), 6, 10)  # 10个结果可以关联到很多数据了
            relative_url_list = []
            for url in url_list:
                relative_url = '_fs' + url.split('_fs')[-1]
                relative_url_list.append(relative_url)
            dataContentImageList = DataContentImage.objects.filter(file__in=relative_url_list)
            imageUsageList = ImageUsage.objects.filter(file__in=dataContentImageList)
            meta_list = []
            for iul in imageUsageList[page * per_page - per_page: min(page * per_page, len(imageUsageList))]:  # 加快速度
                meta = {'image_url': iul.file.get_url(), 'meta_data': iul.meta.to_dict()}
                meta_list.append(meta)
            # meta_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            context['total'] = len(imageUsageList)
            context['page_count'] = int(len(imageUsageList) / per_page) + 1
            context['current_page'] = page
            context['meta_list'] = meta_list
    except Exception as e:
        logger.error('image_search_error:{}'.format(e))
    return render(request, 'image_search/results.html', context=context)
    # from django.http import JsonResponse
    # return JsonResponse({
    #     'm': context
    # })
