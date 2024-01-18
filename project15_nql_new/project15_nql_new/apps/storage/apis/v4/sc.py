import random

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from apps.account.models.users import UserRole
from apps.storage.apis.v4.key_tools.tools import KeyHelper
from apps.storage.models import MaterialCategory, Template, DataMeta
from apps.storage.models.file import FileContentType
from apps.storage.utils.data_import_export import export_data

from mgedata.errors.models import MGEError
from mgedata.utils.general import require_GET_api, get_param, json_response

import numpy as np


@require_GET_api
@login_required
def sc_bulk_export(request):
    """
    批量导出json文档，当同时传入分类和模版名称时，只导出模版下的json数据
    当导出当模版下不存在数据时不导出，并记录到 no_data_template
    Args:
         cateogry_name : 分类名称
         template_name : 模版名称
         data_count    : 导出数据量
         random        : 是否随机导出
    Returns:
         task_ids: list   :数据导出任务id列表
         no_data_template :不存在数据的模版标题
    """
    category_name = get_param('category_name', allow_none=True, convert_to=str)
    template_name = get_param('template_name', allow_none=True, convert_to=str)
    data_count = get_param('data_count', allow_none=True, convert_to=int, default=1000)
    is_random = get_param('random', allow_none=True, convert_to=bool, default=False)
    if data_count < 0:
        raise MGEError.BAD_PARAMETER('参数data_count不能小于0')
    user = request.user
    if not (KeyHelper.checkout_sc_user(user.username) or request.user.has_role(UserRole.ROOT)):
        return HttpResponse(status=403)
    if category_name is None and template_name is None:
        raise MGEError.NOT_FOUND("参数不能为空")
    try:
        task_ids = []
        no_data_template = []
        templates = []
        if template_name is not None:
            templates.append(Template.objects.get(title=template_name))
        else:
            parent_category = MaterialCategory.objects.get(name_zh=category_name)
            if parent_category.leaf:
                templates = Template.objects.filter(category=parent_category)
            else:
                leaves_category = parent_category.get_category_leaves()
                templates = Template.objects.filter(category__in=leaves_category)
        for template in templates:
            queryset = DataMeta.objects.filter(is_public=True).filter(template=template)
            total_count = queryset.count()
            if data_count < total_count:
                if is_random:
                    random_index = sorted(random.sample(range(0, total_count), data_count))
                    meta_ids = list(np.array(list(queryset.values_list('id', flat=True)))[random_index])
                    queryset = queryset.filter(id__in=meta_ids)
                else:
                    queryset = queryset[:data_count]
            if queryset.count() == 0:
                no_data_template.append(template.title)
            else:
                task_id = export_data(user, meta_or_list=queryset, file_format=FileContentType.JSON,
                                      no_attachments=True).id
                task_ids.append(task_id)

        return json_response(data={'task_ids': task_ids, 'no_data_template': no_data_template})
    except MaterialCategory.DoesNotExist:
        raise MGEError.NOT_FOUND("分类\"{}\"不存在".format(category_name))
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND("模版\"{}\"不存在".format(template_name))
