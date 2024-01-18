from copy import deepcopy
from typing import List, Dict, Any

from mongoengine import DoesNotExist

from apps.storage.docs import DataContent, DataFieldContainer, DataFieldTable, DataFieldTableRow
from apps.storage.models import MaterialCategory, DataMeta
from apps.storage.models.data import DataMetaFieldEnum
from apps.storage.models.template import TemplateField, Template, DocumentScope
from mgedata.errors.models import MGEError


class PathNode():
    def __init__(self, path, name, template: Template, option=None):
        if option is None:
            option = {}
        self.path = path
        self.name = name
        self._template_filed: TemplateField = self._get_field(template, path)
        self._template: Template = template
        self.option = option
        self.field_type = self._template_filed.field_type.name

    @classmethod
    def from_dict(cls, d: dict):
        path = d['path']
        name = d.get('name', path)
        template_id = d['template']
        try:
            template = Template.objects.get(id=template_id)
        except Template.DoesNotExist:
            raise MGEError.BAD_TEMPLATE
        option = d.get('options', {})
        return cls(path=path, name=name, template=template, option=option)

    @property
    def template_field(self):
        return self._template_filed

    @property
    def data_location_field(self):
        field_path = self._template_filed.field_path_str
        field_path_list = field_path.split('.')
        field = self._template_filed
        if not self._template_filed.parent_field is None \
                and self._template_filed.field_type.is_basic_or_attachment \
                and not self._template_filed.is_table_column:
            field_path = '.'.join(field_path_list[:-1])
            field = self._get_field(self._template, field_path)
            if field.field_type.is_array and field.parent_field is not None:
                field = field.parent_field
        # elif self._template_filed.field_type.is_array:
        #     if self._template_filed.element_field.field_type.is_table \
        #             or self._template_filed.element_field.field_type.is_generator \
        #             or self._template_filed.element_field.field_type.is_container \
        #             or self._template_filed.element_field.field_type.is_array:
        #         field = self._template_filed.element_field
        #     if self._template_filed.parent_field is not None:
        #         field = self._template_filed.parent_field
        return field

    @property
    def document_path(self):
        return self._template_filed.document_path

    @property
    def field_path_str(self):
        return self._template_filed.field_path_str

    @property
    def template(self):
        return self._template

    @property
    def template_id(self):
        return self._template.id

    @property
    def field_names(self):
        # TODO
        if self.template_field.field_type.is_container or self.template_field.field_type.is_generator:
            return self.template_field.sub_field_names
        else:
            return self.template_field.field_name

    def __hash__(self):
        return hash(f"{self.path}_{str(self.name)}_{str(self.template.id)}")

    def to_dict(self):
        return {'path': self.path,
                'name': self.name,
                'template': self.template.id,
                'field_type': self.field_type,
                'options': self.option, }

    def _get_field(self, template: Template, field_path: str):
        '''
        根据路径获取TemplateField
        '''

        def longest_common_prefix(strs: List[str]) -> str:
            _common_prefix = ""
            for i in zip(*strs):
                if len(set(i)) == 1:
                    _common_prefix += i[0]
                else:
                    break
            return _common_prefix

        common_prefix = ""
        for template_path in list(template.field_path_str_field_map.keys()):
            cur_common_prefix = longest_common_prefix([template_path, field_path])
            common_prefix = cur_common_prefix if len(cur_common_prefix) > len(common_prefix) else common_prefix
            if common_prefix.endswith('.'):
                common_prefix = common_prefix[:-1]
        prefix_field = template.get_field_by_field_path_str(common_prefix)
        if prefix_field is None:
            raise MGEError.UNKNOWN_ERROR
        # elif prefix_field.field_type.is_array:
        #     if prefix_field != field_path:
        #         array_external_path = '.' + str(prefix_field.element_field.field_type.value)
        #         field_path = field_path.replace(common_prefix, common_prefix + array_external_path, 1)
        #         return self._get_field(template, field_path)
        return prefix_field


class SearchPlan():
    def __init__(self, template: Template, document_path: str, document_scope: DocumentScope):
        self.template = template
        self.document_path = document_path
        self.document_scope = document_scope

    def __hash__(self):
        return hash(f"{self.document_path}_{str(self.template.id)}_{str(self.document_scope)}")
