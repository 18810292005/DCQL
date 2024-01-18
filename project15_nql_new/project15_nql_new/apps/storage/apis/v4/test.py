import os

from apps.account.models import User
from apps.storage.apis.v4.data_view import DataView
from apps.storage.models import DataMeta
from apps.storage.models.file import FileContentType
from apps.storage.utils.data_import_export import export_data
from mgedata.errors.models import MGEError
from mgedata.test import MGETestCase, post_to_create_user
from mgedata.test.testcase import assert_mge_error


class DataViewTest(MGETestCase):

    def postSetUp(self) -> None:
        post_to_create_user(self.client, 'shujuguan', 'sjgpwd', 'sjg', 'sunke@shujuguan.cn', '12003451356', 'shujuguan')
        self.user = User.objects.get(email='sunke@shujuguan.cn')
        self.data_view = DataView(user=self.user)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def test_get_token(self):
        self.data_view.get_user_token()
        self.assertEquals(self.data_view._token, "6574456c3ef6078ce2659773e1d5f575")

        with assert_mge_error(MGEError.THIRD_PARTY_REQUEST_FAILED):
            self.user = User.objects.get(email='xx@xx.cn')
            self.data_view = DataView(user=self.user)
            self.data_view.get_user_token()

    def test_get_upload_excel_file_list(self):
        meta_data: DataMeta = DataMeta.objects.all().first()
        archive_outer_url: str = export_data(user=self.user, meta_or_list=meta_data, file_format=FileContentType.JSON,
                                             asynchronous=False)[1:]
        excel_paths: list = self.data_view.get_upload_excel_file_list(archive_outer_url)
        for excel_path in excel_paths:
            self.assertTrue(os.path.exists(excel_path))
            basename, ext = os.path.splitext(excel_path)
            self.assertEquals(ext.upper(), '.XLSX')

    def test_upload_excel_and_create_sheets_to_data_view(self):
        self.data_view.get_user_token()
        meta_data: DataMeta = DataMeta.objects.all().first()
        archive_outer_url: str = export_data(user=self.user, meta_or_list=meta_data,
                                             file_format=FileContentType.XLSX,
                                             asynchronous=False)[1:]
        excel_paths: list = self.data_view.get_upload_excel_file_list(archive_outer_url)
        for excel_path in excel_paths:
            excel_basename = os.path.basename(excel_path)
            response_data = self.data_view.upload_workbook_to_data_view(excel_path)
            print(response_data)
            self.assertTrue(excel_basename, response_data['filename'])
            self.assertIsNotNone(response_data['storageDataId'])
            self.assertIsNotNone(response_data['fd'])
            self.data_view.create_sheets(excel_path)
