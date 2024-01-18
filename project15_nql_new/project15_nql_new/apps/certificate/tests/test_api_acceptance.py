from django.shortcuts import reverse
from apps.account.models import User
from apps.account.models.users import UserRolesForAcceptance
from apps.account.models.users import UserRolesForAcceptanceModel
from apps.storage.models.material import MaterialProject, MaterialSubject
from apps.certificate.models import Acceptance, AcceptanceState
from apps.certificate.models import Certificate
from apps.certificate.models import ExpertEvaluation
from mgedata.errors.models import MGEError
from mgedata.test import debug_required
from mgedata.test.testcase import MGEBaseTestCase
from mgedata.test.utils.client import JSONClient


class TestAcceptanceAPI(MGEBaseTestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ps_id = '2016YFB0700500'
        self.is_project = True
        self.e0 = None
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
            UserRolesForAcceptanceModel.objects.create(user=user,
                                                       roles=[UserRolesForAcceptance.Expert,
                                                              UserRolesForAcceptance.AcceptanceExpert])
        UserRolesForAcceptanceModel.objects.filter(user=self.group_leader).update(
            roles=[UserRolesForAcceptance.GroupLeader])
        UserRolesForAcceptanceModel.objects.filter(user=self.ps_leader).update(
            roles=[UserRolesForAcceptance.ProjectLeader,
                   UserRolesForAcceptance.SubjectLeader])

        acceptance = self.make_request(self.ps_id, self.is_project, self.ps_leader)
        self.acceptance = acceptance
        e0 = User.objects.get(real_name='谢建新')
        e1 = User.objects.get(username='ghaiyan')
        e2 = User.objects.get(username='+')
        self.e0 = e0
        self.e1 = e1
        self.e2 = e2
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)

    @property
    def group_leader(self):
        return User.objects.get(real_name='谢建新')

    @property
    def ps_leader(self):
        return User.objects.get(real_name=MaterialProject.objects.get(id=self.ps_id).leader)

    def test_allocate_acceptance_experts(self):
        self.json_client.login(self.e0)  # 以e0登陆
        experts = User.objects.exclude(real_name__in=['宿彦京', '龚海燕']).exclude(username='+')[0:3]
        expert_name_list = [expert.username for expert in experts]
        view = reverse('api_cert:dispatches')

        with self.assert_mge_error(MGEError.FIELD_MISSING, "acceptance_id"):  # acceptance_id字段缺失
            self.json_client.post_json(view, {'experts': expert_name_list})

        with self.assert_mge_error(MGEError.FIELD_MISSING, "experts"):  # experts字段缺失
            self.json_client.post_json(view, {'acceptance_id': self.acceptance.id})

        experts = User.objects.exclude(real_name=['龚海燕', '+'])
        expert_name_list = [expert.username for expert in experts]
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "没有验收专家权限"):  # 没有验收专家权限
            self.json_client.post_json(view, {'acceptance_id': self.acceptance.id,
                                              'experts': expert_name_list})

        experts = User.objects.exclude(real_name=['宿彦京'])
        expert_name_list = [expert.username for expert in experts]
        with self.assert_mge_error(MGEError.PERMISSION_DENIED):  # 项目或课题负责人不能参与验收
            self.json_client.post_json(view, {'acceptance_id': self.acceptance.id,
                                              'experts': expert_name_list})

        experts = User.objects.exclude(real_name__in=['宿彦京', '龚海燕']).exclude(username='+')[0:3]
        expert_name_list = [expert.username for expert in experts]
        self.json_client.post_json(view, {'acceptance_id': self.acceptance.id,  # 正常请求
                                          'experts': expert_name_list})
        acceptance = Acceptance.objects.get(id=self.acceptance.id)

        self.assertEqual(acceptance.state, AcceptanceState.EXPERT_EVALUATING)
        self.assertEqual(ExpertEvaluation.objects.filter(acceptance=acceptance).count(), 3 + 2)  # setUp中有['龚海燕','+']

    def test_update_acceptance_experts(self):
        self.json_client.login(self.e0)  # 以e0登陆
        view = reverse('api_cert:one_dispatch', kwargs={'acceptance_id': 100})
        experts = User.objects.exclude(real_name__in=['龚海燕']).exclude(username='+')[0:3]
        expert_name_list = [expert.username for expert in experts]

        with self.assert_mge_error(MGEError.NOT_FOUND):  # 待分配验收申请不存在
            self.json_client.patch_json(view, {'experts': expert_name_list})

        view = reverse('api_cert:one_dispatch', kwargs={'acceptance_id': self.acceptance.id})
        with self.assert_mge_error(MGEError.FIELD_MISSING, "experts"):  # experts字段缺失
            self.json_client.patch_json(view, {})
        self.json_client.patch_json(view, {'experts': expert_name_list})

    def test_acceptance_allocated_experts(self):
        self.json_client.login(self.e0)  # 以e0登陆
        view = reverse('api_cert:one_dispatch', kwargs={'acceptance_id': 100})
        with self.assert_mge_error(MGEError.NOT_FOUND):  # 待分配验收申请不存在
            self.json_client.get_json(view)

        view = reverse('api_cert:one_dispatch', kwargs={'acceptance_id': self.acceptance.id})
        response = self.json_client.get_json(view)

        self.assertEqual(response['code'], 0)
        self.assertEqual(len(response['data']), 2)
        self.assertEqual(response['data'],
                         [{'expert_username': '+', 'expert_name': '张'},
                          {'expert_username': 'ghaiyan', 'expert_name': 'Haiyan Gong'}])

    def test_make_acceptance_request(self):
        ExpertEvaluation.objects.all().delete()
        Acceptance.objects.all().delete()
        self.json_client.login(self.ps_leader)
        view = reverse('api_cert:acceptances')
        with self.assert_mge_error(MGEError.FIELD_MISSING, 'is_project'):
            self.json_client.post_json(view, {'ps_id': self.ps_id})
        with self.assert_mge_error(MGEError.FIELD_MISSING, 'ps_id'):
            self.json_client.post_json(view, {'is_project': True})
        with self.assert_mge_error(MGEError.WRONG_FIELD_TYPE, 'str'):
            self.json_client.post_json(view, {'ps_id': 1, 'is_project': True})

        for subject in MaterialSubject.objects.filter(project_id=self.ps_id):
            certificate = Certificate.objects.filter(ps_id=self.ps_id).first()
            Acceptance.objects.get_or_create(ps_id=subject.id, is_project=False, state=AcceptanceState.FINISHED,
                                             leader_evaluation={}, leader=self.group_leader,
                                             certificate=certificate)
        self.json_client.post_json(view,
                                   {'ps_id': self.ps_id, 'is_project': True, 'group_leader_username': 'xiejianxin'})
        acceptance = Acceptance.objects.get(ps_id=self.ps_id)
        self.assertEqual(acceptance.ps_id, self.ps_id)

    def test_retract_acceptance(self):
        ExpertEvaluation.objects.all().delete()
        Acceptance.objects.all().delete()
        acceptance = self.make_request(self.ps_id, self.is_project, self.ps_leader)
        view = reverse('api_cert:retract_acceptance', kwargs={'acceptance_id': acceptance.id})
        self.json_client.login(self.e1)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED):
            self.json_client.delete_json(view)
        self.json_client.login(self.ps_leader)
        self.json_client.delete_json(view)
        self.assertEqual(Acceptance.objects.count(), 5)

    def test_get_expert_list(self):
        UserRolesForAcceptanceModel.objects.all().delete()
        UserRolesForAcceptanceModel.objects.create(user=self.group_leader, roles=[UserRolesForAcceptance.GroupLeader])
        UserRolesForAcceptanceModel.objects.create(user=self.e1, roles=[UserRolesForAcceptance.Expert,
                                                                        UserRolesForAcceptance.AcceptanceExpert,
                                                                        UserRolesForAcceptance.ProjectLeader])
        self.json_client.login(self.group_leader)
        view = reverse('api_cert:get_all_acceptance_experts')
        experts = self.json_client.get_json(view)['data']
        self.assertEqual(len(experts), 1)
        self.assertEqual(experts[0]['expert_name'], self.e1.real_name)

    # def test_signature(self):
    #     from django.conf import settings
    #     import os
    #     ExpertEvaluation.objects.all().delete()
    #     self.json_client.login(self.group_leader)
    #     view = reverse('api_cert:acceptance_signatures', kwargs={'acceptance_id': self.acceptance.id})
    #     with self.assert_mge_error(MGEError.NOT_FOUND, "未上传"):
    #         self.json_client.get_json(view)
    #     with self.assert_mge_error(MGEError.FIELD_MISSING, "signature"):
    #         self.json_client.post_files(view, {})
    #     with open(os.path.join(settings.BASE_DIR, 'manage.py'), 'rb') as fp:
    #         with self.assert_mge_error(MGEError.BAD_DATA, "损坏"):
    #             self.json_client.post_files(view, {'signature': fp})
    #     with open(os.path.join(settings.BASE_DIR, 'apps', 'certificate', 'tests', 'test.pdf'), 'rb') as file:
    #         with self.assert_mge_error(MGEError.PERMISSION_DENIED, "验收未结束"):  # 未完成验收
    #             self.json_client.post_files(view, {'signature': file})
    #         file.seek(0)
    #         self.acceptance.state = AcceptanceState.SIGNATURE_PENDING
    #         self.acceptance.save()
    #         img_bytes = file.read()
    #         file.seek(0)
    #         self.json_client.post_files(view, {'signature': file})
    #         file.seek(0)
    #         with self.assert_mge_error(MGEError.PERMISSION_DENIED, "已成功上传"):
    #             self.json_client.post_files(view, {'signature': file})
    #     resp = self.json_client.get_json(view)
    #     self.assertEqual(img_bytes, resp)
    #     roles = UserRolesForAcceptanceModel.objects.get(user=self.e2)
    #     roles.roles.append(UserRolesForAcceptance.GroupLeader)
    #     roles.save()
    #     self.json_client.login(self.e2)
    #     with self.assert_mge_error(MGEError.PERMISSION_DENIED, "仅限"):
    #         self.json_client.get_json(view)
