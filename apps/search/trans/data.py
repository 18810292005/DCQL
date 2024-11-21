from mgedata.generic.data import Data, DataContent
from mgedata.generic.data_fields import DataValue, IntervalValue, MultiValue, ContainerValue, TableRowValue, GeneratorValue, Field
from mgedata.generic.trans.abstract import FromData, FromDataContent


class DataContentToText(FromDataContent):

    def __init__(self, data_content: DataContent):
        self._data_content = data_content
        self._text = None

    def to(self) -> str:
        if self._data_content is None:
            return ''

        self._text = ''
        for field_name in self._data_content:
            if self._data_content[field_name].get_value() is not None:
                self._text += field_name + ':'
                self._field_to(self._data_content[field_name])
                self._text += ','
        return self._text

    def _value_to(self, value):
        if isinstance(value, DataValue):
            self._data_value_to(value)
        if isinstance(value, MultiValue):
            self._multi_value_to(value)
        if isinstance(value, ContainerValue) or isinstance(value, TableRowValue):
            self._container_value_to(value)
        if isinstance(value, GeneratorValue):
            self._generator_value_to(value)

    def _field_to(self, field: Field):
        self._value_to(field.get_value())

    def _data_value_to(self, value: DataValue):
        self._text += str(value.value)

    def _multi_value_to(self, value: MultiValue):
        self._text += '['
        for i in range(len(value)):
            self._value_to(value[i])
        self._text += ']'

    def _container_value_to(self, value: ContainerValue):
        for field_name in value:
            if value[field_name].get_value() is not None:
                self._text += field_name + ':'
                self._field_to(value[field_name])

    def _generator_value_to(self, value: GeneratorValue):
        if value.field is not None:
            self._text += value.field.name + ':'
            self._value_to(value.field.get_value())


class DataToText(FromData):
    attributes = ('title', 'doi', 'keywords', 'abstract', 'purpose', 'contributor',
                  'source', 'methods', 'reference', 'project', 'subject',

                  'id', 'category', 'category_name', 'template', 'template_name',
                  'user', 'realname', 'institution',

                  'add_time', 'last_modified',
                  'reviewer', 'reviewer_realname', 'reviewer_institution', 'review_state', 'disapprove_reason'
                  )

    def __init__(self, data: Data):
        self._data = data
        self._text = None

    def to(self) -> str:
        self._text = ''
        for field in DataToText.attributes:
            if field in self._data and self._data[field] is not None:
                self._text += str(self._data[field]) + ','
        self._text += DataContentToText(self._data['content']).to()
        return self._text


class DataContentToEsDocument(FromDataContent):

    @staticmethod
    def name_mapping(name):
        return name.replace('.', '\\.')

    def __init__(self, data_content: DataContent):
        self._data_content = data_content or dict()

    def to(self) -> dict:
        result = dict()
        for field_name in self._data_content:
            if self._data_content[field_name].get_value() is not None:
                result[DataContentToEsDocument.name_mapping(field_name)] = self._field_to(
                    self._data_content[field_name])
        return result

    def _field_to(self, field):
        return self._value_to(field.get_value())

    def _value_to(self, value):
        if isinstance(value, DataValue):
            result = value.value
            # JSON不支持inf&nan
            if isinstance(value, IntervalValue):
                result['lb'] = '' if result['lb'] == float('-inf') else result['lb']
                result['ub'] = '' if result['ub'] == float('+inf') else result['ub']
            return result
        if isinstance(value, MultiValue):
            result = []
            for i in range(len(value)):
                result.append({
                    '_idx': i + 1,
                    '_value': self._value_to(value[i])
                })
            return result
        if isinstance(value, ContainerValue) or isinstance(value, TableRowValue):
            result = dict()
            for field_name in value:
                if value[field_name].get_value() is not None:
                    result[DataContentToEsDocument.name_mapping(field_name)] = self._field_to(value[field_name])
            return result
        if isinstance(value, GeneratorValue):
            if value.field is not None:
                return {DataContentToEsDocument.name_mapping(value.field.name): self._field_to(value.field)}
            return {}
        raise ValueError


class DataToEsDocument(FromData):
    fields = ('title', 'doi', 'keywords', 'abstract', 'purpose', 'contributor',
              'source', 'methods', 'reference', 'project', 'subject',

              'id', 'category', 'category_name', 'template', 'template_name',
              'user', 'realname', 'institution',

              'importing', 'score', 'downloads', 'views', 'add_time', 'last_modified', 'is_public',
              'reviewer', 'reviewer_realname', 'reviewer_institution', 'review_state', 'disapprove_reason',
              'public_date', 'public_range')

    def __init__(self, data: Data):
        self._data = data

    def to(self) -> dict:
        data_dict = dict()
        for field in DataToEsDocument.fields:
            if field not in self._data or self._data[field] is None:
                continue
            data_dict[field] = self._data[field]
        data_dict['content'] = DataContentToEsDocument(self._data['content']).to()
        data_dict['summary'] = DataToText(self._data).to()
        return data_dict
