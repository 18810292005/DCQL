# -*- coding: utf-8 -*-

# @File   : collect_urls.py
# @Author : Yuvv
# @Date   : 2017/12/17


import sys
import re
import json
import types

from collections import OrderedDict
from django.urls.resolvers import URLPattern, URLResolver
from django.core.management.base import BaseCommand

from django.conf import settings

RE_KWARG = re.compile(r'(\(\?P\<(.*?)\>.*?\))')  # 命名参数
RE_ARG = re.compile(r'(\(.*?\))')      # 非命名参数
RE_ESCAPE = re.compile(r'(\\(.))')    # 转义字符

URLS_RESOLVE_JS = 'var Urls={};Urls.resolve=function(name,kwargs){var path=Urls._urls[name]||false;if(!path)' \
                  '{throw"URL not found for view: "+name}var _path=path;if(kwargs instanceof Object)' \
                  '{for(var key in kwargs){if(kwargs.hasOwnProperty(key))' \
                  '{if(!path.match("<"+key+">"))' \
                  '{throw key+" does not exist in "+_path}path=path.replace("<"+key+">",kwargs[key])}}}' \
                  'else{for(var j=1;j<arguments.length;j++)' \
                  '{path=path.replace("<>",arguments[j])}}' \
                  'var re=new RegExp("<.*?>","g");var missing_args=path.match(re);' \
                  'if(missing_args){throw"Missing arguments ("+missing_args.join(", ")+") for url "+_path}return path};'


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('-i', nargs='+', type=str,
                            dest='ignore', help='ignore namespace')   # 忽略的 namespace 们

        parser.add_argument('-o', dest='output',
                            help='output file name. default `Urls.min.js`')   # output file

        parser.add_argument('--indent', dest='indent', action='store_true',
                            help='Indent urls dict')  # indent size = 2

    def handle(self, *args, **options):
        """
        example:
            `python manage.py collect_urls -i admin -o static/js/Urls.min.js`
        """
        exclude_ns = options['ignore'] or []
        target_file_path = options['output'] or 'Urls.min.js'
        indent_size = 2 if options['indent'] else None

        js_patterns = OrderedDict()
        print("Generating Javascript urls file %s" % target_file_path)
        Command.handle_url_module(js_patterns, settings.ROOT_URLCONF, exclude_ns)
        # output to the file
        with open(target_file_path, 'w') as urls_file:
            urls_file.write(URLS_RESOLVE_JS)
            urls_file.write('Urls._urls=')
            json.dump(js_patterns, urls_file, indent=indent_size)
            urls_file.write(';\n')
        print("Done generating Javascript urls file %s" % target_file_path)

    @staticmethod
    def handle_url_module(js_patterns, module_name, exclude_ns, namespace='', prefix=''):
        if isinstance(module_name, (str, bytes)):
            __import__(module_name)
            root_urls = sys.modules[module_name]
            patterns = root_urls.urlpatterns
        elif isinstance(module_name, types.ModuleType):
            root_urls = module_name
            patterns = root_urls.urlpatterns
        else:
            root_urls = module_name
            patterns = root_urls

        for pattern in patterns:
            if isinstance(pattern, URLPattern):
                if pattern.name:
                    full_url = prefix + pattern.pattern.regex.pattern
                    for reg_chr in ["^", "$"]:
                        full_url = full_url.replace(reg_chr, "")
                    # handle kwargs, args
                    kwarg_matches = RE_KWARG.findall(full_url)
                    if kwarg_matches:
                        for el in kwarg_matches:
                            # prepare the output for JS resolver
                            full_url = full_url.replace(el[0], "<%s>" % el[1])
                    # after processing all kwargs try args
                    args_matches = RE_ARG.findall(full_url)
                    if args_matches:
                        for el in args_matches:
                            full_url = full_url.replace(el, "<>")  # replace by a empty parameter name
                    escape_matches = RE_ESCAPE.findall(full_url)
                    if escape_matches:
                        for el in escape_matches:
                            full_url = full_url.replace(el[0], el[1])
                    full_name = namespace + ':' + pattern.name if namespace else pattern.name
                    js_patterns[full_name] = '/' + full_url
            elif isinstance(pattern, URLResolver):
                if pattern.urlconf_name and pattern.namespace not in exclude_ns:
                    Command.handle_url_module(js_patterns, pattern.urlconf_name, exclude_ns,
                                              namespace=pattern.namespace, prefix=pattern.pattern.regex.pattern)
