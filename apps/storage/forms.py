# -*- coding: utf-8 -*-

# @File   : forms.py
# @Author : Yuvv
# @Date   : 2018/1/4

from django import forms

from .models import Category


class MaterialCategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ('parent', 'name_zh', 'name_en', 'doi_prefix', 'is_public', 'hidden', 'order')
