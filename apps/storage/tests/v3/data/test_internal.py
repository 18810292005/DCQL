import unittest
from mongoengine import connect, disconnect

from django.test import TestCase

from mgedata.generic.trans.dict import DictToDataContent, DictToData, DataContentToDict, DataToDict
from mgedata.generic.trans.internal import DictToTemplateContent
from mgedata.generic.trans.data import TemplateContentToDataContent, TemplateContentToData


class TestDictToData(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity_1(self):
        # from apps.storage.tests.v3.data import templates, data
        from mgedata.test.utils.sample.template import templates
        from mgedata.test.utils.sample.data import data
        template = DictToTemplateContent(templates[4]).to()
        d = DictToData(TemplateContentToData(template).to(), data[4][0]).to()
        self.assertEqual(data[4][0], DataToDict(d).to())


class TestDictToDataContent(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity_1(self):
        from mgedata.test.utils.sample.data import data_content_dict_1
        from mgedata.test.utils.sample.template import templates
        data_content = TemplateContentToDataContent(DictToTemplateContent(templates[2]).to()).to()
        dc = DictToDataContent(data_content, data_content_dict_1).to()
        self.assertEqual(DataContentToDict(dc).to(), data_content_dict_1)


if __name__ == '__main__':
    unittest.main(verbosity=2)
