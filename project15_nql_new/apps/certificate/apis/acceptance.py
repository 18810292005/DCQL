from django.http import HttpRequest
from apps.account.auth import require_acceptance_roles, require_one_of_acceptance_roles
from apps.account.models.users import User, UserRole, UserRolesForAcceptance, UserRolesForAcceptanceModel
from apps.certificate.core.acceptance import get_ps_info_by_
from apps.certificate.models import Acceptance, AcceptanceState, ExpertEvaluation
from apps.storage.models.data import DataReviewState, DataMeta
from mgedata.errors.models import MGEError
from mgedata.utils.general import (get_json_field_r, json_response,
                                   ensure_privacy,
                                   require_methods_api, get_param)
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q


@require_methods_api(['GET', 'PATCH'])
@require_acceptance_roles(UserRolesForAcceptance.GroupLeader)
def one_dispatch(request: HttpRequest, acceptance_id: int):
    """
    查询某个Acceptance下的验收专家
    :param request:
    :param acceptance_id: 验收申请id
    :return:
    """
    acceptance = Acceptance.get_or_error(acceptance_id)
    ensure_privacy(request, acceptance.leader)  # 确保操作人是组长
    if request.method == 'GET':
        # 获取专家
        expert_list = []
        expert_evaluations = ExpertEvaluation.objects.filter(acceptance=acceptance, is_leader=False)
        for expert_evaluation in expert_evaluations:
            expert = expert_evaluation.expert
            expert_dict = {'expert_username': expert.username, 'expert_name': expert.real_name}
            expert_list.append(expert_dict)

        return json_response(data=expert_list)
    else:  # 修改专家
        users = []
        username_list = get_json_field_r(request, 'experts', list)
        for username in username_list:
            try:
                user = User.objects.get(username=username)
                users.append(user)
            except User.DoesNotExist:
                raise MGEError.NOT_FOUND(f"用户{username}不存在")
        acceptance.bulk_redispatch(users)
        return json_response()


@require_methods_api(['GET', 'DELETE'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader])
def one_acceptance(request: HttpRequest, acceptance_id: int):
    """
    查看验收详情或撤回
    """
    acceptance = Acceptance.get_or_error(acceptance_id)
    if request.method == 'GET':
        result = {
            'id': acceptance.id,
            'ps_id': acceptance.ps_id,
            'name': acceptance.get_project_or_subject().name,
            'create_time': acceptance.c_time,
            'leader': acceptance.user.real_name,
            'state': acceptance.state,
            'cert_key': acceptance.certificate.encoded_key  # 验收申请对应的汇交证明key
        }
        return json_response(result)
    if request.method == 'DELETE':
        ensure_privacy(request, acceptance.user)  # 确保是申请人操作
        acceptance.delete()
        return json_response()


@require_methods_api(['GET', 'POST'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.GroupLeader,
                                  UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader])
def acceptances_view(request: HttpRequest):
    """
    POST方法：
        申请汇交验收
    GET方法：
    查看汇交验收申请（通用）：
        项目和课题负责人：
            |——只能查看自己提交的申请
        评价组长：（0）
            |——查看自己提交的申请（用my参数）
            |——查看所有申请
    :param request:
    :return:
    """
    if request.method == 'POST':
        ps_id = get_json_field_r(request, 'ps_id', str)
        is_project = get_json_field_r(request, 'is_project', bool)
        group_leader = get_json_field_r(request, 'group_leader_username', str)
        try:
            group_leader = User.objects.get(username=group_leader)
        except User.DoesNotExist:
            raise MGEError.NOT_FOUND(f"用户{group_leader}不存在")
        Acceptance.make_request(ps_id, is_project, request.user, group_leader)
        return json_response()
    page = get_param('page', convert_to=int)
    page_size = get_param('page_size', convert_to=int)
    # state可选，没有就是返回全部状态
    # state取值还必须在[x.value for x in AcceptanceState]内
    state = get_param('state', convert_to=int, allowed=[x.value for x in AcceptanceState])
    my = get_param('my', convert_to=int)
    user: User = request.user
    q = Q()
    if state is not None:
        q &= Q(state=state)
    if not user.is_root:
        if user.has_role_for_acceptance(UserRolesForAcceptance.GroupLeader) and not my:
            # 如果是组长，并且没有my选项
            q &= Q(leader=user)
        else:
            q &= Q(user=user)
    acceptances = Acceptance.objects.filter(q).order_by('-c_time').select_related()
    ret = dict()
    page_size = 10 if not page_size or page_size <= 0 else page_size
    paginator = Paginator(acceptances, page_size)
    try:
        acceptances = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        acceptances = paginator.page(1)
        page = 1
    ret['page'] = page
    ret['page_size'] = page_size
    ret['page_count'] = paginator.num_pages
    result = list()
    for acceptance in acceptances:
        result.append({
            'id': acceptance.id,
            'ps_id': acceptance.ps_id,
            'name': acceptance.get_project_or_subject().name,
            'create_time': acceptance.c_time,
            'leader': acceptance.user.real_name,
            'state': acceptance.state,
            'cert_key': acceptance.certificate.encoded_key  # 验收申请对应的汇交证明key
        })
    ret['data'] = result
    return json_response(ret)


