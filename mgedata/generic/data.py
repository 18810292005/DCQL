'''
@Author: amazinglzy
@Date: 2019-07-19 08:39:59
@Last Modified by:   amazinglzy
@Last Modified time: 2019-07-19 08:39:59
'''
from datetime import datetime

from mgedata.generic.data_fields import ContainerField


class Data:
    attributes = ('title', 'doi', 'keywords', 'abstract', 'purpose', 'contributor',
                  'source', 'methods', 'reference',

                  'id', 'category', 'category_name', 'template', 'template_name', 'template_content',
                  'user', 'realname', 'institution',

                  'importing', 'score', 'downloads', 'views', 'add_time', 'last_modified', 'is_public',
                  'reviewer', 'reviewer_realname', 'reviewer_institution', 'review_state', 'disapprove_reason',
                  'via',

                  'project', 'subject', 'content', 'public_date', 'public_range')

    field_checker = (
        (lambda x: isinstance(x, str),
         ('title', 'doi', 'abstract', 'abstract', 'purpose', 'contributor',
          'reference', 'project', 'subject',
          'category_name', 'template_name',
          'user', 'realname', 'institution',
          'reviewer', 'reviewer_realname', 'reviewer_institution', 'disapprove_reason', 'public_range')),
        (lambda x: isinstance(x, list) and all(map(lambda xi: isinstance(xi, str), x)),
         ('keywords',)),
        (lambda x: isinstance(x, bool),
         ('is_public',)),
        (lambda x: isinstance(x, int),
         ('downloads', 'views',
          'id', 'category', 'template')),
        (lambda x: isinstance(x, datetime),
         ('add_time', 'last_modified', 'public_date')),
        (lambda x: x in ('pending', 'approved', 'disapproved'),
         ('review_state',))
    )

    checker_of_field = dict((field, checker) for checker, fields in field_checker for field in fields)

    def __init__(self, **kwargs):

        self._value = dict()
        for field in Data.attributes:
            value = None
            if field in kwargs:
                value = kwargs[field]
            self._value[field] = value

    def __setitem__(self, key, value):
        if key not in self.attributes:
            raise KeyError
        if key in Data.checker_of_field and value is not None and not Data.checker_of_field[key](value):
            raise ValueError('`{}` has invalid value {}'.format(key, value))
        self._value[key] = value

    def force_set(self, key, value):
        if key not in self.attributes:
            return
        if key in Data.checker_of_field and not Data.checker_of_field[key](value):
            self._value[key] = None
        else:
            self._value[key] = value

    def __getitem__(self, item):
        return self._value[item]

    def __iter__(self):
        return iter(self._value.keys())

    def get(self, key, default=None):
        if key not in self._value:
            return default
        return self._value[key]

    def __eq__(self, other):
        if not isinstance(other, Data):
            return False
        for field in self._value:
            if self.get(field) != other.get(field):
                return False
        for field in other:
            if self.get(field) != other.get(field):
                return False
        return True

    def check(self):
        for checker, fields in Data.field_checker:
            for field in fields:
                if self._value[field] is not None and not checker(self._value[field]):
                    raise ValueError('`{}` field with wrong value'.format(field))


class DataContent(ContainerField):

    def __init__(self, misc={}):
        super(DataContent, self).__init__('content', True, misc)
