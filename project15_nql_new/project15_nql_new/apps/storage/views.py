from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import Http404, render
from django.core.handlers.wsgi import WSGIRequest
from django.views.decorators.http import require_GET
from mgedata.errors.models import MGEError
from apps.account.auth import require_role, ensure_privacy
from apps.analytics.tasks import on_view
from apps.storage.models.data import DataMeta, DataUploadSourceMap
from apps.storage.models.template import Template
from mgedata.utils.general import get_param
from apps.storage.doi.models import DoiRegisterState
from apps.storage.models.data import DoiRegisterInfo, DataScore
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import HttpRequest
from apps.storage.models.data import DataReviewState, UploadHistory, DisapproveReason

from apps.account.auth import is_the_same_user, UserRole, has_role
from apps.account.models.users import AdminMaterialCategory
from django.utils.translation import ugettext as _


@require_role(UserRole.TEMPLATE_UPLOADER, is_api=False)
@ensure_csrf_cookie
def add_template(request: WSGIRequest):
    # action = request.GET.get('action')
    # tid = request.GET.get('tid')
    # if action in ('view', 'modify', 'restricted'):
    #     try:
    #         t = Template.objects.get(pk=tid)
    #         ensure_privacy(request, t.user, is_api=False)
    #         if t.ref_count > 0:
    #             action = 'restricted'
    #     except Template.DoesNotExist:
    #         raise MGEError.NOT_FOUND
    return render(request, 'storage/template.html',
                  {'action': 'add'})


@require_role(UserRole.TEMPLATE_UPLOADER, is_api=False)
@ensure_csrf_cookie
def edit_template(request: WSGIRequest, tid):
    try:
        t = Template.objects.get(pk=tid)
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        ensure_privacy(request, t.user, is_api=False)
        if t.ref_count > 0:
            action = 'restricted'
        else:
            action = 'modify'
        return render(request, 'storage/template.html',
                      {'tid': tid,
                       'action': action})


@require_role(UserRole.TEMPLATE_ADMIN, is_api=False)
@require_GET
@ensure_csrf_cookie
def check_template(request: WSGIRequest, tid):
    try:
        Template.objects.get(pk=tid)
    except Template.DoesNotExist:
        raise Http404
    return render(request, 'storage/template_check.html',
                  {'tid': tid,
                   'action': 'check'})


@require_role(UserRole.DATA_UPLOADER, is_api=False)
@login_required
@ensure_csrf_cookie
def add_data(request: WSGIRequest):
    action = request.GET.get('action')  # `add` or `modify`
    did = request.GET.get('did')
    if action == 'modify':
        try:
            d = DataMeta.objects.get(pk=did)
            # if d.username != request.user.username:
            #     error = MGEError.PERMISSION_DENIED
            #     return error_page(error.error_message, error.error_message)
        except DataMeta.DoesNotExist:
            raise Http404
    return render(request, 'storage/add_data.html',
                  {'action': action,
                   'did': did})


@require_GET
@ensure_csrf_cookie
def show_data(request: WSGIRequest, did):
    try:
        d = DataMeta.objects.get(pk=did)

        can_review = False
        reasons = []
        if request.user.is_authenticated and d.pending and request.user.has_role(UserRole.DATA_ADMIN):
            if AdminMaterialCategory.objects.filter(user=request.user, category=d.category):
                can_review = True
                reasons = [{'value': x.value, 'text': _(x.to_string)} for x in DisapproveReason if
                           x != DisapproveReason.OTHER]
        context = dict(meta=d, can_review=can_review, reasons=reasons)
        try:
            source = DataUploadSourceMap.objects.get(meta_id=did)
            context['via'] = source.file.get_url() if source.file else None
        except DataUploadSourceMap.DoesNotExist:
            pass
        on_view(did)
        return render(request, 'storage/show_data.html',
                      context=context)
    except DataMeta.DoesNotExist:
        raise MGEError.NOT_FOUND


@require_GET
@ensure_csrf_cookie
def edit_data(request: WSGIRequest, did):
    try:
        data_meta = DataMeta.objects.get(pk=did)
        if data_meta.review_state != DataReviewState.APPROVED:
            if not is_the_same_user(request, data_meta.user) and not has_role(request.user, UserRole.DATA_ADMIN):
                raise MGEError.NOT_FOUND
        context = dict(meta=data_meta)
        return render(request, 'storage/edit_data.html',
                      context=context)
    except DataMeta.DoesNotExist:
        raise MGEError.NOT_FOUND


# @require_role(UserRole.VERIFIED, is_api=False)
@require_GET
@ensure_csrf_cookie
# @login_required
def export_data(request: WSGIRequest):
    return render(request, template_name='storage/export_data.html')


# @require_GET
# @ensure_csrf_cookie
# @login_required
# def register_doi(request: WSGIRequest):
#     data_ids = request.GET.get('ids')  # 数据的id列表
#     context = {}
#     context['data_ids'] = data_ids
#     return render(request, 'storage/register_doi.html', context=context)


@require_role(UserRole.DATA_UPLOADER | UserRole.ROOT, is_api=False)
@require_GET
@ensure_csrf_cookie
@login_required
def register_doi(request: WSGIRequest):
    return render(request, 'storage/register_doi.html')


