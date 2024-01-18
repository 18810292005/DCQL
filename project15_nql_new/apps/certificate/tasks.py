import base64
import random
from datetime import datetime

from django.conf import settings
from django.db import transaction, models
from django.utils.timezone import get_current_timezone
from django.utils.translation import ugettext as _

from apps.certificate.collector import StatisticCollector
from apps.certificate.models.acceptance import Acceptance, AcceptanceState
from apps.certificate.models.certificate import Certificate, TemplateStatistic
from apps.storage.models import Template
from apps.storage.models.material import MaterialProject, MaterialSubject
from apps.task.task_registry import MGEBaseTask
from mgedata.errors.models import MGEError


class CertificateIssuingTask(MGEBaseTask):

    @property
    def task_description(self):
        return _("Certificate Issuing")

    def run(self, ps_id: str, is_project: bool):
        super().run()
        q = models.Q(
            state__in=[AcceptanceState.FAILED.value, AcceptanceState.FINISHED.value, AcceptanceState.SIGNATURE_PENDING])
        q = models.Q(ps_id=ps_id, is_project=is_project) & ~q
        if Acceptance.objects.filter(q).count() > 0:
            name = "项目" if is_project else "课题"
            raise MGEError.PERMISSION_DENIED(
                f"此{name}正在进行验收，无法开具新证明。请在验收结束后再次申请。")

        dummy = getattr(settings, 'CERT_DEBUG', False)
        is_project = bool(is_project)
        if is_project:
            project_table = MaterialProject
            msg = _("Project \"%(pid)s\" does not exist." % {'pid': ps_id})
        else:
            project_table = MaterialSubject
            msg = _("Subject \"%(pid)s\" does not exist." % {'pid': ps_id})
        try:
            project_table.objects.get(id=ps_id)
        except project_table.DoesNotExist:
            raise MGEError.PROJECT_OR_SUBJECT_NOT_FOUND(msg)
        public_collector = StatisticCollector(ps_id, is_project, dummy, is_public=True)
        private_collector = StatisticCollector(ps_id, is_project, dummy, is_public=False)
        old_cert = None
        should_create_new = False

        try:
            old_cert = Certificate.get_newest_cert(ps_id)
        except Certificate.DoesNotExist:
            should_create_new = True  # 没有旧证明，开具新证明

        # if old_cert is not None and not should_create_new and not public_collector.data_updated_since(
        #         old_cert.issue_time) and not private_collector.data_updated_since(old_cert.issue_time):
        #     # 如果已有旧证明并且数据量没有变化，并且没有新的数据，直接返回旧证明
        #     return base64.urlsafe_b64encode(old_cert.key.encode()).decode()

        _extra = 'CertificateIssuingTask[{}, {}]: start '.format(ps_id, is_project)
        template_statistics = []
        self.update_progress(0.1, block=True, extra=_extra+'do_file')
        public_collector.do_file()
        private_collector.do_file()
        self.update_progress(0.3, block=True, extra=_extra+'do_mongo_count')
        public_collector.do_mongo_count()
        private_collector.do_mongo_count()
        self.update_progress(0.7, block=True, extra=_extra+'do_mongo_size')
        public_collector.do_mongo_size()
        private_collector.do_mongo_size()
        self.update_progress(0.8, block=True, extra=_extra+'do_additional_size')
        public_collector.do_additional_size()
        private_collector.do_additional_size()
        self.update_progress(0.9, block=True, extra=_extra+'calculate TemplateStatistic')
        template_id_list = set(public_collector.template_id_list) | set(private_collector.template_id_list)
        for tid in template_id_list:
            template = Template.objects.get(id=tid)
            sub = TemplateStatistic(field_count=public_collector.get_field_count(tid),
                                    data_count=public_collector.get_data_count(tid),
                                    data_size=public_collector.get_data_size(tid),
                                    image_count=public_collector.get_image_count(tid),
                                    file_count=public_collector.get_file_count(tid),
                                    table_count=public_collector.get_table_count(tid),
                                    field_count_private=private_collector.get_field_count(tid),
                                    data_count_private=private_collector.get_data_count(tid),
                                    data_size_private=private_collector.get_data_size(tid),
                                    image_count_private=private_collector.get_image_count(tid),
                                    file_count_private=private_collector.get_file_count(tid),
                                    table_count_private=private_collector.get_table_count(tid),
                                    template_id=tid,
                                    category_id=template.category_id)
            template_statistics.append(sub)
        self.update_progress(0.95, block=True, extra=_extra+'do_research')

        # 统计科研成果
        public_collector.do_research()
        private_collector.do_research()
        new_cert = Certificate(ps_id=ps_id, issue_time=datetime.now(tz=get_current_timezone()),
                               data_count=public_collector.total_data_count,
                               data_size=public_collector.total_data_size,
                               image_count=public_collector.total_image_count,
                               file_count=public_collector.total_file_count,
                               field_count=public_collector.total_field_count,
                               table_count=public_collector.total_table_count,
                               data_count_private=private_collector.total_data_count,
                               data_size_private=private_collector.total_data_size,
                               image_count_private=private_collector.total_image_count,
                               file_count_private=private_collector.total_file_count,
                               field_count_private=private_collector.total_field_count,
                               table_count_private=private_collector.total_table_count,
                               is_project=is_project, research=public_collector.get_research(),
                               research_private=private_collector.get_research())

        with transaction.atomic():
            key = ''.join([random.choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(8)])
            new_cert.key = key
            new_cert.in_progress = False
            new_cert.save()
            for sub in template_statistics:
                sub.certificate = new_cert
                sub.save()
            if old_cert:
                old_cert.expired = True
                old_cert.expired_time = new_cert.issue_time
                old_cert.save()
            return base64.urlsafe_b64encode(key.encode()).decode()


