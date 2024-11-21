import unittest
from mongoengine import connect, disconnect

from django.test import TestCase

from mgedata.generic.trans import DataRandomFiller
from apps.account.models import User
from apps.storage.models.template import Template, Category

from mgedata.test.utils.client import post_to_create_user


class TestDataRandomFiller(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self) -> None:
        from mgedata.test.utils.sample.template import templates
        self.transformers = []

        post_to_create_user(self.client,
                            username='test',
                            password='test',
                            real_name='test',
                            email='xx@xx.cn',
                            tel='12003451356',
                            institution='ustb')
        self.user = User.objects.get(username='test')
        self.category_root = Category.objects.create(leaf=False, level=1, name_zh='root', name_en='root')
        self.category = Category.objects.create(parent=self.category_root,
                                                level=2,
                                                name_zh='leaf',
                                                name_en='leaf',
                                                leaf=True)
        self.templates = []
        for i in range(len(templates)):
            Template.objects.filter(title='模板测试{}'.format(i + 100)).delete()
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
        self.category.delete()
        self.category_root.delete()
        self.user.delete()

    def test_sanity(self):
        for i in range(len(self.templates)):
            DataRandomFiller(self.user.pk, self.category.id, self.templates[i].id).to()


if __name__ == '__main__':
    unittest.main(verbosity=2)
