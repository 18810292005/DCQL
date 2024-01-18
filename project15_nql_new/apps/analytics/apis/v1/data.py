import re
import numpy as np
from typing import List

from django.utils.translation import get_language
from django.db.models import Q, Count
from django.utils.translation import gettext as _

from apps.analytics.models import *
from apps.analytics.core.cache import DataStatisticsCache, CacheTimeType, CacheKeySet, CacheKeyManager
from apps.certificate.models import Acceptance, AcceptanceState
from mgedata.errors.models import MGEError
from apps.storage.models import Template
from apps.storage.models.data import DataMeta
from apps.storage.models.material import MaterialCategory


def merge_list(x, y):
    return [a + b for a, b in zip(x, y)]


def get_class_root() -> MaterialCategory:
    """
        获取全局根分类
    """
    c = MaterialCategory.objects.filter(level=0, parent=None).first()
    assert c is not None
    return c


def get_sub_classes(mat_class) -> list:
    """
        获取该分类的子分类
    :param mat_class:
    :return:
    """
    assert mat_class.leaf is False
    return MaterialCategory.objects.filter(parent_id=mat_class.id, level__gt=0)


def get_sub_leaf_class_list(mat_class: MaterialCategory) -> list:
    """
    获取指定分类的所有叶子分类
    :param mat_class: 父分类，不能是叶子节点
    :return: 所有叶子分类的列表
    """
    assert mat_class.leaf is False
    result = []
    for c in get_sub_classes(mat_class):
        result += [c] if c.leaf is True else get_sub_leaf_class_list(c)
    return result


def get_class_count(mat_class: MaterialCategory, force_update=False) -> list:
    """
    获取某个分类的统计情况,访问量，下载量，模板数，数据数目-
    """
    analytics_cache_key = CacheKeyManager.get_key(mat_class, CacheKeySet.analytics_field, mat_class.id)
    result = DataStatisticsCache.get_data_cache(analytics_cache_key)
    if result is not None and not force_update:
        return result
    if mat_class.leaf:
        result = ClassCounter.get_unique(mat_class).to_list()
    else:
        classes = get_sub_leaf_class_list(mat_class)
        result = [0, 0, 0, 0]
        for c in classes:
            # 缓存不存在
            class_count_value = ClassCounter.get_unique(c).to_list()
            result = merge_list(result, class_count_value)
    DataStatisticsCache.set_data_cache(analytics_cache_key, result, CacheTimeType.TWO_DAY.value)
    return result


def get_trend_sum_of_leaf_classes(classes, beg, end) -> list:
    """
    将一个叶子节点列表的trend按项目求和
    :param classes: 叶子节点的列表
    :param beg:
    :param end:
    :return:
    """
    result = None
    for c in classes:
        li = ClassTrend.get_unique(c).get_trend_by_date(beg, end)
        if not result:
            result = li
        else:
            # add
            result = [
                {'date': x['date'], 'data': merge_list(x['data'], y['data'])} for x, y in zip(result, li)
            ]
    return result


def get_class_trend(mat_class: MaterialCategory, beg: int, end: int, force_update=False) -> list:
    if mat_class.leaf:
        return ClassTrend.get_unique(mat_class).get_trend_by_date(beg, end)
    else:
        # 这里设置缓存.
        category_cache_key = CacheKeyManager.get_key(mat_class, CacheKeySet.class_trend_field,
                                                     f"{mat_class.id}_{beg}_{end}")
        result = DataStatisticsCache.get_data_cache(category_cache_key)
        if result is not None and not force_update:
            return result
        result = get_trend_sum_of_leaf_classes(get_sub_leaf_class_list(mat_class), beg, end)
        DataStatisticsCache.set_data_cache(category_cache_key, result, CacheTimeType.TWO_DAY.value)
        return result


def get_mat_info(mat_class):
    gl = get_class_count(mat_class)
    tr = get_class_trend(mat_class, get_12_month_before_now(), get_current_date())
    cc = None
    if mat_class.leaf is False:
        cc = [{'name': _(c.name), 'id': c.id, 'data': get_class_count(c)}
              for c in get_sub_classes(mat_class)]
    return gl, tr, cc


def get_ins_or_abort(model_cls, pk):
    ret = model_cls.objects.filter(pk=pk).first()
    if ret is None:
        raise MGEError.NOT_FOUND
    return ret


def get_trend_of_project_or_subject(ps_id: str, is_project=True):
    """
        获取项目/课题验收趋势
    Args:
        ps_id: 项目或者课题id
        is_project: 是否为项目或者课题
    Returns:
    """
    template_id_list = DataMeta.OtherInfoHelper.get_template_id_list_filter_by_project_or_subject_id(ps_id, is_project)
    template_queryset = Template.objects.filter(id__in=template_id_list)
    templates = [{'id': ins.id, 'name': ins.title} for ins in template_queryset]
    lang = get_language() or 'zh'
    categories_list = []
    fetchall = DataMeta.OtherInfoHelper.get_trend_by_ps_id(ps_id, is_project)
    name_key = 'name_en' if lang == 'en' else 'name_zh'
    for row in fetchall:
        categories_list.append(
            {"id": row['id'], "name": row[name_key], "data": [0, 0, row['template_count'], row['data_count']]})

    # 获取项目验收状态
    acceptance = Acceptance.objects.filter(ps_id=ps_id, is_project=is_project).first()
    ac_status = AcceptanceState(acceptance.state).description if acceptance else "未验收"

    return templates, categories_list, ac_status


