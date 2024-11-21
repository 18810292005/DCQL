import json
import random
import pprint

from django.shortcuts import reverse


from mgedata.test import MGETestCase
from mgedata.test.utils.client import post_to_login
from mgedata.test.utils.sample.template import templates
from apps.account.models import User
from apps.storage.models.material import Category, MaterialMethod


class TestTemplateView(MGETestCase):

    def postSetUp(self):
        self.user = User.objects.get(pk='test')
        self.category = Category.objects.get(name_zh='leaf')
        self.method = MaterialMethod.objects.all().first()

    def make_upload_template_json(self, idx, template):
        return {
            'title': f'template{idx}',
            'abstract': f'template{idx}',
            'category': self.category.id,
            'method': self.method.id,
            'published': True,
            'content': template
        }

    def test_post_create_templates_on_field_missing(self):
        post_to_login(self.client, 'test', 'test')
        for idx, template in enumerate(templates):
            data = self.make_upload_template_json(idx, template)
            data.pop(random.choice(list(data.keys())))

            res = self.client.post(
                reverse('api_v3_storage:templates-list'),
                json.dumps(data),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 422, res.json())
        res = self.client.get(
            reverse('api_v3_storage:templates-list'),
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['data']['count'], 0)

    def test_post_create_templates_on_invalid_field(self):
        post_to_login(self.client, 'test', 'test')
        for idx, template in enumerate(templates):
            data = self.make_upload_template_json(idx, template)
            data[random.choice(list(data.keys()))] = -1

            res = self.client.post(
                reverse('api_v3_storage:templates-list'),
                json.dumps(data),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 422, res.json())
        res = self.client.get(
            reverse('api_v3_storage:templates-list'),
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['data']['count'], 0)


class MGETemplateTestCase(MGETestCase):

    def postSetUp(self):
        self.user = User.objects.get(pk='test')
        self.category = Category.objects.get(name_zh='leaf')
        self.method = MaterialMethod.objects.all().first()
        self.template_id_list = []

        post_to_login(self.client, 'test', 'test')
        for idx, template in enumerate(templates):
            res = self.client.post(
                reverse('api_v3_storage:templates-list'),
                json.dumps({
                    'title': f'template{idx}',
                    'abstract': f'template{idx}',
                    'category': self.category.id,
                    'method': self.method.id,
                    'published': True,
                    'content': template
                }),
                content_type='application/json'
            )
            self.template_id_list.append(res.json()['data'])


class TestTemplateRetrieve(MGETemplateTestCase):

    def test_retrieve_basic(self):
        res = self.client.get(
            reverse('api_v3_storage:templates-list'),
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['data']['count'], 5)

        res = self.client.get(
            reverse('api_v3_storage:templates-list'),
            {'method': self.method.id + 1,
             'category': self.category.id}
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['data']['count'], 0)

    def test_retrieve_error(self):
        res = self.client.get(
            reverse('api_v3_storage:templates-list'),
            {'method': self.method.id,
             'category': self.category.id + 1}
        )
        self.assertEqual(res.status_code, 200, res.json())
        self.assertEqual(res.json()['data']['count'], 0)

    def test_retrieve_default_method(self):
        res1 = self.client.get(
            reverse('api_v3_storage:templates-list'),
            {'category': self.category.id}
        )
        res2 = self.client.get(
            reverse('api_v3_storage:templates-list'),
            {'method': self.method.id,
             'category': self.category.id}
        )
        self.assertEqual(res1.json(), res2.json(), pprint.pformat(res1.json()) + pprint.pformat(res2.json()))


class TestTemplateModify(MGETemplateTestCase):

    def test_modify_title(self):
        for template_id in self.template_id_list:
            res = self.client.patch(
                reverse('api_v3_storage:templates-detail', kwargs={'pk': template_id}),
                json.dumps({'title': f'on modified {template_id}'}),
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 200, res.json())

        for template_id in self.template_id_list:
            res = self.client.get(
                reverse('api_v3_storage:templates-detail', kwargs={'pk': template_id})
            )
            self.assertEqual(res.status_code, 200, res.json())
            self.assertEqual(res.json()['data']['title'], f'on modified {template_id}', res.json())
