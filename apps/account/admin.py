from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from .models.users import User as MyUser


@admin.register(MyUser)
class MyUserAdmin(UserAdmin):
    list_display = ('username', 'real_name', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('username', 'email', 'real_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('real_name', 'email', 'email_verified', 'role', 'institution', 'tel')}),
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
