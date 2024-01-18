from enum import Enum
from typing import List

from django.utils.translation import ugettext as _

from mgedata.errors.models import MGEError


class Operator(Enum):
    EQ = '=='
    NE = '!='
    GT = '>'
    LT = '<'
    GTE = '>='
    LTE = '<='
    IN = 'in'
    NIN = 'nin'

    def compare(self, lhs, rhs):
        if self in Operator.arithmetic_operators():
            if not isinstance(lhs, (int, float)) or not isinstance(rhs, (int, float)):
                raise MGEError.INVALID_CONSTRAINT(
                    _('Cannot perform arithmetic comparison between "%(lhs)s" and "%(rhs)s"') % {'lhs': str(lhs),
                                                                                                 'rhs': str(rhs)})
        else:
            if not isinstance(rhs, list):
                raise MGEError.INVALID_CONSTRAINT(
                    _('Can only perform in/not operators on lists, not "%s"') % (str(rhs),))

        return eval(f"lhs {self.value} rhs")

    def inverted(self) -> 'Operator':
        return {
            Operator.EQ: Operator.NE,
            Operator.NE: Operator.EQ,
            Operator.GT: Operator.LTE,
            Operator.GTE: Operator.LT,
            Operator.LT: Operator.GTE,
            Operator.LTE: Operator.GT,
            Operator.NIN: Operator.IN,
            Operator.IN: Operator.NIN,
        }[self]

    @staticmethod
    def arithmetic_operators() -> List['Operator']:
        return [
            Operator.EQ,
            Operator.NE,
            Operator.GT,
            Operator.GTE,
            Operator.LT,
            Operator.LTE,
        ]

    @property
    def json_name(self):
        return self.name.lower()

    @staticmethod
    def is_for_range_or_length(op):
        if op in Operator.arithmetic_operators():
            return True
        else:
            return False

    @staticmethod
    def is_for_choice(op):
        for_choice = [Operator.NIN,
                      Operator.IN]
        if op in for_choice:
            return True
        else:
            return False

    @staticmethod
    def keys():
        return [member.name for member in Operator]

    @staticmethod
    def values():
        return [member.value for member in Operator]
