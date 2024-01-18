import re
from bson import ObjectId

from django.utils import timezone

from mongoengine import Document

from apps.account.models import User
from apps.storage.models import MaterialProject, MaterialSubject
from apps.storage.models.data import DataMeta, MaterialCategory
from apps.storage.models.template import Template
from apps.storage.models.file import DataContentImage, DataContentFile
from apps.storage.docs.file import RealFile
from mgedata.generic.trans.abstract import ToData, ToDataContent, FromData, FromDataContent
from mgedata.generic.trans.data import TemplateContentToDataContent, TemplateContentToData
from mgedata.generic.trans.internal import DictToTemplateContent
from mgedata.generic.data import DataContent, Data
from mgedata.generic.data_fields import *
from apps.storage.docs.data import DataContent as DataContentDoc, \
    DataFieldContainer as DataFieldContainerDoc, \
    DataFieldTable as DataFieldTableDoc, \
    DataFieldTableRow as DataFieldTableRowDoc


class DbToDataContent(ToDataContent):

    def __init__(self, meta_id: int, data_content: DataContent):
        self._meta_id = meta_id
        self._data_content = data_content

        self._db_data_content = DataContentDoc.objects(_meta_id=self._meta_id).first()
        self._db_containers_of_id = dict((ins.id, ins) for ins in
                                         DataFieldContainerDoc.objects(_meta_id=self._meta_id))
        self._db_table_rows_of_id = dict((ins.id, ins) for ins in
                                         DataFieldTableRowDoc.objects(_meta_id=self._meta_id))
        self._db_table_of_id = dict((ins.id, ins) for ins in
                                    DataFieldTableDoc.objects(_meta_id=self._meta_id))

    def to(self) -> DataContent:
        if self._db_data_content is None:
            return None
        self._data_content.create()
        doc = self._db_data_content
        for field_name in self._data_content:
            if field_name in doc:
                self._data_content[field_name].create()
                self._field_to(self._data_content[field_name], doc.__getattribute__(field_name))
        return self._data_content

    def _field_to(self, field: Field, doc_value):
        self._value_to(field.get_value(), doc_value)

    def _value_to(self, value, doc_value):
        if isinstance(value, DataValue):
            self._data_value_to(value, doc_value)
        if isinstance(value, MultiValue):
            self._multi_value_to(value, doc_value)
        if isinstance(value, ContainerValue):
            self._container_value_to(value, doc_value)
        if isinstance(value, GeneratorValue):
            self._generator_value_to(value, doc_value)
        if isinstance(value, TableRowValue):
            self._table_row_value_to(value, doc_value)

    def _data_value_to(self, value, doc_value):
        value.force_set(doc_value)

    def _multi_value_to(self, value, doc_value):
        if isinstance(value, ArrayValue):
            for i in range(len(doc_value)):
                value.create_and_append()
                self._value_to(value[i], doc_value[i])
        if isinstance(value, TableValue):
            table_doc = self._db_table_of_id.get(doc_value)
            if table_doc:
                for i in range(len(table_doc['rows'])):
                    value.create_and_append()
                    self._value_to(value[i], table_doc['rows'][i])

    def _container_value_to(self, value, doc_value):
        container_doc = self._db_containers_of_id.get(doc_value) or DataFieldContainerDoc.objects(id=doc_value).first()
        if container_doc is not None:
            for field_name in container_doc:
                if field_name in value:
                    value[field_name].create()
                    self._field_to(value[field_name], container_doc[field_name])

    def _generator_value_to(self, value, doc_value):
        generator_doc = self._db_containers_of_id.get(doc_value) or DataFieldContainerDoc.objects(id=doc_value).first()
        if generator_doc is not None:
            for field_name in generator_doc:
                if field_name in value:
                    value.select(field_name)
                    self._field_to(value.field, generator_doc[field_name])

    def _table_row_value_to(self, value, doc_value):
        table_row_doc = self._db_table_rows_of_id.get(doc_value) or DataFieldTableRowDoc.objects(id=doc_value).first()
        if table_row_doc is not None:
            for field_name in table_row_doc:
                if field_name in value:
                    value[field_name].create()
                    self._field_to(value[field_name], table_row_doc[field_name])


