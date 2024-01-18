from django.db import models
from django.contrib.postgres.fields import JSONField

from apps.storage.models import MaterialCategory, MaterialSubject, MaterialProject, \
    DataMeta, Template

from .misc import *


class BasicDoc(models.Model):
    """
    下载量、访问量的统计基类
    """
    views = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)

    def inc_view(self):
        self.views += 1
        self.save()

    def inc_dl(self):
        self.downloads += 1
        self.save()

    class Meta:
        abstract = True


class DataCounter(BasicDoc):
    """
    每一条数据的统计内容
    """
    ref = models.OneToOneField(DataMeta, on_delete=models.CASCADE)

    category = models.ForeignKey(MaterialCategory, on_delete=models.SET_NULL, null=True)

    def to_list(self) -> list:
        return [self.views, self.downloads]

    @staticmethod
    def get_unique(target: DataMeta):
        obj, created = DataCounter.objects.get_or_create(ref=target, category=target.category)
        return obj


class ClassCounter(BasicDoc):
    """
    每个分类的统计内容
    只保存叶节点的统计内容。
    """
    ref = models.OneToOneField(MaterialCategory, on_delete=models.CASCADE)

    def to_list(self):
        print("Handling Long Query", self.ref.name)
        template_count = Template.objects.filter(category=self.ref).count()
        data_count = DataMeta.objects.filter(category=self.ref).count()
        return [self.views, self.downloads, template_count, data_count]

    @staticmethod
    def get_unique(target: MaterialCategory):
        # assert target.leaf is True
        obj, created = ClassCounter.objects.get_or_create(ref=target)
        return obj


class TemplateCounter(BasicDoc):
    ref = models.OneToOneField(Template, on_delete=models.CASCADE)

    def to_list(self):
        data_count = DataMeta.objects.filter(template=self.ref).count()
        return [self.views, self.downloads, 1, data_count]

    def init(self):
        queryset = DataMeta.objects.filter(template=self.ref)
        self.views = queryset.aggregate(models.Sum('views'))['views__sum']
        self.downloads = queryset.aggregate(models.Sum('downloads'))['downloads__sum']
        self.save()

    @staticmethod
    def get_unique(target: Template):
        obj, created = TemplateCounter.objects.get_or_create(ref=target)
        if created:
            obj.init()
        return obj


class SubjectCounter(BasicDoc):
    ref = models.OneToOneField(MaterialSubject, on_delete=models.CASCADE)

    def to_list(self):
        data_meta_ids = DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_subject_id(self.ref.id)
        data_queryset = DataMeta.objects.filter(id__in=data_meta_ids)
        template_count = len(DataMeta.OtherInfoHelper.get_template_id_list_filter_by_subject_id(self.ref.id))
        data_count = data_queryset.count()
        return [self.views, self.downloads, template_count, data_count]

    def init(self):
        data_meta_ids = DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_subject_id(self.ref.id)
        queryset = DataMeta.objects.filter(id__in=data_meta_ids)
        self.views = queryset.aggregate(models.Sum('views'))['views__sum'] or 0
        self.downloads = queryset.aggregate(models.Sum('downloads'))['downloads__sum'] or 0
        self.save()

    @staticmethod
    def get_unique(target: MaterialSubject):
        obj, created = SubjectCounter.objects.get_or_create(ref=target)
        if created:
            obj.init()
        return obj


def check_date(beg: int, end: int) -> bool:
    """
    检查年月是否合法
    :param beg: 起始年月
    :param end: 终点年月
    :return:
    """
    beg_month = beg % 100
    end_month = end % 100
    beg_year = beg / 100
    end_year = end / 100

    if not (0 < beg_month < 13 and 0 < end_month < 13):
        return False
    if not (beg_year > 0 and end_year > 0):
        return False
    if beg > end:
        return False
    return True


class ClassTrend(models.Model):
    """
    记录每一个分类的趋势数据
    只有叶子节点存在这种记录
    全局记录和非叶子节点的记录在请求时计算并缓存
    """
    ref = models.OneToOneField(MaterialCategory, on_delete=models.CASCADE)

    record = JSONField(default=dict)

    def get_trend_by_date(self, beg: int, end: int) -> list:
        if not check_date(beg, end):
            return []
        else:
            result = []
            for m in months(beg // 100, beg % 100, end // 100, end % 100):

                try:
                    result.append({'date': m, 'data': self.record[str(m)]})
                except KeyError:
                    result.append({'date': m, 'data': [0, 0, 0, 0]})
            return result

    @staticmethod
    def get_unique(target: MaterialCategory):
        # assert target.leaf is True
        obj, created = ClassTrend.objects.get_or_create(ref=target)
        return obj


class TrendModel(models.Model):
    record = JSONField(default=dict)

    def get_trend_by_date(self, beg: int, end: int) -> list:
        if not check_date(beg, end):
            return []
        else:
            result = []
            for m in months(beg // 100, beg % 100, end // 100, end % 100):

                try:
                    result.append({'date': m, 'data': self.record[str(m)]})
                except KeyError:
                    result.append({'date': m, 'data': [0, 0, 0, 0]})
            return result


class SubjectTrend(TrendModel):
    ref = models.OneToOneField(MaterialSubject, on_delete=models.CASCADE)

    @staticmethod
    def get_unique(target: MaterialSubject):
        # assert target.leaf is True
        obj, created = SubjectTrend.objects.get_or_create(ref=target)
        return obj

    def templates_related(self):
        template_id_list = DataMeta.OtherInfoHelper.get_template_id_list_filter_by_subject_id(self.ref.id)
        return Template.objects.filter(id__in=template_id_list)

    def categories_related(self):
        category_id_list = DataMeta.OtherInfoHelper.get_category_id_list_filter_by_subject_id(self.ref.id)
        return MaterialCategory.objects.filter(id__in=category_id_list)


class ProjectTrend(TrendModel):
    ref = models.OneToOneField(MaterialProject, on_delete=models.CASCADE)

    @staticmethod
    def get_unique(target: MaterialProject):
        # assert target.leaf is True
        obj, created = ProjectTrend.objects.get_or_create(ref=target)
        return obj

    def stat(self):
        template_count = len(DataMeta.OtherInfoHelper.get_template_id_list_filter_by_project_id(self.ref.id))
        update_list = [0, 0, 0, 0]
        for s in self.ref.materialsubject_set.all():
            subject_list = SubjectCounter.get_unique(s).to_list()
            update_list = [update_list[i] + subject_list[i] for i in range(4)]
        update_list[2] = template_count
        return update_list

    def templates_related(self):
        template_id_list = DataMeta.OtherInfoHelper.get_template_id_list_filter_by_project_id(self.ref.id)
        return Template.objects.filter(id__in=template_id_list)

    def categories_related(self):
        category_id_list = DataMeta.OtherInfoHelper.get_category_id_list_filter_by_project_id(self.ref.id)
        return MaterialCategory.objects.filter(id__in=category_id_list)
