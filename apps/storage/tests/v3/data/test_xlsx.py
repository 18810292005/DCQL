'''
@Author: amazinglzy
@Date: 2019-07-19 08:48:47
@Last Modified by:   amazinglzy
@Last Modified time: 2019-07-19 08:48:47
'''
import unittest
from mongoengine import connect, disconnect

from django.test import TestCase
from apps.storage.trans.file.xlsx.data import DataToXlsxDict
from apps.storage.trans.file.xlsx.template import TemplateContentToXlsxDict
# from apps.storage.trans.file import DataToXlsxDict, TemplateContentToXlsxDict
from apps.storage.trans.db import DbToData, DbToTemplateContent
from apps.storage.models.template import Template as TemplatePgModel, DataMeta as DataMetaPgModel


class TestDataToXlsxDict(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity_sample_1000(self):
        for template_pg_ins in TemplatePgModel.objects.all()[:100:10]:
            template_content = DbToTemplateContent(template_pg_ins.id).to()
            xlsx_dict = TemplateContentToXlsxDict(template_content).to()
            for data_meta_pg_ins in DataMetaPgModel.objects.filter(template_id=template_pg_ins.id)[:20]:
                data = DbToData(data_meta_pg_ins.id).to()
                xlsx_dict = DataToXlsxDict(data).to(xlsx_dict)
            print(xlsx_dict)


if __name__ == '__main__':
    unittest.main(verbosity=2)
