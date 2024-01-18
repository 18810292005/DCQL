import base64
import logging
import os.path
import traceback
from collections import OrderedDict
from tempfile import NamedTemporaryFile

import requests
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import reverse
from django.template.loader import render_to_string

try:
    from hardcopy import bytestring_to_pdf
except ValueError:
    def _raise(*args, **kwargs):
        raise ValueError("找不到Chrome，无法生成PDF")


    bytestring_to_pdf = _raise

from apps.certificate.models import Acceptance, ExpertEvaluation, EvaluationPoint
from apps.certificate.models.certificate import Certificate, TemplateStatistic
from apps.certificate.qr import make_qr_code
from apps.certificate.tests.sample import debug_project_quotas, debug_subject_quotas
from apps.storage.models import MaterialCategory, Template
from mgedata.utils.general import (MGEError, HttpRequest, get_json_field_r)

logger = logging.getLogger('django')


def _to_pdf(html: str):
    output = NamedTemporaryFile()
    bytestring_to_pdf(html, output, **{'print-to-pdf-no-header': 1, 'disable-gpu': 1, 'no-proxy-server': 1})
    output.seek(0)
    return HttpResponse(output.read(), content_type='application/pdf')


def certificate_pdf(request: HttpRequest, key: str):
    encoded_key = key
    try:
        key = base64.urlsafe_b64decode(key.encode()).decode()
    except Exception:  # base64抛出的异常不好找就全都except了
        raise MGEError.INVALID_CERTIFICATE
    try:
        cert = Certificate.objects.get(key=key)
    except Certificate.DoesNotExist:
        raise MGEError.INVALID_CERTIFICATE
    result = get_certificate_statistics(cert, encoded_key)
    html = render_to_string('certificate/certificate.html', result).encode('utf-8')
    if settings.DEBUG and settings.PDF_API:
        content = requests.post(settings.PDF_API, json={'html': html}).content
        return HttpResponse(content, content_type='application/pdf')
    return _to_pdf(html)


def external_to_pdf(request: HttpRequest):
    html = get_json_field_r(request, 'html').encode('utf-8')
    return _to_pdf(html)


def evaluation_pdf(request: HttpRequest, key: str):
    encoded_key = key
    try:
        key = base64.urlsafe_b64decode(key.encode()).decode()
    except Exception:  # base64抛出的异常不好找就全都except了
        raise MGEError.INVALID_CERTIFICATE
    try:
        cert = Certificate.objects.get(key=key)
    except Certificate.DoesNotExist:
        raise MGEError.INVALID_CERTIFICATE
    try:
        acceptance = Acceptance.objects.get(certificate=cert)
    except Acceptance.DoesNotExist:
        raise MGEError.PERMISSION_DENIED("未申请验收")
    result = get_certificate_statistics(cert, encoded_key)
    try:
        # 专家查看自己的评价结果
        qs = [ExpertEvaluation.objects.get(acceptance=acceptance, expert=request.user, is_leader=False, finished=True)]
    except ExpertEvaluation.DoesNotExist:
        # 既不是负责人也不是组长
        if not request.user.is_root and request.user != acceptance.user and request.user != acceptance.leader:
            qs = []
        else:
            qs = ExpertEvaluation.objects.filter(acceptance=acceptance, finished=True).order_by('u_time')
    evaluations = []
    for e in qs:
        sub = {'time': e.u_time, 'items': [], 'comment': e.comment,
               'signature': os.path.join(settings.MEDIA_ROOT, e.signature.name),
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
        evaluations.append(sub)
    result['evaluations'] = evaluations
    html = render_to_string('certificate/evaluation.html', result).encode('utf-8')
    output = NamedTemporaryFile()
    bytestring_to_pdf(html, output, **{'print-to-pdf-no-header': 1, 'disable-gpu': 1, 'no-proxy-server': 1})
    output.seek(0)
    return HttpResponse(output.read(), content_type='application/pdf')


def get_certificate_statistics(cert, encoded_key):
    cert.prepare_template()
    categories = OrderedDict()
    template_stats = TemplateStatistic.objects.filter(certificate=cert).order_by('-data_count').prefetch_related()
    for template_stat in template_stats:
        template_stat.prepare_template()
        categories.setdefault(template_stat.category.name_zh, []).append(template_stat)
    is_project = cert.is_project
    project = None
    subject = None
    project_quotas = OrderedDict()
    subject_quotas = OrderedDict()
    if is_project:
        project = cert.get_project_or_subject()
    else:
        subject = cert.get_project_or_subject()
        project = subject.project
    if not cert.is_project:
        project_id = cert.get_project_or_subject().project.id
        subject_id = cert.ps_id
        subject_quotas = get_quotas(is_project=False, ps_id=subject_id)
    else:
        project_id = cert.ps_id
    project_quotas = get_quotas(is_project=True, ps_id=project_id)
    tid_research_map = OrderedDict()
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
        tid_research_map[tid] = {
            'total_count': count,
            'private_count': 0,
            'name': template.title
        }
    for tid, count in cert.research_private.items():
        template = tid_template_map.get(tid)
        if template is None:
            try:
                template = Template.objects.get(id=tid)
            except Template.DoesNotExist:
                continue
        if tid in tid_research_map:
            tid_research_map[tid]['total_count'] += count
            tid_research_map[tid]['private_count'] = count
        else:
            tid_research_map[tid] = {
                'total_count': count,
                'private_count': count,
                'name': template.title
            }
    result = {
        'static_root': settings.STATIC_ROOT,
        'cert': cert,
        'project': project, 'subject': subject, 'project_quotas': project_quotas,
        'subject_quotas': subject_quotas,
        'categories': [{'name': name, 'templates': categories[name]} for name in categories],
        'research': list(tid_research_map.values())
    }
    img = make_qr_code(
        settings.SITE_ADDR + settings.SITE_BASE_URL + reverse('certificate:show_certificate', args=[encoded_key]))
    result['stamp_base64'] = img
    return result


def get_quotas(is_project, ps_id: str):
    if settings.DEBUG:
        if is_project:
            got = debug_project_quotas
        else:
            got = debug_subject_quotas
    else:
        got = []
        try:
            if is_project:
                got = requests.get(settings.PROJECT_QUOTAS_URL.replace('{projectId}', ps_id)).json()['data']
            else:
                got = requests.get(settings.SUBJECT_QUOTAS_URL.replace('{topicId}', ps_id)).json()['data']
        except Exception:
            logger.error(f'调用项目管理系统({ps_id})指标 接口出错, 具体信息:{traceback.format_exc()}')
    res = OrderedDict()
    for sqg in got:
        parent_id = sqg.get('parentId', None)
        quota_value = sqg.get('yjwcl', None)
        quota_name = sqg.get('indexName', None)
        if parent_id is None or quota_value is None or quota_name is None:
            err = f'调用项目管理系统指标接口出错({ps_id})，缺少以下三个字段中的某些字段， ' \
                  f'parentId:{parent_id}, yjwcl:{quota_value}, indexName:{quota_name}'
            logger.error(err)
            return {}
        if parent_id != '0':
            if quota_name == '课题id':
                quota_name = '课题编号'
            elif quota_name == '项目id':
                quota_name = '项目编号'
            res[quota_name] = quota_value
    return res
