from pathlib import Path

from apps.account.excel import generate_excel, read_excel
from mgedata.errors.models import MGEError
from mgedata.test.testcase import MGEBaseTestCase


class ExcelTest(MGEBaseTestCase):
    @property
    def base(self) -> Path:
        return Path(__file__).parent / 'excel'

    def test_generate_excel(self):
        data = generate_excel()
        with open('test.xlsx', 'wb') as f:
            f.write(data)

    def test_read(self):
        with open('test.xlsx', 'rb') as f:
            read_excel(f)

    def test_value_missing(self):
        with self.assert_mge_error(MGEError.INVALID_EXCEL_CELL_VALUE, '列"密码"的值不能为空（单元格B2）'):
            read_excel(self.base / 'value_missing.xlsx')

    def test_value_invalid(self):
        with self.assert_mge_error(MGEError.INVALID_EXCEL_CELL_VALUE, '用户名不能超过50个字符（单元格A2）'):
            read_excel(self.base / 'username_too_long.xlsx')

        err = '权限"abc"不可设置，可选的权限为：访客, 科研人员, 数据审核员, 系统管理员"（错误位于单元格C2）'
        with self.assert_mge_error(MGEError.INVALID_EXCEL_CELL_VALUE, err):
            read_excel(self.base / 'wrong_role.xlsx')

        # TODO

    def test_username_duplicate(self):
        with self.assert_mge_error(MGEError.INVALID_EXCEL_CELL_VALUE, '用户名"test"重复（单元格A2）'):
            read_excel(self.base / 'username_duplicate.xlsx')
