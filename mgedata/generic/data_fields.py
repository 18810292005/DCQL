'''
@Author: amazinglzy
@Date: 2019-07-19 08:42:36
@Last Modified by:   amazinglzy
@Last Modified time: 2019-07-19 08:42:36
'''
import copy

from mgedata.generic.helper import is_type_all

EPS = 0.1**8

"""
class represent each data type
"""


class DataValue:

    def __init__(self, created_by):
        self._created_by = created_by
        self._value = None

    def force_set(self, value):
        self._value = self._trans(value)

    def set(self, value):
        self._check(value)
        self._value = self._trans(value)

    @property
    def value(self):
        return self._value

    def __eq__(self, other):
        if hasattr(other, 'value'):
            return self._value == other.value
        return False

    def _trans(self, value):
        return value

    def _check(self, value):
        return


class StringValue(DataValue):

    def _check(self, value):
        if value is None:
            return
        if not isinstance(value, str):
            try:
                str(value)
            except ValueError:
                raise TypeError('type of string value must be str')

    def _trans(self, value):
        if value is None:
            return None
        try:
            return str(value)
        except TypeError:
            return None


class NumericValue(DataValue):

    def _check(self, value):
        if value is None:
            return
        try:
            float(value)
        except ValueError as e:
            raise TypeError('type of numeric value must be number (int/float)')
        except TypeError as e:
            raise TypeError('type of numeric value must be number (int/float)')

    def _trans(self, value):
        if value is None:
            return None
        try:
            return float(value)
        except TypeError:
            return None


class IntervalValue(DataValue):

    def __getitem__(self, item):
        return self._value[item]

    def _check(self, value):
        if value['lb'] is not None and type(value['lb']) not in (float, int):
            raise TypeError('`lb` of value must be one of float and int')
        if value['ub'] is not None and type(value['ub']) not in (float, int):
            raise TypeError('`ub` of value must be one of float and int')
        if value['lb'] is not None and value['ub'] is not None and value['lb'] > value['ub']:
            raise ValueError

    def _trans(self, value):
        if value is None:
            return None
        try:
            _lb = '-inf' if value['lb'] == '-∞' else value['lb']
            _ub = '+inf' if value['ub'] == '+∞' else value['ub']
            return {'lb': _lb and float(_lb), 'ub': _ub and float(_ub)}
        except (KeyError, TypeError):
            return None


class ErrorValue(DataValue):

    def __getitem__(self, item):
        return self._value[item]

    def _check(self, value):
        if value['val'] is not None and type(value['val']) not in (float, int):
            raise TypeError('`val` of value must be one of float and int')
        if value['err'] is not None and type(value['err']) not in (float, int):
            raise TypeError('`err` of value must be one of float and int')
        if value['val'] is not None and value['err'] is not None and abs(value['val']) < abs(value['err']):
            raise ValueError

    def _trans(self, value):
        if value is None:
            return None
        try:
            return {'val': value['val'] and float(value['val']),
                    'err': value['err'] and float(value['err'])}
        except (KeyError, TypeError):
            return None


class ChoiceValue(DataValue):

    def _check(self, value):
        if value is not None and value not in (self._created_by.misc['opt'] +
                                               [y for x in self._created_by.misc['grp'] for y in x['items']]):
            raise ValueError(' '.join((f"{type(self)}'s value", f"one of {self._created_by.misc['opt']}", f'{value}')))

    def _trans(self, value):
        if value is None:
            return None
        try:
            return str(value)
        except TypeError:
            return None


class ImageValue(DataValue):
    pass


class FileValue(DataValue):
    pass


class FieldsValue:

    def __init__(self, created_by):
        self._created_by = created_by
        self._value = {}
        self._not_empty_field_name = set()
        for field in self._created_by.misc['fields']:
            self._value[field.name] = copy.deepcopy(field)

    def __len__(self):
        return len(self._not_empty_field_name)

    def __iter__(self):
        return iter(self._value.keys())

    def __eq__(self, other):
        if not isinstance(other, ContainerValue):
            return False
        for field in self:
            if field not in other:
                return False
        for field in other:
            if field not in self:
                return False

            if self[field] != other[field]:
                return False
        return True

    def _check(self):
        return


class ContainerValue(FieldsValue):

    def __getitem__(self, item):
        return self._value[item]


class GeneratorValue(FieldsValue):

    def __init__(self, created_by):
        super(GeneratorValue, self).__init__(created_by)
        self._select_field = None

    def select(self, key):
        if self._select_field is not None:
            self._select_field.unset()
        self._select_field = self._value[key]
        self._select_field.create()

    def select_or_ignore(self, key):
        if self._select_field is None or self._select_field.name != key:
            self.select(key)

    @property
    def field(self):
        return self._select_field

    def __eq__(self, other):
        if not super(GeneratorValue, self).__eq__(other):
            return False
        if self.field != other.field:
            return False
        return True


class TableRowValue(FieldsValue):

    def __getitem__(self, item):
        return self._value[item]

    def _check(self):
        for field_name in self._value:
            field = self._value[field_name]
            if type(field) not in (StringField, NumericField, IntervalField, ErrorField, ImageField, FileField):
                raise TypeError('field of table row must in `(StringField, NumericField, '
                                'IntervalField, ErrorField, ImageField, FileField)`')


