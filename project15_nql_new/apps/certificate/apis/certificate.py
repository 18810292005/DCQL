import base64
import logging
import traceback
from collections import OrderedDict

import requests
from django.conf import settings
from django.core.paginator import PageNotAnInteger, Paginator, EmptyPage
from django.db.models import Q
from django.shortcuts import reverse

from apps.account.auth import require_one_of_acceptance_roles
from apps.account.models.users import UserRolesForAcceptance
from apps.certificate.models.certificate import Certificate, TemplateStatistic
from apps.certificate.qr import make_qr_code
from apps.certificate.tasks import CertificateIssuingTask
from apps.storage.models import MaterialSubject, MaterialProject, MaterialCategory, Template, DataMeta
from apps.storage.tasks import DataExportForCertificate
from apps.task.models import UserTask, TaskType
from mgedata.utils.general import (MGEError, HttpRequest,
                                   json_response, get_json_field_r, get_param, require_methods_api, require_GET_api)

logger = logging.getLogger('django')


def verify_certificate(request: HttpRequest, key: str):
    cert = None
    encoded_key = key
    try:
        key = base64.urlsafe_b64decode(key.encode()).decode()
    except Exception:  # base64抛出的异常不好找就全都except了
        raise MGEError.INVALID_CERTIFICATE
    try:
        cert = Certificate.objects.get(key=key)
    except Certificate.DoesNotExist:
        raise MGEError.INVALID_CERTIFICATE
    categories = OrderedDict()
    template_stats = TemplateStatistic.objects.filter(certificate=cert).order_by('-data_count').prefetch_related()
    for template_stat in template_stats:
        t = {'tid': template_stat.template_id, 'title': template_stat.template.title,
             'data_count': template_stat.data_count + template_stat.data_count_private,
             'field_count': template_stat.field_count + template_stat.field_count_private,
             'table_count': template_stat.table_count + template_stat.table_count_private,
             'image_count': template_stat.image_count + template_stat.image_count_private,
             'file_count': template_stat.file_count + template_stat.file_count_private,
             'data_size': template_stat.data_size + template_stat.data_size_private,
             'data_count_private': template_stat.data_count_private,
             'field_count_private': template_stat.field_count_private,
             'table_count_private': template_stat.table_count_private,
             'image_count_private': template_stat.image_count_private,
             'file_count_private': template_stat.file_count_private,
             'data_size_private': template_stat.data_size_private,
             }
        categories.setdefault(template_stat.category.name_zh, []).append(t)
    is_project = cert.is_project
    if is_project:
        project = cert.get_project_or_subject()
        subject_dict = {}
    else:
        subject = cert.get_project_or_subject()
        project = subject.project
        subject_dict = {
            'subject': {
                'name': subject.name,
                'id': subject.id,
                'leader': subject.leader if not subject.leader_fk else subject.leader_fk.real_name,
                'ins': subject.institution,
            }
        }
        try:
            subject_quotas_get = get_quotas('subject', subject.id)
        except Exception:
            logger.error(f'调用项目管理系统 课题({subject.id})指标 接口出错, 具体信息:{traceback.format_exc()}')
            subject_quotas_get = []
        for sqg in subject_quotas_get:
            parent_id = sqg.get('parentId', None)
            quota_value = sqg.get('yjwcl', None)
            quota_name = sqg.get('indexName', None)
            if parent_id is None or quota_value is None or quota_name is None:
                err = f'调用项目管理系统指标接口出错(课题id:{subject.id})，缺少以下三个字段中的某些字段， ' \
                      f'parentId:{parent_id}, yjwcl:{quota_value}, indexName:{quota_name}'
                logger.error(err)
                json_response(msg=err, status_code=400)
            if parent_id != '0':
                if quota_name == '课题id':
                    quota_name = '课题编号'
                subject_dict['subject'][quota_name] = quota_value
    project_dict = {
        'project': {
            'name': project.name,
            'id': project.id,
            'leader': project.leader if not project.leader_fk else project.leader_fk.real_name,
            'ins': project.institution,
        }
    }

    try:
        project_quotas_get = get_quotas('project', project.id) or []
    except Exception:
        logger.error(f'调用项目管理系统 项目({project.id})指标 接口出错，具体信息:{traceback.format_exc()}')
        project_quotas_get = []
    for pqg in project_quotas_get:
        parent_id = pqg.get('parentId', None)
        quota_value = pqg.get('yjwcl', None)
        quota_name = pqg.get('indexName', None)
        if parent_id is None or quota_value is None or quota_name is None:
            err = f'调用项目管理系统指标接口出错(项目id:{project.id})，缺少以下三个字段中的某些字段， ' \
                  f'parentId:{parent_id}, yjwcl:{quota_value}, indexName:{quota_name}'
            logger.error(err)
            json_response(msg=err, status_code=400)
        if parent_id != '0':
            if quota_name == '项目id':
                quota_name = '项目编号'
            project_dict['project'][quota_name] = quota_value

    tid_research_map = OrderedDict()
    tid_research_private_map = OrderedDict()
    try:
        MaterialCategory.objects.get(name_zh='科研成果')
    except MaterialCategory.DoesNotExist:
        raise MGEError.NOT_FOUND("找不到科研成果分类，请联系管理员")

    tid_template_map = {}
    for tid, count in cert.research.items():
        try:
            template = Template.objects.get(id=tid)
            tid_template_map[tid] = template
        except Template.DoesNotExist:
            continue
            # raise MGEError.NOT_FOUND(f'找不到科研成果模板"id={tid}"，请联系管理员')
        tid_research_map[tid] = {
            'tid': template.id,
            'count': count,
            'name': template.title
        }
    for tid, count in cert.research_private.items():
        template = tid_template_map.get(tid)
        if template is None:
            try:
                template = Template.objects.get(id=tid)
            except Template.DoesNotExist:
                continue
                # raise MGEError.NOT_FOUND(f'找不到科研成果模板"id={tid}"，请联系管理员')
        tid_research_private_map[tid] = {
            'tid': template.id,
            'count': count,
            'name': template.title
        }
        # 总数+=count
        tid_research_map.setdefault(tid, {'tid': template.id,
                                          'count': 0,
                                          'name': template.title})['count'] += count

    res = tid_research_map.copy()
    res_private = tid_research_private_map.copy()
    for tid, value in tid_research_map.items():
        if value['count'] == 0:
            res.pop(tid, None)
            res_private.pop(tid, None)

    result = {'is_project': is_project,
              'issue_time': cert.issue_time,
              'expired': cert.expired,
              'data_count': cert.data_count + cert.data_count_private,
              'field_count': cert.field_count + cert.field_count_private,
              'table_count': cert.table_count + cert.table_count_private,
              'image_count': cert.image_count + cert.image_count_private,
              'file_count': cert.file_count + cert.file_count_private,
              'data_size': cert.data_size + cert.data_size_private,
              'data_count_private': cert.data_count_private,
              'field_count_private': cert.field_count_private,
              'table_count_private': cert.table_count_private,
              'image_count_private': cert.image_count_private,
              'file_count_private': cert.file_count_private,
              'data_size_private': cert.data_size_private,
              'categories': [{'category': x, 'templates': categories[x]} for x in categories],
              'research': list(res.values()), 'research_private': list(res_private.values())}
    result.update(subject_dict)
    result.update(project_dict)
    img = make_qr_code(
        settings.SITE_ADDR + settings.SITE_BASE_URL + reverse('certificate:show_certificate', args=[encoded_key]))
    result['qr_code'] = img
    return json_response(result)


