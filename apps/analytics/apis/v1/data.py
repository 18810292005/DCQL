from dataclasses import dataclass

from dateutil.relativedelta import relativedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone

from apps.account.models import User
from apps.storage.models.data import DataMeta, DataStatistic
from apps.storage.models.material import CategoryTree, Category, MaterialProject, ProjectSubjectMember, MaterialSubject

from apps.storage.models.template import Template, TemplateDataStatistic, Snippet


@dataclass
class Stat:
    num_views: int
    num_downloads: int
    num_template: int
    num_data: int


@dataclass
class DataStat:
    title: str
    uploader: str
    num_views: int
    num_downloads: int
    add_time: str


def get_statistics_info(template_id_list) -> Stat:
    """
    返回值：累积查看量,累积下载量, 模板总量, 数据总量
    """
    if template_id_list is None:
        template_id_list = []
    q = {}
    if template_id_list:
        q = {'template_id__in': template_id_list}

    if q:
        sums = TemplateDataStatistic.objects.filter(**q).aggregate(
            Sum('num_views'),
            Sum('num_downloads')
        )
        num_data = DataMeta.objects.filter(**q).count()
        sum_views, sum_downloads = sums['num_views__sum'] or 0, sums['num_downloads__sum'] or 0
    else:
        sum_views = 0
        sum_downloads = 0
        num_data = 0

    return Stat(
        num_views=sum_views,
        num_downloads=sum_downloads,
        num_template=len(template_id_list),
        num_data=num_data
    )


def get_trend(template_id_list: list, start_date, end_date) -> list[tuple[str, Stat]]:
    if start_date is None or end_date is None:
        end_date = timezone.now()
        start_date = end_date - relativedelta(months=11)
    if template_id_list is None:
        template_id_list = []
    days_diff = (end_date - start_date).days
    months_diff = (end_date.year - start_date.year) * 12 + end_date.month - start_date.month
    group_by = "day"
    if months_diff > 0:
        group_by = "month"
    day_strings = []
    month_strings = []
    if group_by == "day":
        for i in range(days_diff + 1):
            day = start_date + relativedelta(days=i)
            day_strings.append(day.strftime('%Y%m%d'))
        print(day_strings)
    else:
        for i in range(months_diff + 1):
            month = start_date + relativedelta(months=i)
            month_strings.append(month.strftime('%Y%m'))
        print(month_strings)
    query_from = start_date
    query_end = end_date
    print(query_from, query_end)
    template_q = {}
    pk_q = {}
    if template_id_list:
        template_q['template_id__in'] = template_id_list
        pk_q['pk__in'] = template_id_list

        stats = TemplateDataStatistic.objects.filter(
            day__gte=query_from, day__lte=query_end, **template_q
        )
        if group_by == "day":
            # group by day
            rec = stats.annotate(
                truncated_day=TruncDay('day')
            ).values('truncated_day').annotate(
                Sum('num_views'), Sum('num_downloads'), Sum('num_new_data')
            )
            template_group = Template.objects.filter(
                pub_date__gte=query_from, pub_date__lte=query_end, **pk_q
            ).annotate(truncated_day=TruncDay('pub_date')).values(
                'truncated_day'
            ).annotate(count=Count('id'))
            day_str_map = {}
            for day_res in rec:
                truncated_date = day_res['truncated_day']
                num_views = day_res['num_views__sum'] or 0
                num_downloads = day_res['num_downloads__sum'] or 0
                num_new_data = day_res['num_new_data__sum'] or 0
                res = [num_views, num_downloads, 0, num_new_data]
                day_str_map[truncated_date.strftime('%Y%m%d')] = res
            result = []
            for template_res in template_group:
                day = template_res['truncated_day']
                day_str = day.strftime('%Y%m%d')
                day_str_map.setdefault(day_str, [0, 0, 0, 0])[2] += template_res['count']
            for day_str in day_strings:
                num_views, num_downloads, num_template, num_data = day_str_map.get(day_str, [0, 0, 0, 0])
                result.append((day_str, Stat(num_views, num_downloads, num_template, num_data)))
        else:
            # group by month
            rec = stats.annotate(
                month=TruncMonth('day')
            ).values('month').annotate(
                Sum('num_views'), Sum('num_downloads'), Sum('num_new_data')
            )
            template_group = Template.objects.filter(
                pub_date__gte=query_from, pub_date__lte=query_end, **pk_q
            ).annotate(month=TruncMonth('pub_date')).values(
                'month'
            ).annotate(count=Count('id'))
            month_str_map = {}
            for month_res in rec:
                truncated_date = month_res['month']
                num_views = month_res['num_views__sum'] or 0
                num_downloads = month_res['num_downloads__sum'] or 0
                num_new_data = month_res['num_new_data__sum'] or 0
                res = [num_views, num_downloads, 0, num_new_data]
                month_str_map[truncated_date.strftime('%Y%m')] = res
            result = []
            for template_res in template_group:
                month = template_res['month']
                month_str = month.strftime('%Y%m')
                month_str_map.setdefault(month_str, [0, 0, 0, 0])[2] += template_res['count']
            for month_str in month_strings:
                num_views, num_downloads, num_template, num_data = month_str_map.get(month_str, [0, 0, 0, 0])
                result.append((month_str, Stat(num_views, num_downloads, num_template, num_data)))
    else:
        result = []
        if group_by == "day":
            for day_str in day_strings:
                result.append((day_str, Stat(num_views=0, num_downloads=0, num_template=0, num_data=0)))
        else:
            for month_str in month_strings:
                result.append((month_str, Stat(num_views=0, num_downloads=0, num_template=0, num_data=0)))
    return result