class CertificateUpdateTask(MGEBaseTask):
    @property
    def task_description(self):
        return "汇交证明更新（后台）"

    def run(self, ps_id: str, is_project: bool):
        super().run()
        is_project = bool(is_project)
        if is_project:
            project_table = MaterialProject
            msg = _("Project \"%(pid)s\" does not exist." % {'pid': ps_id})
        else:
            project_table = MaterialSubject
            msg = _("Subject \"%(pid)s\" does not exist." % {'pid': ps_id})
        try:
            project_table.objects.get(id=ps_id)
        except project_table.DoesNotExist:
            raise MGEError.PROJECT_OR_SUBJECT_NOT_FOUND(msg)
        public_collector = StatisticCollector(ps_id, is_project, False, is_public=True)
        private_collector = StatisticCollector(ps_id, is_project, False, is_public=False)
        try:
            old_cert = Certificate.get_newest_cert(ps_id)
        except Certificate.DoesNotExist:
            raise MGEError.NOT_FOUND("未开具证明，无法更新")

        template_statistics = []
        self.update_progress(0.1, block=True)
        public_collector.do_file()
        private_collector.do_file()
        self.update_progress(0.3, block=True)
        public_collector.do_mongo_count()
        private_collector.do_mongo_count()
        self.update_progress(0.7, block=True)
        public_collector.do_mongo_size()
        private_collector.do_mongo_size()
        public_collector.do_additional_size()
        private_collector.do_additional_size()
        self.update_progress(0.9, block=True)
        template_id_list = set(public_collector.template_id_list) | set(private_collector.template_id_list)
        for tid in template_id_list:
            try:
                template = Template.objects.get(id=tid)
            except Template.DoesNotExist:
                continue
            sub: TemplateStatistic = TemplateStatistic(certificate=old_cert, template=template,
                                                       category=template.category)
            sub.field_count = public_collector.get_field_count(tid)
            sub.data_count = public_collector.get_data_count(tid)
            sub.data_size = public_collector.get_data_size(tid)
            sub.image_count = public_collector.get_image_count(tid)
            sub.file_count = public_collector.get_file_count(tid)
            sub.table_count = public_collector.get_table_count(tid)
            sub.field_count_private = private_collector.get_field_count(tid)
            sub.data_count_private = private_collector.get_data_count(tid)
            sub.data_size_private = private_collector.get_data_size(tid)
            sub.image_count_private = private_collector.get_image_count(tid)
            sub.file_count_private = private_collector.get_file_count(tid)
            sub.table_count_private = private_collector.get_table_count(tid)
            template_statistics.append(sub)
        self.update_progress(0.95, block=True)
        # 统计科研成果
        public_collector.do_research()
        private_collector.do_research()
        old_cert.data_count = public_collector.total_data_count
        old_cert.data_size = public_collector.total_data_size
        old_cert.image_count = public_collector.total_image_count
        old_cert.file_count = public_collector.total_file_count
        old_cert.field_count = public_collector.total_field_count
        old_cert.table_count = public_collector.total_table_count
        old_cert.data_count_private = private_collector.total_data_count
        old_cert.data_size_private = private_collector.total_data_size
        old_cert.image_count_private = private_collector.total_image_count
        old_cert.file_count_private = private_collector.total_file_count
        old_cert.field_count_private = private_collector.total_field_count
        old_cert.table_count_private = private_collector.total_table_count
        old_cert.research = public_collector.get_research()
        old_cert.research_private = private_collector.get_research()
        with transaction.atomic():
            TemplateStatistic.objects.filter(certificate=old_cert).delete()
            for sub in template_statistics:
                sub.save()
            old_cert.save()

        return base64.urlsafe_b64encode(old_cert.key.encode()).decode()