class DataContentToDb(FromDataContent):

    def __init__(self, meta_id: int, template_id: int, data_content: DataContent):
        self._meta_id = meta_id
        self._template_id = template_id
        self._data_content = data_content

        self._inserted_docs = []

    def to(self) -> ObjectId:
        ins = DataContentDoc(_meta_id=self._meta_id, _tid=self._template_id)
        ins.save()
        self._inserted_docs.append(ins)

        for field_name in self._data_content:
            if self._data_content[field_name].get_value() is not None:
                ins.__setattr__(field_name, self._field_to(self._data_content[field_name], ins))
        ins.save()
        return ins.id

    def roll_back(self):
        for ins in self._inserted_docs:
            ins.delete()

    def _field_to(self, field: Field, owner: Document):
        return self._value_to(field.get_value(), owner)

    def _value_to(self, value, owner: Document):
        if isinstance(value, DataValue):
            return self._data_value_to(value, owner)
        if isinstance(value, MultiValue):
            return self._multi_value_to(value, owner)
        if isinstance(value, ContainerValue):
            return self._container_to(value, owner)
        if isinstance(value, GeneratorValue):
            return self._generator_to(value, owner)
        if isinstance(value, TableRowValue):
            return self._table_row_to(value, owner)
        raise ValueError('value must be DataValue or MultiValue or FieldsValue')

    def _data_value_to(self, value, owner: Document):
        if isinstance(value, ImageValue) or isinstance(value, FileValue):
            DbModel = DataContentImage if isinstance(value, ImageValue) else DataContentFile
            for path in value.value:
                if path.startswith('/api/'):
                    match = re.fullmatch(r'/api/v1/storage/file/data/content\?id=([a-zA-Z0-9]+)', path)
                    if match is None or RealFile.get(match.group(1)) is None:
                        raise ValueError('Wrong Image or File path with {}'.format(path))
                else:
                    if DbModel.objects.filter(file=path).first() is None:
                        raise ValueError('Wrong Image or File path with {}'.format(path))
        return value.value

    def _multi_value_to(self, value, owner: Document):
        if isinstance(value, ArrayValue):
            ret = []
            for i in range(len(value)):
                ret.append(self._value_to(value[i], owner))
            return ret
        if isinstance(value, TableValue):
            ins = DataFieldTableDoc(_meta_id=self._meta_id, _tid=self._template_id, _owner_id=owner.id)
            ins.rows = []
            ins.save()
            self._inserted_docs.append(ins)

            for i in range(len(value)):
                ins.rows.append(self._value_to(value[i], ins))
            ins.save()
            return ins.id

    def _container_to(self, value, owner: Document):
        ins = DataFieldContainerDoc(_meta_id=self._meta_id, _tid=self._template_id, _owner_id=owner.id)
        ins.save()
        self._inserted_docs.append(ins)

        for field_name in value:
            if value[field_name].get_value() is not None:
                ins.__setattr__(field_name, self._field_to(value[field_name], ins))
        ins.save()
        return ins.id

    def _generator_to(self, value, owner: Document):
        ins = DataFieldContainerDoc(_meta_id=self._meta_id, _tid=self._template_id, _owner_id=owner.id)
        ins.save()
        self._inserted_docs.append(ins)

        if value.field is not None:
            if value.field.get_value() is not None:
                ins.__setattr__(value.field.name, self._field_to(value.field, ins))
        ins.save()
        return ins.id

    def _table_row_to(self, value, owner: Document):
        ins = DataFieldTableRowDoc(_meta_id=self._meta_id, _tid=self._template_id, _owner_id=owner.id)
        ins.save()
        self._inserted_docs.append(ins)

        for field_name in value:
            if value[field_name].get_value() is not None:
                ins.__setattr__(field_name, self._field_to(value[field_name], ins))
        ins.save()
        return ins.id


