# -*- coding: utf-8 -*-

# @File   : forms.py
# @Author : Yuvv
# @Date   : 2018/1/3

from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models.users import User as MyUser


class MyUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = MyUser


class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = MyUser
