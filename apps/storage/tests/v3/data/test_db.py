import unittest

from mongoengine import connect, disconnect
from django.test import TestCase

from mgedata.generic.trans import DictToDataContent, \
    DataContentToDict, DictToData, DataToDict, DataRandomFiller
from mgedata.generic.trans import TemplateContentToDataContent, DictToTemplateContent, TemplateContentToData
from mgedata.test.utils.asserts import dict_contains_another
from mgedata.test.utils.client import post_to_create_user
from mgedata.test.utils.sample.material import projects as material_projects

from apps.storage.trans.db import DataToDb, DataContentToDb, DbToDataContent, DbToData
from apps.account.models import User
from apps.storage.models.template import Template, Category, MaterialProject


class TestDbToDataContent(TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        from mgedata.test.utils.sample.template import templates
        from mgedata.test.utils.sample.data import data_content_1
        self.template_1 = DictToTemplateContent(templates[1]).to()
        self.template_2 = DictToTemplateContent(templates[2]).to()
        self.template_3 = DictToTemplateContent(templates[3]).to()
        self.data_content_1 = data_content_1
        self.transformers = []

        MaterialProject.make(material_projects)

        post_to_create_user(self.client,
                            username='test',
                            password='test',
                            real_name='test',
                            email='xx@xx.cn',
                            tel='12003451356',
                            institution='ustb')
        self.user = User.objects.get(username='test')
        self.category_root = Category.objects.create(leaf=False, level=0, name_zh='root', name_en='root')
        self.category = Category.objects.create(parent=self.category_root,
                                                level=1,
                                                name_zh='leaf',
                                                name_en='leaf',
                                                leaf=True)
        self.templates = []
        for i in range(len(templates)):
            Template.objects.filter(title=('模板测试{}'.format(i + 100))).delete()
            t, _ = Template.objects.update_or_create(user=self.user,
                                                     title='模板测试{}'.format(i + 100),
                                                     abstract='abstract',
                                                     category=self.category,
                                                     content=templates[i])
            self.templates.append(t)

    def tearDown(self) -> None:
        for i in range(len(self.transformers)):
            self.transformers[i].roll_back()
        for i in range(len(self.templates)):
            self.templates[i].delete()
        self.user.delete()
        self.category_root.delete()

    def test_combined_data_content_1(self):
        meta_id = 33  # 暂时随便设置的
        template_id = 1000  # 暂时设置
        transformer = DataContentToDb(meta_id, template_id, self.data_content_1)
        self.transformers.append(transformer)
        transformer.to()
        back_data_content = DbToDataContent(meta_id, TemplateContentToDataContent(self.template_1).to()).to()
        self.assertTrue(self.data_content_1 == back_data_content)

    def test_combined_data_content_2(self):
        from mgedata.test.utils.sample.data import data_content_dict_1
        from mgedata.test.utils.sample.template import templates
        dc = TemplateContentToDataContent(DictToTemplateContent(templates[2]).to()).to()
        dc = DictToDataContent(dc, data_content_dict_1).to()
        meta_id = 34
        template_id = 1001
        transformer = DataContentToDb(meta_id, template_id, dc)
        self.transformers.append(transformer)
        transformer.to()
        back_data_content = DbToDataContent(meta_id, TemplateContentToDataContent(self.template_2).to()).to()
        # print(data_content_dict_1)
        # print(DataContentToDict(back_data_content).to())
        self.assertTrue(data_content_dict_1 == DataContentToDict(back_data_content).to())

    def test_combined_data_content_3(self):
        from mgedata.test.utils.sample.data import data_content_dict_2
        from mgedata.test.utils.sample.template import templates
        dc = TemplateContentToDataContent(DictToTemplateContent(templates[3]).to()).to()
        dc = DictToDataContent(dc, data_content_dict_2).to()
        meta_id = 34
        template_id = 1001
        transformer = DataContentToDb(meta_id, template_id, dc)
        self.transformers.append(transformer)
        transformer.to()
        back_data_content = DbToDataContent(meta_id, TemplateContentToDataContent(self.template_3).to()).to()
        self.assertTrue(data_content_dict_2 == DataContentToDict(back_data_content).to())

    def test_combined_data_1(self):
        from mgedata.test.utils.sample.data import data
        from mgedata.test.utils.sample.template import templates
        d = TemplateContentToData(DictToTemplateContent(templates[4]).to()).to()
        data[4][0]['template'] = self.templates[4].id
        data[4][0]['category'] = self.category.id
        data[4][0]['project'] = '2016YFB0700500'
        data[4][0]['subject'] = '2016YFB0700503'
        d = DictToData(d, data[4][0]).to()
        transformer = DataToDb(d)
        self.transformers.append(transformer)
        meta_id = transformer.to()
        back_data = DbToData(meta_id).to()
        # self.assertEqual(DataToDict(back_data).to(), data[4][0])
        self.assertTrue(dict_contains_another(DataToDict(back_data).to(), data[4][0]))

    def test_combined_data_random(self):
        for i in range(len(self.templates)):
            d = DataRandomFiller(self.user.pk, self.category.id, self.templates[i].id).to()
            transformer = DataToDb(d)
            self.transformers.append(transformer)
            meta_id = transformer.to()
            back_data = DbToData(meta_id).to()
            # self.assertEqual(DataToDict(back_data).to(), DataToDict(d).to())
            self.assertTrue(dict_contains_another(DataToDict(back_data).to(), DataToDict(d).to()))


if __name__ == '__main__':
    unittest.main(verbosity=2)
