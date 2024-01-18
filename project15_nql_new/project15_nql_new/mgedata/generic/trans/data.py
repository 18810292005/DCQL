from mgedata.generic.trans.abstract import FromTemplateContent
from mgedata.generic.template import TemplateContent
from mgedata.generic.template_fields import *
from mgedata.generic.data_fields import *
from mgedata.generic.data import DataContent, Data


class TemplateContentToDataContent(FromTemplateContent):

    def __init__(self, template: TemplateContent):
        self._template = template

    def to(self):
        fields = []
        for name, field in self._template.fields:
            fields.append(self._to(name, field))
        return DataContent(misc={'fields': fields})

    def _string_to(self, name, field):
        return StringField(name, required=field.required)

    def _numeric_to(self, name, field):
        return NumericField(name, required=field.required, misc=field.misc)

    def _interval_to(self, name, field):
        return IntervalField(name, required=field.required, misc=field.misc)

    def _error_to(self, name, field):
        return ErrorField(name, required=field.required, misc=field.misc)

    def _choice_to(self, name, field):
        return ChoiceField(name, required=field.required, misc=field.misc)

    def _image_to(self, name, field):
        return ImageField(name, required=field.required, misc=field.misc)

    def _file_to(self, name, field):
        return FileField(name, required=field.required, misc=field.misc)

    def _array_to(self, name, field):
        if isinstance(field.misc, StringTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=StringValue))
        if isinstance(field.misc, NumericTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=NumericValue, **field.misc.misc))
        if isinstance(field.misc, IntervalTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=IntervalValue, **field.misc.misc))
        if isinstance(field.misc, ErrorTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=ErrorValue, **field.misc.misc))
        if isinstance(field.misc, ChoiceTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=ChoiceValue, **field.misc.misc))
        if isinstance(field.misc, ImageTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=ImageValue, **field.misc.misc))
        if isinstance(field.misc, FileTemplateField):
            return ArrayField(name, required=field.required, misc=dict(element_type=FileValue, **field.misc.misc))
        if isinstance(field.misc, ArrayTemplateField):
            raise ValueError
        if isinstance(field.misc, TableTemplateField):
            data_fields = []
            for x in field.misc.misc['_head']:
                data_fields.append(self._to(x, field.misc.misc[x]))
            return ArrayField(name, required=field.required, misc=dict(element_type=TableValue, fields=data_fields))
        if isinstance(field.misc, ContainerTemplateField):
            data_fields = []
            for x in field.misc.misc['_ord']:
                data_fields.append(self._to(x, field.misc.misc[x]))
            return ArrayField(name, required=field.required, misc=dict(element_type=ContainerValue, fields=data_fields))
        if isinstance(field.misc, GeneratorTemplateField):
            data_fields = []
            for x in field.misc.misc['_opt']:
                data_fields.append(self._to(x, field.misc.misc[x]))
            return ArrayField(name, required=field.required, misc=dict(element_type=GeneratorValue, fields=data_fields))

    def _table_to(self, name, field):
        fields = []
        for x in field.misc['_head']:
            fields.append(self._to(x, field.misc[x]))
        return TableField(name, required=field.required, misc={'fields': fields})

    def _container_to(self, name, field):
        fields = []
        for x in field.misc['_ord']:
            fields.append(self._to(x, field.misc[x]))
        return ContainerField(name, required=field.required, misc={'fields': fields})

    def _generator_to(self, name, field):
        fields = []
        for x in field.misc['_opt']:
            fields.append(self._to(x, field.misc[x]))
        return GeneratorField(name, required=field.required, misc={'fields': fields})


class TemplateContentToData:

    def __init__(self, template_content: TemplateContent):
        self._template_content = template_content

    def to(self) -> Data:
        return Data(content=TemplateContentToDataContent(self._template_content).to())
