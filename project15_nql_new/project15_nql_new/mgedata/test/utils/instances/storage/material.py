from apps.storage.models.material import *
from mgedata.test.utils.instances.instances import INSTANCES
from mgedata.test.utils.instances.account import user_create


def materialCategory_create():
    if "materialCategory_child" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialCategory_child") + 1]
    materialCategory_parent = MaterialCategory(
        # id = models.AutoField(primary_key=True)
        # parent = models.ForeignKey('self', blank=True, null=True, related_name='children', on_delete=models.CASCADE)
        # level = models.IntegerField(default=0, validators=(MinValueValidator(0),))
        name_zh='父材料',
        name_en='parent',
        leaf=False,
        # doi_prefix = models.CharField(null=True, max_length=255, validators=(MinLengthValidator(3),))
        # order = models.IntegerField(default=1)
        # adding at 2019-8-24
        # is_public = models.BooleanField(default=True)
    ).save()
    materialCategory_child = MaterialCategory(
        # id = models.AutoField(primary_key=True)
        parent=materialCategory_parent,
        level=1,
        name_zh='leaf',
        name_en='leaf',
        leaf=True,
        # doi_prefix = models.CharField(null=True, max_length=255, validators=(MinLengthValidator(3),))
        # order = models.IntegerField(default=1)
        # adding at 2019-8-24
        # is_public = models.BooleanField(default=True)
    )
    materialCategory_child.save()
    INSTANCES.extend(["materialCategory_child", materialCategory_child])
    return materialCategory_child


def materialCategory_private_create():
    if "materialCategory_private" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialCategory_private") + 1]
    materialCategory_create()
    materialCategory_private = MaterialCategory(
        # id = models.AutoField(primary_key=True)
        parent=materialCategory_create().parent,
        level=1,
        name_zh='leaf_private',
        name_en='leaf_private',
        leaf=True,
        # doi_prefix = models.CharField(null=True, max_length=255, validators=(MinLengthValidator(3),))
        # order = models.IntegerField(default=1)
        # adding at 2019-8-24
        is_public=False
    )
    materialCategory_private.save()
    INSTANCES.extend(["materialCategory_child", materialCategory_private])
    return materialCategory_private


def materialMethod_create():
    if "materialMethod_child" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialMethod_child") + 1]
    materialMethod_parent = MaterialMethod(
        name_zh='材料方法1',
        name_en='materialMethod1',
        # parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='children', null=True)
    ).save()
    materialMethod_child = MaterialMethod(
        name_zh='材料方法2',
        name_en='materialMethod2',
        parent=materialMethod_parent
    )
    materialMethod_child.save()
    INSTANCES.extend(["materialMethod_child", materialMethod_child])
    return materialMethod_child


def materialTag_create():
    if "materialTag" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialTag") + 1]
    materialTag = MaterialTag(
        name='tag1'
        # count = models.IntegerField(default=1, validators=(MinValueValidator(0),))
    )
    materialTag.save()
    INSTANCES.extend(["materialTag", materialTag])
    return materialTag


def material_project_create():
    if "materialProject" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialProject") + 1]
    user = user_create()
    materialProject = MaterialProject(
        # id='models.CharField(max_length=128, null=False, primary_key=True)',
        id='2016YFB0700500',
        name='materialProject1',
        leader='leader1',
        institution='institution1',
        leader_contact_method='leader_contact_method1',
        responsible_expert='responsible_expert1',
        responsible_expert_institution='responsible_expert_institution1',
        # 新增project与users多对多依赖
        # 新增project的创建时间
        # created_time = models.DateTimeField(auto_now=True)
        # projects_area =
        # members=[user]
    )
    materialProject.save()
    materialProject.members.set([user])
    INSTANCES.extend(["materialProject", materialProject])
    return materialProject


