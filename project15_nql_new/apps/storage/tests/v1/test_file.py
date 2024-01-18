import time
from unittest import skip

from apps.storage.models import DataContentFile
from apps.storage.utils.data_import_export import export_data
from apps.task.models import UserTask, TaskState
from mgedata.test import MGETestCase
from mgedata.test.utils.http_tools import HttpTools
from os import remove
from apps.storage.models.file import TemporaryUploadedFile, FileContentType
from mgedata.test.utils.instances import *
import subprocess
from django.test import LiveServerTestCase
import mongoengine as me


class TestFileApi(MGETestCase):

    def postSetUp(self):
        HttpTools.login_as_root_user(client=self.client)
        self.urls = {
            'data_content_file': reverse('api_v1_storage:data_content_file'),
            'template_file': reverse('api_v1_storage:template_file', kwargs={'tid': self.template_id}),
            'data_export': reverse('api_v1_storage:data_export'),
            'data_search': reverse('api_v2_search:query_list'),
            'big_file_confirm': reverse('api_v1_storage:big_file_confirm'),
            'all_images_info': reverse('api_v1_storage:data_images_info'),
        }
        return

    def test_template_file(self):
        result = HttpTools.get(client=self.client, url=self.urls['template_file'], data={'type': 'JSON'})
        self.assertIn('.json', result['data'])
        return

    def test_data_content_file(self):
        self.assertEquals(self.file_response_data['code'], 0)
        self.assertIn('/media/', self.get_path_from_data(self.file_response_data))
        # TODO get method is mongo-gridfs file api abandoned and delete method is not finished
        return

    def test_uploaded_file(self):
        # TODO 需要和 export类测试依赖
        return

    def test_data_export(self):
        # TODO ES相关 无法测试
        # query = {"q": {"meta": {"and": [{"field": "realname", "val": "supertest", "op": "contains"}]}}}
        # data = HttpTools.post(client=self.client, url=self.urls['data_search'], data=query)
        # data = {"flat": True, "format": "JSON", "meta_id_list": [], "async": True, "query_id": 1337, "tid": "564"}
        # res = HttpTools.post(client=self.client, url=self.urls['data_export'], data={})
        return

    def test_big_file_confirm(self):
        self.assertEqual(DataContentFile.objects.all().count(), 1)
        filename = 'test_big_file'
        file_path = settings.MEDIA_ROOT + '/' + filename
        with open(file_path, 'w') as f:
            f.write('test')
        response = HttpTools.post(client=self.client, data={'path': file_path, 'name': filename},
                                  url=self.urls['big_file_confirm'])
        print(response)
        self.assertEqual(DataContentFile.objects.all().count(), 2)
        remove(file_path)
        return

    def test_all_images_info(self):
        response = HttpTools.get(client=self.client, url=self.urls['all_images_info'])
        print(response)


class UploadedFileTest(LiveServerTestCase):

    @instance
    def setUp(self) -> None:
        # 登录
        # client = Client()
        test_for_login(self.client)
        materialCategory_create()
        material_project_create()
        material_subject_create()
        template_create_v2()

    # Los: 本机测试失败，可能配置问题
    @skip
    def test_success(self):
        # res = json.loads(client.get(reverse('api_v1_storage:template_file', kwargs={'tid': template_create_v2().id}),
        #                             {'type': 'XLSX'}).content)
        # print(res)
        with open('./mgedata/test/utils/instances/data_instance2.json', 'rb') as fp:
            self.client.post(path=reverse('api_v1_storage:uploaded_file'), data={'file': fp})
        with open('./mgedata/test/utils/instances/data_instance.xml', 'rb') as fp:
            self.client.post(path=reverse('api_v1_storage:uploaded_file'), data={'file': fp})
        with open('./mgedata/test/utils/instances/data_instance2.xlsx', 'rb') as fp:
            self.client.post(path=reverse('api_v1_storage:uploaded_file'), data={'file': fp})
        usertask_list = UserTask.objects.all()
        self.assertEqual(len(usertask_list), 3)
        usertask = UserTask.objects.get(id=3)
        t = TemporaryUploadedFile.objects.all()
        self.assertEqual(len(t), 3)

        p = subprocess.Popen('celery -A mgedata worker -l debug', shell=True)
        # mongo is not fork-safe
        me.connection.disconnect()
        me.connect('mgedata', host='mongomock://localhost')
        success = TaskState.SUCCESS
        count = 0
        while usertask.state != success and usertask.state != TaskState.FAILED and count < 10:
            time.sleep(5)
            count += 5
            usertask = UserTask.objects.get(id=3)
        self.assertEqual(len(DataMeta.objects.all()), 7)
        p.kill()

        # 把数据导出
        meta_or_list = DataMeta.objects.all()[0].id
        print('-----------------------------------------------')
        print(meta_or_list)
        task_or_url = export_data(user=user_create(), meta_or_list=meta_or_list, file_format=FileContentType.JSON,
                                  asynchronous=False)
        print('-----------------------------------------------')
        print(task_or_url)
        task_or_url = export_data(user=user_create(), meta_or_list=meta_or_list, file_format=FileContentType.XLSX,
                                  asynchronous=False)
        print('-----------------------------------------------')
        print(task_or_url)
        task_or_url = export_data(user=user_create(), meta_or_list=meta_or_list, file_format=FileContentType.XML,
                                  asynchronous=False)
        print('-----------------------------------------------')
        print(task_or_url)
        self.assertEqual(usertask.state, success)
        self.assertEqual(len(DataSet.objects.all()), 3)
        print(DataMeta.objects.all()[0].dataset.user)
        self.assertIn(DataMeta.objects.all()[0].dataset, DataSet.objects.all())
