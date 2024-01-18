from mgedata.generic.trans.abstract import FromTemplateContent


class TemplateContentToXlsxDict:
    """
    Example:
    {
        "_ord": ["string", "container"],
        "string": {
            "t": 1
        },
        "container": {
            "t": 9,
            "misc": {
                "_ord": ["container_string"],
                "container_string": {
                    "t": 1
                }
            }
        }
    }

    -->

    (
        '1',
        {
            "string": None,
            "container": (
                '2',
                {
                    "container_string": None
                }
            )
        }
    )

    string, integer, interval, choice, image, files:
    None

    container, generator, table:
    (<sheet_name>, {"field1": <mapping of field1>, "field2": <mapping of field2>, ...})

    array:
    (<sheet_name>, {"value": <mapping of element type>}

    """

    def __init__(self, template_content):
        self._template_content = template_content

    def to(self) -> dict:
        xlsx_dict = TemplateContentToXlsxStructure(self._template_content).to()
        xlsx_dict = XlsxDictToInitializeValue(self._template_content, xlsx_dict).to()
        return xlsx_dict


class TemplateContentToXlsxStructure(FromTemplateContent):

    def create_sheet_name_generator(self):
        sheet_id = 1

        def wrapper():
            nonlocal sheet_id
            ret = str(sheet_id)
            sheet_id += 1

            self._ord.append(ret)
            return ret

        return wrapper

    def __init__(self, template_content):
        self._template_content = template_content

        self._structure = None
        self._ord = []
        self._generate_sheet_name = self.create_sheet_name_generator()

    def to(self) -> dict:
        self._structure = dict()

        links = dict()
        content_sheet_name = self._generate_sheet_name()

        for name, field in self._template_content.fields:
            sub_structure = self._to(name, field)
            if sub_structure is not None:
                links[name] = sub_structure

        self._structure = (content_sheet_name, links)

        return dict(
            structure=self._structure,
            ord=['Data Info'] + self._ord)

    def _string_to(self, name, field):
        return None

    def _numeric_to(self, name, field):
        return None

    def _interval_to(self, name, field):
        return None

    def _error_to(self, name, field):
        return None

    def _choice_to(self, name, field):
        return None

    def _image_to(self, name, field):
        return None

    def _file_to(self, name, field):
        return None

    def _array_to(self, name, field):
        ret = self._generate_sheet_name()
        sub_structure = self._to(name, field.misc)
        return ret, dict(value=sub_structure)

    def _table_to(self, name, field):
        ret = self._generate_sheet_name()
        links = dict()
        for field_name in field.misc['_head']:
            sub_structure = self._to(field_name, field.misc[field_name])
            if sub_structure is not None:
                links[field_name] = sub_structure
        return ret, links

    def _container_to(self, name, field):
        ret = self._generate_sheet_name()
        links = dict()
        for field_name in field.misc['_ord']:
            sub_structure = self._to(field_name, field.misc[field_name])
            if sub_structure is not None:
                links[field_name] = sub_structure

        return ret, links

    def _generator_to(self, name, field):
        ret = self._generate_sheet_name()
        links = dict()
        for field_name in field.misc['_opt']:
            sub_structure = self._to(field_name, field.misc[field_name])
            if sub_structure is not None:
                links[field_name] = sub_structure
        return ret, links


class XlsxDictToInitializeValue(FromTemplateContent):

    def __init__(self, template_content, xlsx_dict):
        self._template_content = template_content
        self._xlsx_dict = xlsx_dict

        self._values = None

    def to(self) -> dict:
        self._values = dict()
        content_sheet_name, links = self._xlsx_dict['structure']

        self._values[content_sheet_name] = dict(
            header=(1, 'Data ID',) + tuple(name for name, _ in self._template_content.fields),
            rows=list())

        self._values['Data Info'] = dict(
            header=(1, 'Data ID', 'Title', 'Abstract', 'Keywords', 'Source', 'Methods', 'Project', 'Subject'),
            rows=list())

        for name, field in self._template_content.fields:
            self._to(links.get(name), field)

        self._xlsx_dict['values'] = self._values
        return self._xlsx_dict

    def _string_to(self, name, field):
        return None

    def _numeric_to(self, name, field):
        return None

    def _interval_to(self, name, field):
        return None

    def _error_to(self, name, field):
        return None

    def _choice_to(self, name, field):
        return None

    def _image_to(self, name, field):
        return None

    def _file_to(self, name, field):
        return None

    def _array_to(self, name, field):
        sheet_name, links = name
        self._values[sheet_name] = dict(
            header=(1, 'Data ID', 'Item ID', 'Value'),
            rows=list())
        self._to(links.get('value'), field.misc)

    def _table_to(self, name, field):
        sheet_name, links = name
        self._values[sheet_name] = dict(
            header=(1, 'Data ID',) + tuple(field.misc['_head']),
            rows=list())
        for field_name in field.misc['_head']:
            self._to(links.get(field_name), field.misc[field_name])

    def _container_to(self, name, field):
        sheet_name, links = name
        for field_name in field.misc['_ord']:
            self._to(links.get(field_name), field.misc[field_name])
        self._values[sheet_name] = dict(
            header=(1, 'Data ID',) + tuple(field.misc['_ord']),
            rows=list())

    def _generator_to(self, name, field):
        sheet_name, links = name
        for field_name in field.misc['_opt']:
            self._to(links.get(field_name), field.misc[field_name])
        self._values[sheet_name] = dict(
            header=(1, 'Data ID',) + tuple(field.misc['_opt']),
            rows=list())