def get_trend_of_project_or_subject_cache(ps_id: str, is_project=True):
    if is_project:
        cache_key = CacheKeyManager.get_key(MaterialProject, CacheKeySet.project_or_subject_trend_field, ps_id)
    else:
        cache_key = CacheKeyManager.get_key(MaterialSubject, CacheKeySet.project_or_subject_trend_field, ps_id)
    trend_value = DataStatisticsCache.get_data_cache(cache_key)
    if trend_value is not None:
        return trend_value
    templates, categories_list, ac_status = get_trend_of_project_or_subject(ps_id, is_project)
    DataStatisticsCache.set_data_cache(cache_key, [templates, categories_list, ac_status], CacheTimeType.TWO_DAY.value)
    return templates, categories_list, ac_status


def query_mat_class(mat_class: MaterialCategory):
    """
        获取材料种类信息以及对应的统计信息
    Args:
        mat_class: 材料种类信息
    """
    assert mat_class is not None
    gl, tr, cc = get_mat_info(mat_class)
    response_dict = {
        "global": gl,
        "trend": tr,
        "class": cc
    }
    if mat_class.level == 0:
        acceptance_value = get_acceptance_info()
        response_field = ["acceptance", "applycount", "uploadtime", "distribution"]
        for field, value in zip(response_field, acceptance_value):
            response_dict[field] = value
    return response_dict


def get_project_time(project_id):
    def _is_Nation_R_D_Type_ID(s):
        pattern = r'^\d{4}'
        if bool(re.match(pattern, s)):
            project_time = s[0:4]
            return True, project_time
        return False, None

    def _is_Central_Universities_BSR(s):
        pattern = r'^FRF'
        if bool(re.match(pattern, s)):
            project_time = s[6:8]
            project_time = "20" + project_time
            return True, project_time
        return False, None

    id_judge = {"国家重点研发计划": _is_Nation_R_D_Type_ID, "中央高校基本科研业务": _is_Central_Universities_BSR}
    for _, f in id_judge.items():
        stat, res = f(project_id)
        if stat:
            return res
    raise MGEError.PROJECT_ID_FORMAT_WRONG("项目id格式不符合:" + str(",".join(list(id_judge.keys()))))


def get_acceptance_info(force_update=False):
    """
        获取每一年的已验收项目数，未验收项目数
        获取项目提交的第一条验收数据時間
        获取项目提交验收申请的时间
        获取项目数据分布
        Returns:
    """
    project_acceptance_cache_key = CacheKeyManager.get_key(Acceptance, CacheKeySet.project_acceptance_field)
    result = DataStatisticsCache.get_data_cache(project_acceptance_cache_key)
    if result is not None and not force_update:
        return result

    submit_acceptance_time = []
    acceptance_num_dict = {}
    projects_acceptance_year = AnalyticsInfo.get_year_list_from_2016_to_now()
    for year in projects_acceptance_year:
        acceptance_num_dict[year] = [0, 0]

    material_projects: List[MaterialProject] = MaterialProject.objects.all()

    for project in material_projects:
        # 获取项目年份.出错默认2016
        if len(project.id) == AnalyticsInfo.project_id_legal_length:  # 项目的长度,如2016YFB0700800
            project_time = get_project_time(project.id)
        else:
            project_time = str(2016)

        if int(project_time) < 2016:
            # 项目的日期小于2016，则视为2016
            project_time = str(2016)

        try:
            acceptance = Acceptance.objects.get(ps_id=project.id, is_project=True)
            submit_acceptance_time.append(acceptance.c_time.strftime('%Y-%m'))
            if acceptance.state == AcceptanceState.FINISHED:
                acceptance_num_dict[project_time][0] += 1
        except Acceptance.DoesNotExist:
            # 说明没有提交汇交申请
            acceptance_num_dict[project_time][1] += 1
    # 获取验收/未验收数量总和
    acceptance_num_dict['total'] = np.sum(list(acceptance_num_dict.values()), axis=0).tolist()
    # 获取项目验收时间分布
    acceptance_time_stat = get_statistics_data_before_now(submit_acceptance_time)
    # 获取上传时间，汇交记录分布
    projects_add_time_dict, projects_data_count_dict = get_projects_data_statistics()
    results = [acceptance_num_dict, acceptance_time_stat,
               projects_add_time_dict, projects_data_count_dict]
    DataStatisticsCache.set_data_cache(project_acceptance_cache_key, results, CacheTimeType.ONE_WEEK.value)
    return results


def get_all_projects_info(force_update=False):
    # 获取projects_info的缓存
    cache_key = CacheKeyManager.get_key(MaterialProject, CacheKeySet.projects_info_field)
    projects_info = DataStatisticsCache.get_data_cache(cache_key)
    if projects_info is not None and not force_update:
        return projects_info

    projects_info = []
    projects: List[MaterialProject] = MaterialProject.objects.all()
    for project in projects:
        project_dict = {}
        data_count = DataMeta.OtherInfoHelper.get_data_meta_count_filter_by_project_id(
            project.id)

        template_count = len(
            DataMeta.OtherInfoHelper.get_category_id_list_filter_by_project_id(project.id))

        project_dict['id'] = project.id
        project_dict['name'] = project.name
        project_dict['leader'] = project.leader
        project_dict['tem_count'] = template_count
        project_dict['data_count'] = data_count
        project_dict['quota_data_count'] = project.quota_data_count
        projects_info.append(project_dict)
    DataStatisticsCache.set_data_cache(cache_key, projects_info, CacheTimeType.ONE_WEEK.value)

    return projects_info
