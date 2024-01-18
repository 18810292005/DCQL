from abc import ABC
from enum import Enum
from typing import Any, Union, List, Tuple, Optional

from django.utils.decorators import classproperty
# from overrides import overrides

from apps.storage.constraint.utils.operator import Operator
from apps.storage.constraint.utils.logic_tree import Node, LogicNode
from mgedata.errors.models import MGEError

from django.utils.translation import ugettext as _

__all__ = ['FieldConstraint', 'RangeConstraint', 'ChoiceConstraint', 'LengthConstraint', 'NoneConstraint',
           'EmptyConstraint', 'Operator', 'LogicNode', 'FieldConstraintType']


class FieldConstraintType(Enum):
    NONE = "nonnull"
    EMPTY = "nonempty"
    RANGE = 'range'
    LENGTH = 'length'
    CHOICE = 'choice'

    @property
    def constraint_class(self):
        return _CONSTRAINT_TYPE_CLASS_MAP[self]


class FieldConstraint(Node, ABC):

    # @overrides
    def __init__(self, operator: Operator = None, value=None, logic_node=LogicNode.LEAF):
        if not hasattr(self, 'logic_node'):
            """
            If self already has attribute 'logic_node', then this __init__ must have been called from
            FieldConstraint._new_instance, which called Node._new_instance, in which Node.__init__ was first called.
            This means that by now all attributes from the base class (Node) have already been set,
            so we don't want to call super().__init__() again to override these attributes.
            """
            super().__init__(logic_node, [])
        self._constraint_value = value
        if callable(value):
            value = value()  # call once to check if value() is allowed
        self.operator = operator
        if self.logic_node != LogicNode.LEAF:
            return
        # We only need validate operator and value if this is a leaf node
        if operator not in self._allowed_operators:
            if operator is None:
                desc = _("empty operator")
            else:
                desc = _("operator %s") % (operator.name,)
            raise MGEError.INVALID_CONSTRAINT(_('Cannot use %(desc)s on %(constraint)ss') %
                                              {'desc': desc,
                                               'constraint': self.constraint_name})
        if not isinstance(value, self.allowed_constraint_value_types):
            allowed_types = ', '.join([x.__name__ for x in self.allowed_constraint_value_types])
            msg = _("Value of %(name)s must be of type %(type_name)s. Got %(got)s (%(type)s) instead.")
            msg = msg % {'name': self.constraint_name, 'type_name': allowed_types, 'got': str(value),
                         'type': type(value).__name__}
            raise MGEError.INVALID_CONSTRAINT(msg)
        elif isinstance(value, list):
            if not value or None in value:
                raise MGEError.INVALID_CONSTRAINT("Value list cannot be empty or contain None")

    # @overrides
    @classmethod
    def _new_instance(cls, logic_node: LogicNode = LogicNode.LEAF, children: List['Node'] = None, identifier=None,
                      inverted=False):
        instance = super()._new_instance(logic_node, children, identifier, inverted)
        FieldConstraint.__init__(instance)
        instance.__init__()
        return instance

    # @overrides
    def leaf_expr(self) -> str:
        raise NotImplementedError

    # @overrides
    def __str__(self):
        return self.to_expr()

    # @overrides
    def __eq__(self, other: 'FieldConstraint'):
        return (
                self.__class__ == other.__class__ and
                other.constraint_value == self.constraint_value and
                other.operator == self.operator and
                self.children == other.children
        )

    @classproperty
    def allowed_constraint_value_types(self) -> Tuple[type, ...]:
        """
        Type of value that is used to create a constraint
        """
        raise NotImplementedError

    @classproperty
    def allowed_target_value_types(self) -> Tuple[type, ...]:
        """
        Types of values that can be validated using this constraint
        """
        raise NotImplementedError

    @classproperty
    def constraint_name(self) -> str:
        """
        User-friendly constraint name
        """
        raise NotImplementedError

    @classproperty
    def _allowed_operators(self) -> List[Optional[Operator]]:
        """
        Operators that can be used in this constraint
        """
        raise NotImplementedError

    @property
    def constraint_value(self):
        if callable(self._constraint_value):
            return self._constraint_value()
        return self._constraint_value

    def validate(self, value: Any):
        """
        Recursively check constraint combinations
        """
        if self.is_empty():
            return
        if self.logic_node == LogicNode.LEAF:
            if not isinstance(self, NoneConstraint) and value is None:
                return
            if not isinstance(value, self.allowed_target_value_types):
                types = ', '.join([x.__name__ for x in self.allowed_target_value_types])
                raise MGEError.INVALID_CONSTRAINT(
                    _('"%(value)s" is not of type %(type)s') % {'value': str(value), 'type': types})

            self._do_check_constraint(value)
            return

        failed_child = None
        if self.logic_node == LogicNode.OR:
            # in case all of the children constraints failed
            # then the failed one is actually this OR combination itself
            failed_child = self
        for child in self.children:
            try:
                child.validate(value)
                if self.logic_node == LogicNode.OR:
                    # shortcut
                    failed_child = None
                    break
            except Exception as e:
                if self.logic_node == LogicNode.AND:
                    # shortcut
                    failed_child = child
                else:
                    continue
        if failed_child is not None:
            raise MGEError.CONSTRAINT_FAILED(failed_child.to_expr())

    def _do_check_constraint(self, value: Any):
        """
        Actual function to check constraint
        """
        raise NotImplementedError

    def _raise(self, msg: str = None, extra_info: Union[List[str], str] = None):
        msg = msg or self.to_expr()
        if isinstance(extra_info, str):
            extra_info = [extra_info]
        raise MGEError.CONSTRAINT_FAILED(f"{msg}, {';'.join(extra_info)}")

    def invert(self):
        super().invert()
        if self.operator:
            self.operator = self.operator.inverted()

    def sub_constraints(self) -> List['FieldConstraint']:
        if self.logic_node == LogicNode.LEAF:
            return [self]
        res = []
        for child in self.children:
            res.extend(child.sub_constraints())
        return res

    @classmethod
    def from_dict(cls, dict_value: dict) -> 'FieldConstraint':
        operator = dict_value.get('operator')
        if operator is not None:
            if not isinstance(operator, str):
                raise MGEError.INVALID_CONSTRAINT('Operators must be strings. Got "%s" instead' % (str(operator),))
            operator = operator.upper()
            if operator not in Operator.__members__:
                raise MGEError.INVALID_CONSTRAINT(_('Unknown operator "%s"') % (operator,))
            operator = Operator[operator]
        value = dict_value.get('value')
        return cls(operator=operator, value=value)

    # @overrides
    def to_dict(self) -> dict:
        if self.logic_node == LogicNode.LEAF:
            base = {
                'type': _CONSTRAINT_CLASS_TYPE_MAP[type(self)].value
            }
            if self.operator:
                base['operator'] = self.operator.json_name
            if self.constraint_value is not None:
                base['value'] = self.constraint_value
            return base
        children_list = []
        for child in self.children:
            children_list.append(child.to_dict())
        return {self.logic_node.value: children_list}


