import random

from django.utils import timezone

from mgedata.generic.data import Data, DataContent
from mgedata.generic.data_fields import *
from mgedata.generic.trans import FromDataContent, FromData, \
    TemplateContentToData, DictToTemplateContent

from apps.storage.models.template import Template as TemplatePgModel


RANDOM_GEN_MAX_INT = 100000


class DataContentRandomFiller(FromDataContent):
    field_value_generator = {
        'string': lambda: 'hello wo shi zifuchuan',
        'numeric': lambda: random.randint(1, RANDOM_GEN_MAX_INT),
        'interval': lambda: {
            'lb': random.randint(1, RANDOM_GEN_MAX_INT // 2),
            'ub': random.randint(RANDOM_GEN_MAX_INT // 2 + 1, RANDOM_GEN_MAX_INT)
        },
        'error': lambda: {
            'val': random.randint(RANDOM_GEN_MAX_INT // 2 + 1, RANDOM_GEN_MAX_INT),
            'err': random.randint(1, RANDOM_GEN_MAX_INT // 2)
        },
        'choice': lambda x: random.choice(x),
        'file': lambda: ['/f/a.txt'],
        'image': lambda: ['/image/f.png'],
        'multi': lambda: random.randint(1, 10)
    }

    @staticmethod
    def ignore_with_possibility(p):
        return random.random() < p

    def __init__(self, data_content: DataContent):
        self._data_content = data_content

    def to(self) -> DataContent:
        self._data_content.create()
        for field_name in self._data_content:
            if not self._data_content[field_name].required:
                if (DataContentRandomFiller.ignore_with_possibility(0.1) or
                    isinstance(self._data_content[field_name], ImageField) or
                        isinstance(self._data_content[field_name], FileField)):
                    continue
            self._data_content[field_name].create()
            self._field_to(self._data_content[field_name])
        return self._data_content

    def _field_to(self, field):
        self._value_to(field, field.get_value())

    def _value_to(self, field, value):
        if isinstance(value, DataValue):
            if isinstance(value, StringValue):
                value.set(DataContentRandomFiller.field_value_generator['string']())
            if isinstance(value, NumericValue):
                value.set(DataContentRandomFiller.field_value_generator['numeric']())
            if isinstance(value, IntervalValue):
                value.set(DataContentRandomFiller.field_value_generator['interval']())
            if isinstance(value, ErrorValue):
                value.set(DataContentRandomFiller.field_value_generator['error']())
            if isinstance(value, ChoiceValue):
                value.set(DataContentRandomFiller.field_value_generator['choice'](field.choices))
            if isinstance(value, ImageValue):
                value.set(DataContentRandomFiller.field_value_generator['image']())
            if isinstance(value, FileValue):
                value.set(DataContentRandomFiller.field_value_generator['file']())
        if isinstance(value, ArrayValue):
            for i in range(DataContentRandomFiller.field_value_generator['multi']()):
                value.create_and_append()
                self._value_to(field, value[i])
        if isinstance(value, TableValue):
            for i in range(DataContentRandomFiller.field_value_generator['multi']()):
                value.create_and_append()
                self._value_to(field, value[i])
        if isinstance(value, ContainerValue):
            for field_name in value:
                if not value[field_name].required:
                    if (DataContentRandomFiller.ignore_with_possibility(0.1) or
                        isinstance(value[field_name], ImageField) or
                            isinstance(value[field_name], FileField)):
                        continue
                value[field_name].create()
                self._field_to(value[field_name])
        if isinstance(value, GeneratorValue):
            return
        if isinstance(value, TableRowValue):
            for field_name in value:
                if not value[field_name].required:
                    if (DataContentRandomFiller.ignore_with_possibility(0.1) or
                        isinstance(value[field_name], ImageField) or
                            isinstance(value[field_name], FileField)):
                        continue
                value[field_name].create()
                self._field_to(value[field_name])


class DataRandomFiller(FromData):
    content_info_generator = {
        'title': lambda: '测试生成随机数据({})'.format(random.randint(1, RANDOM_GEN_MAX_INT)),
        'abstract': lambda: '生成的用于测试的随机数据',
        'purpose': lambda: '用于测试',
        'keywords': lambda: ['测试'],
        'contributor': lambda: 'mge developer',
        'institution': lambda: 'ustb',
        'importing': lambda: False,
        'methods': lambda: [],
        'source': lambda: 'self-production',
        'project': lambda: '2016YFB0700500',
        'subject': lambda: '2016YFB0700503'
    }

    mge_info_generator = {
        'downloads': lambda: random.randint(1, RANDOM_GEN_MAX_INT),
        'views': lambda: random.randint(1, RANDOM_GEN_MAX_INT),
        'add_time': lambda: timezone.localtime(timezone.now()),
        'is_public': lambda: True,
        'score': lambda: 0.0,
    }

    state_info_generator = {
        'review_state': lambda: random.choice(['pending', 'approved', 'disapproved']),
    }

    def __init__(self, username_as_pk, category_id, template_id):
        pg_template = TemplatePgModel.objects.get(pk=template_id)
        template = DictToTemplateContent(pg_template.content).to()
        self._data = TemplateContentToData(template).to()
        self._username = username_as_pk
        self._category_id = category_id

        self._data['user'] = username_as_pk
        self._data['category'] = category_id
        self._data['template'] = template_id

    def to(self) -> Data:
        for field_name, generator in DataRandomFiller.content_info_generator.items():
            self._data[field_name] = generator()

        for field_name, generator in DataRandomFiller.mge_info_generator.items():
            self._data[field_name] = generator()

        for field_name, generator in DataRandomFiller.state_info_generator.items():
            self._data[field_name] = generator()

        self._data['content'] = DataContentRandomFiller(self._data['content']).to()
        return self._data
