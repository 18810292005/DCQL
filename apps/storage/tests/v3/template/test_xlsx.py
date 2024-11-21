import unittest

from django.test import TestCase
from mongoengine import connect, disconnect

from apps.storage.models.template import Template as TemplatePgModel
from apps.storage.trans.file.xlsx import TemplateContentToXlsxDict
from apps.storage.trans.db import DbToTemplateContent


class TestTemplateContentToXlsxDict(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity(self):
        for template_model in TemplatePgModel.objects.all():
            xlsx_dict = TemplateContentToXlsxDict(DbToTemplateContent(template_model.id).to()).to()
        for template_model in TemplatePgModel.objects.all()[::50]:
            print(TemplateContentToXlsxDict(DbToTemplateContent(template_model.id).to()).to())


if __name__ == '__main__':
    unittest.main(verbosity=2)
