import enum

from mgedata.generic.helper import is_type_all


class TemplateFieldEnum(enum.Enum):
    STRING = 1
    NUMBER = 2
    RANGE = 3
    IMAGE = 4
    FILE = 5
    CHOICE = 6
    ARRAY = 7
    TABLE = 8
    CONTAINER = 9
    GENERATOR = 10


class TemplateField:

    def __init__(self, required=False, misc={}):
        self._required = required
        self._misc = misc

    def validate(self):
        raise NotImplementedError

    @property
    def required(self):
        return self._required

    @property
    def misc(self):
        return self._misc


class StringTemplateField(TemplateField):

    def validate(self):
        return


class NumericTemplateField(TemplateField):

    def validate(self):
        return


class IntervalTemplateField(TemplateField):

    def validate(self):
        return


class ErrorTemplateField(TemplateField):

    def validate(self):
        return


class ChoiceTemplateField(TemplateField):

    def validate(self):
        if ('opt' not in self._misc or 'grp' not in self._misc or
                                       any(['name' not in x or 'items' not in x for x in self._misc['grp']])):
            raise ValueError('`opt` and `grp` must in misc and `name` and `items` must in misc.grp')

        if not ((is_type_all(self._misc['opt'], str) and
                 all(map(lambda xx: (isinstance(xx['name'], str) and
                                     is_type_all(xx['items'], str)),
                         self._misc['grp'])))):
            raise ValueError('element in `opt` or `grp.name` or `grp.items` must be str')


class ImageTemplateField(TemplateField):

    def validate(self):
        return


class FileTemplateField(TemplateField):

    def validate(self):
        return


class ArrayTemplateField(TemplateField):

    def validate(self):
        self._misc.validate()


class TableTemplateField(TemplateField):

    def validate(self):
        if '_head' not in self._misc or any([x not in self._misc for x in self._misc['_head']]):
            raise ValueError('`_head` must in misc and all fields in `_head` must also exists in misc')

        for x in self._misc['_head']:
            self._misc[x].validate()


class ContainerTemplateField(TemplateField):

    def validate(self):
        if '_ord' not in self._misc or any([x not in self._misc for x in self._misc['_ord']]):
            raise ValueError('`_ord` must in misc and all fields in `_ord` must also exists in misc')

        for x in self._misc['_ord']:
            self._misc[x].validate()


class GeneratorTemplateField(TemplateField):

    def validate(self):
        if '_opt' not in self._misc or any([x not in self._misc for x in self._misc['_opt']]):
            raise ValueError('`_opt` must in misc and all fields in `_opt` must also exists in misc')

        for x in self._misc['_opt']:
            self._misc[x].validate()
