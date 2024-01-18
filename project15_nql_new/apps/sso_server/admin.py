from django.contrib import admin

from .models import SSOConsumer, ThirdPlatformTokenInformation


@admin.register(SSOConsumer)
class SSOConsumerAdmin(admin.ModelAdmin):
    list_display = ['name', 'access_key', 'access_secret', 'add_date']
    readonly_fields = ['access_key', 'access_secret']
    search_fields = ('name',)
    list_filter = ('add_date',)


@admin.register(ThirdPlatformTokenInformation)
class ThirdPlatformTokenInformationAdmin(admin.ModelAdmin):
    list_display = ['platform_name', 'token']
    search_fields = ('platform_name',)