class DataToDb(FromData):
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

    value_mapping_fields = (('title', 'title'),
                            ('doi', 'doi'),
                            ('keywords', 'keywords'),
                            ('abstract', 'abstract'),
                            ('purpose', 'purpose'),
                            ('contributor', 'contributor'),
                            ('reference', 'reference'),

                            ('institution', 'institution'),
                            ('is_public', 'is_public'),
                            ('downloads', 'downloads'),
                            ('views', 'views'),
                            ('score', 'score'),
                            ('importing', 'importing'),
                            ('disapprove_reason', 'disapprove_reason'),
                            ('other_info', 'other_info'),
                            ('add_time', 'add_time'))
    user_mapping_fields = (('user', 'user'),
                           ('reviewer', 'reviewer'),)

    def value_mapping(self, input, output):
        if self._data[input] is not None:
            self._pg_document.__setattr__(output, self._data[input])

    def user_mapping(self, input, output):
        if self._data[input] is not None:
            self._pg_document.__setattr__(output, User.objects.get(pk=self._data[input]))

    def __init__(self, data: Data):
        self._data = data
        self._pg_document = DataMeta()
        self._pg_document.save()

    def roll_back(self):
        self._pg_document.delete()

    def to(self) -> int:
        ins = self._pg_document
        for source_field, target_field in DataToDb.value_mapping_fields:
            self.value_mapping(source_field, target_field)

        for source_field, target_field in DataToDb.user_mapping_fields:
            self.user_mapping(source_field, target_field)

        if 'category' in self._data:
            ins.category = MaterialCategory.objects.get(pk=self._data['category'])

        if 'template' in self._data:
            ins.template = Template.objects.get(pk=self._data['template'])

        if 'methods' in self._data and 'source' in self._data:
            ins.source = 'MGE-SOURCE_HEADER v1 {} {} #'.format(
                DataToDb.methods_to_mask(self._data['methods']),
                DataToDb.source_to_mask(self._data['source'])
            )

        if 'review_state' in self._data and self._data['review_state'] is not None:
            ins.review_state = ('pending', 'approved', 'disapproved').index(self._data['review_state'])

        if (MaterialProject.objects.filter(pk=self._data['project']).first() is None or
                MaterialSubject.objects.filter(pk=self._data['subject']).first() is None):
            raise ValueError('`project` or `subject` information is not valid')
        other_info = dict(project=self._data['project'], subject=self._data['subject'])
        ins.other_info = other_info

        ins.save()
        if 'content' in self._data:
            ins.dc_id = self._content_to(ins.id, self._data['template'], self._data['content'])

        ins.save()
        return ins.id

    def _content_to(self, meta_id, template_id, data_content) -> ObjectId:
        return DataContentToDb(meta_id, template_id, data_content).to()


class DbToData(ToData):
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
        if isinstance(mask, str) and set(mask) | set('01') == set('01') and len(mask) == 3:
            if mask[0] == '1':
                methods.append('computation')
            if mask[1] == '1':
                methods.append('experiment')
            if mask[2] == '1':
                methods.append('production')
        return methods

    @staticmethod
    def decode_source(source):
        splits = source.split()
        if len(splits) == 5:
            if splits[0] == 'MGE-SOURCE_HEADER' and splits[1] == 'v1' and splits[-1] == '#':
                return splits[2], splits[3]
        return None, None

    fields_mapping = (
        ('title', 'title'),
        ('doi', 'doi'),
        ('keywords', 'keywords'),
        ('abstract', 'abstract'),
        ('purpose', 'purpose'),
        ('contributor', 'contributor'),
        ('reference', 'reference'),

        ('id', 'id'),
        ('institution', 'institution'),

        ('importing', 'importing'),
        ('score', 'score'),
        ('downloads', 'downloads'),
        ('views', 'views'),
        ('is_public', 'is_public'),

        ('public_range', 'public_range'),
        ('public_date', 'public_date'),

        ('reviewer_id', 'reviewer'),
        ('disapprove_reason', 'disapprove_reason'),)

    def __init__(self, meta_id: int):
        self._meta_id = meta_id
        try:
            self._pg_document = DataMeta.objects.get(pk=meta_id)
            self._data = TemplateContentToData(DictToTemplateContent(self._pg_document.template.content).to()).to()
        except DataMeta.DoesNotExist:
            raise ValueError('`meta_id` does not exists')

    def to(self) -> Data:
        ins = self._pg_document
        for source_field, target_field in DbToData.fields_mapping:
            if ins.__getattribute__(source_field) is not None:
                self._data.force_set(target_field, ins.__getattribute__(source_field))

        if ins.source is not None:
            methods_mask, source_mask = DbToData.decode_source(ins.source)
            self._data.force_set('methods', DbToData.mask_to_methods(methods_mask))
            self._data.force_set('source', DbToData.mask_to_source(source_mask))

        if ins.add_time is not None:
            self._data.force_set('add_time', timezone.localtime(ins.add_time))
        if ins.public_date is not None:
            self._data.force_set('public_date', timezone.localtime((ins.public_date)))

        if ins.user is not None:
            self._data.force_set('user', ins.user.username)
            self._data.force_set('realname', ins.user.real_name)
        if ins.reviewer is not None:
            self._data.force_set('reviewer', ins.reviewer.username)
            self._data.force_set('reviewer_realname', ins.reviewer.real_name)
            self._data.force_set('reviewer_institution', ins.reviewer.institution)
        if ins.template is not None:
            self._data.force_set('template', ins.template.id)
            self._data.force_set('template_name', ins.template.title)
            self._data.force_set('template_content', ins.template.content)
        if ins.category is not None:
            self._data.force_set('category', ins.category.id)
            self._data.force_set('category_name', ins.category.name)
        if ins.review_state is not None:
            self._data['review_state'] = 'pending' if ins.review_state == 0 \
                else 'approved' if ins.review_state == 1 else 'disapproved'

        if ins.other_info is not None:
            for field, value in ins.other_info.items():
                if field in self._data:
                    self._data.force_set(field, value)

        if (MaterialProject.objects.filter(pk=self._data['project']).first() is None or
                MaterialSubject.objects.filter(pk=self._data['subject']).first() is None):
            self._data.force_set('project', '2016YFB0700500')
            self._data.force_set('subject', '2016YFB0700503')
        self._data.force_set('project_info', MaterialProject.objects.get(pk=self._data['project']).to_dict())
        self._data.force_set('subject_info', MaterialSubject.objects.get(pk=self._data['subject']).to_dict())
        self._data['other_info'] = ins.other_info

        template = DictToTemplateContent(ins.template.content).to()
        self._data['content'] = self._content_to(self._meta_id, TemplateContentToDataContent(template).to())
        return self._data

    def _content_to(self, meta_id, data_content):
        return DbToDataContent(meta_id, data_content).to()


