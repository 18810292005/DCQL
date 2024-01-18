from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models.users import User as MyUser
from .models.users import (UserRolesForAcceptanceModel,
                           AuthorityOfPrivateMaterialCategory)
from .models.notifications import SystemNotification, Notification
from .forms import MyUserChangeForm, MyUserCreationForm

from apps.storage.models import MaterialCategory, DataMeta
from ..search.tasks import import_to_es
from apps.analytics.tasks import full_site_count_refresh
from django.shortcuts import redirect

def public_user_all_data(modeladmin, request, queryset):
    for user in queryset:
        dm_ids = list(DataMeta.objects.filter(user=user).values_list('id', flat=True))
        DataMeta.objects.filter(id__in=dm_ids).update(public_date=timezone.now(), public_range='public')
        import_to_es.delay(dm_ids)


public_user_all_data.short_description = "公开所有数据"


def data_statistics_refresh(self, request, queryset):
    full_site_count_refresh.delay()

data_statistics_refresh.short_description = "刷新全站统计缓存"
data_statistics_refresh.acts_on_all = True

def project_info_download(self, request, queryset):
    return redirect('/api/v1/analytics/projects/downloadinfo')

project_info_download.short_description = "项目统计信息下载"
project_info_download.acts_on_all = True


@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    change_list_template = "storage/admin_datameta_changelist.html"
    form = MyUserChangeForm
    add_form = MyUserCreationForm

    list_display = ('username', 'real_name', 'email', 'roles')
    list_filter = ('roles',)
    search_fields = ('username', 'email', 'real_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('real_name', 'email', 'email_verified', 'roles', 'institution', 'tel')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'real_name', 'email', 'password1', 'password2'),
        }),
    )
    actions = [public_user_all_data, data_statistics_refresh, project_info_download]

    # 重写changelist_view使得不选择复选框就能执行
    def changelist_view(self, request, extra_context=None):
        try:
            action = self.get_actions(request)[request.POST['action']][0]
            action_acts_on_all = action.acts_on_all
        except (KeyError, AttributeError):
            action_acts_on_all = False

        if action_acts_on_all:
            post = request.POST.copy()
            post.setlist(admin.helpers.ACTION_CHECKBOX_NAME,
                         self.model.objects.values_list('username', flat=True))
            request.POST = post

        return super(MyUserAdmin, self).changelist_view(request, extra_context)



@admin.register(UserRolesForAcceptanceModel)
class UserRoleForAcceptanceAdmin(admin.ModelAdmin):
    search_fields = ('user__username', 'user__real_name')
    list_display = ('user', 'roles')
    list_filter = ('user', 'roles')
    ordering = ('-user__date_joined',)
    autocomplete_fields = ('user',)


def delete_notification(modeladmin, request, queryset):
    for o in queryset:
        o.delete()


delete_notification.short_description = _("Delete selected notifications")


@admin.register(SystemNotification)
class SystemNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'created_at')
    list_filter = ('title', 'content', 'created_at')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    actions = [delete_notification]

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


@admin.register(AuthorityOfPrivateMaterialCategory)
class AuthorityOfPrivateMaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'timestamp')

    fields = ('user', 'category')

    def get_form(self, request, obj=None, **kwargs):
        form = super(AuthorityOfPrivateMaterialCategoryAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['category'].queryset = MaterialCategory.objects.filter(is_public=False)
        return form


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "unread", "timestamp", "content", "important")
    autocomplete_fields = ['recipient']
