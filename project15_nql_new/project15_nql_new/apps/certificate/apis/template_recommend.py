import logging
from django.db.models import Avg
from django.core.paginator import Paginator
from django.db import transaction
from operator import itemgetter
from django.http import HttpRequest
from apps.storage.models.template import Template, TemplateTag
from apps.account.auth import require_one_of_acceptance_roles
from apps.account.models.users import UserRolesForAcceptance, User
from apps.certificate.models import Acceptance, ExpertEvaluation, \
    TemplateStatistic, TemplateRecommend

from mgedata.errors.models import MGEError
from mgedata.utils.general import (get_json_field_r, json_response,
                                   require_methods_api, get_param)

logger = logging.getLogger('django')


def templates_scored_all(user: User, acceptance_id: int):
    """
    判断请求用户是否完成对验收项目的所有模板的评分
    """
    acceptance = Acceptance.get_or_error(acceptance_id)
    ts = TemplateStatistic.objects.filter(certificate = acceptance.certificate).values_list("template_id", flat=True)
    return TemplateRecommend.objects.filter(template__in = ts, expert = user).count() == ts.count()


@require_methods_api(['GET'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.Expert, UserRolesForAcceptance.GroupLeader,
                                  UserRolesForAcceptance.AcceptanceExpert], )
def template_list(request: HttpRequest):
    """
    返回专家所需打分的模板列表
    """
    expert = request.user
    page = get_param('page', convert_to=int)
    page_size = get_param('page_size', convert_to=int)
    expert_evaluation = ExpertEvaluation.objects.filter(expert=expert, finished=False)
    t = []
    for e in expert_evaluation:
        acceptance = e.acceptance
        c = acceptance.certificate
        template_stats = TemplateStatistic.objects.filter(certificate=c).prefetch_related()
        for template_stat in template_stats:
            a = TemplateRecommend.objects.filter(expert=expert, template=template_stat.template)

            t.append({
                "t_id": template_stat.template_id,  # template的id
                "title": template_stat.template.title,  # template的title
                "acceptance_id": acceptance.id,  # 验收的id
                "ps_id": acceptance.ps_id,  # 项目或课题id
                "is_project": acceptance.is_project,  # 是否为项目
                "owner": acceptance.user.real_name,  # 验收项目的负责人
                "leader": acceptance.leader.real_name,  # 验收项目的评价组长
                "is_scored": a.count() > 0  # 模板是否被打分
            })

    page_size = 20 if not page_size or page_size <= 0 else page_size
    t = sorted(t, key=itemgetter('is_scored'))
    paginator = Paginator(t, page_size)
    if not page:
        page = 1
    data = paginator.page(page)
    data = data.object_list
    results = {"count": len(t), "results": data}
    return json_response(data=results)


@require_methods_api(['POST'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.Expert, UserRolesForAcceptance.GroupLeader,
                                  UserRolesForAcceptance.AcceptanceExpert], )
def template_recommend(request: HttpRequest):
    """
    专家对模板结构进行打分，如果不存在模板推荐记录，则创建一条
    并判断打分后平均分是否大于8.5，大于则模板为推荐tag
    """
    t_id = get_json_field_r(request, 't_id', int)
    score = get_json_field_r(request, 'score', int)
    comment = get_json_field_r(request, 'comment', str, force = True)
    if score < 1 or score > 10:
        raise MGEError.TEMPLATE_SCORE_FAILED("分数必须在1-10之间")
    expert = request.user
    template = Template.get_by_id(t_id)
    with transaction.atomic():
        tr, t = TemplateRecommend.objects.get_or_create(expert=expert, template=template)
        tr.score = score
        tr.comment = comment
        tr.save()
        avg_score = TemplateRecommend.objects.filter(template=template).aggregate(Avg("score"))
        av = avg_score["score__avg"]
        if av >= 8.5:
            template.tag = TemplateTag.RECOMMEND
        else:
            template.tag = TemplateTag.ORDINARY
        template.save()
    return json_response()


@require_methods_api(['GET'])
def score_of_template(request: HttpRequest, template_id: int):
    template = Template.get_by_id(template_id)
    tr = TemplateRecommend.objects.filter(template = template)
    if tr.count() == 0:
        return json_response()
    results_score = []
    for k in tr:
        results_score.append([k.score, k.comment, k.expert.real_name])
    avg_score = TemplateRecommend.objects.filter(template=template).aggregate(Avg("score"))["score__avg"]
    results = {"avg_score":avg_score, "score":results_score}
    return json_response(data=results)


@require_methods_api(['GET'])
def can_go_next_or_not(request: HttpRequest, acceptance_id: int):
    if templates_scored_all(request.user, acceptance_id):
        return json_response(data = 1) ## 表示打完了
    return json_response(data = 0) ## 表示还有没打分的模板


@require_methods_api(['GET'])
def expert_avg_score(request: HttpRequest, acceptance_id):
    if not templates_scored_all(request.user, acceptance_id):
        raise MGEError.PERMISSION_DENIED("请先完成所有模板打分")
    acceptance = Acceptance.get_or_error(acceptance_id)
    id_list = acceptance.acceptance_template_list
    template = Template.objects.filter(id__in=id_list)
    avg_score = TemplateRecommend.objects.filter(expert=request.user).filter(template__in=template).aggregate(Avg("score"))["score__avg"]
    return json_response(data=avg_score or 10)


@require_methods_api(['GET'])
def user_template_score(request: HttpRequest, template_id):
    template = Template.get_by_id(template_id)
    try:
        tr = TemplateRecommend.objects.get(template=template, expert=request.user)
    except TemplateRecommend.DoesNotExist:
        return json_response(data=-1) # 和前端约定 模板未打分返回-1
    return json_response(data=tr.to_dict())