from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import PageNotAnInteger, EmptyPage, Paginator
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.translation import gettext as _
from django.views.decorators.csrf import ensure_csrf_cookie

from apps.storage.models.data import DataMeta, DataReviewState
from mgedata.utils.general import *
from .auth import require_role
from .models.users import User, AccountAction, UserRole


def error_page(message, title=None, detail=None, status_code=200):
    from mgedata.utils.middleware import GlobalRequestMiddleware
    ctx = {}
    if detail:
        ctx['detail'] = detail
    if not title:
        ctx['title'] = _('Oops')
    else:
        ctx['title'] = title

    ctx['message'] = message
    return render(request=GlobalRequestMiddleware.get_current_request(), template_name='error.html', context=ctx,
                  status=status_code)


@ensure_csrf_cookie
def login_view(request: HttpRequest):
    next_page = request.GET.get('next', reverse('site_index'))
    if not request.user.is_authenticated:
        # return render(request, template_name='account/login2.html')
        return HttpResponseRedirect('http://nmdms.ustb.edu.cn/')
    try:
        return redirect(next_page)
    except Exception:
        return redirect(reverse('site_index'))


# mge的测试登录入口
@ensure_csrf_cookie
def login_view_mge(request: HttpRequest):
    next_page = request.GET.get('next', reverse('site_index'))
    if not request.user.is_authenticated:
        return render(request, template_name='account/login2.html')
    try:
        return redirect(next_page)
    except Exception:
        return redirect(reverse('site_index'))


@ensure_csrf_cookie
def register_view(request: HttpRequest):
    if request.user.is_authenticated:
        return redirect(reverse('site_index'))
    else:
        return render(request, template_name='account/register2.html')


def logout_view(request: HttpRequest):
    next_page = request.GET.get('next', reverse('site_index'))
    if request.user.is_authenticated:
        logout(request)
    try:
        return redirect(next_page)
    except Exception:
        return redirect(reverse('site_index'))


@login_required
def notifications(request: HttpRequest, page: int = 1):
    notification_list = request.user.notifications.all()
    paginator = Paginator(notification_list, per_page=10)
    try:
        res = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        raise MGEError.NOT_FOUND
    else:
        return render(request, template_name='account/notifications.html',
                      context={'notifications': res, 'page_count': paginator.num_pages, 'current_page': page})


@login_required
def my_info(request: HttpRequest):
    return render(request, template_name='account/me.html')


@login_required
@ensure_csrf_cookie
def my_data(request):
    return render(request, 'account/my-data.html')


@ensure_csrf_cookie
def reset_password_request(request: HttpRequest):
    return render(request, template_name='account/reset_password_request.html')


@ensure_csrf_cookie
def reset_password(request: HttpRequest):
    error = error_page(message=_('Invalid link'),
                       detail=_('The link is invalid or your email address is already verified.'))
    token = request.GET.get('token', None)
    if not token:
        return error_page(message=_('Invalid link'))
    user = User.user_from_token(token)
    if not user or not user.verify_token(token, AccountAction.RESET_PASSWORD):
        return error
    return render(request, template_name='account/reset_password.html')


@require_role(UserRole.RESEARCHER)
@ensure_csrf_cookie
def upload_history(request: HttpRequest, state: str = "all", page: int = 1):
    q = {}
    if state == "all":
        q = {'user': request.user}
    else:
        try:
            q = {'user': request.user, 'review_state': DataReviewState[state.upper()]}
        except ValueError:
            raise MGEError.NOT_FOUND
    paginator = Paginator(UploadHistory.objects.filter(**q), 10)
    try:
        histories = paginator.page(page)
    except EmptyPage:
        raise MGEError.NOT_FOUND
    else:
        return render(request, template_name='account/upload_history.html',
                      context={'history_list': histories, 'page_count': paginator.num_pages,
                               'current_page': page, 'state': state})


@require_role(UserRole.RESEARCHER)
def upload_history_list_data(request: HttpRequest, history_id):
    page = request.GET.get('page', 1)
    try:
        history = UploadHistory.objects.get(id=history_id)
        if request.user == history.user or request.user.has_role(UserRole.DATA_ADMIN):
            meta_list = DataMeta.objects.filter(id__in=history.meta_id_list).select_related()
        else:
            raise MGEError.PERMISSION_DENIED
    except UploadHistory.DoesNotExist:
        meta_list = DataMeta.objects.none()
    if meta_list.count() == 0:
        raise MGEError.NO_AVAILABLE_DATA
    paginator = Paginator(meta_list, 10)
    try:
        result_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        result_page = paginator.page(1)
        page = 1

    context = {'history_id': history_id, 'page_count': paginator.num_pages, 'current_page': page,
               'meta_list': result_page, 'total': paginator.count}
    return render(request, template_name='account/upload_history_data.html', context=context)


def verify_email(request: HttpRequest):
    error = error_page(message=_('Invalid link'),
                       detail=_('The link is invalid or your email address is already verified.'))
    token = request.GET.get('token', None)
    if not token:
        return error
    user = User.user_from_token(token)
    if not user or not user.verify_token(token, AccountAction.VERIFY_EMAIL):
        return error
    return render(request, template_name='success.html',
                  context={'title': _('Success'),
                           'message': _('Your email address is verified.')})
