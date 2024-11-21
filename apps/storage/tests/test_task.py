import pytz
from django.test import TestCase
from django.utils.dateparse import parse_datetime

from apps.storage.tasks import *
from apps.storage.models.material import MaterialProject, MaterialSubject
from mgedata.test.utils.instances import user_create, instance, material_project_create, material_subject_create
from mgedata.test.utils import instances
from django.test import override_settings


class MaterialProjectSynTaskTest(TestCase):

    @instance
    @override_settings(DEBUG=True)
    def setUp(self) -> None:
        # 创建用户
        self.user = user_create()
        # 创建项目
        self.project = material_project_create()
        # 创建课题
        self.subject = material_subject_create()
        material_project_syn()

    @override_settings(DEBUG=True)
    def test_good(self):
        # pool = Pool(processes=2)
        # result = [
        #     pool.apply_async(material_project_syn),
        #     pool.apply_async(PersistentVariables.get_variable, args=(PVEnum.MATERIAL_PROJECT_LOCK.value,))
        # ]
        # pool.close()
        # pool.join()
        # self.assertEqual(False, result[1].get())
        self.assertEqual(len(MaterialProject.objects.all()), len(instances.material_projects))
        mp1 = MaterialProject.objects.get(id=self.project.id)
        self.assertEqual(
            mp1.created_time,
            pytz.timezone("Asia/Shanghai").localize(
                parse_datetime(instances.material_projects[0]["cctCreate"]),
                is_dst=None
            )
        )
        self.assertEqual(mp1.leader.username, instances.material_projects[0]["leaderMail"].split('@')[0])
        self.assertEqual(
            len(MaterialSubject.objects.filter(project=self.project.id)),
            len(instances.material_projects[0]["mgeTopicList"])
        )
        self.assertEqual(PersistentVariables.get_variable(PVEnum.MATERIAL_PROJECT_VERSION.value), 0)
