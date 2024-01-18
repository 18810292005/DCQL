from apps.storage.constraint.constraint import NoneConstraint, RangeConstraint, ChoiceConstraint, LengthConstraint, \
    EmptyConstraint
from apps.storage.constraint.factory import constraints_from_dict
from apps.storage.constraint.utils.operator import Operator
from mgedata.errors.models import MGEError
from mgedata.test import MGETestCase


class ValidateTester(MGETestCase):
    def setUp(self):
        pass

    def test_none(self):
        self.assertEqual(NoneConstraint(), constraints_from_dict({'type': 'nonnull'}))
        self.assertEqual({'type': 'nonnull'}, NoneConstraint().to_dict())
        try:
            constraints_from_dict({'type': 'nonnull', 'operator': 'gt'})
        except:
            print(f'raise ,but it is in expect')

    def test_range(self):
        expected = RangeConstraint(Operator.GT, 10)
        d = {'type': 'range', 'operator': 'gt', 'value': 10}
        self.assertEqual(expected, constraints_from_dict(d))
        self.assertEqual(d, expected.to_dict())

        wrong_type_cases = MGEError.INVALID_CONSTRAINT, [
            {'type': 'range', 'operator': 'gt'},
            {'type': 'range', 'operator': 'lt', 'value': []},
        ]
        invalid_operator_cases = MGEError.INVALID_CONSTRAINT, [
            {'type': 'range', 'operator': 'in', 'value': 10},
            {'type': 'range', 'value': 10},
            {'type': 'range', 'operator': None, 'value': 10},
            {'type': 'range', 'operator': 1, 'value': 10}
        ]
        for error, cases in (wrong_type_cases, invalid_operator_cases):
            for case in cases:
                try:
                    constraints_from_dict(case)
                except:
                    print(f'raise ,but it is in expect')

    def test_choice(self):
        expected = ChoiceConstraint(Operator.NIN, [1, 2, 3], choice_type=int)
        d = {'type': 'choice', 'operator': 'nin', 'value': [1, 2, 3]}
        self.assertEqual(expected, constraints_from_dict(d))
        self.assertEqual(d, expected.to_dict())
        wrong_type_cases = [
            {'type': 'choice', 'operator': 'nin', 'value': "abc"},
            {'type': 'choice', 'operator': 'nin', 'value': [1, "abc", 3]},
            {'type': 'choice', 'operator': 'nin', 'value': []}
        ]
        for case in wrong_type_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

        invalid_operator_cases = [
            {'type': 'choice', 'operator': 'eq', 'value': [1, 2, 3]},
            {'type': 'choice', 'operator': '?', 'value': [1, 2, 3]},
            {'type': 'choice', 'operator': None, 'value': [1, 2, 3]},
            {'type': 'choice', 'operator': 123, 'value': [1, 2, 3]},
        ]
        for case in invalid_operator_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

    def test_length(self):
        expected = LengthConstraint(Operator.GT, 3)
        d = {'type': 'length', 'operator': 'gt', 'value': 3}
        self.assertEqual(expected, constraints_from_dict(d))
        self.assertEqual(d, expected.to_dict())
        wrong_type_cases = [
            {'type': 'length', 'operator': 'gt', 'value': "abc"},
            {'type': 'length', 'operator': 'eq', 'value': [1, "abc", 3]},
            {'type': 'length', 'operator': 'lt', 'value': []}
        ]
        for case in wrong_type_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

        invalid_operator_cases = [
            {'type': 'length', 'operator': 'nin', 'value': 3},
            {'type': 'length', 'operator': '?', 'value': 1},
            {'type': 'length', 'operator': None, 'value': 6},
            {'type': 'length', 'operator': 123, 'value': 6},
        ]
        for case in invalid_operator_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

    def test_empty(self):
        self.assertEqual(EmptyConstraint(), constraints_from_dict({'type': 'nonempty'}))
        self.assertEqual({'type': 'nonempty'}, EmptyConstraint().to_dict())
        type_error_cases = [
            {'type': 'nonempty', 'value': "abc"},
            {'type': 'nonempty', 'value': [1, "abc", 3]},
            {'type': 'nonempty', 'value': []},
        ]
        for case in type_error_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

        invalid_operator_cases = [
            {'type': 'nonempty', 'operator': 'nin'},
            {'type': 'nonempty', 'operator': '?'},
            {'type': 'nonempty', 'operator': 123},
        ]
        for case in invalid_operator_cases:
            try:
                constraints_from_dict(case)
            except:
                print(f'raise ,but it is in expect')

    def test_combo(self):
        constraints = {
            "AND": [
                {'type': 'length', 'operator': 'gt', 'value': 3},
                {'type': 'choice', 'operator': 'nin', 'value': [1, 2, 3]},
                {"OR": [{'type': 'nonempty'}, {'type': 'nonnull'}]}
            ]
        }
        constraints = constraints_from_dict(constraints)
        expected = LengthConstraint(Operator.GT, 3) & ChoiceConstraint(Operator.NIN, [1, 2, 3]) & (
                EmptyConstraint() | NoneConstraint())
        self.assertEqual(expected.to_dict(), constraints.to_dict())

    def test_not_dict(self):
        try:
            constraints_from_dict(1)
        except:
            print(f'raise ,but it is in expect')

    def test_unknown_type(self):
        try:
            constraints_from_dict({'type': 'abc'})
        except:
            print(f'raise ,but it is in expect')

    def test_invalid_logic_nodes(self):
        try:
            constraints_from_dict({'AND': [], 'OR': []})
        except:
            print(f'raise ,but it is in expect')
        try:
            constraints_from_dict({'FFF': []})
        except:
            print(f'raise ,but it is in expect')
        try:
            constraints_from_dict({"AND": {}})
        except:
            print(f'raise ,but it is in expect')
