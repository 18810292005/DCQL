# 缺陷服务API对接
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from apps.storage.models import Template, DataMeta
from apps.storage.models.template import TemplateFieldEnum
from apps.storage.utils.serializers.json import JSONFieldSerializer
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, get_param, require_GET_api


@require_GET_api
def get_templates(request):
    """
    获取用户xuke_ustb创建的所有模版
    Returns:
        template_list:List template部分信息
        count:int 模版总数
    """
    templates = Template.objects.filter(user__username='xuke_ustb')
    template_list = []
    for template in templates:
        template_dict = {'id': template.id, 'title': template.title, 'category': template.category.name,
                         'abstract': template.abstract}
        template_list.append(template_dict)
    return json_response(data={'template_list': template_list, 'count': len(template_list)})


@require_GET_api
def get_data_with_images(request):
    """
    获取用户xuke_ustb的某个模版(template_id)的元数据信息
    与此模版下所有图像url,用于缺陷检测服务
    Args:
        template_id:int 必填,模版id
        page:int 页数
        page_size:int 页面大小
    Returns:
        results:Dict 数据详情
            'data_meta' : Dict 元数据信息
            'images' : Dict 图像信息,具体key/value不确定
                `field_path_str`: `values`
        page:int 页数
        page_size:int 页面大小
        page_count:int 总页数
        data_count:数据总量
    """
    template_id = get_param('template_id', allow_none=False, convert_to=int)
    page = get_param('page', convert_to=int, default=1)
    page_size = get_param('page_size', convert_to=int, default=10)
    serializer = JSONFieldSerializer(to_url=True, absolute_file_path=True)
    results = []
    try:
        template = Template.objects.filter(user__username='xuke_ustb').get(id=template_id)
        paginator = Paginator(DataMeta.objects.filter(template=template), page_size)
        try:
            data_metas = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            data_metas = paginator.page(1)
            page = 1

        for data_meta in data_metas:
            data_meta_with_images = {'data_meta': data_meta.to_dict(),
                                     'images': serializer.get_spec_field_type_values(data_meta,
                                                                                     TemplateFieldEnum.IMAGE)}
            results.append(data_meta_with_images)
        return json_response(
            data={'results': results, 'page': page, 'page_size': page_size, 'page_count': paginator.num_pages,
                  'data_count': paginator.count})
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND(f"模板{template_id}不存在")
