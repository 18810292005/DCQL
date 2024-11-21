import re

from mgedata.generic.data import Data, DataContent
from mgedata.generic.data_fields import *
from mgedata.generic.trans.abstract import FromData, FromDataContent


class DataContentToXlsxDict(FromDataContent):

    def __init__(self, data_id: int, data_content: DataContent):
        self._data_id = data_id
        self._data_content = data_content

    def to(self, xlsx_dict):
        structure = xlsx_dict['structure']
        values = xlsx_dict['values']
        content_sheet_name, links = structure

        values[content_sheet_name]['rows'].append(
            (self._data_id,) +
            tuple(self._field_to(self._data_content[field_name],
                                 links.get(field_name),
                                 values) for field_name in self._data_content)
        )

        for sheet_name in values:
            for i in range(len(values[sheet_name]['rows'])):
                values[sheet_name]['rows'][i] = (i + 2, ) + values[sheet_name]['rows'][i]

        return xlsx_dict

    def _field_to(self, field: Field, structure: dict, values: dict):
        if field.get_value() is None:
            return None
        return self._value_to(field.get_value(), structure, values)

    def _value_to(self, value, structure: dict, values: dict):
        if isinstance(value, DataValue):
            return self._data_value_to(value, structure, values)
        if isinstance(value, MultiValue):
            return self._multi_value_to(value, structure, values)
        if isinstance(value, ContainerValue):
            return self._container_to(value, structure, values)
        if isinstance(value, GeneratorValue):
            return self._generator_to(value, structure, values)
        # if isinstance(value, TableRowValue):
        #     return self._table_row_to(value, structure, values)
        raise ValueError('value must be DataValue or MultiValue or FieldsValue')

    def _data_value_to(self, value: DataValue, structure: dict, values: dict):
        if isinstance(value, ImageValue) or isinstance(value, FileValue):
            return '\n'.join(value.value)
        if isinstance(value, IntervalValue):
            return ' '.join(['(', str(value['lb']), ',', str(value['ub']), ')'])
        if isinstance(value, ErrorValue):
            return ' '.join(['(', str(value['val']), '±', str(value['err']), ')'])
        return value.value

    def _multi_value_to(self, value: MultiValue, structure: dict, values: dict):
        if isinstance(value, ArrayValue):
            sheet_name, links = structure
            for i in range(len(value)):
                values[sheet_name]['rows'].append(
                    (self._data_id, i + 1, self._value_to(value[i], links.get('value'), values)))
        elif isinstance(value, TableValue):
            sheet_name, links = structure
            for i in range(len(value)):
                values[sheet_name]['rows'].append(
                    (self._data_id, ) +
                    tuple(self._field_to(value[i][field_name],
                                         links.get(field_name),
                                         values) for field_name in value[i]))
        else:
            raise ValueError('MultiValue contains Other Value than Array and Table Value')

    def _container_to(self, value: ContainerValue, structure: dict, values: dict):
        sheet_name, links = structure
        values[sheet_name]['rows'].append(
            (self._data_id,) +
            tuple(self._field_to(value[field_name],
                                 links.get(field_name),
                                 values) for field_name in value)
        )

    def _generator_to(self, value: GeneratorValue, structure: dict, values: dict):
        sheet_name, links = structure
        if value.field is not None:
            values[sheet_name]['rows'].append(
                (self._data_id, ) +
                tuple(self._field_to(value.field,
                                     links.get(field_name),
                                     values) if field_name == value.field.name else None
                      for field_name in value)
            )


class DataToXlsxDict(FromData):

    fields = ('id', 'title', 'abstract', 'keywords', 'source',
              'methods', 'project', 'subject')
    fields_transformer = {
        'id': lambda x: x,
        'title': lambda x: x,
        'abstract': lambda x: x,
        'keywords': lambda x: ','.join(x or []),
        'source': lambda x: x,
        'methods': lambda x: ','.join(x or []),
        'project': lambda x: x,
        'subject': lambda x: x
    }

    def __init__(self, data: Data):
        self._data = data

    def to(self, xlsx_dict):
        structure = xlsx_dict['structure']
        values = xlsx_dict['values']

        self._content_to(xlsx_dict)

        info_values = tuple(DataToXlsxDict.fields_transformer[field](self._data[field])
                            for field in DataToXlsxDict.fields)
        values['Data Info']['rows'].append(info_values)

        for i in range(len(values['Data Info']['rows'])):
            values['Data Info']['rows'][i] = (i + 2, ) + values['Data Info']['rows'][i]

        return xlsx_dict

    def _content_to(self, xlsx_dict):
        if self._data['content'] is None:
            return
        DataContentToXlsxDict(self._data['id'], self._data['content']).to(xlsx_dict)


