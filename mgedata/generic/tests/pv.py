import unittest

from mgedata.generic.pv import PathValueSet
from mgedata.generic.trans.pv import XlsxDictToPathValueSet


class TestPairValueSet(unittest.TestCase):

    def test_sanity(self):
        pv = PathValueSet()
        pv.insert(('field1', 'field2', '1', 'field3'), '100')
        self.assertEqual(pv.get(('field1', 'field2', '1', 'field3')), '100')

#
# class TestPairValueSetToXlsxDict(unittest.TestCase):
#
#     def test_sanity(self):
#         from mgedata.test.utils.sample.array import xlsx_dict, path_value_set as actual_path_value_set
#         path_value_set = XlsxDictToPathValueSet(xlsx_dict).to()
#         self.assertEqual(path_value_set, actual_path_value_set)


if __name__ == '__main__':
    unittest.main()
