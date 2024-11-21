from functools import partial

from django.db.models import Q
from django.http import HttpRequest, JsonResponse

from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.storage.models import DataMeta, Template
from apps.storage.models.data import DataReviewState, DataVisibility
from apps.storage.models.material import ProjectSubjectMember
from mgedata.errors.models import MGEError
from mgedata.utils.general import get_page_info, get_param, require_methods_api, load_request_body, \
    get_field, json_response
from mgedata.utils.pagination import MyPaginator


@require_methods_api(['GET'])
@require_role(UserRole.DATA_ADMIN)
def review_data_list(request: HttpRequest):
    page, page_size = get_page_info(request)
    state = get_param('review_state', convert_to=int)
    title_or_abstract = get_param('title_or_abstract', convert_to=str, allow_none=True)
    try:
        state = DataReviewState(state)
    except ValueError:
        state = None
    q1 = Q(
        subject_id__in=ProjectSubjectMember.objects.filter(user=request.user, subject__isnull=False).values_list(
            'subject_id', flat=True
        )
    )
    q2 = Q(
        project_id__in=ProjectSubjectMember.objects.filter(user=request.user, subject__isnull=True).values_list(
            'project_id', flat=True
        )
    )
    q = q1 | q2
    q &= ~Q(visibility=DataVisibility.PRIVATE)
    if state is not None:
        q &= Q(review_state=state)
    if title_or_abstract is not None:
        q &= Q(title__icontains=title_or_abstract) | Q(abstract__icontains=title_or_abstract)
    queryset = DataMeta.objects.filter(q).select_related('project', 'subject', 'reviewer', 'user')
    if state in (DataReviewState.APPROVED, DataReviewState.DISAPPROVED):
        sort_key = '-review_time'
    else:
        sort_key = '-add_time'
    queryset = queryset.order_by(sort_key)
    paginator = MyPaginator(queryset, page_size)
    res = []
    meta: DataMeta
    for meta in paginator.page(page):
        res.append(
            {
                'title': meta.title,
                'id': meta.id,
                'batch_id': meta.batch_upload_history_id,
                'review_state': meta.review_state,
                'reviewer': meta.reviewer_id,
                'review_time': meta.review_time,
                'reviewer_real_name': meta.reviewer.real_name if meta.reviewer else None,
                'real_name': meta.user.real_name,
                'time': meta.add_time,
                'project_name': meta.project.name,
                'subject_name': meta.subject.name,
                'project_id': meta.project_id,
                'subject_id': meta.subject_id,
                'abstract': meta.abstract,
                'visibility': meta.visibility,
                'disapprove_reason': meta.disapprove_reason,
            }
        )
    return JsonResponse({
        'results': res,
        'count': paginator.count,
        'page_size': paginator.per_page,
    })


@require_methods_api(['PATCH'])
@require_role(UserRole.DATA_ADMIN)
def review_data(request: HttpRequest, meta_id):
    meta = DataMeta.objects.filter(pk=meta_id).first()
    if not meta:
        raise MGEError.NOT_FOUND
    if meta.review_state != DataReviewState.PENDING:
        raise MGEError.PERMISSION_DENIED
    body = load_request_body(request)
    approved = get_field(body, 'approved', bool)
    approve_same_batch = get_field(body, 'approve_same_batch', bool)
    if not approved:
        reason = get_field(body, 'reason', str)
        func = partial(DataMeta.batch_disapprove, reason=reason)
    else:
        func = DataMeta.batch_approve
    if approve_same_batch:
        meta_ids = list(DataMeta.objects.filter(
            batch_upload_history_id=meta.batch_upload_history_id
        ).values_list('id', flat=True))
    else:
        meta_ids = [meta_id]
    func(meta_ids, reviewer=request.user)

    return json_response()


@require_methods_api(['PATCH'])
@require_role(UserRole.DATA_ADMIN)
def batch_review_data(request: HttpRequest):
    body = load_request_body(request)
    approved = get_field(body, 'approved', bool)
    meta_id_list = get_field(body, 'meta_id_list', list)
    if not approved:
        reason = get_field(body, 'reason', str)
        DataMeta.batch_disapprove(meta_id_list, reviewer=request.user, reason=reason)
    else:
        DataMeta.batch_approve(meta_id_list, reviewer=request.user)

    return json_response()


@require_methods_api(['GET'])
@require_role(UserRole.DATA_ADMIN)
def review_template_list(request: HttpRequest):
    page, page_size = get_page_info(request)
    title = get_param('title', allow_none=True)
    category_id = get_param('category_id', convert_to=int, allow_none=True)
    state = get_param('review_state', convert_to=int, allow_none=True)
    title_or_abstract = get_param('title_or_abstract', convert_to=str, allow_none=True)
    q = Q(published=True)
    if title is not None:
        q &= Q(title__icontains=title)
    if category_id is not None:
        q &= Q(category_id=category_id)
    if title_or_abstract is not None:
        q &= Q(title__icontains=title_or_abstract) | Q(abstract__icontains=title_or_abstract)
    try:
        state = DataReviewState(state)
    except ValueError:
        state = None
    if state is not None:
        q &= Q(review_state=state)
    queryset = Template.objects.filter(q).select_related('category', 'reviewer', 'user')
    queryset = queryset.filter(
        Q(public=True) |
        Q(reviewer__username=request.user.username)
    )
    paginator = MyPaginator(queryset, page_size)
    res = []
    template: Template
    for template in paginator.page(page):
        res.append(
            {
                'title': template.title,
                'id': template.id,
                'review_state': template.review_state,
                'reviewer': template.reviewer_id,
                'reviewer_real_name': template.reviewer.real_name if template.reviewer else None,
                'real_name': template.user.real_name,
                'pub_date': template.pub_date,
                'abstract': template.abstract,
                'disapprove_reason': template.disapprove_reason,
                'category_name': template.category.name,
                'public': template.public,
            }
        )
    return json_response({
        'results': res,
        'count': paginator.count,
        'page_size': paginator.per_page,
    })


@require_methods_api(['PATCH'])
@require_role(UserRole.DATA_ADMIN)
def review_template(request: HttpRequest, tid):
    template = Template.objects.filter(pk=tid).first()
    if not template:
        raise MGEError.NOT_FOUND
    if template.review_state != DataReviewState.PENDING:
        raise MGEError.PERMISSION_DENIED
    body = load_request_body(request)
    approved = get_field(body, 'approved', bool)
    if not approved:
        reason = get_field(body, 'reason', str)
        template.disapprove(reviewer=request.user, reasons=[], reason=reason)
    else:
        template.approve(reviewer=request.user)
    return json_response()


@require_methods_api(['PATCH'])
@require_role(UserRole.DATA_ADMIN)
def batch_review_template(request: HttpRequest):
    body = load_request_body(request)
    tids = get_field(body, 'tids', list)
    approved = get_field(body, 'approved', bool)
    for tid in tids:
        template = Template.objects.filter(pk=tid).first()
        if not template:
            raise MGEError.NOT_FOUND
        if template.review_state != DataReviewState.PENDING:
            raise MGEError.PERMISSION_DENIED
    for tid in tids:
        template = Template.objects.filter(pk=tid).first()
        if not approved:
            reason = get_field(body, 'reason', str)
            template.disapprove(reviewer=request.user, reasons=[], reason=reason)
        else:
            template.approve(reviewer=request.user)
    return json_response()
