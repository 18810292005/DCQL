from django.test import TestCase
from django.urls import reverse
from django.test import Client
from mgedata.test.utils.instances import template_create, materialMethodTemplateRelation_create, \
    materialMethod_create
import json


class TemplateMaterialMethodViewTest(TestCase):
    def setUp(self):
        self.template = template_create()
        materialMethodTemplateRelation_create()
        self.client = Client()

    def test_good(self):
        template_id = self.template.id
        params = {
            "template_id": template_id
        }
        resp = self.client.get(reverse('api_v3_storage:template_material_method'), params)
        res = {
            "method_id": materialMethod_create().id,
            "method_name": materialMethod_create().name,
            "category_id": self.template.category_id,
            "category_name": self.template.category.name
        }
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(json.loads(resp.content), res)
        pass
