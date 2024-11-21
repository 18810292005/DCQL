from django.db import transaction
from django.db.models import Q, Count
from django.http import HttpRequest

from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.search.core_v2.es import delete_meta_with_ids
from apps.storage.models import DataMeta, Template, TemplateDataStatistic
from apps.storage.models.data import DataReviewState
from mgedata.errors.models import MGEError
from mgedata.utils.general import get_page_info, get_param, require_methods_api, json_response, load_request_body, \
    get_field
from mgedata.utils.pagination import MyPaginator


@require_methods_api(['GET'])
@require_role(UserRole.RESEARCHER)
def my_data_list(request: HttpRequest):
    page, page_size = get_page_info(request)
    state = get_param('review_state', convert_to=int)
    try:
        state = DataReviewState(state)
    except ValueError:
        state = None
    project_id = get_param('project_id', allow_none=True)
    subject_id = get_param('subject_id', convert_to=int, allow_none=True)
    category_id = get_param('category_id', convert_to=int, allow_none=True)
    template_id = get_param('template_id', convert_to=int, allow_none=True)
    title = get_param('title', allow_none=True)
    abstract = get_param('abstract', allow_none=True)
    visibility = get_param('visibility', allow_none=True)
    q = Q(user=request.user)
    if state is not None:
        q &= Q(review_state=state)
    if project_id is not None:
        q &= Q(project_id=str(project_id))
    if subject_id is not None:
        q &= Q(subject_id=str(subject_id))
    if category_id is not None:
        q &= Q(category_id=str(category_id))
    if template_id is not None:
        q &= Q(template_id=str(template_id))
    if title is not None:
        q &= Q(title__icontains=title)
    if abstract is not None:
        q &= Q(abstract__icontains=abstract)
    if visibility is not None:
        q &= Q(visibility=visibility)
    queryset = DataMeta.objects.filter(q)
    paginator = MyPaginator(queryset, page_size)
    res = []
    meta: DataMeta
    for meta in paginator.page(page):
        res.append(
            {
                'batch_id': meta.batch_upload_history_id,
                'title': meta.title,
                'id': meta.id,
                'review_state': meta.review_state,
                'reviewer': meta.reviewer_id,
                'reviewer_real_name': meta.reviewer.real_name if meta.reviewer else None,
                'real_name': meta.user.real_name,
                'time': meta.add_time,
                'project_name': meta.project.name,
                'subject_name': meta.subject.name,
                'template_id': meta.template.id,
                'template_title': meta.template.title,
                'project_id': meta.project_id,
                'subject_id': meta.subject_id,
                'visibility': meta.visibility,
                'abstract': meta.abstract,
                'disapprove_reason': meta.disapprove_reason,
            }
        )
    return json_response({
        'results': res,
        'page': page,
        'page_size': paginator.per_page,
        'total': paginator.count,
    })


@require_methods_api(['GET'])
@require_role(UserRole.RESEARCHER)
def my_template_list(request: HttpRequest):
    page, page_size = get_page_info(request)
    state = get_param('review_state', convert_to=int, allow_none=True)
    title_or_abstract = get_param('title_or_abstract', allow_none=True)
    category_id = get_param('category_id', convert_to=int, allow_none=True)
    public = get_param('public', allow_none=True)
    category_id = None if category_id == 0 else category_id
    q = Q(user=request.user)
    if state is not None:
        q &= Q(review_state=DataReviewState(state))
    if title_or_abstract is not None:
        q &= Q(title__icontains=title_or_abstract) | Q(abstract__icontains=title_or_abstract)
    if category_id is not None:
        q &= Q(category_id=category_id)
    if public is not None:
        q &= Q(public=public)
    queryset = Template.objects.filter(q).select_related('category', 'reviewer', 'user')
    paginator = MyPaginator(queryset, page_size)
    res = []
    meta: DataMeta
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
                'category_id': template.category.id,
                'category_name': template.category.name,
                'published': template.published,
                'public': template.public,
                'has_data': True if template.ref_count > 0 else False,
            }
        )
    return json_response({
        'results': res,
        'page': page,
        'page_size': paginator.per_page,
        'total': paginator.count,
    })


@require_methods_api(['DELETE'])
@require_role(UserRole.RESEARCHER)
def batch_delete_data(request: HttpRequest):
    body = load_request_body(request)
    data_ids = get_field(body, 'meta_id_list', required_type=list)
    queryset = DataMeta.objects.filter(id__in=data_ids, user=request.user)
    with transaction.atomic():
        for result in DataMeta.objects.filter(id__in=data_ids).values('template_id').annotate(
                num_data=Count('id')
        ):
            template_id = result['template_id']
            num_data = result['num_data']
            queryset.delete()
            TemplateDataStatistic.inc_count(template_id, -num_data)
            delete_meta_with_ids(data_ids)

    return json_response()
