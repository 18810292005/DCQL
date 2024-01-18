from mgedata.test import MGETestCase, debug_required
from django.urls import reverse


class TestMaterialApi(MGETestCase):

    @debug_required
    def setUp(self) -> None:
        self.urls = {
            'specific_material_project': reverse('api_v1_1_storage:specific_material_project')
        }
        return

    # # TODO 错误原因,缺少project_id,确少url映射
    # def test_specific_material_project(self):
    #     result = HttpTools.post(client=self.client, data={}, url=self.urls['specific_material_project'])
    #     self.assertEqual(result['a'], 'asdas')
    #     return
