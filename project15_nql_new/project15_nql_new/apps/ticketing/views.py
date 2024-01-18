from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpRequest
from .models import Ticket, TicketType
from mgedata.utils.general import get_param
from apps.account.auth import is_the_same_user, UserRole
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from mgedata.utils.general import MGEError


@login_required
def show_ticket(request: HttpRequest, ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        if not is_the_same_user(request, ticket.created_by) and not request.user.has_role(
                UserRole.TEMPLATE_ADMIN | UserRole.DATA_ADMIN | UserRole.USER_ADMIN):
            raise MGEError.PERMISSION_DENIED
        return render(request, template_name='ticketing/show_ticket.html',
                      context={'reply_list': ticket.get_replies(), 'ticket': ticket})
    except Ticket.DoesNotExist:
        raise MGEError.NOT_FOUND


@login_required
def create_ticket(request: HttpRequest):
    return render(request, template_name='ticketing/create_ticket.html',
                  context={'topic_choices': TicketType.to_choices()})


@login_required
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

    return render(request, template_name='ticketing/list_tickets.html',
                  context={'ticket_list': tickets,
                           'page_number': paginator.num_pages,
                           'current_page': page,
                           'ticket_type': t_type})
