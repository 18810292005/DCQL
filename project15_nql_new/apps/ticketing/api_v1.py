# -*- coding: utf-8 -*-

# @File   : api_v1
# @Author : Harold Chen
# @Date   : 2018/1/15

from mgedata.utils.general import *
from apps.account.models.users import UserRole
from apps.account.notify import NotificationType
from apps.ticketing.models import Ticket, TicketAttachment, TicketImage, TicketType
from django.db import transaction
from lxml.html.clean import clean_html
from django.utils.html import escape
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.forms.models import model_to_dict

from .serializers import TicketSerializer
from mgedata.utils.mixins import AutoFilterMixin
from rest_framework import generics

from ..account.notify import notify_admins


@login_required_api
@require_POST_api
def reply(request: HttpRequest):
    ticket_id = get_json_field_r(request, 'ticket_id')
    images = get_json_field_r(request, 'images', required_type=list, allow_none=True)
    files = get_json_field_r(request, 'files', required_type=list, allow_none=True)
    content = get_json_field_r(request, 'content', required_type=str)
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        if request.user.username == ticket.created_by.username:
            ensure_privacy(request, ticket.created_by)
            ticket.user_reply(clean_html(content))
        else:
            check_role(request, UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN)
            ticket.admin_reply(request.user, clean_html(content))

        if images is not None:
            for image_id in images:
                try:
                    image = TicketImage.objects.get(id=image_id)
                    image.ticket = ticket
                    image.save(files=('ticket',))
                except TicketImage.DoesNotExist:
                    pass
        if files is not None:
            for file_id in files:
                try:
                    file = TicketAttachment.objects.get(id=file_id)
                    file.ticket = ticket
                    file.save(files=('ticket',))
                except TicketAttachment.DoesNotExist:
                    pass

        return json_response()
    except Ticket.DoesNotExist:
        raise MGEError.NOT_FOUND


@login_required_api
@require_POST_api
def create_ticket(request: HttpRequest):
    title = get_json_field_r(request, 'title', required_type=str)
    content = get_json_field_r(request, 'content', required_type=str)
    t_type = get_json_field_r(request, 't_type', required_type=int)
    images = get_json_field_r(request, 'images', required_type=list, allow_none=True)
    files = get_json_field_r(request, 'files', required_type=list, allow_none=True)
    try:
        t_type = TicketType(t_type)
    except ValueError:
        raise MGEError.WRONG_FIELD_TYPE("Unknown t_type")
    with transaction.atomic():
        ticket = Ticket(title=escape(title), content=clean_html(content), t_type=t_type, created_by=request.user)
        ticket.save()
        if images is not None:
            for image_id in images:
                try:
                    image = TicketImage.objects.get(id=image_id)
                    image.ticket = ticket
                    image.save(update_fields=('ticket',))
                except TicketImage.DoesNotExist:
                    pass
        if files is not None:
            for file_id in files:
                try:
                    file = TicketAttachment.objects.get(id=file_id)
                    file.ticket = ticket
                    file.save(update_fields=('ticket',))
                except TicketAttachment.DoesNotExist:
                    pass
    if t_type == TicketType.PERMISSION_REQUEST:
        admin_type = UserRole.USER_ADMIN
    elif t_type == TicketType.TEMPLATE:
        admin_type = UserRole.TEMPLATE_ADMIN
    elif t_type == TicketType.DATA:
        admin_type = UserRole.DATA_ADMIN
    else:
        admin_type = UserRole.ROOT
    notify_admins(admin_type, NotificationType.NEW_TICKET_FROM_USER, object1=request.user.username,
                  object2=ticket.html_title)

    return json_response({'id': ticket.pk})


@login_required_api
@require_role(UserRole.USER_ADMIN)
def close_ticket(request: HttpRequest):
    ticket_id = get_json_field_r(request, 'ticket_id')
    reason = get_json_field_r(request, 'reasons', allow_none=True)
    try:
        ticket = Ticket.objects.get(id=ticket_id)

        if reason:
            check_role(request, UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN)
            ticket.admin_reply(request.user, clean_html(reason))

        ticket.close_ticket()
        return json_response()
    except Ticket.DoesNotExist:
        raise MGEError.NOT_FOUND