@require_methods_api(['GET'])
@require_acceptance_roles(UserRolesForAcceptance.GroupLeader)
def get_all_acceptance_experts(request: HttpRequest):
    """
    查看所有验收专家列表,需要评价组长权限
    """
    q = ~Q(user=request.user)
    q &= Q(roles__contains=[UserRolesForAcceptance.AcceptanceExpert.value])
    usernames = list(UserRolesForAcceptanceModel.objects.filter(q).values_list(
        'user_id', flat=True))
    # 按照拼音排序
    experts = User.objects.raw(
        "SELECT username, real_name from account_user where username = ANY(%s) order by convert_to(real_name,'GBK')",
        [usernames])
    results = [{'expert_username': x.username, 'expert_name': x.real_name} for x in experts]
    return json_response(results)


# @require_methods_api(['GET'])
# @require_acceptance_roles([UserRolesForAcceptance.ProjectLeader,
#                            UserRolesForAcceptance.SubjectLeader])
def get_all_leaders(request: HttpRequest):
    """
    查看所有评价组长列表,需要项目或者课题负责人权限
    """
    q = ~Q(user=request.user)
    q &= Q(roles__contains=[UserRolesForAcceptance.GroupLeader.value])
    usernames = list(UserRolesForAcceptanceModel.objects.filter(q).values_list(
        'user_id', flat=True))
    # 按照拼音排序
    leaders = User.objects.raw(
        "SELECT username, real_name from account_user where username = ANY(%s) order by convert_to(real_name,'GBK')",
        [usernames])
    results = [{'username': x.username, 'name': x.real_name} for x in leaders]
    return json_response(results)


@require_methods_api(["GET"])
@require_one_of_acceptance_roles([UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader])
def get_acceptance_data_filter(request: HttpRequest):
    acceptance_id = get_param('acceptance_id', convert_to=int)
    user: User = request.user

    # 获取课题/项目信息
    if acceptance_id is None:
        q = ~Q(state=AcceptanceState.FAILED)
        if not user.has_role(UserRole.ROOT):
            q &= Q(user=user)
        acceptances: list[Acceptance] = Acceptance.objects.filter(
            q).order_by('ps_id').distinct('ps_id', 'is_project')

        rs = get_ps_info_by_(acceptances)
        return json_response({'results': rs})

    try:
        acceptance = Acceptance.objects.get(id=acceptance_id)
    except Acceptance.DoesNotExist:
        raise MGEError.NOT_FOUND("未申请验收")

    # 获取汇交证明下模版数据
    templates_stat = acceptance.get_templates_stat()
    return json_response({'results': templates_stat})


@require_methods_api(["GET"])
@require_one_of_acceptance_roles([UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader,
                                  UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.GroupLeader])
def get_acceptance_data(request: HttpRequest):
    acceptance_id = get_param('acceptance_id', convert_to=int, allow_none=False)
    subject_id = get_param('subject_id', convert_to=str)
    tid = get_param('tid', convert_to=int)
    cid = get_param('category_id', convert_to=int)
    per_page = get_param('per_page', convert_to=int, default=20)
    page = get_param('page', convert_to=int, default=1)

    try:
        acceptance = Acceptance.objects.get(id=acceptance_id)
    except Acceptance.DoesNotExist:
        raise MGEError.NOT_FOUND("未申请验收")

    ps_id = subject_id if subject_id is not None else acceptance.ps_id

    q = Q(id__in=DataMeta.OtherInfoHelper.get_data_meta_ids_by_ps_id(ps_id),
          review_state=DataReviewState.APPROVED)
    if tid:
        q &= Q(template=tid)
    if cid:
        q &= Q(category=cid)
    paginator = Paginator(DataMeta.objects.filter(q), per_page=per_page)
    total = paginator.count
    try:
        result_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        result_page = paginator.page(1)
    rs = [dm.to_dict() for dm in result_page]
    return json_response({'results': rs, 'total': total, 'page': page, 'page_size': per_page})

#
# @require_methods_api(['POST', 'GET'])
# @require_one_of_acceptance_roles([UserRolesForAcceptance.GroupLeader])
# def acceptance_signatures(request: HttpRequest, acceptance_id: int):
#     acceptance = Acceptance.get_or_error(acceptance_id)
#     if request.method == 'POST':  # 上传扫描件
#         ensure_privacy(request, acceptance.leader, "只有组长才可以上传扫描件")  # 组长才可以上传
#         image = request.FILES.get('signature', None)
#         if not image:
#             raise MGEError.FIELD_MISSING('缺少文件类型字段"signature"')
#         import filetype
#         kind = filetype.guess(image.read())
#         if not kind or kind.mime != 'application/pdf':
#             raise MGEError.BAD_DATA("所选文件并非pdf或者已经损坏")
#         image.seek(0)
#         acceptance.upload_signature(image)
#         return json_response()
#     else:  # 查看扫描件
#         if not acceptance.sig_doc:
#             raise MGEError.NOT_FOUND("未上传扫描件")
#         if request.user != acceptance.user and request.user != acceptance.leader:
#             raise MGEError.PERMISSION_DENIED("仅限负责人和组长查看")
#         return HttpResponse(acceptance.sig_doc.file, content_type='application/pdf')
