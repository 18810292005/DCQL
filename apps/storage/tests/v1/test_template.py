from unittest import skip

from mgedata.test import MGETestCase
from mgedata.test.utils.http_tools import HttpTools
from apps.storage.models.template import Template
from django.urls import reverse
from mgedata.test.utils.fixture.template import create_template_one_show, create_template_show, \
    create_template_response, create_template


class TestTemplateApi(MGETestCase):

    def postSetUp(self):
        HttpTools.login_as_root_user(self.client)
        self.urls = {
            'templates': reverse('api_v1_storage:templates'),
            'template_one': reverse('api_v1_storage:template_one', kwargs={'tid': int(self.template_id)}),
            'oauth2_templates': reverse('api_v1_storage:oauth2_templates'),
            'oauth2_templates_one': reverse('api_v1_storage:oauth2_templates_one',
                                            kwargs={'tid': int(self.template_id)})
        }
        return

    def test_templates(self):
        self.maxDiff = None
        self.assertIsInstance(self.template_response_data, dict)
        self.assertIsInstance(self.template_id, str)
        self.assertEquals(self.template_response_data, create_template_response(self.template_id))
        self.assertEquals(Template.objects.filter(pk=self.template_id).count(), 1)

        self.assertEquals(
            HttpTools.get(client=self.client, url=self.urls['templates'], data={'per_page': 5, 'page': 1}),
            create_template_show(self.template_id, self.material_category_id, ref_count=1))
        return

    @skip
    def test_template_one(self):
        self.maxDiff = None
        self.assertEquals(HttpTools.get(client=self.client, url=self.urls['template_one']),
                          create_template_one_show(self.template_id, self.material_category_id, ref_count=1))

        self.assertEquals(HttpTools.patch(client=self.client, url=self.urls['template_one'],
                                          data=create_template(self.material_category_id))['code'], 0)
        return

    def test_template_oauth2_view(self):
        result = HttpTools.oauth2_get(client=self.client, url=self.urls['oauth2_templates'])
        self.assertEquals(result['code'], 0)
        self.assertEquals(result['data']['templates'][0]['id'], int(self.template_id))

        result = HttpTools.oauth2_get(client=self.client, url=self.urls['oauth2_templates_one'])
        self.assertEquals(result['code'], 0)
        self.assertEquals(result['data']['template']['id'], int(self.template_id))
        return
