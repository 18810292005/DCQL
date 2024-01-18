from json import JSONDecodeError

import requests
from django.db import connection
from django.db.models import Q

from apps.storage.docs import DataContent, DataFieldContainer, DataFieldTableRow, DataFieldTable
from apps.storage.models import DataMeta, FileUsage, ImageUsage, MaterialCategory, Template
from apps.storage.models.data import DataReviewState
from mgedata.errors.models import MGEError

ADDITIONAL_TEMPLATE_IDs = (2662,)
ADDITIONAL_URL = 'http://10.0.4.210/admin/interface!getExampleStatistic.action'


class StatisticCollector:
    def __init__(self, ps_id, is_project, dummy, is_public):
        self._research_tid_list = []
        self._research = {}
        try:
            research_cat = MaterialCategory.objects.get(name_zh='科研成果')
        except MaterialCategory.DoesNotExist:
            raise MGEError.NOT_FOUND("找不到科研成果分类，请联系管理员")
        self._research_tid_list = list(Template.objects.filter(category=research_cat).values_list('id', flat=True))
        self._tid_data_count_map = {}
        self._tid_table_count_map = {}
        self._tid_field_count_map = {}
        self._tid_data_size_map = {}
        self._tid_file_count_map = {}
        self._tid_image_count_map = {}
        self._tid_image_size_map = {}
        self._tid_file_size_map = {}
        self._tid_data_map= {}
        self._template_id_list = []
        self._all_id_list = []
        self._ps_id = ps_id
        self._is_project = is_project
        self._dummy = dummy
        self._is_public = is_public
        # _q init阶段里没有用到
        self._q = ~Q(template_id__in=self._research_tid_list)
        if is_project:
            self._other_info_q = Q(other_info__project=ps_id)
        else:
            self._other_info_q = Q(other_info__subject=ps_id)
        self._q &= self._other_info_q & Q(review_state=DataReviewState.APPROVED)
        if is_public:
            self._q &= Q(public_range='public')
        else:
            self._q &= ~Q(public_range='public')
        
        if is_project:
            results = self.get_templateid_dataid_group_by_project_and_not_in_research(ps_id, self._research_tid_list, is_public)
        else:
            results = self.get_templateid_dataid_group_by_subject_and_not_in_research(ps_id, self._research_tid_list, is_public)
        # results是一个元组list，每个元组有两项，第一项是template_id,第二项是改template下的data_id list
        for x in results:
            self._template_id_list.append(x[0])
            self._all_id_list = self._all_id_list + x[1]
            self._tid_data_map[x[0]] = x[1]
            self._tid_data_count_map[x[0]] = len(x[1])

        self._total_data_count = len(self._all_id_list)

        if dummy:
            import random
            for _map in (
                    self._tid_table_count_map,
                    self._tid_field_count_map,
                    self._tid_file_count_map,
                    self._tid_image_count_map,
                    self._tid_image_size_map,
                    self._tid_file_size_map
            ):
                for tid in self._template_id_list:
                    _map[tid] = random.randint(1, 100000)

    def get_templateid_dataid_group_by_subject_and_not_in_research(self, subject_id, research_tid_list, is_public):
        new_research = [str(x) for x in research_tid_list]
        research_str = "(" + ",".join(new_research) + ")"
        subject = "'" + "{" + "\"subject\":\"{subject}\"".format(subject=subject_id) + "}" + "'"
        if is_public:
            public_range = "AND \"storage_datameta\".\"public_range\" = \'public\')"
        else:
            public_range = "AND NOT \"storage_datameta\".\"public_range\" = \'public\')"
        
        with connection.cursor() as cursor:
            sql = "SELECT \"storage_datameta\".\"template_id\", array_agg(\"storage_datameta\".\"id\") \
            FROM \"storage_datameta\"\
            WHERE (\"storage_datameta\".\"deleted\" = false AND \
            \"storage_datameta\".\"importing\" = false AND NOT\
            (\"storage_datameta\".\"template_id\" IN "+ research_str +\
            " AND \"storage_datameta\".\"template_id\" IS NOT NULL) AND" \
            + " (\"storage_datameta\".\"other_info\" @> "\
            + f"{subject}" + ") AND \
                \"storage_datameta\".\"review_state\" = 1 " \
            + public_range\
            +"group by \"storage_datameta\".\"template_id\""
            cursor.execute(sql)
            result = cursor.fetchall()

        return result

    def get_templateid_dataid_group_by_project_and_not_in_research(self, project_id, research_tid_list, is_public):
        new_research = [str(x) for x in research_tid_list]
        research_str = "(" + ",".join(new_research) + ")"
        project = "'" + "{" + "\"project\":\"{project}\"".format(project=project_id) + "}" + "'"
        if is_public:
            public_range = "AND \"storage_datameta\".\"public_range\" = \'public\')"
        else:
            public_range = "AND NOT \"storage_datameta\".\"public_range\" = \'public\')"
        
        with connection.cursor() as cursor:
            sql = "SELECT \"storage_datameta\".\"template_id\", array_agg(\"storage_datameta\".\"id\") \
            FROM \"storage_datameta\"\
            WHERE (\"storage_datameta\".\"deleted\" = false AND \
            \"storage_datameta\".\"importing\" = false AND NOT\
            (\"storage_datameta\".\"template_id\" IN "+ research_str +\
            " AND \"storage_datameta\".\"template_id\" IS NOT NULL) AND" \
            + " (\"storage_datameta\".\"other_info\" @> "\
            + f"{project}" + ") AND \
                \"storage_datameta\".\"review_state\" = 1 " \
            + public_range\
            +"group by \"storage_datameta\".\"template_id\""
            cursor.execute(sql)
            result = cursor.fetchall()

        return result
    
    def get_research(self):
        return self._research

    def data_updated_since(self, time):
        return DataMeta.objects.filter(Q(add_time__gte=time) & self._q).count() != 0

    def get_data_count(self, template_id):
        return self._tid_data_count_map.get(template_id, 0)

    def get_data_size(self, template_id):
        return self._tid_data_size_map.get(template_id, 0) + self.get_file_size(template_id) + self.get_image_size(
            template_id)

    def get_file_size(self, template_id):
        return self._tid_file_size_map.get(template_id, 0) or 0

    def get_image_size(self, template_id):
        return self._tid_image_size_map.get(template_id, 0) or 0

    def get_file_count(self, template_id):
        return self._tid_file_count_map.get(template_id, 0)

    def get_image_count(self, template_id):
        return self._tid_image_count_map.get(template_id, 0)

    def get_field_count(self, template_id):
        return self._tid_field_count_map.get(template_id, 0)

    def get_table_count(self, template_id):
        return self._tid_table_count_map.get(template_id, 0)

    @property
    def total_data_count(self):
        return self._total_data_count

    @property
    def total_data_size(self):
        return sum(self._tid_data_size_map.values()) + self.total_file_size + self.total_image_size

    @property
    def total_table_count(self):
        return sum(self._tid_table_count_map.values())

    @property
    def total_image_count(self):
        return sum(self._tid_image_count_map.values())

    @property
    def total_image_size(self):
        return sum(self._tid_image_size_map.values())

    @property
    def total_file_count(self):
        return sum(self._tid_file_count_map.values())

    @property
    def total_file_size(self):
        return sum(self._tid_file_size_map.values())

    @property
    def template_id_list(self):
        return list(set(self._template_id_list) - set(self._research_tid_list))

    @property
    def total_field_count(self):
        return sum(self._tid_field_count_map.values())

    def do_mongo_count(self):
        if self._dummy:
            return

        def batch(batch_size=1000000):
            _len = len(self._all_id_list)
            for ndx in range(0, _len, batch_size):
                yield self._all_id_list[ndx:min(ndx + batch_size, _len)]

        map_func = """
                   function() {
                       for (var key in this) {
                           if (!key.startsWith('_'))
                               emit(this._tid, 1);;
                           }
                       }
                   """
        reduce_func = "function(key, values) { return Array.sum(values); }"
        for cur_list in batch():
            # 统计所有容器中的字段数，按照模板统计
            container_mr = DataFieldContainer.objects(_meta_id__in=cur_list).map_reduce(map_f=map_func,
                                                                                        reduce_f=reduce_func,
                                                                                        output='inline')
            # 统计所有根数据的字段数，按照模板统计
            root_mr = DataContent.objects(_meta_id__in=cur_list).map_reduce(map_f=map_func,
                                                                            reduce_f=reduce_func,
                                                                            output='inline')
            for table in (root_mr, container_mr):
                for doc in table:
                    if int(doc.key) not in self._tid_field_count_map:
                        self._tid_field_count_map[int(doc.key)] = 0
                    self._tid_field_count_map[int(doc.key)] += doc.value

        for tid in self._template_id_list:
            self._tid_table_count_map[tid] = DataFieldTable.objects(_tid=tid).count()

    def do_mongo_size(self):
        if self._dummy:
            return
        map_func = """
                      function() {
                            emit(this._tid, Object.bsonsize(this));
                        }
                    """
        reduce_func = "function(key, values) { return Array.sum(values); }"

        def batch(batch_size=1000000):
            _len = len(self._all_id_list)
            for ndx in range(0, _len, batch_size):
                yield self._all_id_list[ndx:min(ndx + batch_size, _len)]

        for cur_list in batch():

            # 统计所有容器的容量，按照模板统计
            container_mr = DataFieldContainer.objects(_meta_id__in=cur_list).map_reduce(map_f=map_func,
                                                                                        reduce_f=reduce_func,
                                                                                        output='inline')

            # 统计所有根数据的容量，按照模板统计
            root_mr = DataContent.objects(_meta_id__in=cur_list).map_reduce(map_f=map_func,
                                                                            reduce_f=reduce_func,
                                                                            output='inline')
            # 统计所有表格的容量，按照模板统计

            table_mr = DataFieldTableRow.objects(_meta_id__in=cur_list).map_reduce(map_f=map_func,
                                                                                   reduce_f=reduce_func,
                                                                                   output='inline')
            for table in (root_mr, container_mr, table_mr):
                for doc in table:
                    if int(doc.key) not in self._tid_data_size_map:
                        self._tid_data_size_map[int(doc.key)] = 0
                    self._tid_data_size_map[int(doc.key)] += doc.value

    def do_file(self):
        if self._dummy:
            return
        for tid in self._template_id_list:
            meta_id_list = self._tid_data_map[tid]
            self._tid_file_count_map[tid] = FileUsage.objects.filter(meta_id__in=meta_id_list).count()
            self._tid_image_count_map[tid] = ImageUsage.objects.filter(meta_id__in=meta_id_list).count()
            sql = "select Sum(size) from (select meta_id, size from storage_fileusage left join " \
                  "storage_datacontentfile as sd on file_id = sd.id where meta_id = ANY(%s)) as f "
            with connection.cursor() as cursor:
                cursor.execute(sql, [meta_id_list])
                row = cursor.fetchone()
                self._tid_file_size_map[tid] = int(row[0] or 0)
            sql = "select Sum(size) from (select meta_id, size from storage_imageusage left join " \
                  "storage_datacontentimage as sd on file_id = sd.id where meta_id = ANY(%s)) as f "
            with connection.cursor() as cursor:
                cursor.execute(sql, [meta_id_list])
                row = cursor.fetchone()
                self._tid_image_size_map[tid] = int(row[0] or 0)

    def do_research(self):
        for template in Template.objects.filter(id__in=self._research_tid_list):
            if self._is_public:
                q = Q(public_range='public')
            else:
                q = ~Q(public_range='public')
            self._research[template.id] = DataMeta.objects.filter(
                self._other_info_q & Q(template=template, review_state=DataReviewState.APPROVED) & q).count()

    def do_additional_size(self):
        if self._is_project:
            key = 'projectId'
        else:
            key = 'taskId'
        for tid in ADDITIONAL_TEMPLATE_IDs:
            try:
                res = requests.get(ADDITIONAL_URL, {'templateId': tid, key: self._ps_id})
                res = res.json()
            except JSONDecodeError:
                raise MGEError.THIRD_PARTY_REQUEST_FAILED(f"计算中心统计接口调用失败, 错误: {str(res.content)}")
            except Exception as e:
                raise MGEError.THIRD_PARTY_REQUEST_FAILED(f"计算中心统计接口调用失败, 错误: {str(e)}")
            if self._is_public:
                key = 'publicData'
            else:
                key = 'privateData'
            size = res['data'][key]['fileSize']
            old_size = self._tid_data_size_map.get(tid, 0)
            old_size += size
            self._tid_data_size_map[tid] = old_size