@login_required_api
def finish_ticket(request: HttpRequest):
    ticket_id = get_json_field_r(request, 'ticket_id')
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        ensure_privacy(request, ticket.created_by)
        ticket.finish_ticket()
        return json_response()
    except Ticket.DoesNotExist:
        raise MGEError.NOT_FOUND


@login_required_api
@require_POST_api
def upload_file(request: HttpRequest):
    if not request.FILES:
        raise MGEError.BAD_PARAMETER
    files = request.FILES.getlist('files[]')
    rs = list()
    for file in files:
        t = TicketAttachment(filename=file.name, file=file, owner=request.user)
        t.save()
        rs.append(dict(id=t.id, url=t.get_url(), name=t.filename))
    return json_response(rs)


@login_required_api
@require_POST_api
def upload_image(request: HttpRequest):
    if not request.FILES:
        raise MGEError.BAD_PARAMETER
    files = request.FILES.getlist('files[]')
    rs = list()
    for file in files:
        t = TicketImage(filename=file.name, image=file, owner=request.user)
        t.save()
        rs.append(dict(id=t.id, url=t.get_url(), name=t.filename))
    return json_response(rs)


class TicketList(AutoFilterMixin, generics.ListAPIView):
    serializer_class = TicketSerializer
    queryset = Ticket.objects.all()

    filter_fields = '__all__'

    def pre_filter_queryset(self, queryset):
        # TODO
        return queryset


# ADDed By @ChenFangyi
@login_required_api
def topic_choices(request: HttpRequest):
    return json_response({'topic_choices': TicketType.to_choices()})


@login_required_api
@require_GET_api
def list_tickets(request: HttpRequest):
    page = get_param('page')
    t_type = get_param('type')
    if t_type not in ('new', 'open', 'ended', 'closed'):
        t_type = 'new'
    if not request.user.has_role(
            UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN | UserRole.DOI_ADMIN):
        params = dict(created_by=request.user)
    else:
        params = {}
    if t_type == 'new':
        if not request.user.has_role(UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN):
            params['new_admin_reply'] = True
        else:
            params['new_user_reply'] = True
    elif t_type == 'open':
        params['status'] = 1
    elif t_type == 'closed':
        params['status'] = 2
    elif t_type == 'ended':
        params['status'] = 3

    if len(params) > 0:
        tickets = Ticket.objects.filter(**params)
    else:
        tickets = Ticket.objects.all()

    paginator = Paginator(tickets, 15)
    if page:
        try:
            tickets = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            page = 1
            tickets = paginator.page(1)
    else:
        page = 1
        tickets = paginator.page(1)

    tickets = [t.to_dict() for t in tickets]
    return json_response({'ticket_list': tickets,
                          'page_number': paginator.num_pages,
                          'current_page': int(page),
                          'ticket_type': t_type})


@login_required_api
@require_methods_api(['GET', 'PATCH'])
def ticket(request: HttpRequest, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        raise MGEError.NOT_FOUND

    if request.method == 'GET':
        if not is_the_same_user(request, ticket.created_by) and not request.user.has_role(
                UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN):
            raise MGEError.PERMISSION_DENIED
        reply_list = [t.to_dict() for t in list(ticket.get_replies())]
        return json_response({'ticket': ticket.to_dict(), 'reply_list': reply_list})

    elif request.method == 'PATCH':
        type = get_json_field_r(request, 'type',allowed=['close', 'finish'])

        if type == "close":
            reason = get_json_field_r(request, 'reasons', allow_none=True)
            if reason:
                check_role(request, UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN)
                ticket.admin_reply(request.user, clean_html(reason))

            ticket.close_ticket()
            return json_response()

        elif type == "finish":
            ensure_privacy(request, ticket.created_by)
            ticket.finish_ticket()
            return json_response()

        else:
            raise MGEError.BAD_JSON
