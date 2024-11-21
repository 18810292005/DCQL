from mgedata.test import MGETestCase, template_required, upload_file_required, data_required
from apps.storage.models.data import DataMeta
from apps.storage.models.template import Template
from apps.storage.apis.v2.data import data_to_dict
from mgedata.test.utils.fixture.data import create_full_data
from apps.storage.models.data import DataPublicRange
import json


class TestTemplateFunctions(MGETestCase):

    def setUp(self):
        self.maxDiff = None
        return

    @template_required
    @upload_file_required
    def test_template_add_data(self):
        data = create_full_data(file_path=self.file_path, image_path=self.image_path,
                                category_id=self.material_category_id,
                                template_id=self.template_id)
        meta_dict = data.get('meta')
        source = meta_dict.get('source', {})
        meta_dict['reference'] = source.get('reference')
        meta_dict["source"] = ' '.join([DataMeta.SourceHelper.REPRESENTATION_HEADER,
                                        DataMeta.SourceHelper.VERSION_1,
                                        source.get('methods'),
                                        source.get('source'),
                                        DataMeta.SourceHelper.REPRESENTATION_END])

        data_meta = Template.objects.get(pk=int(self.template_id)).add_data(data.get('meta'), data.get('content'),
                                                                            uploaded_by='supertest',
                                                                            check_uploaded_files=True)
        data_dict = data_to_dict(data_meta, False)
        public_date = json.dumps(DataPublicRange.generate_date(1).astimezone(tz=None), default=str).split('.')[0][1:]

        data_dict_show = {'abstract': 'test data for tdd',
                          'add_time': '2019-12-11 17:34:41',
                          'approved': False,
                          'author': 'supertest',
                          'category': 'leaf',
                          'category_id': self.material_category_id,
                          'content': {'test_array': [1, 2, 3],
                                      'test_container': {'test_rang': {'lb': -1, 'ub': 1},
                                                         'test_table': [{'test_row': 1},
                                                                        {'test_row': 2}]},
                                      'test_file': [self.file_path],
                                      'test_image': [self.image_path],
                                      'test_str': 'test_data'},
                          'contributor': '',
                          'doi': 'test_doi',
                          'downloads': 0,
                          'external_link': None,
                          'id': data_meta.id,
                          'institution': '',
                          'keywords': ['test', 'tdd'],
                          'methods': ['experiment'],
                          'project': '',
                          'purpose': '',
                          'reference': 'test',
                          'reviewer': '',
                          'reviewer_ins': '',
                          'score': 0,
                          'source': 'self-production',
                          'tid': int(self.template_id),
                          'title': 'test_data',
                          'views': 0,
                          'public_date': public_date,
                          'public_range': DataPublicRange.generate_range(2),
                          }

        self.assertTrue(len(data_dict['add_time']) > 0)
        data_dict['add_time'] = data_dict_show['add_time']
        print(data_dict, data_dict_show)
        self.assertEquals(data_dict, data_dict_show)
        return

    @data_required
    def test_template_modify_data(self):
        data = create_full_data(file_path=self.file_path, image_path=self.image_path,
                                category_id=self.material_category_id,
                                template_id=self.template_id)
        meta_dict = data['meta']
        meta_dict['title'] = 'test_modify_data'
        content_dict = data['content']
        content_dict['test_str'] = 'test_modify'
        data_meta = Template.objects.get(pk=int(self.template_id)).modify_data(
            DataMeta.objects.get(pk=self.data_meta_id), meta_dict, content_dict)
        data_dict = data_to_dict(data_meta, False)
        public_date = json.dumps(DataPublicRange.generate_date(1).astimezone(tz=None), default=str).split('.')[0][1:]

        data_dict_show = {'abstract': 'test data for tdd',
                          'add_time': '2019-12-11 17:34:41',
                          'approved': False,
                          'author': 'supertest',
                          'category': 'leaf',
                          'category_id': self.material_category_id,
                          'content': {'test_array': [1, 2, 3],
                                      'test_container': {'test_rang': {'lb': -1, 'ub': 1},
                                                         'test_table': [{'test_row': 1},
                                                                        {'test_row': 2}]},
                                      'test_file': [self.file_path],
                                      'test_image': [self.image_path],
                                      'test_str': 'test_modify'},
                          'contributor': '',
                          'doi': 'test_doi',
                          'downloads': 0,
                          'external_link': None,
                          'id': self.data_meta_id,
                          'institution': '',
                          'keywords': ['test', 'tdd'],
                          'methods': [],
                          'project': '',
                          'purpose': '',
                          'reference': '',
                          'reviewer': '',
                          'reviewer_ins': '',
                          'score': 0.0,
                          'source': '',
                          'tid': int(self.template_id),
                          'title': 'test_modify_data',
                          'views': 0,
                          'public_date': public_date,
                          'public_range': DataPublicRange.generate_range(2),
                          }

        self.assertTrue(len(data_dict['add_time']) > 0)
        data_dict['add_time'] = data_dict_show['add_time']
        self.assertEquals(data_dict, data_dict_show)
        return
