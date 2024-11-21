from collections import OrderedDict
from datetime import datetime, timedelta

import pandas as pd
from django.utils import timezone

from apps.storage.models.data import DataMeta


class AnalyticsInfo:
    # 项目id合法长度14位
    project_id_legal_length = 14
    # 项目id正则合法长度
    project_id_re_legal_length = 2

    # 项目分布区间
    data_range = [0, 10000, 100000, 500000, 1000000, 2000000, 3000000, float('inf')]
    data_distribution_labels = ['<1w', '<10w', '<50w', '<100w', '<200w', '<300w', '>=300w']

    @staticmethod
    def get_year_list_from_2016_to_now():
        now_year = datetime.now().strftime("%Y")
        return [str(year) for year in range(2016, int(now_year) + 1)]

    @staticmethod
    def get_year_month_list_from_202101_to_now():
        # 返回从2021年1月1日到现在的年月列表
        dates = ["2021-1-1", datetime.now().strftime("%Y-%m-%d")]
        start, end = [datetime.strptime(_, "%Y-%m-%d") for _ in dates]
        year_month_ordered_dict = OrderedDict(
            ((start + timedelta(_)).strftime(r"%Y-%m"), None) for _ in range((end - start).days)).keys()
        year_month_list = list(year_month_ordered_dict)
        return year_month_list


def months(start_year, start_month, end_year, end_month):
    """
    月份的迭代器，闭区间
    :param start_year: 起始年份
    :param start_month: 起始月份
    :param end_year: 终点年份
    :param end_month: 终点月份
    :return:
    """
    month, year = start_month, start_year

    while (year, month) <= (end_year, end_month):
        yield year * 100 + month
        month += 1
        if month > 12:
            month = 1
            year += 1


def get_current_date():
    now = timezone.now()
    y = now.year if now.month != 1 else now.year - 1
    m = now.month - 1 if now.month != 1 else 12  # 最后一个月还没有更新
    return y * 100 + m


def get_12_month_before_now():
    now = datetime.now()
    y = now.year
    m = now.month
    return (y - 1) * 100 + m


def get_statistics_data_before_now(data: list) -> dict:
    year_month_list = AnalyticsInfo.get_year_month_list_from_202101_to_now()
    stat_dict = {}
    for _date in year_month_list:
        stat_dict[_date] = data.count(_date)
    return stat_dict


def get_distribution_of_data(data: list) -> dict:
    """
        数据标签和数据范围，与前端协调
    """
    data_distribution_labels = AnalyticsInfo.data_distribution_labels
    data_range = AnalyticsInfo.data_range
    # 根据data_range划分数据范围
    series_data = pd.cut(data, data_range, labels=data_distribution_labels).value_counts().to_dict()
    data_distribution = {}
    for label in data_distribution_labels:
        data_distribution[label] = series_data[label]

    return data_distribution


def get_projects_data_statistics():
    """
        获得项目的数据统计，即项目的提交时间，项目的总数分布
    Returns:
    """
    projects_data_meta_list = DataMeta.OtherInfoHelper.get_data_meta_add_time_count_group_by_project_id()
    projects_add_time_list = [_dict[0] for _dict in projects_data_meta_list]
    projects_data_count_list = [_dict[1] for _dict in projects_data_meta_list]
    projects_add_time_dict = {}
    year_list = AnalyticsInfo.get_year_list_from_2016_to_now()
    for _year in year_list:
        projects_add_time_dict[_year] = projects_add_time_list.count(_year)
    # 得到数据的分布频率
    projects_data_count_dict = get_distribution_of_data(projects_data_count_list)
    return projects_add_time_dict, projects_data_count_dict
