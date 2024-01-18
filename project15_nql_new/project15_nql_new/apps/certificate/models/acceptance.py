import datetime
from enum import Enum
from enum import IntEnum
from typing import Dict, Union, List, BinaryIO, AnyStr

from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.core.exceptions import ValidationError
from django.db import models
from django.db import transaction
from django.db.models import Q
from django.utils.timezone import get_current_timezone
from django.utils.translation import ugettext_noop

from apps.account.models.users import User, UserRolesForAcceptance
from apps.account.notify import NotificationType, notify
from apps.certificate.models.certificate import Certificate, TemplateStatistic
from apps.storage.models import Template
from apps.storage.models.material import MaterialProject, MaterialSubject
from mgedata.errors.models import MGEError, MGEException

EXPERT_DEADLINE_DAYS = 30


class AcceptanceState(IntEnum):
    """
    验收申请的状态
    """
    DISPATCHING = 0  # 待分配验收专家
    EXPERT_EVALUATING = 1  # 专家评价中
    LEADER_EVALUATING = 2  # 评价组长评价中
    SIGNATURE_PENDING = 3  # 通过验收，等待上传签名的报告
    FAILED = 4  # 不通过
    FINISHED = 5  # 完成验收

    @property
    def description(self):
        return ("待分配验收专家", "专家评价中", "组长评价中", "通过（待上传扫描件）", "不通过", "通过")[self.value]

    @staticmethod
    def choices():
        return ((x.value, x.description) for x in AcceptanceState)