def get_template_and_stats(template_id_list, top_k: int = 10) -> list[dict]:
    """
    返回数据量最多的前10个模板
    """
    if template_id_list is None:
        template_id_list = []
    q = {}
    pk_q = {}
    if template_id_list:
        q = {'template_id__in': template_id_list}
        pk_q = {'id__in': template_id_list}
        stats = TemplateDataStatistic.objects.filter(**q).values('template_id').annotate(
            num_data=Sum('num_new_data')
        ).order_by(
            '-num_data'
        )[:top_k]
        template_id_num_data_map = {}
        new_template_ids = []
        for stat in stats:
            new_template_ids.append(stat['template_id'])
            template_id_num_data_map[stat['template_id']] = stat['num_data']
        templates = Template.objects.filter(id__in=new_template_ids)
        res = []
        for template in templates:
            res.append({
                'id': template.id,
                'title': template.title,
                'num_data': template_id_num_data_map.get(template.id, 0)
            })
        res.sort(key=lambda x: x['num_data'], reverse=True)
    else:
        res = []

    return res


def get_data_stat(template_id_list, top_n: int = 10) -> tuple[list[DataStat], list[DataStat]]:
    if template_id_list is None:
        template_id_list = []
    q = {}
    if template_id_list:
        q = {'template_id__in': template_id_list}

    views = DataStatistic.objects.filter(**q).filter(num_views__gt=0).order_by(
        '-num_views'
    ).select_related('meta')[:top_n]
    downloads = DataStatistic.objects.filter(**q).filter(num_downloads__gt=0).order_by(
        '-num_downloads'
    )[:top_n]
    views_ranked = []
    for stat in views:
        data = stat.meta
        views_ranked.append(DataStat(
            title=data.title,
            uploader=data.user.real_name,
            num_views=stat.num_views,
            num_downloads=stat.num_downloads,
            add_time=stat.meta.add_time.strftime('%Y-%m-%d')
        ))
    downloads_ranked = []
    for stat in downloads:
        data = stat.meta
        downloads_ranked.append(DataStat(
            title=data.title,
            uploader=data.user.real_name,
            num_views=stat.num_views,
            num_downloads=stat.num_downloads,
            add_time=stat.meta.add_time.strftime('%Y-%m-%d')
        ))
    return views_ranked, downloads_ranked


