import json

from mgedata.generic.data import Data
from mgedata.generic.data_fields import *
from mgedata.generic.trans.abstract import ToData, FromData
from mgedata.generic.trans.dict import DictToDataContent, DataContentToDict
from mgedata.generic.trans.data import TemplateContentToDataContent

from apps.storage.trans.db import DbToTemplateContent


class DataContentToApiDict(DataContentToDict):

    def _data_value_to(self, value):
        if isinstance(value, ImageValue) or isinstance(value, FileValue):
            return ['/media/' + path if not path.startswith('/api') else path for path in value.value]
        return super(DataContentToApiDict, self)._data_value_to(value)


class ApiDictToDataContent(DictToDataContent):

    def _data_value_to(self, value, doc_value):
        if isinstance(value, ImageValue) or isinstance(value, FileValue):
            doc_value = [path[len('/media/'):] if path.startswith('/media/') else path for path in doc_value]
        return super(ApiDictToDataContent, self)._data_value_to(value, doc_value)


class ApiToData(ToData):

    @staticmethod
    def mask_to_source(mask):
        if mask == '10':
            return 'self-production'
        elif mask == '01':
            return 'reference'
        return ''

    @staticmethod
    def mask_to_methods(mask):
        methods = []
        if set(mask) | set('01') == set('01') and len(mask) == 3:
            if mask[0] == '1':
                methods.append('computation')
            if mask[1] == '1':
                methods.append('experiment')
            if mask[2] == '1':
                methods.append('production')
        return methods

    fields_mapping = (
        ('title', 'title'),
        ('category', 'category'),
        ('tid', 'template'),
        ('abstract', 'abstract'),
        ('project', 'project'),
        ('subject', 'subject'),
    )

    optional_fields_mapping = (
        ('purpose', 'purpose'),
        ('doi', 'doi')
    )

    def __init__(self, request):
        self._req_body = json.loads(request.body.decode('utf-8'))
        self._req_user = request.user

    def to(self) -> Data:
        meta = self._req_body['meta']
        content = self._req_body['content']
        data = Data()

        for field_from, field_to in ApiToData.fields_mapping:
            if field_from in meta:
                data[field_to] = meta[field_from]
            else:
                raise AttributeError('`{}` is missing'.format(field_from))
        for field_from, field_to in ApiToData.optional_fields_mapping:
            if field_from in meta:
                data[field_to] = meta[field_from]

        if 'keywords' in meta:
            if isinstance(meta['keywords'], str) and len(meta['keywords'].strip()) > 0:
                data['keywords'] = meta['keywords'].strip().split(',')
            else:
                raise ValueError('`keywords` field with wrong value')
        if 'source' not in meta:
            raise AttributeError('`{}` is missing'.format('source'))
        else:
            data['source'] = ApiToData.mask_to_source(meta['source'])

        if 'methods' not in meta:
            raise AttributeError('`{}` is missing'.format('methods'))
        else:
            data['methods'] = ApiToData.mask_to_methods(meta['methods'])
        data['user'] = self._req_user.username
        data_content = TemplateContentToDataContent(DbToTemplateContent(data['template']).to()).to()
        data['content'] = ApiDictToDataContent(data_content, content).to()

        return data


class DataToApiResponseBody(FromData):

    fields_mapping = (('id', 'id'),
                      ('title', 'title'),
                      ('category_name', 'category'),
                      ('category', 'category_id'),
                      ('source', 'source'),
                      ('methods', 'methods'),
                      ('template', 'tid'),
                      ('keywords', 'keywords'),
                      ('doi', 'doi'),
                      ('score', 'score'),
                      ('downloads', 'downloads'),
                      ('views', 'views'),
                      ('abstract', 'abstract'),
                      ('purpose', 'purpose'),
                      ('realname', 'author'),
                      ('add_time', 'add_time'),
                      ('reference', 'reference'),
                      ('project_info', 'project'),
                      ('subject_info', 'subject'),
                      ('contributor', 'contributor'),
                      ('institution', 'institution'),
                      ('reviewer_realname', 'reviewer'),
                      ('reviewer_institution', 'reviewer_ins'),
                      ('via', 'via'),
                      ('template_content', 'template'))

    def __init__(self, data):
        self._data = data

    def to(self) -> dict:
        ret = dict()
        for field_from, field_to in DataToApiResponseBody.fields_mapping:
            if field_from in self._data:
                ret[field_to] = self._data[field_from]
        ret['approved'] = self._data['review_state'] == 1
        ret['content'] = DataContentToApiDict(self._data['content']).to()
        return ret


class DataToApiRequestBody(FromData):  # use it for test api currently
    @staticmethod
    def source_to_mask(source):
        if source == 'self-production':
            return '10'
        elif source == 'reference':
            return '01'
        return ''

    @staticmethod
    def methods_to_mask(methods):
        mask = ''
        if methods is None:
            return mask
        mask += '1' if 'computation' in methods else '0'
        mask += '1' if 'experiment' in methods else '0'
        mask += '1' if 'production' in methods else '0'
        return mask

    fields_mapping = (('title', 'title'),
                      ('category', 'category'),
                      ('template', 'tid'),
                      ('keywords', 'keywords'),
                      ('doi', 'doi'),
                      ('abstract', 'abstract'),
                      ('purpose', 'purpose'),
                      ('reference', 'reference'),
                      ('project', 'project'),
                      ('subject', 'subject'),
                      ('contributor', 'contributor'),
                      ('institution', 'institution'))

    def __init__(self, data):
        self._data = data

    def to(self) -> dict:
        meta = dict()
        for field_from, field_to in DataToApiRequestBody.fields_mapping:
            if field_from in self._data:
                meta[field_to] = self._data[field_from]
        meta['source'] = DataToApiRequestBody.source_to_mask(self._data['source'])
        meta['methods'] = DataToApiRequestBody.methods_to_mask(self._data['methods'])
        meta['keywords'] = ','.join(meta['keywords'])
        content = DataContentToApiDict(self._data['content']).to()
        return dict(meta=meta, content=content)
