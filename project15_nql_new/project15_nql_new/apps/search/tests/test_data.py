'''
Description: 生成data content相关的单元测试
Autor: liminghong.dev
Date: 2021-03-29 11:46:58
'''
import unittest

from mgedata.generic.trans import DictToData, DictToTemplateContent, TemplateContentToData
from mgedata.test.utils.sample.array import dict_data, es_data, template

from apps.search.trans.data import DataToEsDocument


class TestDataContentToEsDocument(unittest.TestCase):

    def test_content(self):
        for i in range(len(dict_data)):
            data = TemplateContentToData(DictToTemplateContent(template).to()).to()
            data = DictToData(data, dict_data[i]).to()
            es_doc = DataToEsDocument(data).to()
            self.assertEqual(es_data[i]['content'], es_doc['content'])

    def test_meta(self):
        for i in range(len(dict_data)):
            data = TemplateContentToData(DictToTemplateContent(template).to()).to()
            data = DictToData(data, dict_data[i]).to()
            data['doi'] = 'doi'
            data['purpose'] = 'purpose'
            data['template_name'] = 'template_name'

            es_doc = DataToEsDocument(data).to()

            for field in DataToEsDocument.fields:
                if data[field] is None:
                    continue
                self.assertEqual(data[field], es_doc.get(field))


if __name__ == '__main__':
    unittest.main(verbosity=2)
