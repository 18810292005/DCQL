class Template:
    attributes = ('id', 'title', 'category', 'user', 'abstract', 'pub_date',
                  'published', 'trashed', 'reviewer', 'review_state', 'content',
                  'disapprove_reason')

    def __init__(self, **kwargs):
        self._value = dict()
        for field in self.attributes:
            value = None
            if field in kwargs:
                value = kwargs[field]
            self._value[field] = value

    def __setitem__(self, key, value):
        if key not in self.attributes:
            raise KeyError

        self._value[key] = value

    def __getitem__(self, key):
        return self._value[key]

    def __iter__(self):
        return iter(self._value)


class TemplateContent:

    def __init__(self, fields):
        self.fields = fields
        self.fields_dict = dict(fields)

    def validate(self):
        for _, field in self.fields:
            field.validate()
