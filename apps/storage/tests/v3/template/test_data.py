import unittest
from django.test import TestCase

from mongoengine import connect, disconnect

from mgedata.test.utils.sample.template import templates
from mgedata.generic.trans import DictToTemplateContent, TemplateContentToDataContent


class TestTemplateToData(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        self.t0 = DictToTemplateContent(templates[0]).to()
        self.t1 = DictToTemplateContent(templates[1]).to()

    def test_sanity(self):
        TemplateContentToDataContent(self.t0).to()
        TemplateContentToDataContent(self.t1).to()

    def test_string_field(self):
        d = TemplateContentToDataContent(self.t1).to()
        d.create()
        d['字符串'].create()
        d['字符串'].set('hello')

    def test_numeric_field(self):
        d = TemplateContentToDataContent(self.t1).to()
        d.create()
        self.assertEqual(d['数值型'].name, '数值型')
        self.assertEqual(d['数值型'].unit, 'C')


if __name__ == '__main__':
    unittest.main(verbosity=2)
