from mgedata.test import *
from apps.storage.apis.v4.key_tools.tools import KeyHelper
from apps.storage.models.file import DataContentFile


class TestFileApi(MGETestCase):

    def setUp(self):
        self.urls = {
            'file_upload': reverse('api_v4_storage:file_upload'),
        }

    def testFileUpload(self):
        files = list()
        for i in range(10):
            files.append(generate_random_file())

        init_count = DataContentFile.objects.all().count()
        key = KeyHelper.generate_key()
        response = self.client.post(path=self.urls['file_upload'],
                                    data={'key': key, 'type': '', 'files[]': files}).json()
        finish_count = DataContentFile.objects.all().count()
        self.assertEqual(finish_count, init_count + 10)
        self.assertEqual(response['code'], 0)
