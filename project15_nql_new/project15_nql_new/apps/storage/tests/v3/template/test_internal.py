import unittest
from django.test import TestCase

from mgedata.generic.trans.internal import DictToTemplateContent


class TestIntervalTemplateTransformer(TestCase):

    def setUp(self) -> None:
        from mgedata.test.utils.sample.template import templates
        self.t1 = DictToTemplateContent(templates[0])

    def test_sanity(self):
        self.t1.to().validate()


if __name__ == '__main__':
    unittest.main(verbosity=2)