@require_methods_api(['POST', 'GET'])
@require_one_of_acceptance_roles([UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader])
def certificates(request: HttpRequest):
    if request.method == 'POST':  # 申请证明
        is_project = get_json_field_r(request, 'is_project', bool)
        ps_id = get_json_field_r(request, 'ps_id', str)
        if is_project:
            table = MaterialProject
            name = "项目"
        else:
            table = MaterialSubject
            name = "课题"
        try:
            ps = table.objects.get(id=ps_id)
        except table.DoesNotExist:
            raise MGEError.NOT_FOUND(f"{name}{ps_id}不存在")
        else:
            if ps.leader_fk and ps.leader_fk != request.user or not ps.leader_fk \
                    and ps.leader != request.user.real_name:
                raise MGEError.PERMISSION_DENIED(f"您不是{name}{ps_id}的负责人")
        task = UserTask.add_task(request.user, CertificateIssuingTask().signature([ps_id, is_project]),
                                 TaskType.CERTIFICATE)
        return json_response({'task_id': task.id})
    else:  # 我的汇交证明
        page = get_param('page', convert_to=int)
        page_size = get_param('page_size', convert_to=int)
        page_size = 10 if not page_size or page_size <= 0 else page_size
        q = Q()
        for table in (MaterialProject, MaterialSubject):
            q |= Q(ps_id__in=list(table.filter_with_leader(request.user).values_list('id', flat=True)))
        results = []
        paginator = Paginator(Certificate.objects.filter(q), page_size)
        try:
            qs = paginator.page(page)
        except (PageNotAnInteger, EmptyPage):
            page = 1
            qs = paginator.page(1)
        for cert in qs:
            results.append({
                'ps_id': cert.ps_id,
                'issue_time': cert.issue_time,
                'expired': cert.expired,
                'expired_time': cert.expired_time,
                'is_project': cert.is_project,
                'key': cert.encoded_key
            })
        return json_response({'data': results, 'page': page,
                              'page_size': page_size,
                              'page_count': paginator.num_pages})