class Acceptance(models.Model):
    """
    验收申请，未分配验收专家时可以撤回（直接从数据库中删除）
    一旦开始分配专家，则不允许删除，无论其最后是否通过
    再次申请时插入一条新记录，保留之前的申请
    """

    user = models.ForeignKey(User, null=True, on_delete=models.PROTECT, related_name='ps_leader',
                             verbose_name="项目或课题负责人")
    leader = models.ForeignKey(User, on_delete=models.PROTECT, related_name='leader', verbose_name="评价组长")
    ps_id = models.CharField(max_length=128, verbose_name="项目或课题编号")  # 项目或课题编号
    is_project = models.BooleanField(verbose_name="是否为项目")  # True为项目，False为课题
    c_time = models.DateTimeField(auto_now_add=True, verbose_name="申请时间")  # 申请发布时间
    u_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")  # 状态更新时间，无论是否通过
    state = models.IntegerField(default=AcceptanceState.DISPATCHING, verbose_name="申请状态",
                                choices=AcceptanceState.choices(),
                                help_text='<br/>'.join(f"{x.description}: {x.value}" for x in AcceptanceState))  # 申请状态
    # evaluation = JSONField(default=dict, blank=True, verbose_name="组长评价")
    # comment = models.TextField(null=True, blank=True, verbose_name="组长文字评价")
    signature = models.FileField(upload_to='_fs/signature/', null=True, blank=True, verbose_name="组长签名章")
    certificate = models.ForeignKey(Certificate, on_delete=models.PROTECT, verbose_name="汇交证明")

    @property
    def signature_url(self, absolute=False):
        if not self.signature or not self.signature.name:
            return ""
        if absolute:
            return settings.SITE_ADDR + settings.MEDIA_URL + self.signature.name
        return settings.MEDIA_URL + self.signature.name

    def to_dict(self):
        return {
            'id': self.pk,
            'ps_id': self.ps_id,
            'is_project': self.is_project,
            'state': self.state,
        }

    def select_self_for_update(self) -> 'Acceptance':
        """
        行锁
        """
        return Acceptance.objects.select_for_update().get(id=self.id)

    def get_project_or_subject(self) -> Union[MaterialProject, MaterialSubject]:
        if self.is_project:
            table = MaterialProject
        else:
            table = MaterialSubject
        try:
            return table.objects.get(id=self.ps_id)
        except table.DoesNotExist:
            name = "项目" if self.is_project else "课题"
            raise MGEError.NOT_FOUND(f"{name}{self.ps_id}不存在")

    def delete(self, using=None, keep_parents=False):
        """
        撤回申请时调用，会检测是否可以撤回
        """
        with transaction.atomic():
            this = self.select_self_for_update()
            if this.state == AcceptanceState.DISPATCHING:
                ExpertEvaluation.objects.filter(acceptance=this).delete()
                super().delete(using, keep_parents)
            else:
                raise MGEError.PERMISSION_DENIED("该申请已分配验收专家，无法撤回")

    def bulk_dispatch(self, users: List[User]):
        with transaction.atomic():
            for user in users:
                self.dispatch(user)

    def bulk_redispatch(self, users: List[User]):
        with transaction.atomic():
            for dispatch in ExpertEvaluation.objects.filter(acceptance=self, is_leader=False):
                if dispatch.finished:
                    continue
                dispatch.delete()  # 调用delete撤回，不能直接用queryset的delete方法
            self.bulk_dispatch(users)

    def dispatch(self, user: User):
        """
        分配给某个专家进行评价
        """
        if not user.has_role_for_acceptance(UserRolesForAcceptance.AcceptanceExpert):
            raise MGEError.PERMISSION_DENIED(f"{user.real_name}没有验收专家权限，请重新选择")
        # 如果该专家已经被分配到这个申请则跳过
        if ExpertEvaluation.objects.filter(acceptance=self, expert=user).count() > 0:
            return
        if self.get_project_or_subject().leader == user.real_name:
            # 检测用户是否是项目或课题负责人
            # TODO 项目验收的话还要检查是否是课题负责人
            raise MGEError.PERMISSION_DENIED(f"{user.real_name}是项目或课题负责人，不能参与验收")
        with transaction.atomic():
            this = self.select_self_for_update()
            if this.state in (AcceptanceState.SIGNATURE_PENDING, AcceptanceState.FAILED, AcceptanceState.FINISHED):
                raise MGEError.PERMISSION_DENIED("验收已结束，无法再分配专家")
            this.state = AcceptanceState.EXPERT_EVALUATING  # 申请状态变为专家评价中
            deadline = datetime.datetime.now(tz=get_current_timezone()) + datetime.timedelta(days=EXPERT_DEADLINE_DAYS)
            ExpertEvaluation(acceptance=self, expert=user, deadline=deadline).save()
            this.save()
            if self.is_project:
                object1 = ugettext_noop('project')
            else:
                object1 = ugettext_noop('subject')
            object2 = self.get_project_or_subject().name
            object3 = deadline.strftime('%Y-%m-%d')
            notify(user, NotificationType.EVALUATION_PENDING, object1, object2, object3)

    def recall_dispatch(self, user: User):
        """
        撤回分配
        """
        try:
            ExpertEvaluation.objects.get(acceptance=self, expert=user).delete()
        except ExpertEvaluation.DoesNotExist:
            raise MGEError.PERMISSION_DENIED(f"{user.real_name}没有被分配参与此次验收")
        else:
            with transaction.atomic():
                this = self.select_self_for_update()
                # 如果专家都被撤回，状态回到待分配
                if ExpertEvaluation.objects.filter(acceptance=self).count() == 0:
                    this.state = AcceptanceState.DISPATCHING
                    this.save()

    def _leader_evaluate(self, evaluation: dict, comment: str, signature: BinaryIO):
        """
        组长评价
        """
        EvaluationPoint.check_evaluation(evaluation, comment)
        failed = EvaluationPoint.has_failed(evaluation)
        with transaction.atomic():
            # 填写评价和更新验收申请状态要保证在一个事务内
            this = self.select_self_for_update()  # 行锁
            if this.state != AcceptanceState.LEADER_EVALUATING:
                # 如果专家已经评价完成，此时组长又分配了专家，可能会出现这种情况
                raise MGEError.PERMISSION_DENIED("请等待验收专家完成评价")
            if failed:
                this.state = AcceptanceState.FAILED
            else:
                this.state = AcceptanceState.FINISHED
            ee, created = ExpertEvaluation.objects.get_or_create(acceptance=self, expert=self.leader,
                                                                 is_leader=True)
            ee.comment = comment
            ee.evaluation = evaluation
            ee.finished = True
            ee.signature.save(f"{this.id}-{this.leader.real_name}.jpg", signature)
            this.u_time = datetime.datetime.now(tz=get_current_timezone())
            ee.u_time = this.u_time
            ee.save()
            this.save()
            if self.is_project:
                object1 = ugettext_noop('project')
            else:
                object1 = ugettext_noop('subject')
            object2 = self.get_project_or_subject().name
            if failed:
                n = NotificationType.EVALUATION_FAILED
            else:
                n = NotificationType.EVALUATION_ACCEPTED
            notify(self.user, n, object1, object2)

    def evaluate(self, user: User, evaluation: dict, comment: str, signature: BinaryIO):
        """
        评价
        """
        if self.leader == user:
            self._leader_evaluate(evaluation, comment, signature)
        else:
            try:
                dispatch = ExpertEvaluation.objects.get(acceptance=self, expert=user)
                dispatch.make_expert_evaluation(evaluation, comment, signature)
            except ExpertEvaluation.DoesNotExist:
                raise MGEError.PERMISSION_DENIED(f"{user.real_name}没有被分配参与此次验收")

    @staticmethod
    def make_request(ps_id: str, is_project: bool, user: User, group_leader: User = None) -> 'Acceptance':
        """
        申请验收，只有该项目或者课题之前所有申请都不通过，或者从未申请过验收时才允许申请
        """
        name = "项目" if is_project else "课题"
        if is_project:
            table = MaterialProject
        else:
            table = MaterialSubject
        try:
            ps = table.objects.get(id=ps_id)
        except table.DoesNotExist:
            raise MGEError.NOT_FOUND(f"{name}{ps_id}不存在")

        if not ps.leader_fk:
            is_leader = ps.leader == user.real_name
        else:
            is_leader = ps.leader_fk == user
        if not is_leader:
            raise MGEError.PERMISSION_DENIED(f"您不是{name}{ps_id}的负责人")

        with transaction.atomic():
            q = ~Q(state=AcceptanceState.FAILED)
            previous = Acceptance.objects.filter(Q(ps_id=ps_id) & q).count()
            if previous != 0:
                raise MGEError.PERMISSION_DENIED("正在验收或验收已通过，无法再次申请")
            if not group_leader:
                try:
                    group_leader = User.objects.get(real_name="谢建新")
                except User.DoesNotExist:
                    raise MGEError.NOT_FOUND("没有评价组长相关信息，请联系管理员！")
            if not group_leader.has_role_for_acceptance(UserRolesForAcceptance.GroupLeader):
                raise MGEError.PERMISSION_DENIED(f"用户{group_leader.real_name}不是评价组长")
            acceptance = Acceptance(ps_id=ps_id, is_project=is_project, user=user, leader=group_leader)
            cert = Certificate.get_newest_cert(ps_id)
            if cert is None:
                raise MGEError.PERMISSION_DENIED("项目或课题未生成汇交证明，无法验收")
            acceptance.certificate = cert
            acceptance.save()
            ExpertEvaluation(acceptance=acceptance, expert=group_leader, is_leader=True).save()
        notify(group_leader, NotificationType.NEW_ACCEPTANCE_REQUEST)
        return acceptance

    def get_evaluations(self, requester: User) -> List['ExpertEvaluation']:
        if requester != self.leader and requester != self.user:
            # 专家查看自己的评价
            try:
                return [ExpertEvaluation.objects.get(acceptance=self, expert=requester)]
            except ExpertEvaluation.DoesNotExist:
                raise MGEError.PERMISSION_DENIED("分配已被撤回或没有参与此验收的权限")

    @staticmethod
    def get_or_error(acceptance_id: int, **kwargs):
        try:
            return Acceptance.objects.get(id=acceptance_id, **kwargs)
        except Acceptance.DoesNotExist:
            raise MGEError.NOT_FOUND("验收申请不存在")

    def full_clean(self, exclude=None, validate_unique=True):
        try:
            self.get_project_or_subject()
        except MGEException:
            name = "项目" if self.is_project else "课题"
            raise ValidationError(f"{name}{self.ps_id}不存在")

    def get_all_expert_username(self) -> List[AnyStr]:
        experts_username = list(self.expertevaluation_set.values_list('expert__username', flat=True))
        if self.leader.username not in experts_username:
            experts_username.append(self.leader.username)
        return experts_username

    def get_templates_stat(self):
        if self.certificate is None:
            return
        ret = {}
        template_stats = TemplateStatistic.objects.filter(certificate=self.certificate)
        template_ids = list(template_stats.values_list('template', flat=True))
        templates_info = []
        for tid in template_ids:
            try:
                template = Template.objects.get(id=tid)
                template = {'id': template.id,
                            'title': template.title,
                            'category_id': template.category_id,
                            'category_full_path': template.category.full_path}
                templates_info.append(template)
            except Template.DoesNotExist:
                continue
        ret['ps_id'] = self.ps_id
        ret['templates'] = templates_info
        return ret

    @property
    def acceptance_template_list(self) -> list:
        ts = TemplateStatistic.objects.filter(certificate=self.certificate)
        result = list(ts.values_list('template_id', flat=True))
        return result