def get_statistic_info_by_category_old(cat_id: int = None, institute_id=None, institute_level=None,
                                       username=None, start_date=None, end_date=None):
    """
    四元组：[累积查看量,累积下载量,模板总量,数据总量]
    """
    if cat_id:
        getter = CategoryTree.sub_cats_getter()
        cat_id_list = getter(cat_id, recursive=True) + [cat_id]  # 该节点各自节点最后加上本节点的列表
        template_queryset = Template.objects.filter(category_id__in=cat_id_list)  # 分类下模板id列表
    else:
        template_queryset = Template.objects.all()
    # 机构：机构和子机构下所有领导和成员创建的模板
    if institute_id and institute_level:
        user_id_set = set()
        if institute_level == 1:
            # project
            _queryset = list(MaterialProject.objects.filter(id=institute_id))
            for record in ProjectSubjectMember.objects.filter(
                    project_id__in=[project.id for project in _queryset],
                    subject__isnull=True
            ).select_related('user'):
                user_id_set.add(record.user.username)
            _queryset = list(MaterialSubject.objects.filter(project=institute_id))
            for record in ProjectSubjectMember.objects.filter(
                    subject_id__in=[subject.id for subject in _queryset]
            ).select_related('user'):
                user_id_set.add(record.user.username)
        else:
            # subject
            _queryset = list(MaterialSubject.objects.filter(id=institute_id))
            for record in ProjectSubjectMember.objects.filter(
                    subject_id__in=[subject.id for subject in _queryset]
            ).select_related('user'):
                user_id_set.add(record.user.username)
        user_id_list = list(user_id_set)
        template_queryset = template_queryset.filter(user_id__in=user_id_list)
    # 用户：具体某个用户创建的模板
    if username:
        template_queryset = template_queryset.filter(user_id=username)
    # if institute_id:
    # 获取模板 id 列表
    template_id_list = list(template_queryset.values_list('id', flat=True))
    trend = get_trend(template_id_list, start_date, end_date)
    old_trend = []
    for month, stat in trend:
        old_trend.append({
            'date': month,
            'data': [stat.num_views, stat.num_downloads, stat.num_template, stat.num_data]
        })
    _global = get_statistics_info(template_id_list)
    old_global = [_global.num_views, _global.num_downloads, _global.num_template, _global.num_data]
    num_dict = {"num_views": old_global[0], "num_downloads": old_global[1],
                "num_template": old_global[2], "num_data": old_global[3]}
    top_view, top_download = get_data_stat(template_id_list)
    return {
        "global": old_global,
        "trend": old_trend,
        'top_view': [x.__dict__ for x in top_view],
        'top_download': [x.__dict__ for x in top_download],
        'top_templates': get_template_and_stats(template_id_list),
        'num_dict': num_dict
    }


def get_top_templates(top_k: int = 10) -> list[dict]:
    """
    返回数据量最多的前top_k个模板
    """
    template_id_list = list(Template.objects.values_list('id', flat=True))
    if template_id_list:
        q = {'template_id__in': template_id_list}
        pk_q = {'id__in': template_id_list}
        stats = TemplateDataStatistic.objects.filter(**q).values('template_id').annotate(
            num_data=Sum('num_new_data')
        ).order_by(
            '-num_data'
        )[:top_k]
        template_id_num_data_map = {}
        new_template_ids = []
        for stat in stats:
            new_template_ids.append(stat['template_id'])
            template_id_num_data_map[stat['template_id']] = stat['num_data']
        templates = Template.objects.filter(id__in=new_template_ids)
        res = []
        for template in templates:
            res.append({
                'id': template.id,
                'category': template.category.name,
                'title': template.title,
                'num_data': template_id_num_data_map.get(template.id, 0)
            })
        res.sort(key=lambda x: x['num_data'], reverse=True)
    else:
        res = []

    return res


def get_statistics_count() -> dict:
    """
    返回值：分类数量，模板总量, 数据总量,累积下载量, 累积查看量，用户量
    """
    template_id_list = list(Template.objects.values_list('id', flat=True))
    stat = get_statistics_info(template_id_list=template_id_list)
    num_category = Category.objects.all().count()
    num_user = User.objects.all().count()
    return {
        "num_category": num_category,
        "num_template": stat.num_template,
        'num_data': stat.num_data,
        'num_downloads': stat.num_downloads,
        'num_views': stat.num_views,
        'num_user': num_user
    }


def get_user_statistics_count(user) -> dict:
    num_data = DataMeta.objects.filter(user=user).count()
    num_template = Template.objects.filter(user=user).count()
    num_snippet = Snippet.objects.filter(user=user).count()
    return {
        "num_data": num_data,
        "num_template": num_template,
        "num_snippet": num_snippet
    }
