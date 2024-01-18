def create_full_data(file_path: str, image_path: str, category_id: int, template_id: str):
    data = {'content': {'test_array': [1, 2, 3],
                        'test_container': {'test_rang': {'lb': -1, 'ub': 1},
                                           'test_table': [{'test_row': 1},
                                                          {'test_row': 2}]},
                        'test_file': [file_path],
                        'test_image': [image_path],

                        'test_str': 'test_data'},
            'meta': {'abstract': 'test data for tdd',
                     'category': str(category_id),
                     'doi': 'test_doi',
                     'keywords': 'test,tdd',
                     'purpose': '',
                     'source': {'methods': '0100',
                                'project': '',
                                'reference': 'test',
                                'source': '10'},
                     'tid': template_id,
                     'title': 'test_data',
                     'public_date': 1,
                     'public_range': 2}}
    return data
