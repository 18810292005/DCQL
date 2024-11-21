from elasticsearch_dsl import Mapping, Text, Index

from mgedata.generic.template import TemplateContent
from mgedata.generic.trans.abstract import FromTemplateContent


class TemplateContentToEsContentMapping(FromTemplateContent):

    @staticmethod
    def name_mapping(name):
        return name.replace('.', '\\.')

    def __init__(self, template: TemplateContent):
        self._template = template

    def to(self) -> dict:
        mapping = dict()
        for name, field in self._template.fields:
            mapping[TemplateContentToEsContentMapping.name_mapping(name)] = self._to(name, field)
        return {'properties': mapping}

    def _string_to(self, name, field):
        return {
            "type": "keyword",
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text"},
                "reverse": {"type": "text", "analyzer": "reverse_analyzer"}
            }
        }

    def _numeric_to(self, name, field):
        return {"type": "double"}

    def _interval_to(self, name, field):
        return {
            "properties": {
                "lb": {"type": "double"},
                "ub": {"type": "double"}
            }
        }

    def _error_to(self, name, field):
        return {
            "properties": {
                "val": {"type": "double"},
                "err": {"type": "double"}
            }
        }

    def _choice_to(self, name, field):
        return {
            "type": "keyword",
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text"},
                "reverse": {"type": "text", "analyzer": "reverse_analyzer"}
            }
        }

    def _image_to(self, name, field):
        return {"type": "keyword"}

    def _file_to(self, name, field):
        return {"type": "keyword"}

    def _array_to(self, name, field):
        return {
            "type": "nested",
            "properties": {
                "_idx": {"type": "long"},
                "_value": self._to(name,
                                   field.misc)
            }
        }

    def _table_to(self, name, field):
        mapping = dict(_idx={"type": "long"}, _value={"properties": {}})
        for field_name in field.misc['_head']:
            _key = TemplateContentToEsContentMapping.name_mapping(field_name)
            mapping["_value"]["properties"][_key] = self._to(field_name, field.misc[field_name])
        return {
            "type": "nested",
            "properties": mapping
        }

    def _container_to(self, name, field):
        mapping = dict()
        for field_name in field.misc['_ord']:
            mapping[TemplateContentToEsContentMapping.name_mapping(field_name)] = self._to(field_name,
                                                                                           field.misc[field_name])
        return {
            "properties": mapping
        }

    def _generator_to(self, name, field):
        mapping = dict()
        for field_name in field.misc['_opt']:
            mapping[TemplateContentToEsContentMapping.name_mapping(field_name)] = self._to(field_name,
                                                                                           field.misc[field_name])
        return {
            "properties": mapping
        }


class TemplateContentToEsMapping:
    def __init__(self, index_name: str, template: TemplateContent):
        self._index_name = index_name
        self._template = template

    default_fields = ('title', 'doi', 'keywords', 'abstract',
                      'contributor', 'project', 'subject', 'category_name', 'template_name',
                      'user', 'realname', 'institution', 'reviewer_realname',)
    long_fields = ('id', 'category', 'template', 'downloads', 'views')
    boolean_fields = ('is_public',)
    double_fields = ()
    keyword_fields = ('public_range', 'reviewer',)
    date_fields = ('add_time',)

    def default_config(self, mapping: Mapping, field_name: str) -> dict:
        mapping.field(field_name,
                      'keyword',
                      ignore_above=512,
                      fields={
                          'text': Text(),
                          'reverse': Text(analyzer='reverse_analyzer')
                      })
        return mapping

    def to(self) -> dict:
        _index = Index(self._index_name)

        m = Mapping()
        for field in TemplateContentToEsMapping.default_fields:
            m = self.default_config(m, field)
        for field in TemplateContentToEsMapping.long_fields:
            m.field(field, 'long')
        for field in TemplateContentToEsMapping.boolean_fields:
            m.field(field, 'boolean')
        for field in TemplateContentToEsMapping.double_fields:
            m.field(field, 'double')
        for field in TemplateContentToEsMapping.keyword_fields:
            m.field(field, 'keyword')
        for field in TemplateContentToEsMapping.date_fields:
            m.field(field, 'date')
        _index.mapping(m)

        _index.settings(
            index={
                "analysis": {
                    "filter": {
                        "last512": {
                            "length": "512",
                            "type": "truncate"
                        }
                    },
                    "analyzer": {
                        "reverse_analyzer": {
                            "filter": ["reverse", "last512"],
                            "type": "custom",
                            "tokenizer": "keyword"
                        }
                    }
                },
                'mapping.total_fields.limit': 10000,
                'mapping.nested_fields.limit': 500,
                'mapping.depth.limit': 20,
                'max_result_window': 10000000
            })

        index_dict = _index.to_dict()
        index_dict['mappings']['properties']['content'] = TemplateContentToEsContentMapping(self._template).to()
        return index_dict
