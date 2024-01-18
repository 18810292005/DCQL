from django import forms
from django.contrib import admin

from apps.service.models import FrontendStaticInfo, VisitApiRecord


class FrontendStaticInfoForm(forms.ModelForm):
    name = forms.ChoiceField(choices=[('logo', 'logo')])

    class Meta:
        model = FrontendStaticInfo
        fields = ['name', 'file', 'description', 'content', 'is_delete']


@admin.register(FrontendStaticInfo)
class FrontendStaticInfoAdmin(admin.ModelAdmin):
    form = FrontendStaticInfoForm
    list_display = ('name', 'description', 'content', 'file', 'is_delete')
    search_fields = ('name',)


@admin.register(VisitApiRecord)
class VisitApiRecordAdmin(admin.ModelAdmin):
    list_display = ('username', 'path', 'method', 'body', 'cost_time', )
    list_filter = ('method', 'visit_time', )
    order_by = ('-cost_time', )