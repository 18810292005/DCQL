from apps.storage.constraint.utils.operator import Operator
from mgedata.test import MGETestCase


class OperatorTester(MGETestCase):
    def setUp(self):
        pass

    def test_for_range_choice_length(self):
        self.assertEqual(Operator.EQ.is_for_range_or_length, True)
        self.assertEqual(Operator.EQ.is_for_choice, False)
        self.assertEqual(Operator.IN.is_for_range_or_length, False)
        self.assertEqual(Operator.IN.is_for_choice, True)
