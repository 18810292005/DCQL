from datetime import datetime

from apps.storage.data_refactor.json_refactor import ColumnDatatGetter
from apps.storage.data_refactor.utils.path_node import PathNode
from apps.storage.docs import DataContent
from apps.storage.models import Template, DataMeta, MaterialCategory
from apps.storage.models.file import DataRefactorFile
from apps.storage.tasks import JiuZhanExportWithCustomTask
from apps.storage.utils.serializers import FlatJSONWriter
from apps.task.models import UserTask, TaskType
from mgedata.test import MGETestCase, material_category_required
from mongoengine import connect, disconnect


class PathNodeTester(MGETestCase):
    @material_category_required
    def setUp(self):
        disconnect()
        connect('mgedata', host='127.0.0.1', port=27017)
        template_content = {"_ord": ["top_con", "array_con", "table", "array_str", "array_table", "top_range"],
                            "table": {"r": False, "t": 8, "misc": {"a": {"r": False, "t": 1, "misc": {}},
                                                                   "b": {"r": False, "t": 2, "misc": {"unit": None}},
                                                                   "_head": ["a", "b"]}},
                            "top_con": {"r": False, "t": 9, "misc": {"_ord": ["sub_con", "sub_array_str", "sub_str"],
                                                                     "sub_con": {"r": False, "t": 9, "misc": {
                                                                         "_ord": ["sub_con_range", "sub_con_choice"],
                                                                         "sub_con_range": {"r": False, "t": 3,
                                                                                           "misc": {"type": 0,
                                                                                                    "unit": None}},
                                                                         "sub_con_choice": {"r": False, "t": 6,
                                                                                            "misc": {"grp": [
                                                                                                {"name": "group1",
                                                                                                 "items": ["1-1",
                                                                                                           "1-2"]},
                                                                                                {"name": "group2",
                                                                                                 "items": ["2-1",
                                                                                                           "2-2"]}],
                                                                                                "opt": ["1", "2",
                                                                                                        "3", "4",
                                                                                                        "test1",
                                                                                                        "test2"]}}}},
                                                                     "sub_str": {"r": False, "t": 1, "misc": {}},
                                                                     "sub_array_str": {"r": False, "t": 7,
                                                                                       "misc": {"r": False, "t": 1,
                                                                                                "misc": {}}}}},
                            "array_con": {"r": False, "t": 7, "misc": {"r": False, "t": 9, "misc": {
                                "_ord": ["array_con_str", "array_con_num", "array_sub_array"],
                                "array_con_num": {"r": False, "t": 2, "misc": {"unit": None}},
                                "array_con_str": {"r": False, "t": 1, "misc": {}},
                                "array_sub_array": {"r": False, "t": 7, "misc": {"r": False, "t": 9,
                                                                                 "misc": {"_ord": ["sub_str"],
                                                                                          "sub_str": {"r": False,
                                                                                                      "t": 1,
                                                                                                      "misc": {}}}}}}}},
                            "array_str": {"r": False, "t": 7, "misc": {"r": False, "t": 1, "misc": {}}},
                            "top_range": {"r": False, "t": 3, "misc": {"type": 0, "unit": None}},
                            "array_table": {"r": False, "t": 7, "misc": {"r": False, "t": 8,
                                                                         "misc": {"a": {"r": False, "t": 1, "misc": {}},
                                                                                  "b": {"r": False, "t": 2,
                                                                                        "misc": {"unit": None}},
                                                                                  "_head": ["a", "b"]}}}}
        category = MaterialCategory.objects.get(name_zh='leaf_1')
        self.template_1 = Template(id=18,
                                   title='测试模板1',
                                   abstract='测试',
                                   published=True,
                                   trashed=False,
                                   review_state=0,
                                   content=template_content,
                                   constraints={},
                                   category=category)
        self.template_1.save(check_pk=False)

        self.template_content2 = {'_ord': ['test_file'],
                                  'test_file': {'misc': {'multi': False}, 'r': False, 't': 5}}
        self.template_2 = Template(id=10,
                                   title='测试模板2',
                                   abstract='测试',
                                   published=True,
                                   trashed=False,
                                   review_state=0,
                                   content=self.template_content2,
                                   constraints={},
                                   category=category)
        self.template_2.save(check_pk=False)

        self.template_content3 = {'_ord': ['test_image'],
                                  'test_image': {'misc': {'multi': False}, 'r': False, 't': 4}}
        self.template_3 = Template(id=11,
                                   title='测试模板3',
                                   abstract='测试',
                                   published=True,
                                   trashed=False,
                                   review_state=0,
                                   content=self.template_content3,
                                   constraints={},
                                   category=category)
        self.template_3.save(check_pk=False)

    # def test_get_field(self):
    #     datas = [PathNode('top_con', 'test_array_con', self.template_1, ).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('top_con.sub_str', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('array_str', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('array_con', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('array_con.9.array_con_str', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('table', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('table.a', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('table', 'test_array_con', self.template_1).to_dict(),
    #              PathNode('table.a', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('array_table', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('array_table.a', 'test_array_con', self.template_1).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     datas = [PathNode('top_range', 't1', self.template_1, {}).to_dict(),
    #              PathNode('array_con.9.array_con_str', 't2', self.template_1, {'expand_array': True}).to_dict(),
    #              PathNode('top_con', 't3', self.template_1, {}).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     print(jr.refactor_datas(datas))
    #     pass
    #
    # def test_file(self):
    #     datas = [PathNode('test_file', 'file', self.template_2).to_dict()]
    #     jr = ColumnDatatGetter(self.template_2)
    #     frame,_,_ =jr.refactor_datas(datas)
    #     print(frame)
    #     pass

    # def test_hdf(self):
    #     datas = [PathNode('top_range', 't1', self.template_1, {}).to_dict(),
    #              PathNode('array_con.9.array_con_str', 't2', self.template_1, {'expand_array': True}).to_dict(),
    #              PathNode('top_con', 't3', self.template_1, {}).to_dict()]
    #     jr = ColumnDatatGetter(self.template_1)
    #     hdf = jr.refactor_to_hdf('rf_data.h5',  datas)
    #     datas = [PathNode('test_file', 'file', self.template_2).to_dict()]
    #     jr = ColumnDatatGetter(self.template_2)
    #     hdf = jr.refactor_to_hdf('rf_file_data.h5', datas)
    #     datas = [PathNode('test_image', 'image', self.template_3).to_dict()]
    #     jr = ColumnDatatGetter(self.template_3)
    #     hdf = jr.refactor_to_hdf('rf_image_data.h5', datas)
    #     pass

    def test_json(self):
        datas = [{'path': 'top_range', 'name': 't1', 'config': {}},
                 {'path': 'array_con.9.array_con_str', 'name': 't2', 'config': {'expand_array': True}},
                 {'path': 'top_con', 'name': 't3', 'config': {}}]
        jr = ColumnDatatGetter(self.template_1)
        jr.refactor_to_json('test.json', datas, file=True)
        datas = [PathNode('test_file', 'file', self.template_2).to_dict()]
        jr = ColumnDatatGetter(self.template_2)
        jr.refactor_to_json('test_file.json', datas, file=True)
        datas = [PathNode('test_image', 'image', self.template_3).to_dict()]
        jr = ColumnDatatGetter(self.template_3)
        jr.refactor_to_json('test_image.json', datas, file=True)
        pass
