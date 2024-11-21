from mgedata.generic.template import TemplateContent, Template
from apps.storage.models.template import Template as TemplatePgModel
from mgedata.generic.trans.abstract import ToTemplateContent, ToTemplate
from mgedata.generic.trans.internal import DictToTemplateContent


class DbToTemplateContent(ToTemplateContent):

    def __init__(self, template_id):
        try:
            self._template_dict = TemplatePgModel.objects.get(pk=template_id).content
        except TemplatePgModel.DoesNotExist:
            raise ValueError('`template_id` does not exists')

    def to(self) -> TemplateContent:
        return DictToTemplateContent(self._template_dict).to()


class DbToTemplate(ToTemplate):
    basic_attributes = (('id', 'title', 'category', 'user', 'abstract', 'pub_date',
                         'published', 'trashed', 'reviewer', 'review_state', 'disapprove_reason'))

    attributes = basic_attributes + ('content',)

    def __init__(self, template_id):
        try:
            self._template_pg_model = TemplatePgModel.objects.get(pk=template_id)
        except TemplatePgModel.DoesNotExist:
            raise ValueError('`template_id` does not exists')

    def to(self) -> Template:
        kwargs = dict(
            (field, getattr(self._template_pg_model, field)) for field in self.basic_attributes
        )
        kwargs['content'] = DictToTemplateContent(self._template_pg_model.content).to()
        return Template(**kwargs)
