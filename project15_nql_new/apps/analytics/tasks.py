from celery import shared_task

from apps.storage.models import DataMeta, MaterialSubject, MaterialCategory, MaterialProject
from apps.analytics.apis.v1.data import get_all_projects_info, get_acceptance_info, \
    get_trend_of_project_or_subject, get_class_count, get_class_trend
from apps.analytics.core.cache import DataStatisticsCache, CacheTimeType, CacheKeyManager, CacheKeySet
from apps.analytics.models import DataCounter, ClassCounter, TemplateCounter, SubjectCounter, get_12_month_before_now, \
    get_current_date


@shared_task
def on_view(data_id):
    """
    用户访问数据详情页面时调用此函数
    :param data_id: 数据id
    :return: 无
    """
    data = DataMeta.objects.filter(pk=data_id).first()
    if data is None:
        raise RuntimeWarning('ObjectId ' + str(data_id) + ' not found')
    else:
        DataMeta.on_view(data_id)
        DataCounter.get_unique(data).inc_view()
        ClassCounter.get_unique(data.category).inc_view()
        TemplateCounter.get_unique(data.template).inc_view()
        if data.other_info:
            subject = MaterialSubject.objects.filter(
                pk=data.other_info.get('subject')).first()
            if subject:
                SubjectCounter.get_unique(subject).inc_view()


@shared_task
def on_download(data_ids):
    """
    用户下载数据文件时调用此函数
    如果该数据拥有多个文件，只调用此函数一次
    :param data_ids: 数据id列表
    :return: 无
    """
    data_metas = DataMeta.objects.filter(id__in=data_ids)
    DataMeta.on_download([data.id for data in data_metas])
    for data in data_metas:
        DataCounter.get_unique(data).inc_dl()
        ClassCounter.get_unique(data.category).inc_dl()
        TemplateCounter.get_unique(data.template).inc_dl()
        if data.other_info:
            subject = MaterialSubject.objects.filter(
                pk=data.other_info.get('subject')).first()
            if subject:
                SubjectCounter.get_unique(subject).inc_dl()


@shared_task
def full_site_count_refresh():
    # 先将各个材料节点的[访问量，下载量，模板数，数据数目]统计,后续直接从缓存中获取,对应get_class_count函数
    mc_list = MaterialCategory.objects.filter()
    for mat_class in mc_list:
        get_class_count(mat_class, force_update=True)

    # 计算叶子trend缓存,对应get_class_trend函数缓存
    beg = get_12_month_before_now()
    end = get_current_date()
    classes = MaterialCategory.objects.filter(leaf=False).all()
    for _class in classes:
        get_class_trend(_class, beg, end, force_update=True)

    # 课题缓存,有些数据量大,直接获取会很慢,对应get_trend_of_project_or_subject_cache函数
    subject_queryset = MaterialSubject.objects.all()
    for subject in subject_queryset:
        cache_key = CacheKeyManager.get_key(MaterialSubject, CacheKeySet.project_or_subject_trend_field, subject.id)
        value = get_trend_of_project_or_subject(subject.id, is_project=False)
        DataStatisticsCache.set_data_cache(cache_key, value, CacheTimeType.TWO_DAY.value)
    # 缓存项目
    project_queryset = MaterialProject.objects.all()
    for project in project_queryset:
        cache_key = CacheKeyManager.get_key(MaterialProject, CacheKeySet.project_or_subject_trend_field, project.id)
        value = get_trend_of_project_or_subject(project.id)
        DataStatisticsCache.set_data_cache(cache_key, value, CacheTimeType.TWO_DAY.value)
    # 所有项目信息缓存
    get_all_projects_info(force_update=True)
    # 获取验收信息
    get_acceptance_info(force_update=True)
