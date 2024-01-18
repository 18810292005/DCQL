from enum import Enum


class ExpressionAttribute(Enum):
    LENGTH = 'length'
    VALUE = 'value'

    @staticmethod
    def keys():
        return [member.name for member in ExpressionAttribute]

    @staticmethod
    def values():
        return [member.value for member in ExpressionAttribute]
