from apps.storage.constraint.utils.constraint_helper import Expression2ConstraintHelper
from apps.storage.constraint.utils.operator import Operator
from mgedata.test import MGETestCase


class Expression2ConstraintHelperTester(MGETestCase):
    def setUp(self):
        self.e2ch = Expression2ConstraintHelper()

    def test_range(self):
        e1 = ["value", "1", "<"]
        c1 = self.e2ch.rpn_expression_to_tree(e1)
        c1.validate(0)
        try:
            c1.validate(1)
        except:
            pass
        else:
            raise
        e2 = ["value", "1.0", "<"]
        c2 = self.e2ch.rpn_expression_to_tree(e2)
        c2.validate(0)
        c1.validate(0.9)
        try:
            c1.validate(1.1)
        except:
            pass
        else:
            raise

    def test_choice(self):
        e1 = ["value", "[1,2,3,4,5]", "in"]
        c1 = self.e2ch.rpn_expression_to_tree(e1)
        c1.validate(1)
        c1.validate(2)
        c1.validate(3)
        c1.validate(4)
        c1.validate(5)
        try:
            c1.validate(6)
        except:
            pass
        else:
            raise
        e2 = ["value", "[1.0,1.2,1.3]", "in"]
        c2 = self.e2ch.rpn_expression_to_tree(e2)
        c2.validate(1.0)
        c2.validate(1.2)
        c2.validate(1.3)
        try:
            c2.validate(1.1)
        except:
            pass
        else:
            raise

    def test_length(self):
        e1 = ["length", "3", "!="]
        c1 = self.e2ch.rpn_expression_to_tree(e1)
        c1.validate([1, 2])
        c1.validate([1, 2, 2, 3, 4])
        try:
            c1.validate([1, 2, 3])
        except:
            pass
        else:
            raise

    def test_logic_and(self):
        e1 = ["value", "3", "<", "value", "1", ">", "AND"]
        c1 = self.e2ch.rpn_expression_to_tree(e1)
        c1.validate(2)
        try:
            c1.validate(1)
        except:
            pass
        else:
            raise
        try:
            c1.validate(6)
        except:
            pass
        else:
            raise

        e1 = ["value", "3", ">", "value", "-1", "<", "OR"]
        c1 = self.e2ch.rpn_expression_to_tree(e1)
        c1.validate(4)
        c1.validate(-2)
        try:
            c1.validate(0)
        except:
            pass
        else:
            raise
