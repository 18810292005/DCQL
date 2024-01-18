# -*- coding: utf-8 -*-

# @File   : collect_urls_ts.py
# @Author : Jasper0819X
# @Date   : 2018/11/29

import sys

from django.core.management.base import BaseCommand
from django.conf import settings
from django.urls.resolvers import URLPattern, URLResolver
from .extract_url_args import extract_url_args


def collect_urls(url_patterns, prefix=''):
    assert isinstance(url_patterns, list)

    ret = {}
    for item in url_patterns:
        regex_pattern = item.pattern.regex.pattern
        regex_pattern = regex_pattern.lstrip('^').rstrip('$')
        if isinstance(item, URLResolver):
            # 没有命名空间的URL不解析
            if not item.namespace:
                continue
            namespace = item.namespace.replace('-', '_')
            ret[namespace] = collect_urls(item.url_patterns,
                                          prefix=prefix + regex_pattern)

        elif isinstance(item, URLPattern):
            if not item.name:
                continue

            name = item.name.replace('-', '_')
            url, args = extract_url_args(prefix + regex_pattern)
            if not url.startswith('/'):
                url = '/' + url
            if args is not None:
                # 有参数的情况，生成一个函数
                arguments = ', '.join([f'{key}: {args[key]}' for key in args])
                url = f'({arguments}) => `{url}`,'
            else:
                url = f"'{url}',"

            ret[name] = url
        else:
            raise Exception('unrecognized pattern type')

    return ret


def write_urls(f, urls: dict, indent: int):
    for key in urls:
        if isinstance(urls[key], dict):
            f.write(' ' * indent + f'{key}: {{\n')
            write_urls(f, urls[key], indent + 2)
            f.write(' ' * indent + '},\n')
        else:
            f.write(' ' * indent + f'{key}: {urls[key]}\n')


def load_urlconf_from_string(url_module_path):
    __import__(url_module_path)
    return sys.modules[url_module_path]


class Command(BaseCommand):
    help = """
    收集工程的URL信息并生成TypeScript文件
    用法：
          python manage.py collect_urls_ts -o static_src/apis/Urls.ts
    """

    def add_arguments(self, parser):
        parser.add_argument('-o', dest='output',
                            help='输出文件名')

    def handle(self, *args, **kwargs):
        output_file_path = kwargs['output'] or 'Urls.ts'

        root_conf = load_urlconf_from_string(settings.ROOT_URLCONF)

        urls = collect_urls(root_conf.urlpatterns)
        with open(output_file_path, 'w') as f:
            f.write('export const Urls = {\n')
            write_urls(f, urls, 2)
            f.write('};\nexport default Urls;\n')
        self.stdout.write('Done.')