class EvaluationPoint(Enum):
    """
    评价条目
    """

    a = "与任务书中要求的汇交材料类别对比，该项目提交数据符合程度", ('优', '良', '中', '合格', '不合格')
    b = "与任务书中要求数据量对比，该项目提交数据符合程度", ('优', '良', '中', '合格', '不合格')
    c = "数据内容规范性（注：规范性指，提交的数据模板与内容是否符合该材料领域的常用数据表达方式）", (
    '优', '良', '中', '合格', '不合格')
    d = "数据内容完整性（注：完整性指，所提交的数据是否缺少关键数据项）", ('优', '良', '中', '合格', '不合格')
    e = "数据可再利用性（注：从元数据、数据模板、数据内容等方面综合评价数据是否方便再次利用）", (
    '优', '良', '中', '合格', '不合格')
    f = "综合评价", ('优', '良', '中', '合格', '不合格')

    @staticmethod
    def ordered_list():
        return sorted([x.name for x in EvaluationPoint])

    @staticmethod
    def has_failed(evaluation: Dict[str, str]):
        return evaluation['f'] == '不合格'

    @staticmethod
    def check_evaluation(evaluation: Dict[str, str], comment: str):
        missing = set(EvaluationPoint.ordered_list()) - set(evaluation.keys())  # 未填的评价条目
        if missing:
            raise MGEError.FIELD_MISSING(f'缺少评价条目"{", ".join(missing)}"')
        for key, value in evaluation.items():
            if not value:
                raise MGEError.FIELD_MISSING(f'评价条目"{key}"的值为空')
            elif value not in EvaluationPoint[key].value[1]:
                raise MGEError.WRONG_FIELD_TYPE(f'评价条目"{key}"的值'
                                                f'只能为"{"，".join(EvaluationPoint[key].value[1])}"'
                                                f'之一')
        if not comment:
            raise MGEError.FIELD_MISSING("必须填写文字评价")


