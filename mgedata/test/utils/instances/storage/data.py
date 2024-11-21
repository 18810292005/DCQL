from apps.storage.models.data import *
from mgedata.test.utils.instances.instances import INSTANCES
from mgedata.test.utils.instances.account import user_create
from .template import template_create
from .material import materialCategory_create


def dataSet_create():
    if "dataSet" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataSet") + 1]
    user = user_create()
    dataSet = DataSet(
        user=user,
        contributor='contributor 1',  # the responsible for doi
        title='title 1',
        project='project 1'
        # doi = models.CharField(max_length=300, null=True, blank=True, default=None)
    )
    dataSet.save()
    INSTANCES.extend(["dataSet", dataSet])
    return dataSet


def dataMeta_create():
    if "dataMeta" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataMeta") + 1]
    user = user_create()
    dataSet = dataSet_create()
    materialCategory = materialCategory_create()
    template = template_create()
    dataMeta = DataMeta(
        title='title',
        category=materialCategory,
        template=template,
        source='source',
        reference='reference',
        contributor='contributor',
        institution='institution',
        other_info={'other': 'info'},
        user=user,
        dc_id='aaaaaaaaaaaaaaaaaaaaaaaa',
        reviewer=user,
        disapprove_reason='disapprove_reason',
        dataset=dataSet,
    )
    dataMeta.save()
    INSTANCES.extend(["dataMeta", dataMeta])
    return dataMeta


def dataMeta2_create():
    if "dataMeta2" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataMeta2") + 1]
    user = user_create()
    dataSet = dataSet_create()
    materialCategory = materialCategory_create()
    template = template_create()
    dataMeta2 = DataMeta(
        title='title2',
        category=materialCategory,
        template=template,
        source='source',
        reference='reference',
        contributor='contributor',
        institution='institution',
        other_info={'other': 'info'},
        user=user,
        dc_id='aaaaaaaaaaaaaaaaaaaaaaab',
        reviewer=user,
        disapprove_reason='disapprove_reason',
        dataset=dataSet,
    )
    dataMeta2.save()
    INSTANCES.extend(["dataMeta2", dataMeta2])
    return dataMeta2


def dataMeta3_create():
    if "dataMeta3" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataMeta3") + 1]
    user = user_create()
    dataSet = dataSet_create()
    materialCategory = materialCategory_create()
    template = template_create()
    dataMeta3 = DataMeta(
        title='title3',
        category=materialCategory,
        template=template,
        source='source',
        reference='reference',
        contributor='contributor',
        institution='institution',
        other_info={'other': 'info'},
        user=user,
        dc_id='aaaaaaaaaaaaaaaaaaaaacab',
        reviewer=user,
        disapprove_reason='disapprove_reason',
        dataset=dataSet,
    )
    dataMeta3.save()
    INSTANCES.extend(["dataMeta3", dataMeta3])
    return dataMeta3


def uploadedSourceFile_create():
    if "uploadedSourceFile" in INSTANCES:
        return INSTANCES[INSTANCES.index("uploadedSourceFile") + 1]
    uploadedSourceFile = UploadedSourceFile(
        uploaded_by='uploaded_by',
        file='_fs/source/2020/01/01/'
    )
    uploadedSourceFile.save()
    INSTANCES.extend(["uploadedSourceFile", uploadedSourceFile])
    return uploadedSourceFile


def dataUploadSourceMap_create():
    if "dataUploadSourceMap" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataUploadSourceMap") + 1]
    dataMeta = dataMeta_create()
    uploadedSourceFile = uploadedSourceFile_create()
    dataUploadSourceMap = DataUploadSourceMap(
        meta=dataMeta,
        file=uploadedSourceFile,
    )
    dataUploadSourceMap.save()
    INSTANCES.extend(["dataUploadSourceMap", dataUploadSourceMap])
    return dataUploadSourceMap


def uploadHistory_create():
    if "uploadHistory" in INSTANCES:
        return INSTANCES[INSTANCES.index("uploadHistory") + 1]
    user = user_create()
    uploadedSourceFile = uploadedSourceFile_create()
    materialCategory = materialCategory_create()
    uploadHistory = UploadHistory(
        user=user,
        # time = models.DateTimeField(auto_now_add=True)
        meta_id_list=[1],
        count=1,
        source=uploadedSourceFile,
        # 判断时统一以source为准，source为空表示表单提交，否则是文件提交
        # via_file = models.BooleanField(default=False)
        # review_state = models.IntegerField(default=DataReviewState.PENDING)
        reviewer=user,
        category=materialCategory,
        disapprove_reason='disapprove_reason'
    )
    uploadHistory.save()
    INSTANCES.extend(["uploadHistory", uploadHistory])
    return uploadHistory


def doiRegisterInfo_create():
    if "doiRegisterInfo" in INSTANCES:
        return INSTANCES[INSTANCES.index("doiRegisterInfo") + 1]
    doiRegisterInfo = DoiRegisterInfo(
        title='title'
        # contributor = models.CharField(max_length=255, null=False, blank=False)
        # project = models.CharField(max_length=255, null=False, blank=False)
        # status = models.IntegerField(choices=STATUS, default=0)
        # data_ids = ArrayField(models.IntegerField(), null=False, blank=False, default=list)
        # applicant = models.TextField(default=get_current_username, null=True)
        # add_time = models.DateTimeField(auto_now_add=True)
        # dataset_id = models.IntegerField(null=True, default=None)
    )
    doiRegisterInfo.save()
    INSTANCES.extend(["doiRegisterInfo", doiRegisterInfo])
    return doiRegisterInfo


def dataScore_create():
    if "dataScore" in INSTANCES:
        return INSTANCES[INSTANCES.index("dataScore") + 1]
    user = user_create()
    dataMeta = dataMeta_create()
    dataScore = DataScore(
        user=user,
        data=dataMeta,
        # score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
        # time = models.DateTimeField(auto_now_add=True)
    )
    dataScore.save()
    INSTANCES.extend(["dataScore", dataScore])
    return dataScore
