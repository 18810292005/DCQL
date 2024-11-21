from django.utils import timezone

from apps.storage.docs.data import DataContent as DataContentDoc
from apps.storage.models.data import DataMeta
from mgedata.generic.data import DataContent, Data
from mgedata.generic.data_fields import *
from mgedata.generic.trans.abstract import ToData, ToDataContent
from mgedata.generic.trans.data import TemplateContentToDataContent, TemplateContentToData
from mgedata.generic.trans.internal import DictToTemplateContent


class DbToDataContent(ToDataContent):

    def __init__(self, meta_id: int, data_content: DataContent, raw_doc: DataContentDoc | dict=None):
        self._meta_id = meta_id
        self._data_content = data_content
        if raw_doc is not None and isinstance(raw_doc, dict):
            self._db_data_content = {'data': raw_doc}
        else:
            self._db_data_content = DataContentDoc.objects(_meta_id=self._meta_id).first()

    def to(self) -> DataContent:
        if self._db_data_content is None:
            return None
        self._data_content.create()
        doc = self._db_data_content['data']
        for field_name in self._data_content:
            if field_name in doc:
                self._data_content[field_name].create()
                self._field_to(self._data_content[field_name], doc[field_name])
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
        for i in range(len(doc_value or [])):
            value.create_and_append()
            self._value_to(value[i], doc_value[i])

    def _container_value_to(self, value, doc_value):
        container_doc = doc_value
        if container_doc is not None:
            for field_name in container_doc:
                if field_name in value:
                    value[field_name].create()
                    self._field_to(value[field_name], container_doc[field_name])

    def _generator_value_to(self, value, doc_value):
        generator_doc = doc_value
        if generator_doc is not None:
            for field_name in generator_doc:
                if field_name in value:
                    value.select(field_name)
                    self._field_to(value.field, generator_doc[field_name])

    def _table_row_value_to(self, value, doc_value):
        table_row_doc = doc_value
        if table_row_doc is not None:
            for field_name in table_row_doc:
                if field_name in value:
                    value[field_name].create()
                    self._field_to(value[field_name], table_row_doc[field_name])


class DbToData(ToData):
    fields_mapping = (
        ('title', 'title'),
        ('doi', 'doi'),
        ('keywords', 'keywords'),
        ('abstract', 'abstract'),
        ('purpose', 'purpose'),
        ('contributor', 'contributor'),

        ('project_id', 'project_id'),
        ('subject_id', 'subject_id'),
        ('id', 'id'),
        ('institution', 'institution'),

        ('is_public', 'is_public'),

        ('public_range', 'public_range'),
        ('public_date', 'public_date'),

        ('reviewer_id', 'reviewer'),
        ('disapprove_reason', 'disapprove_reason'),)

    def __init__(self, meta: int | DataMeta):
        template_content = None

        if isinstance(meta, DataMeta):
            self._meta_id = meta.pk
            self._pg_document = meta
            template_content = template_content or meta.template.content
        else:
            self._meta_id = meta
            self._pg_document = DataMeta.objects.get(pk=meta)
            template_content = template_content or self._pg_document.template.content
        self._data = TemplateContentToData(DictToTemplateContent(template_content).to()).to()

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
        # if ins.review_state is not None:
        #     self._data['review_state'] = 'pending' if ins.review_state == 0 \
        #         else 'approved' if ins.review_state == 1 else 'disapproved'

        project = ins.project
        subject = ins.subject
        self._data.force_set('project', f'{project.id} {project.name}')
        self._data.force_set('subject', f'{subject.id} {subject.name}')

        template = DictToTemplateContent(ins.template.content).to()
        self._data['content'] = self._content_to(self._meta_id, TemplateContentToDataContent(template).to())
        return self._data

    def _content_to(self, meta_id, data_content):
        return DbToDataContent(meta_id, data_content).to()