class NoneConstraint(FieldConstraint):

    # NoneConstraint OR any constraint will nullify that other constraint

    def _do_check_constraint(self, value: Any):
        if value is None:
            self._raise()

    @classproperty
    def allowed_constraint_value_types(self):
        return type(None),

    @classproperty
    def allowed_target_value_types(self) -> Tuple[type, ...]:
        return object,

    @classproperty
    def constraint_name(self) -> str:
        return _("non-null constraint")

    @classproperty
    def _allowed_operators(self):
        return [None]

    # @overrides
    def leaf_expr(self) -> str:
        return _("Value cannot be none")


class RangeConstraint(FieldConstraint):

    # @overrides
    def leaf_expr(self) -> str:
        return f"{self.operator.value}{str(self.constraint_value)}"

    def _do_check_constraint(self, value: Union[int, float]):
        if not self.operator.compare(value, self.constraint_value):
            self._raise(extra_info=_("Provided value: %s") % (str(value, )))

    @classproperty
    def allowed_constraint_value_types(self):
        return int, float

    @classproperty
    def allowed_target_value_types(self) -> Tuple[type, ...]:
        return int, float

    @classproperty
    def constraint_name(self) -> str:
        return _("range constraint")

    @classproperty
    def _allowed_operators(self) -> List[Operator]:
        return Operator.arithmetic_operators()