class MultiValue:

    def __init__(self, created_by):
        self._created_by = created_by
        self._value = []

    @property
    def element_type(self):
        return self._created_by.element_type

    @property
    def misc(self):
        return self._created_by.misc

    def __getitem__(self, item):
        return self._value[item]

    def __setitem__(self, key, value):
        self._value[key].set(value)

    def __len__(self):
        return len(self._value)

    def pop(self):
        return self._value.pop()

    def create_and_append(self, value=None):
        self._value.append(self.element_type(self))
        try:
            if value is not None:
                self._value[len(self._value) - 1].set(value)
        except (TypeError, ValueError) as e:
            self._value.pop()
            raise e

    def __eq__(self, other):
        if not isinstance(other, MultiValue):
            return False
        if len(self) != len(other):
            return False
        for i in range(len(self)):
            if self.__getitem__(i) != other[i]:
                return False
        return True


class ArrayValue(MultiValue):
    pass


class TableValue(MultiValue):
    pass


"""
Here are data fields of each data type
"""


class Field:

    def __init__(self, name, required=False, misc={}):
        if not isinstance(required, bool):
            raise TypeError(' '.join(('required field', 'bool type', f'{type(required)}')))
        self._name = name
        self._required = required
        self._misc = misc
        self._value = None

    @property
    def name(self):
        return self._name

    @property
    def required(self):
        return self._required

    @property
    def misc(self):
        return self._misc

    def get_value(self):
        return self._value

    def _check(self):
        if self._required and self._value is None:
            raise TypeError(' '.join(('not null value', 'not none', f'{self._value} is None')))

    def __eq__(self, other):
        if not isinstance(other, Field):
            return False
        return (self.name == other.name and
                self.required == other.required and
                self.get_value() == other.get_value())


class DataField(Field):
    DataType = None

    def set(self, value):
        self._value.set(value)

    def unset(self):
        self._value = None

    def create(self):
        self._value = type(self).DataType(self)

    def create_or_ignore(self):
        if self._value is None:
            self._value = type(self).DataType(self)

    @property
    def value(self):
        return self._value.value

    def __eq__(self, other):
        return (self.name == other.name and
                self.required == other.required and
                self.value == other.value)


class StringField(DataField):
    DataType = StringValue


class NumericField(DataField):
    DataType = NumericValue

    @property
    def unit(self):
        return self.misc.get('unit')

    def __eq__(self, other):
        return (self.name == other.name and
                self.required == other.required and
                abs(self.value - other.value) < EPS)


class ChoiceField(DataField):
    DataType = ChoiceValue

    def __init__(self, name, required=False, misc={}):
        super(ChoiceField, self).__init__(name, required=required, misc=misc)
        try:
            if 'opt' not in misc or 'grp' not in misc:
                raise ValueError('misc must contains opt and grp in choice field')
            if not (is_type_all(misc['opt'], str) and all(is_type_all(l['items'], str) for l in misc['grp'])):
                raise ValueError(f"wrong opt and grp with {self.misc['opt']} and {self.misc['grp']}")
        except KeyError as e:
            raise ValueError(str(e))

    @property
    def choices(self):
        return self.misc['opt'] + [choice for grp in self.misc['grp'] for choice in grp['items']]


class IntervalField(DataField):
    DataType = IntervalValue

    @property
    def unit(self):
        return self._misc.get('unit')


class ErrorField(DataField):
    DataType = ErrorValue

    @property
    def unit(self):
        return self._misc.get('unit')


class ImageField(DataField):
    DataType = ImageValue


class FileField(DataField):
    DataType = FileValue


class FieldsField(Field):
    DataType = None

    @property
    def fields(self):
        return self.misc['fields']

    def __iter__(self):
        return iter(self._value)

    def create(self):
        self._value = type(self).DataType(self)

    def create_or_ignore(self):
        if self._value is None:
            self._value = type(self).DataType(self)


class ContainerField(FieldsField):
    DataType = ContainerValue

    def __getitem__(self, item):
        return self._value[item]


class GeneratorField(FieldsField):
    DataType = GeneratorValue

    def select(self, key):
        self._value.select(key)

    @property
    def field(self):
        return self._value.field


class MultiField(Field):
    DataType = MultiValue

    @property
    def element_type(self):
        return self._misc['element_type']

    def __getitem__(self, item):
        return self._value[item]

    def __len__(self):
        return len(self._value)

    def __iter__(self):
        return iter(self._value)

    def create_and_append(self, value=None):
        self._value.create_and_append(value)

    def pop(self):
        self._value.pop()

    def create(self):
        self._value = type(self).DataType(self)

    def create_or_ignore(self):
        if self._value is None:
            self._value = type(self).DataType(self)


class ArrayField(MultiField):
    DataType = ArrayValue


class TableField(MultiField):
    DataType = TableValue

    def __init__(self, name, required=False, misc={}):
        super(TableField, self).__init__(name, required, dict(element_type=TableRowValue, **misc))
