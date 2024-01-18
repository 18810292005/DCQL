import base64

from django.contrib import admin
from django.forms import ModelChoiceField
from django.shortcuts import reverse
from django.utils.html import format_html

from apps.task.models import UserTask, TaskType
from mgedata.errors.models import MGEException
from .models import Certificate, ExpertEvaluation, TemplateRecommend, Acceptance, AcceptanceState
from .tasks import CertificateUpdateTask
from ..storage.models import DataMeta
from ..storage.tasks import RebuildFileUsageTask


class UserChoiceField(ModelChoiceField):
    def label_from_instance(self, obj):
        return f"{obj.real_name}"


def bulk_update_certificate(modeladmin, request, queryset):
    for cert in queryset:
        try:
            UserTask.add_task(None, CertificateUpdateTask().s(ps_id=cert.ps_id, is_project=cert.is_project),
                              TaskType.CERTIFICATE_UPDATE)
        except MGEException:
            pass


def bulk_rebuild_certificate_file_usage(modeladmin, request, queryset):
    for cert in queryset:
        if cert.is_project:
            meta_id_list = DataMeta.objects.filter(other_info__project=cert.ps_id).values_list('id', flat=True)
        else:
            meta_id_list = DataMeta.objects.filter(other_info__subject=cert.ps_id).values_list('id', flat=True)
        try:
            UserTask.add_task(None, RebuildFileUsageTask().s(list(meta_id_list)), TaskType.CERTIFICATE_REBUILD)
        except MGEException:
            pass


bulk_update_certificate.short_description = '后台更新'
bulk_rebuild_certificate_file_usage.short_description = '重建图片/文件数量'


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('ps_id', 'issue_time', 'is_project', 'show_cert', 'show_cert_pdf')
    list_filter = ('issue_time',)
    search_fields = ('ps_id',)
    actions = [bulk_update_certificate, bulk_rebuild_certificate_file_usage]

    def get_form(self, request, obj=None, **kwargs):
        self.exclude = ("research",)
        form = super(CertificateAdmin, self).get_form(request, obj, **kwargs)
        return form

    def show_cert(self, obj):
        url = reverse('certificate:show_certificate', kwargs={
            'key': base64.urlsafe_b64encode(obj.key.encode()).decode()
        })
        return format_html('<a href="%s">%s</a>' % (url, '查看汇交证明'))

    def show_cert_pdf(self, obj):
        url = reverse('certificate:certificate_pdf', kwargs={
            'key': base64.urlsafe_b64encode(obj.key.encode()).decode()
        })
        return format_html('<a href="%s">%s</a>' % (url, '查看PDF'))


@admin.register(Acceptance)
class AcceptanceAdmin(admin.ModelAdmin):
    list_display = ('ps_id', 'leader', 'user', 'is_project', 'show_evaluation_pdf')
    search_fields = ('ps_id', 'user__real_name', 'user__username')
    autocomplete_fields = ['leader', 'user']

    class ChoiceField(ModelChoiceField):
        def label_from_instance(self, obj):
            return f"{obj.ps_id}: {AcceptanceState(obj.state).description}"

    def show_evaluation_pdf(self, obj):
        url = reverse('certificate:evaluation_pdf', kwargs={
            'key': base64.urlsafe_b64encode(obj.certificate.key.encode()).decode()
        })
        return format_html('<a href="%s">%s</a>' % (url, '查看专家评价PDF'))


@admin.register(TemplateRecommend)
class TemplateRecommendAdmin(admin.ModelAdmin):
    list_display = ('id', 'expert', 'template', 'score', 'add_time', 'comment')


@admin.register(ExpertEvaluation)
class ExpertEvaluation(admin.ModelAdmin):
    list_display = ('get_ps_id', 'expert', 'finished', 'u_time', 'is_leader')
    search_fields = ('expert__real_name', 'expert__username', 'acceptance__ps_id')
    autocomplete_fields = ['expert']

    def get_ps_id(self, obj):
        return obj.acceptance.ps_id

    get_ps_id.short_description = 'ps_id'

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'acceptance':
            return AcceptanceAdmin.ChoiceField(queryset=Acceptance.objects.all())
        # elif db_field.name == 'expert':
        #     qs = UserRolesForAcceptanceModel.objects.filter(
        #         roles__contains=[UserRolesForAcceptance.AcceptanceExpert.value,
        #                          UserRolesForAcceptance.GroupLeader.value,
        #                          UserRolesForAcceptance.SubjectLeader.value,
        #                          UserRolesForAcceptance.ProjectLeader.value]).values_list(
        #         'user_id')
        #
        #     return UserChoiceField(queryset=User.objects.filter(username__in=qs))
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
