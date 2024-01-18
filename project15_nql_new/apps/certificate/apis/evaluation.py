import logging

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.http.request import HttpRequest

from apps.account.auth import require_one_of_acceptance_roles
from apps.account.models.users import UserRolesForAcceptance, User, UserRole
from apps.certificate.apis.template_recommend import templates_scored_all
from apps.certificate.core.acceptance import get_ps_info_by_
from apps.certificate.models import EvaluationPoint, ExpertEvaluation, Acceptance, AcceptanceState
from mgedata.utils.general import (
    json_response, require_POST_api, require_GET_api,
    get_json_field_r, get_multipart_field, get_param, require_methods_api, ensure_privacy, MGEError
)

logger = logging.getLogger('django')


@require_GET_api
def evaluation_points(request: HttpRequest):
    data = []
    for point in EvaluationPoint:
        value = point.value
        data.append({
            'id': point.name,
            'content': value[0],
            'options': value[1]
        })
    return json_response(data)


@require_methods_api(['GET', 'POST'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.GroupLeader])
def dispatches(request: HttpRequest):
    """
    分配专家进行评价/专家获取自己的验收评价分配
    """
    if request.method == 'GET':
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int)
        if not page_size:
            page_size = 10
        finished = get_param('finished', convert_to=int, allowed=(0, 1))
        q = Q(is_leader=False)
        if not request.user.is_root:
            q = Q(expert=request.user)

        if finished is not None:
            q &= Q(finished=bool(finished))
        data = []
        qs = ExpertEvaluation.objects.filter(q).select_related()
        paginator = Paginator(qs, page_size)
        try:
            qs = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            qs = paginator.page(1)
            page = 1
        for e in qs:
            data.append({
                "acceptance_id": e.acceptance.id,
                "ps_id": e.acceptance.ps_id,
                "ps_name": e.acceptance.get_project_or_subject().name,
                "c_time": e.acceptance.c_time,
                "cert_key": e.acceptance.certificate.encoded_key,
                "finished": e.finished,
                "leader": e.acceptance.user.real_name,
                "deadline": e.deadline
            })
        return json_response({'page': page, 'page_size': page_size,
                              'page_count': paginator.num_pages, 'data': data})
    else:  # 分配专家
        acceptance_id = get_json_field_r(request, 'acceptance_id', int)
        username_list = get_json_field_r(request, 'experts', list)
        acceptance = Acceptance.get_or_error(acceptance_id)
        ensure_privacy(request, acceptance.leader)  # 确保操作人是组长
        users = []
        for username in username_list:
            try:
                user = User.objects.get(username=username)
                users.append(user)
            except User.DoesNotExist:
                raise MGEError.NOT_FOUND(f"用户{username}不存在")
        acceptance.bulk_dispatch(users)
        return json_response()


@require_POST_api
@require_one_of_acceptance_roles([UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.GroupLeader])
def make_evaluation(request: HttpRequest):
    acceptance_id = get_multipart_field(request, 'acceptance_id', int)
    if not templates_scored_all(request.user, acceptance_id):
        raise MGEError.PERMISSION_DENIED("请先完成所有模板打分")
    comment = get_multipart_field(request, 'comment', str)
    evaluations = {}
    for point_id in EvaluationPoint.ordered_list():
        evaluations[point_id] = get_multipart_field(request, point_id, str)
    signature = get_multipart_field(request, 'signature', bytes)
    Acceptance.get_or_error(acceptance_id).evaluate(request.user, evaluations, comment, signature)
    return json_response()


@require_GET_api
@require_one_of_acceptance_roles([UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.GroupLeader,
                                  UserRolesForAcceptance.SubjectLeader,
                                  UserRolesForAcceptance.ProjectLeader])
def evaluation_results(request: HttpRequest, acceptance_id: int):
    """
    项目和课题负责人、评价组长可以看到所有专家已完成的评价
    验收专家只能看到自己的评价。项目和课题负责人看不到专家姓名
    """
    acceptance = Acceptance.get_or_error(acceptance_id)
    # evaluations = acceptance.evaluation_results(request.user)

    try:
        # 专家查看自己的评价结果
        qs = [ExpertEvaluation.objects.get(acceptance=acceptance, expert=request.user, is_leader=False, finished=True)]
    except ExpertEvaluation.DoesNotExist:
        # 既不是负责人也不是组长
        if not request.user.is_root and request.user != acceptance.user and request.user != acceptance.leader:
            qs = []
        else:
            qs = ExpertEvaluation.objects.filter(acceptance=acceptance, finished=True).order_by('u_time')
    data = []
    for e in qs:
        sub = {'time': e.u_time, 'items': [], 'comment': e.comment, 'signature': e.signature_url,
               'is_leader': e.is_leader, 'expert_name': e.expert.real_name}
        for point in EvaluationPoint:
            point_id = point.name
            point_str = point.value[0]
            options = point.value[1]
            sub['items'].append({
                'id': point_id,
                'content': point_str,
                'options': options,
                'result': e.evaluation[point_id],
            })
        data.append(sub)
    return json_response(data)


@require_GET_api
@require_one_of_acceptance_roles([UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.GroupLeader,
                                  ])
def get_evaluation_data_filter(request: HttpRequest):
    acceptance_id = get_param('acceptance_id', convert_to=int)
    user: User = request.user

    # 获取课题/项目信息
    if acceptance_id is None:
        q = ~Q(acceptance__state__in=[AcceptanceState.FAILED, AcceptanceState.FINISHED])
        q &= Q(finished=False)
        if not user.has_role(UserRole.ROOT):
            q &= Q(expert=user)
        evaluations = ExpertEvaluation.objects.filter(q)

        evaluations = evaluations.order_by('acceptance_id').distinct('acceptance_id')
        acceptances_id = evaluations.values_list('acceptance_id', flat=True)
        acceptances: list[Acceptance] = Acceptance.objects.filter(id__in=acceptances_id)

        rs = get_ps_info_by_(acceptances)
        return json_response({'results': rs})

    try:
        acceptance = Acceptance.objects.get(id=acceptance_id)
    except Acceptance.DoesNotExist:
        raise MGEError.NOT_FOUND("未申请验收")

    # 获取汇交证明下模版数据
    templates_stat = acceptance.get_templates_stat()
    return json_response({'results': templates_stat})
