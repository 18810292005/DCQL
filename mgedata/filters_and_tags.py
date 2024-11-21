# -*- coding: utf-8 -*-

# @File   : template_filters
# @Author : Jasper0819X; Harold Chen
# @Date   : 2018/3/19

from django.template import Library
from django.templatetags.static import StaticNode
from django.utils.html import conditional_escape
from django import template
from mgedata.settings import VER

register = Library()


@register.simple_tag(name='with_default', takes_context=True)
def with_default(context, key, obj=None, default=''):
    if obj is None:
        obj = context
    try:
        return obj[key]
    except (AttributeError, TypeError, KeyError, IndexError):
        return default


@register.simple_tag(name='version_code')
def verions_code():
    return '' + VER


@register.simple_tag(name='has_role', takes_context=True)
def has_role(context, role):
    request = context['request']
    return request.user.is_authenticated and request.user.has_role(role)


class NodeForStaticVer(StaticNode):
    def __init__(self, varname=None, path=None):
        if path is None:
            raise template.TemplateSyntaxError(
                "Static template nodes must be given a path to return.")
        self.path = path
        self.varname = varname

    def render(self, context):
        url = self.url(context)
        if context.autoescape:
            url = conditional_escape(url)
        url = url + '?v=' + VER
        if self.varname is None:
            return url
        context[self.varname] = url
        return ''


@register.tag(name='static_ver')
def static_ver(parser, token):
    bits = token.split_contents()
    if len(bits) < 2:
        raise template.TemplateSyntaxError(
            "'%s' takes at least one argument (path to file)" % bits[0])

    path = parser.compile_filter(bits[1])

    varname = bits[3] if len(bits) >= 2 and bits[-2] == 'as' else None

    return NodeForStaticVer(varname, path)