def material_subject_create():
    if "materialSubject" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialSubject") + 1]
    materialProject = material_project_create()
    materialSubject = MaterialSubject(
        id='2016YFB0700503',
        name='materialSubject1',
        leader='leader1',
        institution='institution1',
        leader_contact_method='leader_contact_method',
        project=materialProject,
        # user=user,
        # 新增创建课题时间
    )
    materialSubject.save()
    INSTANCES.extend(["materialSubject", materialSubject])
    return materialSubject


material_projects = [
    {
        "id": 54,
        "number": "2016YFB0700500",
        "name": "先进高分子基复合材料高通量制备研发及其在新一代飞机上的示范应用",
        "year": 0,
        "guide": "",
        "taskBook": "",
        "taskBookOname": "",
        "organizer": "",
        "status": 10,
        "userId": 675,
        "cctCreate": "2019-06-13 15:54:24",
        "cctModified": "2019-06-13 15:54:24",
        "createrId": 675,
        "objectiveItem": "",
        "userAccount": None,
        "userMail": "dushiyu@nimte.ac.cn",
        "createName": "都时禹",
        "leaderName": "刘茜",
        "leaderMail": "qianliu@sunm.shcnc.ac.cn",
        "mgeTopicList": [
            {
                "id": 196,
                "number": "2017YFB0703301",
                "name": "基于材料基因工程的先进高分子基复合材料体系高通量设计、模拟研究",
                "year": 0,
                "guide": "",
                "taskBook": "",
                "taskBookOname": "",
                "organizer": "",
                "status": 20,
                "stModified": 0,
                "projectId": 54,
                "userId": 722,
                "cctCreateStr": "2019-06-13 16:36:39",
                "createrId": 722,
                "objectiveItem": "",
                "createName": "朱俊",
                "userMail": "zhujun@uestc.edu.cn",
                "topicLeaderName": "黄卫东",
                "topicLeaderMail": "huang@nwpu.edu.cn"
            },
            {
                "id": 197,
                "number": "2017YFB0703302",
                "name": "基于材料基因工程的先进高分子基复合材料高通量工艺模拟、表征与评价研究",
                "year": 0,
                "guide": "",
                "taskBook": "",
                "taskBookOname": "",
                "organizer": "",
                "status": 20,
                "stModified": 0,
                "projectId": 54,
                "userId": 850,
                "cctCreateStr": "2019-06-13 16:36:39",
                "createrId": 850,
                "objectiveItem": "",
                "createName": "叶继春",
                "userMail": "jichun.ye@infinitemasterials.com",
                "topicLeaderName": "黄卫东",
                "topicLeaderMail": "huang@nwpu.edu.cn"
            },
        ]
    },
    {
        "id": 54,
        "number": "2016YFB0700501",
        "name": "先进高分子基复合材料高通量制备研发及其在新一代飞机上的示范应用",
        "year": 0,
        "guide": "",
        "taskBook": "",
        "taskBookOname": "",
        "organizer": "",
        "status": 10,
        "userId": 675,
        "cctCreate": "2019-06-13 15:54:24",
        "cctModified": "2019-06-13 15:54:24",
        "createrId": 675,
        "objectiveItem": "",
        "userAccount": None,
        "userMail": "liang.jiang@csu.edu.cn",
        "createName": "江亮",
        "leaderName": "刘茜",
        "leaderMail": "qianliu@sunm.shcnc.ac.cn",
        "mgeTopicList": [
            {
                "id": 196,
                "number": "2017YFB07033015",
                "name": "基于材料基因工程的先进高分子基复合材料体系高通量设计、模拟研究",
                "year": 0,
                "guide": "",
                "taskBook": "",
                "taskBookOname": "",
                "organizer": "",
                "status": 20,
                "stModified": 0,
                "projectId": 54,
                "userId": 722,
                "cctCreateStr": "2019-06-13 16:36:39",
                "createrId": 722,
                "objectiveItem": "",
                "createName": "黄晓旭",
                "userMail": "xiaoxuhuang@cqu.edu.cn",
                "topicLeaderName": "黄卫东",
                "topicLeaderMail": "huang@nwpu.edu.cn"
            },
        ]
    }
]
