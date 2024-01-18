from mgedata.generic.trans.abstract import ToData, ToDataContent, FromData, FromDataContent
from mgedata.generic.data import DataContent, Data
from mgedata.generic.data_fields import *


class DictToDataContent(ToDataContent):

    def __init__(self, data_content: DataContent, data_content_dict: dict):
        self._data_content = data_content
        self._data_content_dict = data_content_dict

    def to(self) -> DataContent:
        self._data_content.create_or_ignore()
        for field_name in self._data_content:
            if field_name in self._data_content_dict:
                self._data_content[field_name].create_or_ignore()
                self._field_to(self._data_content[field_name], self._data_content_dict[field_name])
        return self._data_content

    def _field_to(self, field: Field, doc_value):
        self._value_to(field.get_value(), doc_value)

    def _value_to(self, value, doc_value):
        if isinstance(value, DataValue):
            self._data_value_to(value, doc_value)
            return
        if isinstance(value, MultiValue):
            self._multi_value_to(value, doc_value)
            return
        if isinstance(value, ContainerValue):
            self._container_value_to(value, doc_value)
            return
        if isinstance(value, GeneratorValue):
            self._generator_value_to(value, doc_value)
            return
        if isinstance(value, TableRowValue):
            self._table_row_value_to(value, doc_value)
            return
        raise ValueError

    def _data_value_to(self, value, doc_value):
        value.set(doc_value)

    def _multi_value_to(self, value, doc_value):
        for i in range(len(doc_value)):
            value.create_and_append()
            self._value_to(value[i], doc_value[i])

    def _container_value_to(self, value, doc_value):
        for field_name in doc_value:
            value[field_name].create_or_ignore()
            self._field_to(value[field_name], doc_value[field_name])

    def _generator_value_to(self, value, doc_value):
        for field_name in doc_value:
            value.select_or_ignore(field_name)
            self._field_to(value.field, doc_value[field_name])

    def _table_row_value_to(self, value, doc_value):
        for field_name in doc_value:
            value[field_name].create_or_ignore()
            self._field_to(value[field_name], doc_value[field_name])


class DataContentToDict(FromDataContent):

    def __init__(self, data_content: DataContent):
        self._data_content = data_content

    def to(self) -> dict:
        result = dict()
        for field_name in self._data_content:
            if self._data_content[field_name].get_value() is not None:
                result[field_name] = self._field_to(self._data_content[field_name])
        return result

    def _field_to(self, field):
        return self._value_to(field.get_value())

    def _value_to(self, value):
        if isinstance(value, DataValue):
            return self._data_value_to(value)
        if isinstance(value, MultiValue):
            return self._multi_value_to(value)
        if isinstance(value, ContainerValue):
            return self._container_value_to(value)
        if isinstance(value, TableRowValue):
            return self._table_row_value_to(value)
        if isinstance(value, GeneratorValue):
            return self._generator_value_to(value)
        raise ValueError

    def _data_value_to(self, value):
        return value.value

    def _multi_value_to(self, value):
        result = []
        for i in range(len(value)):
            result.append(self._value_to(value[i]))
        return result

    def _container_value_to(self, value):
        result = dict()
        for field_name in value:
            if value[field_name].get_value() is not None:
                result[field_name] = self._field_to(value[field_name])
        return result

    def _table_row_value_to(self, value):
        return self._container_value_to(value)

    def _generator_value_to(self, value):
        if value.field is not None and value.field.get_value() is not None:
            return {value.field.name: self._field_to(value.field)}
        else:
            return {}


class DictToData(ToData):

    def __init__(self, data: Data, data_dict: dict):
        self._data = data
        self._data_dict = data_dict

    def to(self) -> Data:
        for field, value in self._data_dict.items():
            if field not in self._data:
                continue
            if field == 'content':
                self._data[field] = DictToDataContent(self._data['content'], value).to()
            else:
                self._data[field] = value
        return self._data


class DataToDict(FromData):

    def __init__(self, data: Data):
        self._data = data

    def to(self) -> dict:
        data_dict = dict()
        for field in self._data:
            if self._data[field] is None:
                continue
            if field == 'content':
                data_dict[field] = DataContentToDict(self._data['content']).to()
            else:
                data_dict[field] = self._data[field]
        return data_dict