@require_GET_api
@require_one_of_acceptance_roles([UserRolesForAcceptance.GroupLeader,
                                  UserRolesForAcceptance.AcceptanceExpert,
                                  UserRolesForAcceptance.ProjectLeader,
                                  UserRolesForAcceptance.SubjectLeader])
def download_data(request: HttpRequest, key: str):
    cert = None
    try:
        key = base64.urlsafe_b64decode(key.encode()).decode()
    except Exception:  # base64抛出的异常不好找就全都except了
        raise MGEError.INVALID_CERTIFICATE
    tid = get_param('tid', convert_to=int, allow_none=False)
    rand = bool(get_param('random', convert_to=int, allowed=(0, 1)))
    try:
        cert = Certificate.objects.get(key=key)
    except Certificate.DoesNotExist:
        raise MGEError.INVALID_CERTIFICATE

    task = UserTask.add_task(request.user,
                             DataExportForCertificate().s(cert.ps_id, cert.is_project, tid,
                                                          random_percentage=0.1 if rand else 1),
                             TaskType.EXPORT_FOR_CERTIFICATE)
    return json_response({'task_id': task.id})


def get_quotas(type: str, id: str):
    if settings.DEBUG:
        return {}
    if type == 'project':
        return requests.get(settings.PROJECT_QUOTAS_URL.replace('{projectId}', id)).json()['data']
    elif type == 'subject':
        return requests.get(settings.SUBJECT_QUOTAS_URL.replace('{topicId}', id)).json()['data']
    return None


@require_GET_api
def statistics_for_nmdms(request: HttpRequest, ps_id):
    cert = Certificate.objects.filter(ps_id=ps_id, expired=False).first()
    if not cert:
        raise MGEError.NOT_FOUND(f"{ps_id}不存在或还未申请汇交证明")
    res = dict(data_count=cert.data_count + cert.data_count_private, research={})
    res['category_count'] = len(
        set(TemplateStatistic.objects.filter(certificate=cert).values_list('category_id', flat=True)))
    for k, v in cert.research.items():
        res['research'][k] = v + cert.research_private[k]
    return json_response(res)


@require_GET_api
def statistics_for_nmdms_full(request: HttpRequest, ps_id):
    cert = Certificate.objects.filter(ps_id=ps_id, expired=False).first()
    if not cert:
        raise MGEError.NOT_FOUND(f"{ps_id}不存在或还未申请汇交证明")
    res = dict(data_count=cert.data_count + cert.data_count_private, research={})
    res['category_count'] = len(
        set(TemplateStatistic.objects.filter(certificate=cert).values_list('category_id', flat=True)))
    if cert.is_project:
        key = 'other_info__project'
    else:
        key = 'other_info__subject'
    res['patent_count'] = DataMeta.objects.filter(**{'template_id': 888, key: ps_id}).count()
    res['software_count'] = DataMeta.objects.filter(**{'template_id': 887, key: ps_id}).count()
    res['conference_paper_count'] = DataMeta.objects.filter(**{'template_id': 893, key: ps_id}).count()
    res['conference_report_count'] = DataMeta.objects.filter(**{'template_id': 891, key: ps_id}).count()
    res['journal_paper_count'] = DataMeta.objects.filter(**{'template_id': 890, key: ps_id}).count()
    res['standard_count'] = DataMeta.objects.filter(**{'template_id': 894, key: ps_id}).count()
    return json_response(res)
