from typing import Optional

from django.utils.translation import ugettext as _

from apps.storage.constraint.constraint import FieldConstraint, FieldConstraintType
from apps.storage.constraint.utils.logic_tree import LogicNode
from mgedata.errors.models import MGEError


def constraints_from_dict(dict_value: dict) -> Optional[FieldConstraint]:
    if not isinstance(dict_value, dict):
        raise MGEError.INVALID_CONSTRAINT(
            _('Constraints must be in the form of dictionaries. Got "%s" instead') % (str(dict_value),))
    if not dict_value:
        return None
    if 'type' in dict_value:
        constraint_type = str(dict_value.get('type'))
        try:
            constraint_type = FieldConstraintType(constraint_type)
            return constraint_type.constraint_class.from_dict(dict_value)
        except ValueError:
            raise MGEError.INVALID_CONSTRAINT(_('Unknown constraint type "%s"') % (constraint_type,)) from None
    elif len(dict_value.keys()) > 1:
        raise MGEError.INVALID_CONSTRAINT(
            _('Every dict must have only one logic operator. Got "%s"') % (', '.join(dict_value.keys())))

    logic = list(dict_value.keys())[0]
    logic = str(logic).upper()
    if logic not in (LogicNode.AND.value, LogicNode.OR.value):
        raise MGEError.INVALID_CONSTRAINT(_("Unknown logic operator %s") % (logic,))
    combinations = list(dict_value.values())[0]
    if not isinstance(combinations, list):
        raise MGEError.INVALID_CONSTRAINT(_('Values for AND/OR must be lists. Got "%s"') % (str(combinations, )))
    constraint = None
    for value in combinations:
        if constraint is None:
            constraint = constraints_from_dict(value)
            continue
        new_constraint = constraints_from_dict(value)
        if logic == LogicNode.AND.value:
            constraint &= new_constraint
        else:
            constraint |= new_constraint
    return constraint
