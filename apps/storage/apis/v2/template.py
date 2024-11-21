# -*- coding: utf-8 -*-

# @File   : template
# @Author : Harold Chen
# @Date   : 2018/2/9

from apps.account.notify import notify, NotificationType
from mgedata.utils.general import require_methods_api, json_response, login_required_api
from apps.account.auth import UserRole, require_role
from apps.storage.models.template import Template
from mgedata.utils.general import get_param
from mgedata.errors.models import MGEError
from mgedata.utils.general import get_json_field_r
from django.http import HttpRequest
from apps.storage.models.data import DisapproveReason, DataReviewState


@require_methods_api(["GET"])
def get_template_names(request):
    try:
        tid_list = get_param('list')
        tid_list = tid_list.split(',')
        template_list = Template.objects.filter(id__in=tid_list).only('id', 'title')
        return json_response({x.id: x.title for x in template_list})
    except (ValueError, TypeError, AttributeError):
        raise MGEError.BAD_PARAMETER


@require_role(UserRole.DATA_ADMIN)
@require_methods_api(["PATCH"])
def review_template(request: HttpRequest, tpl_id: int):
    approved = get_json_field_r(request, 'approved', bool)
    reasons = None
    reason = None
    if not approved:
        reasons = get_json_field_r(request, 'reasons', list, allow_none=True)
        reason = get_json_field_r(request, 'reason', str, allow_none=True)
        if not reasons and not reason:
            raise MGEError.WRONG_FIELD_TYPE("Reasons cannot be empty")
        if reasons:
            for r in reasons:
                try:
                    DisapproveReason(r)
                except ValueError:
                    raise MGEError.WRONG_FIELD_TYPE("Invalid value " + str(r))
    try:
        tpl = Template.objects.get(pk=tpl_id)
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    else:
        if tpl.review_state != DataReviewState.PENDING:
            return json_response()
        if approved:
            tpl.approve(reviewer=request.user)
        else:
            tpl.disapprove(reviewer=request.user, reasons=reasons, reason=reason)
        n_type = NotificationType.DATA_APPROVED if approved else NotificationType.TEMPLATE_DISAPPROVED
        notify(tpl.user, n_type, tpl.title)
        return json_response()


def check_template_title(request: HttpRequest):
    if request.method == "GET":
        title = get_param('title', allow_none=False)
    elif request.method == "POST":
        try:
            title = get_json_field_r(request, 'title', str, allow_none=False)
        except Exception:
            raise MGEError.BAD_DATA("格式不正确或标题过长（标题长度2.5MB以内）")
    count = Template.objects.filter(title=title).count()
    if count == 0:
        return json_response()
    else:
        raise MGEError.BAD_DATA("模版标题已经存在")