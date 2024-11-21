'''
Description: 生成索引相关的单元测试
Autor: liminghong.dev
Date: 2021-03-29 11:46:58
'''
import unittest

from mgedata.generic.trans.internal import DictToTemplateContent
from mgedata.test.utils.sample.template import templates
from mgedata.test.utils.sample.mapping import es_content_mapping, mapping
from mgedata.test.utils.sample.array import template as template_dict, es_mapping
from apps.search.trans.template import TemplateContentToEsContentMapping, TemplateContentToEsMapping


class TestTemplateContentToEsContentMappingTransformer(unittest.TestCase):

    def test_template_content_to_es_mapping(self):
        for i in range(5):
            self.assertEqual(
                TemplateContentToEsContentMapping(DictToTemplateContent(templates[i]).to()).to(),
                es_content_mapping[i]
            )

    def test_template_content_to_es_mapping_array(self):
        template = DictToTemplateContent(template_dict).to()
        es_mapping_transformed = TemplateContentToEsContentMapping(template).to()
        self.assertEqual(es_mapping_transformed, es_mapping['mapping']['_doc'])

    def test_template_to_es_mapping(self):
        template_content = DictToTemplateContent(dict(_ord=[])).to()
        es_mapping = TemplateContentToEsMapping('test', template_content).to()
        self.assertDictEqual(es_mapping, mapping)


if __name__ == '__main__':
    unittest.main(verbosity=2)