class XlsxDictToDataContent:

    META_DATA_SHEET = 1

    ARRAY_DATA_ID_COL = 1
    ARRAY_ELEMENT_ID_COL = 2
    ARRAY_VALUE_COL = 3

    def __init__(self, data_content, xlsx_dict, data_id):
        self._data_content = data_content
        self._xlsx_dict = xlsx_dict
        self._data_id = data_id

    def to(self):
        content_sheet_name, links = self._xlsx_dict['structure']
        content_header, content_rows = (self._xlsx_dict['values'][content_sheet_name]['header'],
                                        self._xlsx_dict['values'][content_sheet_name]['rows'])
        if len(content_rows) == 0:
            return None

        row, self._xlsx_dict['values'][content_sheet_name]['rows'] = content_rows[0], content_rows[1:]

        for idx, field_name in enumerate(content_header[1:], 1):
            self._field_to(links.get(field_name), self._data_content[field_name], row[idx])
        return self._data_content

    def _field_to(self, structure, field, xlsx_value):
        self._value_to(structure, field.get_value(), xlsx_value)

    def _value_to(self, structure, value, xlsx_value):
        if isinstance(value, DataValue):
            self._data_value_to(structure, value, xlsx_value)
        if isinstance(value, MultiValue):
            self._multi_value_to(structure, value, xlsx_value)
        if isinstance(value, ContainerValue):
            self._container_value_to(structure, value, xlsx_value)
        if isinstance(value, GeneratorValue):
            self._generator_value_to(structure, value, xlsx_value)

    def _data_value_to(self, structure, value, xlsx_value):
        value.set(xlsx_value)

    def _multi_value_to(self, structure, value, xlsx_value):
        sheet_name, links = structure
        header, sheet_rows = (self._xlsx_dict['values'][sheet_name]['header'],
                              self._xlsx_dict['values'][sheet_name]['rows'])

        if isinstance(value, ArrayValue):

            i = 0
            while True:
                if len(sheet_rows) == 0:
                    break
                if sheet_rows[0][self.ARRAY_DATA_ID_COL] != self._data_id:
                    break
                if i > 0 and int(sheet_rows[0][self.ARRAY_ELEMENT_ID_COL]) == 1:
                    break

                row, self._xlsx_dict['values'][sheet_name]['rows'] = sheet_rows[0], sheet_rows[1:]
                value.create_and_append()
                self._value_to(links.get('value'), value[i], row[self.ARRAY_VALUE_COL])
                i += 1

        if isinstance(value, TableValue):
            i = 0
            while True:
                if len(sheet_rows) == 0:
                    break
                if sheet_rows[0][self.ARRAY_DATA_ID_COL] != self._data_id:
                    break
                if i > 0 and int(sheet_rows[0][self.ARRAY_ELEMENT_ID_COL]) == 1:
                    break

                row, self._xlsx_dict['values'][sheet_name]['rows'] = sheet_rows[0], sheet_rows[1:]
                value.create_and_append()
                for idx, field_name in enumerate(header[2:], 2):
                    value[i][field_name].set(row[idx])
                i += 1

    def _container_value_to(self, structure, value, xlsx_value):
        sheet_name, links = structure
        header, rows = (self._xlsx_dict['values'][sheet_name]['header'],
                        self._xlsx_dict['values'][sheet_name]['rows'])
        row, self._xlsx_dict['values'][sheet_name]['rows'] = rows[0], rows[1:]
        for idx, field_name in enumerate(header[1:], 1):
            self._field_to(links.get(field_name), value[field_name], row[idx])

    def _generator_value_to(self, structure, value, xlsx_value):
        sheet_name, links = structure
        header, rows = (self._xlsx_dict['values'][sheet_name]['header'],
                        self._xlsx_dict['values'][sheet_name]['rows'])
        row, self._xlsx_dict['values'][sheet_name]['rows'] = rows[0], rows[1:]
        for idx, field_name in enumerate(header[1:], 1):
            if row[idx] is not None:
                value.select(field_name)
                self._field_to(links.get(field_name), value.field, row[idx])


# TODO 试图重构 excel 导出的代码，暂时未推进
class XlsxDictToData:

    fields = ('id', 'title', 'doi', 'abstract', 'keywords', 'source', 'computation',
              'experiment', 'production', 'reference', 'project')

    META_DATA_SHEET = 1

    DATA_ID_COL = 1
    TITLE_COL = 2
    DOI_COL = 3
    ABSTRACT_COL = 4
    KEYWORDS_COL = 5
    SOURCE_COL = 6
    COMPUTATION_COL = 7
    EXPERIMENT_COL = 8
    PRODUCTION_COL = 9
    REFERENCE_COL = 10
    PROJECT_COL = 11

    def __init__(self, xlsx_dict, data):
        self._xlsx_dict = xlsx_dict
        self._data = data

    def to(self):
        sheet_name = self._xlsx_dict['ord'][self.META_DATA_SHEET]
        rows = self._xlsx_dict['ord'][sheet_name]['rows']

        if len(rows) == 0:
            return None

        row, self._xlsx_dict['ord'][sheet_name]['rows'] = rows[0], rows[1:]

        data_id = row[self.DATA_ID_COL]
        self._data['content'] = XlsxDictToDataContent(self._data['content'], self._xlsx_dict, data_id).to()

        self._data['title'] = row[self.TITLE_COL]
        self._data['doi'] = row[self.DOI_COL]
        self._data['abstrct'] = row[self.ABSTRACT_COL]
        self._data['keywords'] = list(row[self.KEYWORDS_COL].split(','))
        self._data['source'] = row[self.SOURCE_COL]
        self._data['methods'] = []
        if row[self.COMPUTATION_COL] == 'yes':
            self._data['methods'].append('computation')
        if row[self.EXPERIMENT_COL] == 'yes':
            self._data['methods'].append('experiment')
        if row[self.PRODUCTION_COL] == 'yes':
            self._data['methods'].append('production')
        self._data['reference'] = row[self.REFERENCE_COL]

        self._data['project'] = re.match(r'.*\((.*)\)', row[self.PROJECT_COL]).group(1)
        return self._data
