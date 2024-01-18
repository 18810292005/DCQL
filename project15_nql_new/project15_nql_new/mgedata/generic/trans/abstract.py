from mgedata.generic.template_fields import *


class ToTemplateContent:

    pass


class FromTemplateContent:

    def to(self):
        raise NotImplementedError

    def _to(self, name, field: TemplateField):
        if isinstance(field, StringTemplateField):
            return self._string_to(name, field)
        if isinstance(field, NumericTemplateField):
            return self._numeric_to(name, field)
        if isinstance(field, IntervalTemplateField):
            return self._interval_to(name, field)
        if isinstance(field, ErrorTemplateField):
            return self._error_to(name, field)
        if isinstance(field, ChoiceTemplateField):
            return self._choice_to(name, field)
        if isinstance(field, ImageTemplateField):
            return self._image_to(name, field)
        if isinstance(field, FileTemplateField):
            return self._file_to(name, field)
        if isinstance(field, ArrayTemplateField):
            return self._array_to(name, field)
        if isinstance(field, TableTemplateField):
            return self._table_to(name, field)
        if isinstance(field, ContainerTemplateField):
            return self._container_to(name, field)
        if isinstance(field, GeneratorTemplateField):
            return self._generator_to(name, field)
        raise ValueError

    def _string_to(self, name, field):
        raise NotImplementedError

    def _numeric_to(self, name, field):
        raise NotImplementedError

    def _interval_to(self, name, field):
        raise NotImplementedError

    def _error_to(self, name, field):
        raise NotImplementedError

    def _choice_to(self, name, field):
        raise NotImplementedError

    def _image_to(self, name, field):
        raise NotImplementedError

    def _file_to(self, name, field):
        raise NotImplementedError

    def _array_to(self, name, field):
        raise NotImplementedError

    def _table_to(self, name, field):
        raise NotImplementedError

    def _container_to(self, name, field):
        raise NotImplementedError

    def _generator_to(self, name, field):
        raise NotImplementedError


class FromTemplate:
    pass


class ToTemplate:
    pass


class ToDataContent:

    pass


class FromDataContent:

    pass


class ToData:

    pass


class FromData:

    pass
