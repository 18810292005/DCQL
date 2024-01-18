from django.db.models import Q

from apps.account.models.users import User, UserRolesForAcceptanceModel, UserRolesForAcceptance
from apps.certificate.models import Certificate, Acceptance, AcceptanceState, ExpertEvaluation, EvaluationPoint
from apps.storage.models import MaterialSubject
from mgedata.errors.models import MGEError
from mgedata.test.testcase import MGEBaseTestCase


class TestAcceptance(MGEBaseTestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._ps_id = '2016YFB0700500'
        self._is_project = True

    def make_request(self, ps_id, is_project, ps_leader):
        if is_project:
            for subject in MaterialSubject.objects.filter(project_id=ps_id):
                Certificate.create_cert_for_debug(subject.id, is_project=False)
                certificate = Certificate.objects.filter(ps_id=subject.id).first()
                Acceptance.objects.get_or_create(ps_id=subject.id, is_project=False, state=AcceptanceState.FINISHED,
                                                 leader=self.group_leader,
                                                 certificate=certificate)
        return Acceptance.make_request(ps_id, is_project, ps_leader)

    def setUp(self):
        Certificate.create_cert_for_debug(self._ps_id, is_project=self._is_project)
        for user in User.objects.all():
            # 所有用户都有权限
            UserRolesForAcceptanceModel.objects.create(user=user, roles=[x.value for x in UserRolesForAcceptance])

    @property
    def group_leader(self):
        return User.objects.get(real_name='谢建新')

    @property
    def ps_leader(self):
        return User.objects.get(real_name='宿彦京')

    def test_request(self):
        ps_id = self._ps_id
        is_project = self._is_project
        normal_user = User.objects.filter(~Q(real_name='宿彦京')).first()
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, '汇交证明'):  # 未生成汇交证明
            Certificate.objects.filter(ps_id=ps_id).delete()
            self.make_request(ps_id, is_project, self.ps_leader)
        Certificate.create_cert_for_debug(ps_id, is_project=is_project)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "负责人"):
            self.make_request(ps_id, is_project, normal_user)
        acceptance = self.make_request(ps_id, is_project, self.ps_leader)
        for state in AcceptanceState:
            acceptance.state = state
            acceptance.save()
            if state != AcceptanceState.FAILED:
                with self.assert_mge_error(MGEError.PERMISSION_DENIED, "正在验收"):
                    self.make_request(ps_id, is_project, self.ps_leader)
            else:
                acceptance = self.make_request(ps_id, is_project, self.ps_leader)  # 失败状态才可以重复提交申请

    def test_dispatch(self):
        acceptance = self.make_request(self._ps_id, self._is_project, self.ps_leader)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED("没有")):
            user = User.objects.create_user(username='nonono', email='asdff@sad.com', password='as2rfnvc',
                                            real_name='s')
            acceptance.dispatch(user=user)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED("负责人")):
            acceptance.dispatch(user=self.ps_leader)
        # 两个专家
        e1 = User.objects.get(username='ghaiyan')
        e2 = User.objects.get(username='+')
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)
        # with self.assert_mge_error(MGEError.PERMISSION_DENIED("已经")):
        #     acceptance.dispatch(user=User.objects.get(username='ghaiyan'))
        acceptance.refresh_from_db()
        self.assertEqual(acceptance.state, AcceptanceState.EXPERT_EVALUATING)
        # 分配没有权限的用户
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "没有"):
            acceptance.recall_dispatch(self.ps_leader)
        # 撤回专家
        acceptance.recall_dispatch(e1)
        acceptance.recall_dispatch(e2)
        acceptance.refresh_from_db()
        self.assertEqual(acceptance.state, AcceptanceState.DISPATCHING)

    def test_evaluation(self):
        acceptance = self.make_request(self._ps_id, self._is_project, self.ps_leader)
        e1 = User.objects.get(username='ghaiyan')
        e2 = User.objects.get(username='+')
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "没有被分配"):
            acceptance.evaluate(self.ps_leader, {}, "")
        with self.assert_mge_error(MGEError.FIELD_MISSING, "缺少"):
            acceptance.evaluate(e1, {}, "")
        evaluation = dict.fromkeys(EvaluationPoint.ordered_list(), "优")
        with self.assert_mge_error(MGEError.FIELD_MISSING, "为空"):
            evaluation['a'] = None
            acceptance.evaluate(e1, evaluation, "a")
        with self.assert_mge_error(MGEError.WRONG_FIELD_TYPE):
            evaluation['a'] = "hahah"
            acceptance.evaluate(e1, evaluation, "a")
        with self.assert_mge_error(MGEError.FIELD_MISSING, "文字评价"):
            evaluation['a'] = '优'
            acceptance.evaluate(e1, evaluation, "")
        e = ExpertEvaluation.objects.get(expert=e1, acceptance=acceptance)
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "撤回"):
            # 模拟调用acceptance.evaluate的过程中，拿到ExpertEvaluation之后撤回了分配
            acceptance.recall_dispatch(e1)
            e.make_expert_evaluation(evaluation, "ha")
        acceptance.dispatch(e1)
        acceptance.evaluate(e1, evaluation, "这里是文字评价嘻嘻")
        # 专家未评价完成时组长评价
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "请等待"):
            acceptance.evaluate(self.group_leader, evaluation, "ha")
        acceptance.evaluate(e2, evaluation, "另一个文字评价嘻嘻")
        acceptance.refresh_from_db()
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "已经"):
            acceptance.evaluate(e1, evaluation, "ha")

        # 撤回已评价的专家
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "已评价"):
            acceptance.recall_dispatch(e1)
        self.assertEqual(acceptance.state, AcceptanceState.LEADER_EVALUATING)

    def test_leader_evaluation(self):
        acceptance = self.make_request(self._ps_id, self._is_project, self.ps_leader)
        e1 = User.objects.get(username='ghaiyan')
        e2 = User.objects.get(username='+')
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)
        evaluation = dict.fromkeys(EvaluationPoint.ordered_list(), "优")
        acceptance.evaluate(e1, evaluation, "hahaha")
        acceptance.evaluate(e2, evaluation, "hahaha")
        with self.assert_mge_error(MGEError.PERMISSION_DENIED, "没有"):
            acceptance.evaluate(self.ps_leader, evaluation, "ha")
        evaluation['f'] = '不合格'
        acceptance.evaluate(self.group_leader, evaluation, "ha")
        acceptance.refresh_from_db()
        self.assertEqual(acceptance.state, AcceptanceState.FAILED)
        acceptance = self.make_request(self._ps_id, self._is_project, self.ps_leader)
        acceptance.dispatch(e1)
        acceptance.dispatch(e2)
        acceptance.evaluate(e1, evaluation, "hahaha")
        acceptance.evaluate(e2, evaluation, "hahaha")
        evaluation['f'] = '优'
        acceptance.evaluate(self.group_leader, evaluation, "haha")
        acceptance.refresh_from_db()
        self.assertEqual(acceptance.state, AcceptanceState.SIGNATURE_PENDING)
