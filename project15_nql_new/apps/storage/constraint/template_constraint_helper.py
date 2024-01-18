from typing import Dict

from apps.storage.constraint.factory import constraints_from_dict
from mgedata.errors.models import MGEError


class DataConstraintHelper:
    @staticmethod
    def validate_field_value(template_field, template, value):
        path = template_field.field_path_str
        constraint_dict = template.validation.get(path, None)
        if not constraint_dict:
            return
        constraint = constraints_from_dict(constraint_dict)
        try:
            constraint.validate(value)
        except Exception as e:
            raise e
