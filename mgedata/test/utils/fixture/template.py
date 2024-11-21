from time import strftime, localtime


def create_template(material_category_id):
    return create_templates(material_category_id)[0]


def create_templates(material_category_id):
    templates = [{'abstract': 'template for test',
                  'category': str(material_category_id),
                  'content': {'_ord': ['test_str', 'test_array', 'test_file', 'test_image', 'test_container'],
                              'test_array': {'misc': {'misc': {'unit': 'kk'}, 'r': True, 't': 2},
                                             'r': True,
                                             't': 7},
                              'test_container': {'misc': {'_ord': ['test_table', 'test_rang'],
                                                          'test_rang': {'misc': {'type': 0,
                                                                                 'unit': 'kk'},
                                                                        'r': False,
                                                                        't': 3},
                                                          'test_table': {'misc': {'_head': ['test_row'],
                                                                                  'test_row': {'misc': {'unit': 'kk'},
                                                                                               'r': True,
                                                                                               't': 2}},
                                                                         'r': False,
                                                                         't': 8}},
                                                 'r': True,
                                                 't': 9},
                              'test_file': {'misc': {'multi': True}, 'r': False, 't': 5},
                              'test_image': {'misc': {'multi': True}, 'r': False, 't': 4},
                              'test_str': {'misc': {}, 'r': True, 't': 1}},
                  'published': True,
                  'title': 'test_for_tdd'}]
    return templates


def create_template_one_show(template_id: str, material_category_id, ref_count: int):
    template_one_show = {'code': 0,
                         'data': {'abstract': 'template for test',
                                  'author': 'supertest',
                                  'category': 'leaf',
                                  'category_id': material_category_id,
                                  'content': {
                                      '_ord': ['test_str', 'test_array', 'test_file', 'test_image', 'test_container'],
                                      'test_array': {'misc': {'misc': {'unit': 'kk'}, 'r': True, 't': 2},
                                                     'r': True,
                                                     't': 7},
                                      'test_container': {'misc': {'_ord': ['test_table', 'test_rang'],
                                                                  'test_rang': {'misc': {'type': 0,
                                                                                         'unit': 'kk'},
                                                                                'r': False,
                                                                                't': 3},
                                                                  'test_table': {'misc': {'_head': ['test_row'],
                                                                                          'test_row': {'misc': {
                                                                                              'unit': 'kk'},
                                                                                              'r': True,
                                                                                              't': 2}},
                                                                                 'r': False,
                                                                                 't': 8}},
                                                         'r': True,
                                                         't': 9},
                                      'test_file': {'misc': {'multi': True}, 'r': False, 't': 5},
                                      'test_image': {'misc': {'multi': True}, 'r': False, 't': 4},
                                      'test_str': {'misc': {}, 'r': True, 't': 1}},
                                  'id': int(template_id),
                                  'pub_date': str(strftime("%Y-%m-%d", localtime())),
                                  'published': True,
                                  'ref_count': ref_count,
                                  'title': 'test_for_tdd',
                                  'username': 'supertest'}}
    return template_one_show


def create_template_response(template_id: str):
    return {"code": 0, "data": {"failed": [], "succeed": [template_id]}}


def create_template_show(template_id: str, material_category_id, ref_count: int):
    templates_show = {'code': 0,
                      'data': {'templates': [{'abstract': 'template for test',
                                              'author': 'supertest',
                                              'category': 'leaf',
                                              'category_id': material_category_id,
                                              'content': {
                                                  '_ord': ['test_str', 'test_array', 'test_file', 'test_image',
                                                           'test_container'],
                                                  'test_array': {'misc': {'misc': {'unit': 'kk'}, 'r': True, 't': 2},
                                                                 'r': True,
                                                                 't': 7},
                                                  'test_container': {'misc': {'_ord': ['test_table', 'test_rang'],
                                                                              'test_rang': {'misc': {'type': 0,
                                                                                                     'unit': 'kk'},
                                                                                            'r': False,
                                                                                            't': 3},
                                                                              'test_table': {
                                                                                  'misc': {'_head': ['test_row'],
                                                                                           'test_row': {
                                                                                               'misc': {'unit': 'kk'},
                                                                                               'r': True,
                                                                                               't': 2}},
                                                                                  'r': False,
                                                                                  't': 8}},
                                                                     'r': True,
                                                                     't': 9},
                                                  'test_file': {'misc': {'multi': True}, 'r': False, 't': 5},
                                                  'test_image': {'misc': {'multi': True}, 'r': False, 't': 4},
                                                  'test_str': {'misc': {}, 'r': True, 't': 1}},
                                              'id': int(template_id),
                                              'pub_date': str(strftime("%Y-%m-%d", localtime())),
                                              'published': True,
                                              'ref_count': ref_count,
                                              'title': 'test_for_tdd',
                                              'username': 'supertest'}],
                               'total': 1}}
    return templates_show
