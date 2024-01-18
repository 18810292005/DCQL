import re

re_kwargs = re.compile(r'(\(\?P<(.*?)>(.*?)\))')
# re_non_capture = re.compile(r'(\(\?(.*?)\))')
re_escape = re.compile(r'(\\(.))')


def detect_type(regex: str):
    """
    将正则字符串转换成typescript的类型
    基本不能正常工作只能做最简单的检测
    :param regex:
    :return:
    """
    # 是的就是这么粗暴
    if regex.startswith('[0-9]') or regex.startswith(r'\d'):
        return 'number'
    else:
        return 'string'


def extract_url_args(url):
    args = {}
    # 找到所有形如(?P<name>\d+)的参数并提取出name
    kwargs = re_kwargs.findall(url)
    if kwargs is not None:
        for e in kwargs:
            args[e[1]] = detect_type(e[2])
            url = url.replace(e[0], f'${{{e[1]}}}')
    # 找到转义字符
    escapes = re_escape.findall(url)
    if escapes:
        for e in escapes:
            url = url.replace(e[0], e[1])

    return url, (None if len(args) == 0 else args)


if __name__ == '__main__':
    print(extract_url_args('/api/v2/storage/data/(?P<oid>[0-9]+)'))
    print(extract_url_args('/api'))
    print(extract_url_args(r'articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<slug>[\w-]+)'))
    print(extract_url_args(r'/api/v1/account/users/(?P<username>[\w.@+-]+)/avatar/'))
