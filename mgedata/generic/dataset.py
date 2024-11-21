'''
@Author: amazinglzy
@Date: 2019-07-19 10:10:32
@Last Modified by:   amazinglzy
@Last Modified time: 2019-07-19 10:10:32
'''
from typing import List

from mgedata.generic.template import Template
from apps.storage.trans.db import DbToData


class DataSet:

    def __init__(self, template: Template):
        self._template = template
        self._data = dict()

    def __len__(self):
        return len(self._data)

    def __iter__(self):
        return iter(self._data)

    def __getitem__(self, key):
        return self._data[key]

    def add_data_by_id(self, meta_id: int):
        if meta_id not in self._data:
            data = DbToData(meta_id).to()
            if data['template'] != self._template['id']:
                raise TypeError('Trying to add data to DataSet with not the same template')
            self._data[data['id']] = data

    def add_data(self, data):
        if data['template'] != self._template['id']:
            raise TypeError('Trying to add data to DataSet with not the same template')
        self._data[data['id']] = data

    @property
    def template(self):
        return self._template
