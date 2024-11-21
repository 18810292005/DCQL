'''
@Author: amazinglzy
@Date: 2019-07-19 10:10:20
@Last Modified by:   amazinglzy
@Last Modified time: 2019-07-19 10:10:20
'''
import os
import shutil
from django.test import TestCase
from tempfile import mkdtemp
from mongoengine import connect, disconnect

from mgedata.generic.dataset import DataSet

from apps.storage.models.template import Template as TemplatePgModel, DataMeta as DataMetaPgModel
from apps.storage.trans.file.xlsx import XlsxDictToXlsxFile, XlsxFileToXlsxDict, DataSetToXlsxDict
from apps.storage.trans.db import DbToTemplate


class TestXlsxDictToXlsxFile(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self):
        self.tmp_dir = mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_sanity(self):
        xlsx_dict = dict(
            values={
                'Data Info': {'header': (1, 'id',), 'rows': [(2, 1,), (3, 2,)]},
                '1': {'header': (1, 'id', 'name'), 'rows': [(2, 1, 'Alice'), (3, 2, 'Bob')]},
                '2': {'header': (1, 'id', 'title'), 'rows': [(2, 1, 'what is that?'), (3, 2, 'See you later!')]}
            },
            ord=['Data Info', '1', '2'],
            structure=('1', {'links': ('2', None)}))
        tr = XlsxDictToXlsxFile(xlsx_dict)
        tr.to(os.path.join(self.tmp_dir, 'testing.xlsx'))


class TestXlsxFileToXlsxDict(TestCase):

    @classmethod
    def setUpClass(cls):
        disconnect()
        connect('mongoenginetest', host='mongomock://localhost')

    @classmethod
    def tearDownClass(cls):
        disconnect()

    def setUp(self):
        self.tmp_dir = mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_sanity(self):
        xlsx_dict = dict(
            values={
                'Data Info': {'header': (1, 'id',), 'rows': [(2, 1,), (3, 2,)]},
                '1': {'header': (1, 'id', 'name', 'links'), 'rows': [(2, 1, 'Alice', None), (3, 2, 'Bob', None)]},
                '2': {'header': (1, 'id', 'title'), 'rows': [(2, 1, 'what is that?'), (3, 2, 'See you later!')]}
            },
            ord=['Data Info', '1', '2'],
            structure=('1', {'links': ('2', None)}))
        tr = XlsxDictToXlsxFile(xlsx_dict)
        tr.to(os.path.join(self.tmp_dir, 'testing.xlsx'))

        rtr = XlsxFileToXlsxDict(os.path.join(self.tmp_dir, 'testing.xlsx'))
        back_dict = rtr.to()
        self.assertEqual(xlsx_dict['values']['1'], back_dict['values']['1'])
        self.assertEqual(xlsx_dict['values']['2'], back_dict['values']['2'])
        self.assertEqual(back_dict['values']['Template Structure'],
                         {'header': (1, 'Template Structure', 'Sheet Name'),
                          'rows': [(2, 'content', '1'), (3, 'content.links', '2')]})


class TestDataSetToXlsxDict(TestCase):

    def test_sanity(self):
        for tpl in TemplatePgModel.objects.all().values('id')[::50]:
            template = DbToTemplate(tpl['id']).to()
            dataset = DataSet(template)
            for dd in DataMetaPgModel.objects.filter(template_id=tpl['id']).values('id')[:10]:
                dataset.add_data_by_id(dd['id'])
            print(DataSetToXlsxDict(dataset).to())


class TestDataSetToXlsxFile(TestCase):

    def setUp(self):
        self.tmp_dir = mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.tmp_dir)

    def test_sanity(self):
        for tpl in TemplatePgModel.objects.all().values('id')[::50]:
            template = DbToTemplate(tpl['id']).to()
            dataset = DataSet(template)
            for dd in DataMetaPgModel.objects.filter(template_id=tpl['id']).values('id')[:10]:
                dataset.add_data_by_id(dd['id'])
            xlsx_dict = DataSetToXlsxDict(dataset).to()
            tr = XlsxDictToXlsxFile(xlsx_dict)
            tr.to(os.path.join(self.tmp_dir, 'testing.xlsx'))

            rtr = XlsxFileToXlsxDict(os.path.join(self.tmp_dir, 'testing.xlsx'))
            back_dict = rtr.to()

# zhiyuan
# class TestXlsxDictToData(MGETestCase):
#
#     def test_sample_1(self):
#         from mgedata.test.utils.sample.array import template as template_dict, dict_data, xlsx_dict as const_xlsx_dict
#         template = DictToTemplateContent(template_dict).to()
#
#         xlsx_dict = copy.deepcopy(const_xlsx_dict)
#         for i in range(len(dict_data)):
#             expected_data = DictToData(TemplateContentToData(template).to(), dict_data[i]).to()
#             actual_data = XlsxDictToData(TemplateContentToData(template).to(), xlsx_dict).to()
#             self.assertEqual(DataToDict(expected_data).to()['content'], DataToDict(actual_data).to()['content'])