class ExpertEvaluation(models.Model):
    class Meta:
        ordering = ('finished', '-deadline')

    acceptance = models.ForeignKey(Acceptance, on_delete=models.PROTECT, verbose_name="验收申请")
    expert = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name="验收专家")
    deadline = models.DateTimeField(verbose_name="截止时间", null=True, blank=True)
    is_leader = models.BooleanField(default=False, verbose_name="是否为组长评价")
    u_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    finished = models.BooleanField(default=False, verbose_name="是否完成评价")
    evaluation = JSONField(default=dict, blank=True, verbose_name="专家评价")
    comment = models.TextField(null=True, blank=True, verbose_name="专家文字评价")
    signature = models.ImageField(null=True, blank=True, upload_to='_fs/signature', verbose_name="专家签名章")

    def __init__(self, *args, **kwargs):
        self.hide_expert_name = False
        super().__init__(*args, **kwargs)

    @property
    def signature_url(self, absolute=False):
        if not self.signature or not self.signature.name:
            return ""
        if absolute:
            return settings.SITE_ADDR + settings.MEDIA_URL + self.signature.name
        return settings.MEDIA_URL + self.signature.name

    @property
    def expert_name(self):
        if self.hide_expert_name:
            return None
        return self.expert.real_name

    def delete(self, using=None, keep_parents=False):
        """
        删除方法，撤回时直接调用删除方法，会检测是否可以撤回
        """
        with transaction.atomic():
            this = ExpertEvaluation.objects.select_for_update().get(id=self.id)
            if not this.finished:  # 未完成评价的专家可以被撤回
                super().delete(using, keep_parents)
            else:
                raise MGEError.PERMISSION_DENIED("专家已评价，无法撤回")

    def make_expert_evaluation(self, evaluation: Dict[str, str], comment: str, signature: BinaryIO):
        """
        填写评价
        """
        # 已经填过不能再填
        if self.finished is True:
            raise MGEError.PERMISSION_DENIED('评价已经提交，无法重复提交')
        EvaluationPoint.check_evaluation(evaluation, comment)
        with transaction.atomic():
            # 填写评价和更新验收申请状态要保证在一个事务内
            acceptance = self.acceptance.select_self_for_update()  # 行锁
            if acceptance.state != AcceptanceState.EXPERT_EVALUATING:
                # 如果执行到这个函数但是此时分配被撤回就会执行到这里
                raise MGEError.PERMISSION_DENIED("该评价任务已被评价组长撤回")
            try:
                this: ExpertEvaluation = ExpertEvaluation.objects.select_for_update().get(id=self.id)
            except ExpertEvaluation.DoesNotExist:
                # doubly sure
                raise MGEError.PERMISSION_DENIED("该评价任务已被评价组长撤回")
            else:
                this.finished = True
                this.comment = comment
                this.evaluation = evaluation
                this.signature.save(f"{this.id}-{this.expert.real_name}.jpg", signature)
                this.save()
                if ExpertEvaluation.objects.filter(acceptance=acceptance, finished=False, is_leader=False).count() == 0:
                    # 如果分配的专家都评价完成，状态转为组长评价
                    acceptance.state = AcceptanceState.LEADER_EVALUATING
                    acceptance.save()
                    if self.acceptance.is_project:
                        object1 = ugettext_noop('project')
                    else:
                        object1 = ugettext_noop('subject')
                    object2 = self.acceptance.get_project_or_subject().name
                    notify(self.acceptance.leader, NotificationType.EVALUATION_LEADER_PENDING, object1, object2)
