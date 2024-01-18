from apps.storage.constraint.constraint import FieldConstraint, RangeConstraint, NoneConstraint, LengthConstraint, \
    ChoiceConstraint, EmptyConstraint
from apps.storage.constraint.utils.logic_tree import LogicNode
from apps.storage.constraint.utils.operator import Operator
from mgedata.errors.models import MGEError
from mgedata.test import MGETestCase


class ConstraintsTester(MGETestCase):
    def setUp(self):
        pass

    def test_constraint_expr(self):
        def assertConstraintsExpr(excepted, constraint: FieldConstraint):
            self.assertEqual(excepted, constraint.to_expr())
            self.assertEqual(excepted, str(constraint))

        c = RangeConstraint(operator=Operator.GT, value=1)
        assertConstraintsExpr(">1", c)
        c = RangeConstraint(operator=Operator.LT, value=0)
        assertConstraintsExpr("<0", c)
        c = RangeConstraint(operator=Operator.GTE, value=30)
        assertConstraintsExpr(">=30", c)
        c = RangeConstraint(operator=Operator.LTE, value=98)
        assertConstraintsExpr("<=98", c)
        c = RangeConstraint(operator=Operator.EQ, value=100)
        assertConstraintsExpr("==100", c)
        c = RangeConstraint(operator=Operator.NE, value=10)
        assertConstraintsExpr("!=10", c)

        c = ChoiceConstraint(operator=Operator.IN, value=[10, 20])
        assertConstraintsExpr("value in [10, 20]", c)
        c = ChoiceConstraint(operator=Operator.NIN, value=[10, 20])
        assertConstraintsExpr("value not in [10, 20]", c)

        c = NoneConstraint()
        assertConstraintsExpr("Value cannot be none", c)

        c1 = RangeConstraint(operator=Operator.GT, value=1)
        c2 = RangeConstraint(operator=Operator.LTE, value=98)
        c3 = RangeConstraint(operator=Operator.EQ, value=0)
        c4 = RangeConstraint(operator=Operator.EQ, value=100)
        c5 = RangeConstraint(operator=Operator.NE, value=10)
        c = (c1 & c2 | c3 | c4) & c5
        self.assertEqual(c.to_expr(), '((>1 AND <=98) OR ==0 OR ==100) AND !=10')
        c.invert()
        self.assertEqual(c.to_expr(), '((<=1 OR >98) AND !=0 AND !=100) OR ==10')

    def test_equal(self):
        c1 = NoneConstraint()
        c11 = NoneConstraint()
        c2 = RangeConstraint(operator=Operator.GT, value=1)
        c3 = RangeConstraint(operator=Operator.GT, value=2)
        c4 = LengthConstraint(operator=Operator.GT, value=2)
        self.assertEqual(c1, c11)
        self.assertNotEqual(c1, c2)
        self.assertNotEqual(c2, c3)
        self.assertNotEqual(c3, c4)
        self.assertEqual(c1, c1 & c11)
        self.assertEqual(c1, c1 | c11)

    def test_none_value(self):
        c = RangeConstraint(Operator.GT, 10)
        c.validate(None)

    def test_non_leaf_logic_node_without_children(self):
        c = RangeConstraint(value="any", logic_node=LogicNode.OR)
        c.validate("any test")
        c = RangeConstraint(value="any", logic_node=LogicNode.AND)
        c.validate("any test")

    def test_none_constraint(self):
        c = NoneConstraint()
        self.assertEqual("Value cannot be none", c.to_expr())
        c.validate(0)
        c.validate([])
        c.validate("")
        c.validate("abc")
        c.validate(10)
        try:
            c.validate(None)
        except Exception as e:
            print(e)
        try:
            NoneConstraint(operator=Operator.GT, value=1)
        except Exception as e:
            print(e)

        # combined with other constraint
        c = NoneConstraint() | RangeConstraint(operator=Operator.EQ, value=10)
        self.assertEqual("Value cannot be none OR ==10", c.to_expr())
        # NoneConstraint combined with another constraint with "OR" will nullify that constraint !!!!
        c.validate(None)
        c.validate(10)
        c.validate(0)

    def test_range_constraint(self):
        c1 = RangeConstraint(operator=Operator.GT, value=1)
        c2 = RangeConstraint(operator=Operator.LTE, value=98)
        c3 = RangeConstraint(operator=Operator.EQ, value=0)
        c4 = RangeConstraint(operator=Operator.EQ, value=100)
        c5 = RangeConstraint(operator=Operator.NE, value=10)
        c = (c1 & c2 | c3 | c4) & c5
        c.raise_with_expr = True
        self.assertEqual(c.to_expr(), '((>1 AND <=98) OR ==0 OR ==100) AND !=10')
        c.validate(0)
        c.validate(100)
        c.validate(2)

        # value can be none, unless NoneConstraint is explicitly added
        c.validate(None)
        try:
            c.validate(-1)
        except Exception as e:
            print(e)
        try:
            c.validate(10)
        except Exception as e:
            print(e)
        try:
            RangeConstraint(operator=Operator.IN, value=1)
        except Exception as e:
            print(e)
        try:
            c.validate("abc")
        except Exception as e:
            print(e)

        # test callable
        c = RangeConstraint(Operator.GT, value=lambda: 10)
        self.assertEqual(">10", c.to_expr())
        c.validate(100)
        try:
            c.validate(1)
        except Exception as e:
            print(e)

        # test shortcuts
        constraints = RangeConstraint(Operator.GT, 10) | RangeConstraint(Operator.LTE, 1)
        try:
            constraints.validate(5)
        except Exception as e:
            print(e)

    def test_string_length_constraint(self):
        try:
            LengthConstraint(operator=Operator.GT, value=-1)
        except Exception as e:
            print(e)
        try:
            LengthConstraint(operator=Operator.EQ, value=0)
        except Exception as e:
            print(e)
        c1 = LengthConstraint(operator=Operator.GTE, value=0)
        c1.validate("")
        c1.validate("abc")
        c2 = LengthConstraint(operator=Operator.GT, value=0)
        c2.raise_with_expr = True
        try:
            c2.validate("")
        except Exception as e:
            print(e)
        c3 = LengthConstraint(operator=Operator.LTE, value=3)
        c4 = LengthConstraint(operator=Operator.EQ, value=5)
        c1._constraint_value = 2
        # length>=2 AND length>0 AND (length==5 OR length<=3)
        c = c1 & c2 & (c4 | c3)
        c.validate("ab")
        c.validate("abc")
        c.validate("abcde")
        c.raise_with_expr = True
        try:
            c.validate("")
        except Exception as e:
            print(e)
        try:
            c.validate("abcd")
        except Exception as e:
            print(e)
        try:
            c.validate("aaaaaaaa")
        except Exception as e:
            print(e)
        try:
            LengthConstraint(operator=Operator.IN, value=1)
        except Exception as e:
            print(e)
        try:
            c.validate(123)
        except Exception as e:
            print(e)
        # test callable
        c = LengthConstraint(operator=Operator.LTE, value=3)
        try:
            c.validate("abcdef")
        except Exception as e:
            print(e)

    def test_array_length_constraint(self):
        try:
            LengthConstraint(operator=Operator.GT, value=-1)
        except Exception as e:
            print(e)
        try:
            LengthConstraint(operator=Operator.EQ, value=0)
        except Exception as e:
            print(e)
        c1 = LengthConstraint(operator=Operator.GTE, value=0)
        c1.validate([])
        c1.validate([1, 2, 3])
        c2 = LengthConstraint(operator=Operator.GT, value=0)
        c2.raise_with_expr = True
        try:
            c2.validate([])
        except Exception as e:
            print(e)
        c3 = LengthConstraint(operator=Operator.LTE, value=3)
        c4 = LengthConstraint(operator=Operator.EQ, value=5)
        c1._constraint_value = 2
        # length>=2 AND length>0 AND (length==5 OR length<=3)
        c = c1 & c2 & (c4 | c3)
        c.validate([1, 2])
        c.validate([1, 2, 3])
        c.validate([{}, {}, []])
        c.raise_with_expr = True
        try:
            c.validate([])
        except Exception as e:
            print(e)
        try:
            c.validate([{}, [], [], []])
        except Exception as e:
            print(e)
        try:
            c.validate(10 * [1])
        except Exception as e:
            print(e)
        try:
            c.validate(1)
        except Exception as e:
            print(e)
        try:
            LengthConstraint(operator=Operator.IN, value=1)
        except Exception as e:
            print(e)
        # test callable
        c = LengthConstraint(operator=Operator.LTE, value=3)
        c.validate([1, 2, 3])
        try:
            c.validate([1, 2, 3, 4, 5, 6])
        except Exception as e:
            print(e)

    def test_choice_constraint(self):
        try:
            ChoiceConstraint(operator=Operator.GT, value=1, choice_type=int)
        except Exception as e:
            print(e)
        try:
            ChoiceConstraint(operator=Operator.IN, value=1, choice_type=int)
        except Exception as e:
            print(e)
        try:
            ChoiceConstraint(operator=Operator.IN, value=['1', '2'], choice_type=int)
        except Exception as e:
            print(e)
        try:
            ChoiceConstraint(operator=Operator.IN, value=[1, 2, 3], choice_type=float)
        except Exception as e:
            print(e)
        try:
            ChoiceConstraint(operator=Operator.IN, value=[1, 2, None], choice_type=float)
        except Exception as e:
            print(e)
        try:
            ChoiceConstraint(operator=Operator.IN, value=[], choice_type=float)
        except Exception as e:
            print(e)
        c = ChoiceConstraint(operator=Operator.IN, value=[1.0, 2.2, 3.3], choice_type=float)
        c.raise_with_expr = True
        c.validate(1.0)
        c.validate(1)
        c.validate(2.2)
        c.validate(3.3)
        try:
            c.validate(1.2)
        except Exception as e:
            print(e)
        try:
            c.validate("abc")
        except Exception as e:
            print(e)
        c = ChoiceConstraint(operator=Operator.NIN, value=[1, 2, 3], choice_type=int)
        c.validate(5)
        c.validate(100)
        try:
            c.validate(1)
        except Exception as e:
            print(e)
        try:
            c.validate(2)
        except Exception as e:
            print(e)
        try:
            c.validate(3)
        except Exception as e:
            print(e)
        try:
            c.validate([])
        except Exception as e:
            print(e)
        # test callable
        c = ChoiceConstraint(operator=Operator.NIN, value=[1, 2, 3], choice_type=int)
        c.validate(5)
        try:
            c.validate(1)
        except Exception as e:
            print(e)

    def test_empty_constraints(self):
        c = EmptyConstraint()
        c.validate([1, 2, 3])
        c.validate({'a': 1, 'b': 2})
        try:
            c.validate([])
        except Exception as e:
            print(e)
        try:
            c.validate({})
        except Exception as e:
            print(e)
        try:
            c.validate(1)
        except Exception as e:
            print(e)

    def test_different_constraints(self):
        c = NoneConstraint() & RangeConstraint(Operator.GT, 1) & LengthConstraint(Operator.EQ, 100)
        c |= LengthConstraint(Operator.LTE, 10) & ChoiceConstraint(Operator.IN, [1, 2, 3], choice_type=int)
        to_list = [type(c) for c in c.sub_constraints()]
        self.assertEqual([NoneConstraint, RangeConstraint, LengthConstraint, LengthConstraint, ChoiceConstraint],
                         to_list)
