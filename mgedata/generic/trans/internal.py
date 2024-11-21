from mgedata.generic.template import TemplateContent
from mgedata.generic.template_fields import TemplateFieldEnum, \
    StringTemplateField, NumericTemplateField, IntervalTemplateField, ErrorTemplateField, \
    ChoiceTemplateField, ImageTemplateField, FileTemplateField, ArrayTemplateField, \
    TableTemplateField, ContainerTemplateField, GeneratorTemplateField
from mgedata.generic.trans.abstract import ToTemplateContent


class DictToTemplateContent(ToTemplateContent):

    def __init__(self, data):
        self.data = data

    def to(self):
        fields = []
        for field in self.data['_ord']:
            fields.append((field, self._to(self.data[field])))
        return TemplateContent(fields)

    def _to(self, data):
        t = TemplateFieldEnum(data['t'])
        if t == TemplateFieldEnum.STRING:
            return StringTemplateField(required=data.get('r', False), misc={})
        elif t == TemplateFieldEnum.NUMBER:
            return NumericTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
        elif t == TemplateFieldEnum.RANGE:
            if data['misc']['type'] == 0:
                return IntervalTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
            else:
                return ErrorTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
        elif t == TemplateFieldEnum.CHOICE:
            return ChoiceTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
        elif t == TemplateFieldEnum.IMAGE:
            return ImageTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
        elif t == TemplateFieldEnum.FILE:
            return FileTemplateField(required=data.get('r', False), misc=data.get('misc', {}))
        elif t == TemplateFieldEnum.ARRAY:
            return ArrayTemplateField(required=data.get('r', False), misc=self._to(data.get('misc', {})))
        elif t == TemplateFieldEnum.TABLE:
            return TableTemplateField(required=data.get('r', False), misc=dict(
                [('_head', data['misc']['_head'])] + [(k, self._to(data['misc'][k])) for k in data['misc']['_head']]
            ))
        elif t == TemplateFieldEnum.CONTAINER:
            return ContainerTemplateField(required=data.get('r', False), misc=dict(
                [('_ord', data['misc']['_ord'])] + [(k, self._to(data['misc'][k])) for k in data['misc']['_ord']]
            ))
        elif t == TemplateFieldEnum.GENERATOR:
            return GeneratorTemplateField(required=data.get('r', False), misc=dict(
                [('_opt', data['misc']['_opt'])] + [(k, self._to(data['misc'][k])) for k in data['misc']['_opt']]
            ))
        raise ValueError
