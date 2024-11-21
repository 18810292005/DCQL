import unittest
from django.test import TestCase

from mongoengine import connect, disconnect

from apps.storage.models.template import Template as TemplatePgModel
from apps.storage.trans.db import DbToTemplateContent, DbToTemplate


class TestDbToTemplateContent(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity(self):
        for template_model in TemplatePgModel.objects.all():
            template_content = DbToTemplateContent(template_model.id).to()


class TestDbToTemplate(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def test_sanity(self):
        for template_model in TemplatePgModel.objects.all():
            template = DbToTemplate(template_model.id).to()


if __name__ == '__main__':
    unittest.main(verbosity=2)
