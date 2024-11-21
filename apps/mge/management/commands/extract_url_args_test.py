import unittest
from .extract_url_args import extract_url_args


class ExtractUrlTest(unittest.TestCase):
    # 没有参数的情况
    def test_noargs(self):
        result, args = extract_url_args('/api/v1')
        self.assertEqual('/api/v1', result)
        self.assertEqual(None, args)

        result, args = extract_url_args('/api/v1/service/sub/class/')
        self.assertEqual('/api/v1/service/sub/class/', result)
        self.assertEqual(None, args)

    # 有参数的情况
    def test_args(self):
        result, args = extract_url_args('/api/v2/storage/data/(?P<oid>[0-9]+)')
        self.assertEqual('/api/v2/storage/data/${oid}', result)

        result, args = extract_url_args('articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/')
        self.assertEqual('articles/${year}/${month}/', result)

        result, args = extract_url_args(r'articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<slug>[\w-]+)')
        self.assertEqual('articles/${year}/${month}/${slug}', result)

    # 有转义字符的情况
    def test_escape(self):
        result, args = extract_url_args(r'/api/v1\.1')
        self.assertEqual('/api/v1.1', result)
        self.assertEqual(None, args)

        result, args = extract_url_args(r'/set\-language')
        self.assertEqual('/set-language', result)
        self.assertEqual(None, args)
