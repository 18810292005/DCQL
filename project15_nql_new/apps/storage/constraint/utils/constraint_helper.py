import re
from typing import List

from apps.storage.constraint.constraint import FieldConstraint, FieldConstraintType, LengthConstraint, ChoiceConstraint, \
    RangeConstraint
from apps.storage.constraint.utils.attribute import ExpressionAttribute
from apps.storage.constraint.utils.logic_tree import LogicNode
from apps.storage.constraint.utils.operator import Operator
from mgedata.errors.models import MGEError
from django.utils.translation import ugettext as _


class Expression2ConstraintHelper():

    def _convert_type(self, arg_value, arg_type):
        def _is_int(value):
            try:
                int(value)
                return True
            except ValueError:
                return False

        def _is_float(value):
            try:
                float(value)
                return True
            except ValueError:
                return False

        if arg_type == list:
            if not re.match("^\[.*\]$", arg_value):
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                    _('List value must start with "[" and end with "]'))
            elements = str(arg_value[1:-1]).split(',')
            if len(elements) <= 0:
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                    _('List must have values and values must be separated by commas.'))
            if _is_int(elements[0]):
                element_type = int
            elif _is_float(elements[0]):
                element_type = float
            else:
                element_type = str
            try:
                elements_new = [element_type(i) for i in elements]
            except ValueError:
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                    _('List values must be same type.'))
            return elements_new, element_type
        elif arg_type == int:
            try:
                return int(arg_value), int
            except ValueError:
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                    _('Range and Length constraint must be int or float.'))
        elif arg_type == float:
            try:
                return float(arg_value), float
            except ValueError:
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                    _('Range constraint must be int or float.'))
        else:
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_('Not Implement'))

    def generate_logic_constraint(self, left: FieldConstraint, right: FieldConstraint, logic_op: LogicNode):
        if logic_op == LogicNode.AND:
            return left & right
        elif logic_op == LogicNode.OR:
            return left | right
        else:
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_('Unknown logical operator'))

    def generate_operator_constraint(self, target: ExpressionAttribute, operator: Operator, **kwargs):
        def _judge_attribute_and_operator(target: ExpressionAttribute, operator: Operator):
            judge_method = [Operator.is_for_range_or_length, Operator.is_for_choice]
            allow_map = {
                ExpressionAttribute.LENGTH: [FieldConstraintType.LENGTH, None],
                ExpressionAttribute.VALUE: [FieldConstraintType.RANGE, FieldConstraintType.CHOICE]
            }
            for index, method in enumerate(judge_method):
                if method(operator):
                    if allow_map[target][index]:
                        return allow_map[target][index]
                    else:
                        raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                            _(f'Operator {str(operator.value)} cannot be used for {str(target.value)}'))
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_(f'Unknown error in attribute and operator mapping.'))

        def _get_arguments(arg_name: str, arg_types: List, **kwargs):
            if arg_name not in kwargs:
                raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_(f'The operator must have a operand'))
            arg_value = kwargs.get(arg_name)
            for arg_type in arg_types:
                try:
                    arg_value_res, arg_type_res = self._convert_type(arg_value, arg_type)
                    return arg_value_res, arg_type_res
                except Exception as e:
                    print(e)
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_('Value in expression must be str,list,int or float.'))

        expression_type = _judge_attribute_and_operator(target, operator)
        if expression_type == FieldConstraintType.LENGTH:
            value, value_type = _get_arguments('value', [int], **kwargs)
            return LengthConstraint(operator=operator, value=value)
        elif expression_type == FieldConstraintType.CHOICE:
            value, value_type = _get_arguments('value', [list], **kwargs)
            return ChoiceConstraint(operator=operator, value=value, choice_type=value_type)
        elif expression_type == FieldConstraintType.RANGE:
            value, value_type = _get_arguments('value', [int, float], **kwargs)
            return RangeConstraint(operator=operator, value=value)
        else:
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_('Unknown expression type.'))

    def rpn_expression_to_tree(self, expression):
        stack_value = []
        try:
            for item in expression:
                if item in LogicNode.values():
                    n2 = stack_value.pop()  # 注意，先出栈的在操作符右边.
                    n1 = stack_value.pop()
                    result = self.generate_logic_constraint(left=n1, right=n2, logic_op=LogicNode(item))
                    stack_value.append(result)
                elif item in Operator.values():
                    value = stack_value.pop()  # 注意，先出栈的在操作符右边.
                    target = stack_value.pop()
                    stack_value.append(
                        self.generate_operator_constraint(target=ExpressionAttribute(target), operator=Operator(item),
                                                          value=value))
                else:
                    stack_value.append(item)
        except Exception as e:
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(_(f'Illegal expression:{str(e)}.'))
        if len(stack_value) > 1:
            raise MGEError.ILLEGAL_CONSTRAINT_EXPRESSION(
                _(f'The expression cannot be closed, and here are redundancies:{str(stack_value[1:])}'))
        return stack_value[0]