@require_role(UserRole.DOI_ADMIN | UserRole.ROOT, is_api=False)
@require_GET
@ensure_csrf_cookie
@login_required
def show_doi_list(request: WSGIRequest):
    state = get_param('state')
    # Q 对象可以用于查询时 多个查询条件联合查询
    if state == 'unaudited':
        query = DoiRegisterInfo.objects.filter(status=DoiRegisterState.UNAUDITED)
    elif state == 'approved':
        query = DoiRegisterInfo.objects.filter(status=DoiRegisterState.APPROVED)
    elif state == 'notapproved':
        query = DoiRegisterInfo.objects.filter(status=DoiRegisterState.NOT_APPROVED)
    else:
        query = DoiRegisterInfo.objects.all()
        state = 'all'
    page = get_param('page')
    paginator = Paginator(query, 10)
    try:
        doi_application_list = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        doi_application_list = paginator.page(1)
        page = 1
    context = {}
    context['doi_application_list'] = doi_application_list
    context['state'] = state
    context['page_count'] = paginator.num_pages
    context['current_page'] = page
    return render(request, 'storage/doi_list.html', context=context)


@require_role(UserRole.DOI_ADMIN | UserRole.ROOT, is_api=False)
@require_GET
@ensure_csrf_cookie
@login_required
def show_doi_detail(request: WSGIRequest, did):
    try:
        doi_apply_info = DoiRegisterInfo.objects.get(id=did)
    except DoiRegisterInfo.DoesNotExist:
        raise Http404
    data_dids = doi_apply_info.data_ids

    page, page_count = get_param('page'), 10
    page = 1 if page is None else int(page)
    data_id_list = data_dids[(page - 1) * page_count: page * page_count]
    data_list = []
    for data_id in data_id_list:
        try:
            data = DataMeta.objects.get(id=data_id)
            data_list.append(data)
        except DataMeta.DoesNotExist:
            pass
    context = {}
    context['current_page'] = page
    context['page_count'] = page_count
    context['meta_list'] = data_list
    return render(request, 'storage/doi_data_detail.html', context=context)


@require_GET
@ensure_csrf_cookie
def doi_link(request, doi):
    """
    注册doi时将链接写入到链接中
    :param request:
    :param doi: 要链接的doi
    :return:
    """
    # 1. 进行全表扫描 2. 查询所有的申请信息
    data_objects = DataMeta.objects.filter(doi=doi)
    if data_objects.count() == 0:
        raise Http404
    page = get_param('page')
    paginator = Paginator(data_objects, 10)
    try:
        data_list = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        data_list = paginator.page(1)
        page = 1
    context = {}
    context['current_page'] = page
    context['page_count'] = paginator.num_pages
    context['meta_list'] = data_list
    return render(request, 'storage/doi_data_detail.html', context=context)


@require_role(UserRole.DATA_ADMIN, is_api=False)
def review_data(request: HttpRequest, state: str = "pending", page: int = 1):
    categories = [x['category_id'] for x in
                  AdminMaterialCategory.objects.filter(user=request.user).values('category_id')]
    q = {'category_id__in': categories}
    try:
        q['review_state'] = DataReviewState[state.upper()].value
    except KeyError:
        if state != 'all':
            raise MGEError.NOT_FOUND
    paginator = Paginator(UploadHistory.objects.filter(**q).exclude(user=request.user), 10)
    try:
        histories = paginator.page(page)
    except EmptyPage:
        raise MGEError.NOT_FOUND
    else:
        reasons = [{'value': x.value, 'text': _(x.to_string)} for x in DisapproveReason if x != DisapproveReason.OTHER]
        return render(request, template_name='storage/review_data.html',
                      context={'history_list': histories, 'page_count': paginator.num_pages,
                               'current_page': page, 'state': state, 'reasons': reasons})


@require_role(UserRole.TEMPLATE_ADMIN, is_api=False)
@ensure_csrf_cookie
def show_template_review(request: WSGIRequest, page, state):
    """
    :param request:
    :param page: 第几页
    :param state: 0代表未审核模版 1代表审核过的模版 2代表所有模版
    :return:

    """

    categories = [x['category_id'] for x in
                  AdminMaterialCategory.objects.filter(user=request.user).values('category_id')]
    page_contains = 10
    if state == 0:
        pending_list = Template.objects.filter(review_state=0, category_id__in=categories).select_related('user',
                                                                                                          'category')
        paginator = Paginator(pending_list, page_contains)
    elif state == 1:
        pending_list = Template.objects.filter(review_state=1, category_id__in=categories).select_related('user',
                                                                                                          'category')
        paginator = Paginator(pending_list, page_contains)
    elif state == 2:
        pending_list = Template.objects.filter(review_state=2, category_id__in=categories).select_related('user',
                                                                                                          'category')
        paginator = Paginator(pending_list, page_contains)
    elif state == 3:
        pending_list = Template.objects.filter(category_id__in=categories).select_related('user', 'category')
        paginator = Paginator(pending_list, page_contains)
    else:
        raise MGEError.BAD_PARAMETER
    try:
        res = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        res = paginator.page(1)

    reasons = [{'value': x.value, 'text': _(x.to_string)} for x in
               (DisapproveReason.META_MISSING, DisapproveReason.OTHER)]
    return render(request, 'storage/show_template_review.html',
                  {'data': res, 'page': page, 'pages': paginator.num_pages, 'state': state,
                   'reasons': reasons})


@require_GET
@login_required
@ensure_csrf_cookie
def data_score(request):
    data_id = request.GET.get('did', 1)
    try:
        data = DataMeta.objects.get(id=data_id)
        score_number = DataScore.objects.filter(data_id=data_id).count()  # 共有多少人进行了评分
        context = {}
        context['data_id'] = data.id
        context['total_number'] = score_number
        context['current_score'] = data.score
        return render(request, 'storage/data_score.html', context=context)
    except DataMeta.DoesNotExist:
        raise Http404
    except DataScore.DoesNotExist:
        raise Http404
