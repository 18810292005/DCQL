from unittest import skip

from apps.storage.apis.v2.data import data_to_dict
from mgedata.test import *
from apps.storage.apis.v4.key_tools.tools import KeyHelper
from apps.storage.models.data import DataMeta


class TestDataApi(MGETestCase):

    def setUp(self):
        self.urls = {
            'data_upload': reverse('api_v4_storage:data_upload'),
            'data_sync': reverse('api_v4_storage:data_sync'),
        }

    @template_required
    def testDataUpload(self):
        HttpTools.create_data_uploader_user()
        data = {
            "template": {
                "_id": self.template_id,
                "test_str": {
                    "_type": "字符串型"
                },
                "test_array": {
                    "_type": "数组型",
                    "test_array": {
                        "_type": "数值型",
                        "_unit": "kk"
                    }
                },
                "test_file": {
                    "_type": "文件"
                },
                "test_container": {
                    "_type": "容器型",
                    "test_table": {
                        "_type": "表格型",
                        "test_row": {
                            "_type": "数值型",
                            "_unit": "kk"
                        }
                    },
                    "test_rang": {
                        "_type": "范围型",
                        "_unit": "kk"
                    }
                }
            },
            "data": [
                {
                    "meta": {
                        "数据 ID": "1",
                        "标题": "title 1",
                        "DOI": "",
                        "数据摘要": "su 1",
                        "关键词": "",
                        "来源": "MGE-SOURCE_HEADER v1 000 10 #",
                        "引用": "",
                        "其他信息": "project: 2016YFB0700500；subject: 2016YFB0700503",
                        "public_date": 0,
                        "public_range": 0
                    },
                    "content": {
                        "test_str": "str 1",
                        "test_array": [
                            1,
                            2
                        ],
                        "test_file": [

                        ],
                        "test_container": {
                            "test_table": [
                                {
                                    "test_row": 1
                                },
                                {
                                    "test_row": 2
                                }
                            ],
                            "test_rang": "(-1,1)"
                        }
                    }
                },
                {
                    "meta": {
                        "数据 ID": "2",
                        "标题": "title 2",
                        "DOI": "",
                        "数据摘要": "su 2",
                        "关键词": "",
                        "来源": "MGE-SOURCE_HEADER v1 000 10 #",
                        "引用": "",
                        "其他信息": "project: 2016YFB0700500；subject: 2016YFB0700503",
                        "public_date": 0,
                        "public_range": 0
                    },
                    "content": {
                        "test_str": "str 2",
                        "test_array": [
                            1,
                            2
                        ],
                        "test_file": [

                        ],
                        "test_container": {
                            "test_table": [
                                {
                                    "test_row": 1
                                },
                                {
                                    "test_row": 2
                                }
                            ],
                            "test_rang": "(-1,1)"
                        }
                    }
                }
            ]
        }

        init_count = DataMeta.objects.all().count()
        key = KeyHelper.generate_key()
        response = HttpTools.post(client=self.client, url=self.urls['data_upload'],
                                  data={'key': key, 'upload_by': 'test', 'data': data})
        finish_count = DataMeta.objects.all().count()
        print(response)
        self.assertEqual(finish_count, init_count + 2)
        self.assertEqual(response['code'], 0)

    @data_required
    @skip
    def testDataSync(self):
        data = {
            'version': 1,
            'data': create_full_data(file_path=self.file_path,
                                     image_path=self.image_path,
                                     category_id=self.material_category_id,
                                     template_id=self.template_id)
        }
        data['data']['meta']['id'] = self.data_meta_id
        data['data']['content']['test_str'] = 'sync_str'
        print(data)
        response = HttpTools.post(client=self.client, url=self.urls['data_sync'], data=data)
        print(response)
        self.assertEqual(response['code'], 0)
        self.assertEqual(response['data']['new_version'], 1)
        meta = DataMeta.objects.get(pk=1)
        data_dict = data_to_dict(meta, False)
        print(data_dict)
        self.assertEqual(data_dict['content']['test_str'], 'sync_str')

    @data_required
    def testDataPublic(self):
        meta: DataMeta = DataMeta.objects.all().first()
        meta.is_public = False
        meta.save()
        response = HttpTools.put(client=self.client, url=self.urls['data_sync'], data={'id_list': [meta.id]})
        print(response)
        public_meta = DataMeta.objects.get(pk=meta.id)
        self.assertEqual(public_meta.id, meta.id)
        self.assertEqual(public_meta.is_public, True)
