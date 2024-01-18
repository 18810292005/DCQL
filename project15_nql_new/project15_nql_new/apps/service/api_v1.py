from datetime import timedelta

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.forms import model_to_dict
from django.http import HttpRequest
from django.db.models import Q, Sum
from mgedata.errors.models import MGEError
from mgedata.utils.general import get_json_field_r
from mgedata.utils.general import require_methods_api, json_response, get_param
from apps.service.models import DatabaseContribution, FrontendStaticInfo, SearchRecord, VisitDataRecord
from apps.service.models import VisitRecord
from apps.account.models.users import UserRole
from apps.storage.models import MaterialCategory


@require_methods_api(['GET'])
def online_user_counts(request):
    t = get_param('delta', allow_none=True, convert_to=int)
    if t is None:
        counts = VisitRecord.get_user_activities().count()
    elif t == -1:
        counts = VisitRecord.objects.all().count()
    else:
        counts = VisitRecord.get_user_activities(timedelta(minutes=t)).count()
    return json_response({
        'counts': counts
    })


@require_methods_api(['GET'])
def user_visits(request):
    total_visits = VisitRecord.objects.all().aggregate(Sum("views"))["views__sum"]
    return json_response({
        'counts': total_visits
    })


@require_methods_api(['GET', 'POST'])
def contribution(request: HttpRequest, category_id: int):
    """
    数据库贡献表api
    """
    try:
        category = MaterialCategory.public_objects.get(id=category_id)
    except MaterialCategory.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        db_contribution = DatabaseContribution.objects.filter(category=category).first()
        if db_contribution is None:
            DatabaseContribution.objects.create(category=category).save()
            db_contribution = DatabaseContribution.objects.filter(category=category).first()
        if request.method == 'POST':
            if request.user.is_anonymous:
                raise MGEError.PERMISSION_DENIED
            if not request.user.has_role(UserRole.USER_ADMIN):
                raise MGEError.PERMISSION_DENIED
            field_list = DatabaseContribution.filed_list()
            update_field_list = []
            for field_name in field_list:
                field_value = get_json_field_r(request, field_name, allow_none=True)
                if field_value:
                    setattr(db_contribution, field_name, field_value)
                    update_field_list.append(field_name)
            db_contribution.save(update_fields=update_field_list)
        return json_response(data=db_contribution.to_dict())


@require_methods_api(['GET'])
def main_category(request: HttpRequest):
    """
    获取平台介绍大分类【'平台总体介绍','数据库'...】
    """
    main_categories = MaterialCategory.raw_objects.filter(level=1, hidden=True, public=True)  # 总体分类介绍level为1且被隐藏
    response = []
    for main_category in main_categories:
        dict = {'id': main_category.id, 'name_zh': main_category.name_zh, 'name_en': main_category.name_en}
        response.append(dict)
    return json_response(data=response)


@require_methods_api(['GET'])
def get_frontend(request: HttpRequest):
    name = get_param('name', allow_none=False, convert_to=str)
    try:
        fs = FrontendStaticInfo.objects.get(name=name, is_delete=False)
        ret = model_to_dict(fs, exclude='file')
        ret['file'] = fs.get_url()
        return json_response(ret)

    except FrontendStaticInfo.DoesNotExist:
        raise MGEError.NOT_FOUND(f"静态文件\"{name}\"未找到.")


@require_methods_api(['GET'])
def search_record(request: HttpRequest):
    """
    获取用户搜索记录
    """
    page = get_param('page', convert_to=int, allow_none=True, default=1)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=10)
    q = Q()
    paginator = Paginator(SearchRecord.objects.filter(q).order_by('search_time'), page_size)
    try:
        result_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        result_page = paginator.page(1)
        page = 1
    result = [instance.to_dict() for instance in result_page]

    content = {'result': result, 'page_count': paginator.num_pages, 'page': page, 'page_size': page_size}
    return json_response(content)


@require_methods_api(['GET'])
def visit_data_record(request: HttpRequest):
    """
    获取用户访问记录
    """
    page = get_param('page', convert_to=int, allow_none=True, default=1)
    page_size = get_param('page_size', convert_to=int, allow_none=True, default=10)
    q = Q()
    paginator = Paginator(VisitDataRecord.objects.filter(q).order_by('visit_time'), page_size)
    try:
        result_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        result_page = paginator.page(1)
        page = 1
    result = [instance.to_dict() for instance in result_page]

    content = {'result': result, 'page_count': paginator.num_pages, 'page': page, 'page_size': page_size}
    return json_response(content)