class LengthConstraint(FieldConstraint):
    # @overrides
    def leaf_expr(self) -> str:
        return _("length") + f"{self.operator.value}{str(self.constraint_value)}"

    # @overrides
    def __init__(self, operator: Operator = None, value=None):
        super().__init__(operator, value)
        if self.logic_node != LogicNode.LEAF:
            return
        if value < 0:
            raise MGEError.INVALID_CONSTRAINT(_("length must be >= 0"))
        elif value == 0 and operator == Operator.EQ:
            raise MGEError.INVALID_CONSTRAINT(_("length cannot be 0"))

    @classproperty
    def allowed_constraint_value_types(self):
        return int,

    @classproperty
    def allowed_target_value_types(self):
        return list, str,

    @classproperty
    def constraint_name(self) -> str:
        return _("length constraint")

    @classproperty
    def _allowed_operators(self) -> List[Operator]:
        return Operator.arithmetic_operators()

    def _do_check_constraint(self, value: list):
        if not self.operator.compare(len(value), self.constraint_value):
            self._raise(extra_info=_("Provided length: %s") % (str(len(value), )))


class ChoiceConstraint(FieldConstraint):

    # @overrides
    def leaf_expr(self) -> str:
        return _("value") + f" {self.operator.value} {str(self.constraint_value)}"

    # @overrides
    def __init__(self, operator=None, value=None, choice_type: type = None):
        super().__init__(operator, value)
        if self.logic_node != LogicNode.LEAF:
            return
        if not choice_type:
            # infer type from the first choice
            choice_type = type(value[0])
            msg = _("Values for %(name)s must all be of the same type") % {'name': self.constraint_name}
        else:
            msg = _("Values for %(name)s must all be %(type)s") % {'type': choice_type.__name__,
                                                                   'name': self.constraint_name}
        if not all([isinstance(v, choice_type) for v in value]):
            raise MGEError.INVALID_CONSTRAINT(msg)
        self.choice_type = choice_type

    @classproperty
    def allowed_constraint_value_types(self):
        return list,

    @classproperty
    def allowed_target_value_types(self):
        return int, float, str

    @classproperty
    def constraint_name(self) -> str:
        return _("choice constraint")

    @classproperty
    def _allowed_operators(self) -> List[Operator]:
        return [Operator.IN, Operator.NIN]

    def _do_check_constraint(self, value: list):
        if not self.operator.compare(value, self.constraint_value):
            self._raise(extra_info=_("Provided value: %s") % (str(value, )))


class EmptyConstraint(FieldConstraint):

    # @overrides
    def leaf_expr(self) -> str:
        return _("Value cannot be empty")

    def _do_check_constraint(self, value: Any):
        if len(value) == 0:
            self._raise()

    @classproperty
    def allowed_constraint_value_types(self):
        return type(None),

    @classproperty
    def allowed_target_value_types(self) -> Tuple[type, ...]:
        return list, dict, tuple, str

    @classproperty
    def constraint_name(self) -> str:
        return _("non-empty constraint")

    @classproperty
    def _allowed_operators(self):
        return [None]


_CONSTRAINT_TYPE_CLASS_MAP = {
    FieldConstraintType.NONE: NoneConstraint,
    FieldConstraintType.EMPTY: EmptyConstraint,
    FieldConstraintType.RANGE: RangeConstraint,
    FieldConstraintType.LENGTH: LengthConstraint,
    FieldConstraintType.CHOICE: ChoiceConstraint
}
_CONSTRAINT_CLASS_TYPE_MAP = {v: k for k, v in _CONSTRAINT_TYPE_CLASS_MAP.items()}
