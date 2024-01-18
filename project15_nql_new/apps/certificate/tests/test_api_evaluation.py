import json
import os
from django.shortcuts import reverse

from apps.account.models.users import User, UserRolesForAcceptanceModel, UserRolesForAcceptance
from apps.certificate.models import Certificate, Acceptance, EvaluationPoint, AcceptanceState
from apps.storage.models import MaterialSubject, MaterialProject
from mgedata.errors.models import MGEError
from mgedata.test import debug_required
from mgedata.test.testcase import MGEBaseTestCase
from mgedata.test.utils.client import JSONClient
from django.conf import settings


class TestEvaluationAPI(MGEBaseTestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ps_id = '2016YFB0700500'
        self.project: MaterialProject = MaterialProject.objects.get(pk=self.ps_id)
        self.ps_leader = self.project.leader_fk if self.project.leader_fk is not None else User.objects.get(
            real_name=self.project.leader)
        self.is_project = True
        self.e1 = None
        self.e2 = None
        self.json_client = JSONClient()
        self.acceptance = None

    def make_request(self, ps_id, is_project, ps_leader):
        if is_project:
            for subject in MaterialSubject.objects.filter(project_id=ps_id):
                Certificate.create_cert_for_debug(subject.id, is_project=False)
                certificate = Certificate.objects.filter(ps_id=subject.id).first()
                Acceptance.objects.get_or_create(ps_id=subject.id, is_project=False, state=AcceptanceState.FINISHED,
                                                 leader=self.group_leader,
                                                 certificate=certificate)
        return Acceptance.make_request(ps_id, is_project, ps_leader)

    @debug_required
    def setUp(self):
        Certificate.create_cert_for_debug(self.ps_id, is_project=self.is_project)
        for user in User.objects.all():
            # 所有用户都有权限
            UserRolesForAcceptanceModel.objects.create(user=user, roles=[x.value for x in UserRolesForAcceptance])
        acceptance = self.make_request(self.ps_id, self.is_project, self.ps_leader)
        self.acceptance = acceptance
        e1 = User.objects.get(username='ghaiyan')
        e2 = User.objects.get(username='+')
        self.e1 = e1
        self.e2 = e2
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)

    @property
    def group_leader(self):
        return User.objects.get(real_name='谢建新')

    def test_get_evaluation_points(self):
        points = self.json_client.get_json(reverse('api_cert:evaluation_points'))
        self.assertEqual(points, {"code": 0, "data": [
            {"id": "a", "content": "与任务书中要求的汇交材料类别对比，该项目提交数据符合程度",
             "options": ["优", "良", "中", "合格", "不合格"]},
            {"id": "b", "content": "与任务书中要求数据量对比，该项目提交数据符合程度",
             "options": ["优", "良", "中", "合格", "不合格"]},
            {"id": "c", "content": "数据内容规范性（注：规范性指，提交的数据模板与内容是否符合该材料领域的常用数据表达方式）",
             "options": ["优", "良", "中", "合格", "不合格"]},
            {"id": "d", "content": "数据内容完整性（注:完整性指，所提交的数据是否缺少关键数据项）",
             "options": ["优", "良", "中", "合格", "不合格"]},
            {"id": "e", "content": "数据可再利用性（注:从元数据、数据模板、数据内容等方面综合评价数据是否方便再次利用）",
             "options": ["优", "良", "中", "合格", "不合格"]},
            {"id": "f", "content": "综合评价", "options": ["优", "良", "中", "合格", "不合格"]}]})

    def test_make_evaluation(self):
        self.json_client.login(self.e1)  # 以e1登陆
        view = reverse('api_cert:make_evaluation')
        with open(os.path.join(settings.BASE_DIR, "apps/certificate/tests/test.pdf"), 'rb') as fp:
            files = {'signature': fp}
            with self.assert_mge_error(MGEError.FIELD_MISSING, "acceptance_id"):
                p = {'comment': "ah", 'evaluation': json.dumps({'a': "a"})}
                self.json_client.post_files(view, extra_fields=p, files=files)
            with self.assert_mge_error(MGEError.FIELD_MISSING):
                p = {'acceptance_id': self.acceptance.id,
                     'comment': "haha"}
                self.json_client.post_files(view, extra_fields=p, files=files)
            with self.assert_mge_error(MGEError.FIELD_MISSING, "comment"):
                p = {'acceptance_id': self.acceptance.id,
                     'comment': "",
                     **{x: '优' for x in EvaluationPoint.ordered_list()}}
                self.json_client.post_files(view, extra_fields=p, files=files)
            import random
            test_eval = {p.name: random.choice(p.value[1]) for p in EvaluationPoint}
            p = {'acceptance_id': self.acceptance.id,
                 'comment': "这是一条文字评价", **test_eval}
            self.json_client.post_files(view, extra_fields=p, files=files)
            self.json_client.login(self.e2)
            self.json_client.post_files(view, extra_fields=p, files=files)
            self.json_client.login(self.acceptance.leader)
            self.json_client.post_files(view, extra_fields=p, files=files)

    def test_dispatches(self):
        view = reverse('api_cert:dispatches')
        self.json_client.login(self.e1)  # 以e1登陆
        dispatches = self.json_client.get_json(view)['data']['data']
        self.assertEqual(len(dispatches), 1)
        self.assertEqual(dispatches[0]['acceptance_id'], self.acceptance.id)
        import random
        test_eval = {p.name: random.choice(p.value[1]) for p in EvaluationPoint}
        with open(os.path.join(settings.BASE_DIR, "apps/certificate/tests/test.pdf"), 'rb') as fp:
            self.json_client.post_files(reverse('api_cert:make_evaluation'),
                                        extra_fields={'acceptance_id': self.acceptance.id,
                                                      'comment': "这是一条文字评价",
                                                      **test_eval}, files={'signature': fp})
        with self.assert_mge_error(MGEError.WRONG_FIELD_TYPE):
            self.json_client.get_json(view, {'finished': 'a'})
        dispatches = self.json_client.get_json(view, {'finished': 1})['data']['data']
        self.assertEqual(len(dispatches), 1)
        # 多个项目的分配
        leader = User.objects.get(real_name='朱俊')
        Certificate.create_cert_for_debug('2016YFB0700201', False)
        new_acc = Acceptance.make_request('2016YFB0700201', False, leader)
        new_acc.dispatch(self.e1)
        dispatches = self.json_client.get_json(view)['data']['data']
        self.assertEqual(len(dispatches), 2)
        dispatches = self.json_client.get_json(view, {'finished': 1})['data']['data']
        self.assertEqual(len(dispatches), 1)
        self.assertEqual(dispatches[0]['acceptance_id'], self.acceptance.id)
        # # TODO 分页

    def test_get_results(self):
        view = reverse('api_cert:dispatches')
        self.json_client.login(self.e1)  # 以e1登陆
        import random
        test_eval = {p.name: random.choice(p.value[1]) for p in EvaluationPoint}
        e_dict = {'acceptance_id': self.acceptance.id,
                  'comment': "这是一条文字评价",
                  **test_eval}
        view2 = reverse('api_cert:make_evaluation')
        with open(os.path.join(settings.BASE_DIR, "apps/certificate/tests/test.pdf"), 'rb') as fp:
            self.json_client.post_files(view2, extra_fields=e_dict, files={'signature': fp})
            self.json_client.login(self.e2)
            e_dict['comment'] = '另一条文字评价'
            self.json_client.post_files(view2, extra_fields=e_dict, files={'signature': fp})
            leader = User.objects.get(real_name='尹海清')
            with self.assert_mge_error(MGEError.PERMISSION_DENIED, "验收的权限"):
                self.json_client.login(leader)
                view = reverse('api_cert:evaluation_results', kwargs={'acceptance_id': self.acceptance.id})
                _ = self.json_client.get_json(view)['data']

            self.json_client.login(self.ps_leader)
            results = self.json_client.get_json(view)['data']
            self.assertEqual(len(results), 2)
            self.assertTrue('expert_name' not in results[0] and 'expert_name' not in results[1])
            self.json_client.login(self.group_leader)
            results = self.json_client.get_json(view)['data']
            self.assertEqual(len(results), 2)
            self.assertTrue('expert_name' in results[0] and 'expert_name' in results[1])
            self.assertEqual(results[0]['expert_name'], self.e1.real_name)
            self.assertEqual(results[1]['expert_name'], self.e2.real_name)