class DeletedDbToDataContent(DbToDataContent):

    def to(self) -> DataContent:
        ret = super(DeletedDbToDataContent, self).to()
        self._db_data_content.delete()
        for ins_id in self._db_containers_of_id:
            self._db_containers_of_id[ins_id].delete()
        for ins_id in self._db_table_of_id:
            self._db_table_of_id[ins_id].delete()
        for ins_id in self._db_table_rows_of_id:
            self._db_table_rows_of_id[ins_id].delete()
        return ret


class DeletedDbToData(DbToData):

    def _content_to(self, meta_id, data_content):
        return DeletedDbToDataContent(meta_id, data_content).to()

    def to(self) -> Data:
        ret = super(DeletedDbToData, self).to()
        self._pg_document.delete()
        return ret


class DataToOriginDb(DataToDb):

    def __init__(self, data):
        super(DataToOriginDb, self).__init__(data)
        try:
            self._pg_document = DataMeta.objects.get(pk=data['id'])
        except DataMeta.DoesNotExist:
            raise ValueError('`meta_id` is not valid')

        self._db_data_content = DataContentDoc.objects(_meta_id=data['id']).first()
        self._db_containers_of_id = dict((ins.id, ins) for ins in
                                         DataFieldContainerDoc.objects(_meta_id=data['id']))
        self._db_table_rows_of_id = dict((ins.id, ins) for ins in
                                         DataFieldTableRowDoc.objects(_meta_id=data['id']))
        self._db_table_of_id = dict((ins.id, ins) for ins in
                                    DataFieldTableDoc.objects(_meta_id=data['id']))
        self._backup = dict()
        self.make_backup()

    def make_backup(self):
        ins = self._pg_document
        for _, target_field in (DataToOriginDb.value_mapping_fields +
                                DataToOriginDb.user_mapping_fields +
                                (('', 'category'),
                                 ('', 'template'),
                                 ('', 'methods'),
                                 ('', 'source'),
                                 ('', 'review_state'),
                                 ('', 'other_info'))):
            if hasattr(ins, target_field):
                self._backup[target_field] = getattr(ins, target_field)

        if 'category' in self._data:
            ins.category = MaterialCategory.objects.get(pk=self._data['category'])

        if 'template' in self._data:
            ins.template = Template.objects.get(pk=self._data['template'])

        if 'methods' in self._data and 'source' in self._data:
            ins.source = 'MGE-SOURCE_HEADER v1 {} {} #'.format(
                DataToDb.methods_to_mask(self._data['methods']),
                DataToDb.source_to_mask(self._data['source'])
            )

        if 'review_state' in self._data:
            ins.review_state = ('pending', 'approved', 'disapproved').index(self._data['review_state'])

        if (MaterialProject.objects.filter(pk=self._data['project']).first() is None or
                MaterialSubject.objects.filter(pk=self._data['subject']).first() is None):
            raise ValueError('`project` or `subject` information is not valid')
        other_info = dict(project=self._data['project'], subject=self._data['subject'])
        ins.other_info = other_info

    def roll_back(self):
        for attr, value in self._backup.items():
            setattr(self._pg_document, attr, value)
        self._pg_document.save()

    def _content_to(self, meta_id, template_id, data_content) -> ObjectId:
        ret = DataContentToDb(meta_id, template_id, data_content).to()
        for ins in self._db_containers_of_id.values():
            ins.delete()
        for ins in self._db_table_rows_of_id.values():
            ins.delete()
        for ins in self._db_table_of_id.values():
            ins.delete()
        if self._db_data_content:
            self._db_data_content.delete()
        return ret
