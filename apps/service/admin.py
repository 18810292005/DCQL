from django import forms
from django.contrib import admin

from apps.service.models import FrontendStaticInfo


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
