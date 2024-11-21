import copy,json
from collections import defaultdict
from typing import List, Dict
import datetime
from apps.nql.executor import MGESearch
from apps.account.models import User
from apps.nql.executor.utils.utils import get_field_by_path_without_number, get_element, generate_path_for_es, \
    merge_nested_dicts
from django.conf import settings
from apps.nql.logicplan.LogicalPlanNode import ColumnName, Limit
from apps.search.core_v2.helps import Service
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.search.core_v2.es import _transform_data_to_es, _insert_to_es, delete_meta_with_ids, update_field
from apps.storage.utils.serializers.json import JSONHandler, DataMode
from apps.storage.docs.data import *
from apps.storage.models import Template, DataMeta
from apps.storage.models.template import TemplateField, TemplateFieldEnum
from mgedata.errors.models import MGEError
from apps.storage.models.material import Category
from mgedata.utils.general import require_methods_api, json_response, load_request_body, get_json_field_r

class BaseExecutor():
    def __init__(self, **kwargs):
        self.children = kwargs.get("children", None)

    def next(self):
        pass


class FilterExecutor(BaseExecutor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.select_elements = kwargs.get("select_elements", None)
        self.template_name = kwargs.get("template_name", None)
        self.data_source: BaseExecutor = self.children[0]

    def next(self):
        datas: List = self.data_source.next()

        if len(datas) <= 0:
            return datas

        element_datas_group_by_id = defaultdict(list)
        res = []
        try:
            template = Template.objects.get(title=self.template_name)
        except:
            raise MGEError.BAD_TEMPLATE(f"no such template:{self.template_name}")
        if datas is None:
            return None
        for c in self.select_elements:
            if isinstance(c, str):
                if c == "*":
                    return datas
            elif isinstance(c, ColumnName):
                path = c.id
                for i, d in enumerate(datas):
                    element_datas_group_by_id[str(i)].append(get_element(d, generate_path_for_es(template, path)))
        for ds in element_datas_group_by_id.values():
            res.append(merge_nested_dicts(ds))
        print("datas",datas)
        print("res",res)
        return res


class ScanExecutor(BaseExecutor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.conditions = kwargs.get("conditions", None)
        self.template_name = kwargs.get("template_name", None)
        self.limit = kwargs.get("num", None)
        if self.limit is None:
            self.limit = Limit(limit=50, offset=0)
        self.column_name = kwargs.get("column_name", None)
        self.value = kwargs.get("value", None)

    def _construct_query(self):
        def _wrap(d):
            def _warp_leaf_field(rest_nodes, leaf_field, pre=""):
                if len(rest_nodes) == 0:
                    res = copy.deepcopy(leaf_field)
                    del res["nested"]
                    res["field"] = pre
                    return res
                rest_nodes_new = rest_nodes[1:]
                if pre != "":
                    current_path = pre + "." + rest_nodes[0]
                else:
                    current_path = rest_nodes[0]

                if rest_nodes[0].startswith("_"):
                    current_path += "." + rest_nodes_new[0]
                    rest_nodes_new = rest_nodes_new[1:]

                current_path_field: TemplateField = get_field_by_path_without_number(template=template,
                                                                                     path_old=current_path)
                if current_path_field is None:
                    raise MGEError.BAD_DATA(f"there is no path {current_path} in template")

                if current_path_field.field_type.is_es_in_array:
                    rest_nodes_new.insert(0, "_value")
                    if leaf_field.get("nested", "ALL") == "ALL":
                        nested_op = "all"
                    else:
                        nested_op = "exists"
                    # print(leaf_field)
                    return {"field": current_path, "op": nested_op,
                            "val": _warp_leaf_field(rest_nodes=rest_nodes_new, leaf_field=leaf_field, pre=current_path)}
                else:
                    return _warp_leaf_field(rest_nodes=rest_nodes_new, leaf_field=leaf_field, pre=current_path)

            # print(d)
            if "and" in d:
                return {"and": [_wrap(l) for l in d["and"]]}
            elif "or" in d:
                return {"or": [_wrap(l) for l in d["or"]]}
            elif "field" in d and "val" in d and "op" in d:
                nodes = str(d["field"]).split(".")
                return _warp_leaf_field(nodes, d)

        data = {}
        try:
            template = Template.objects.get(title=self.template_name)
        except:
            raise MGEError.BAD_TEMPLATE(f"no such template:{self.template_name}")
        data['tid'] = int(template.id)
        # print(self.conditions)
        if self.conditions is not None:
            query = _wrap(self.conditions.to_dict())
        else:
            query = None
        # print(query)
        data['q'] = query
        #print("data",data)
        return {"data": [data]}

    def simplefy_and_new_data(self,data,template,key,new_value):
        def update_value(data, template, key, new_value):
            # keys = key.split('.')
            k = key[0]
            if '[' in k:
                num = k.count('[')
                if num == 1:
                    simplek = k
                    simplek, index = simplek.split('[')
                    index = int(index.strip(']'))
                elif num == 2:
                    simplek = k
                    simplek, index1, index2 = simplek.split('[')
                    index1 = int(index1.strip(']'))
                    index2 = int(index2.strip(']'))
                typ = template.get(simplek, {})['t']
                children = template.get(simplek, {})['misc']
            else:
                typ = template.get(k, {})['t']
                children = template.get(k, {})['misc']
            # typ = template['t']
            if '[' in k:
                if typ == 7:
                    # 一维数组
                    if num == 1:
                        child_typ = children['t']
                        if child_typ == 1:
                            data[simplek][index] = str(new_value)
                        elif child_typ == 2:
                            data[simplek][index] = float(new_value)
                        elif child_typ == 3:
                            dictionary = json.loads(new_value)
                            data[simplek][index] = dictionary
                        elif child_typ == 4 or child_typ == 5:
                            lst = json.loads(new_value)
                            data[simplek][index] = lst
                        elif child_typ == 6:
                            data[simplek][index] = str(new_value)
                        elif child_typ == 8:
                            children = children.get('misc', {})
                            for i in data[simplek][index]:
                                update_value(i, children, key[1:], new_value)
                        elif child_typ == 9 or child_typ == 10:
                            children = children.get('misc', {})
                            update_value(data[simplek][index], children, key[1:], new_value)
                    # 多维数组
                    elif num == 2:
                        child_typ = children['t']
                        if child_typ == 8:
                            children = children.get('misc', {})
                            update_value(data[simplek][index1][index2], children, key[1:], new_value)
                if typ == 8 or typ == 9 or typ == 10:
                    current_dict = data.get(simplek, {})[index]
                    update_value(current_dict, children, key[1:], new_value)
                return data
            else:
                # 字符
                if typ == 1:
                    data[k] = str(new_value)
                # 数值
                if typ == 2:
                    data[k] = float(new_value)
                # 范围
                if typ == 3:
                    # range_type = children.get('type',{})
                    dictionary = json.loads(new_value)
                    data[k] = dictionary
                # 文件5和图片4
                if typ == 4 or typ == 5:
                    dictionary = json.loads(new_value)
                    data[k] = dictionary
                # 候选
                if typ == 6:
                    data[k] = str(new_value)
                # 数组
                if typ == 7:
                    child_typ = children['t']
                    if child_typ == 1:
                        for i in range(len(data[k])):
                            data[k][i] = str(new_value)
                    elif child_typ == 2:
                        for i in range(len(data[k])):
                            data[k][i] = float(new_value)
                    elif child_typ == 3:
                        for i in range(len(data[k])):
                            dictionary = json.loads(new_value)
                            data[k][i] = dictionary
                    elif child_typ == 4 or child_typ == 5:
                        for i in range(len(data[k])):
                            lst = json.loads(new_value)
                            data[k][i] = lst
                    elif child_typ == 6:
                        for i in range(len(data[k])):
                            data[k][i] = str(new_value)
                    elif child_typ == 8:
                        children = children.get('misc', {})
                        for i in data[k]:
                            for j in i:
                                update_value(j, children, key[1:], new_value)
                    elif child_typ == 9 or child_typ == 10:
                        children = children.get('misc', {})
                        for i in data[k]:
                            update_value(i, children, key[1:], new_value)
                # 表格
                if typ == 8:
                    child = data.get(k, {})
                    for i in child:
                        update_value(i, children, key[1:], new_value)
                # 容器
                if typ == 9:
                    update_value(data.get(k, {}), children, key[1:], new_value)
                # 生成器
                if typ == 10:
                    update_value(data.get(k, {}), children, key[1:], new_value)
                return data

        def simplify_data(data):
            if isinstance(data, dict):
                # 如果是字典类型，直接提取 '_value' 的值，否则递归处理每个键值对
                if '_value' in data:
                    return simplify_data(data['_value'])
                else:
                    return {key: simplify_data(value) for key, value in data.items()}
            elif isinstance(data, list):
                # 如果是列表类型，递归处理列表中的每个元素
                return [simplify_data(item) for item in data]
            else:
                # 基本数据类型，直接返回
                return data
        new_data = simplify_data(data[0])
        simplifydata = update_value(new_data,template,key,new_value)
        return simplifydata

    def next(self):
        template = Template.objects.get(title=self.template_name)
        tid = int(template.id)
        data_meta = DataMeta.objects.filter(template_id=tid)
        res = []
        for i in data_meta:
            result = i.to_dict()
            serializer = JSONHandler(mode=DataMode.WRITE, template=i.template)
            data_dict = serializer.data_to_dict(i,False)
            result['content'] = data_dict
            print("result",result)
            res.append(result['content'])
        print('con_query',self._construct_query())
        _query = MultiTemplateQueryFactory.produce(self._construct_query())
        print("query",_query)
        sr = Service.search(index=settings.ES_INDEX_NAME, _query=_query, size=self.limit.limit, from_=self.limit.offset)
        print('sr',sr)
        _hits = sr['hits']['hits']
        print('hits',_hits)
        #res = []
        # for d in _hits:
        #     res.append(d['_source']['content'])
        print("res",res)
        if self.column_name:
            for i in data_meta:
                data = DataContent.objects.get(pk=i.dc_id)
                data.update(set__data__num=self.value)
            # for d in _hits:
            #     print("333")
            #     _index = d['_index']
            #     _id = d['_id']
            #     keys = self.column_name.split('.')
            #     _template = Template.objects.get(title=self.template_name).content
            #     new_content = self.simplefy_and_new_data(res,_template,keys,self.value)
            #     _query = {"doc":{"content":new_content}}
            #     sr = Service.update(index=_index,id=_id, _query=_query)
            # old_data = res
            # keys = self.column_name.split('.')
            # template = Template.objects.get(title=self.template_name)
            # content = template.content
            # new_data = self.simplefy_and_new_data(old_data,content,keys,self.value)
            # source = str(DataMeta.SourceHelper("self-production", "computation").representation())
            # category = template.category
            # title = self.template_name
            # title_key = str("Title".lower())
            # abstract_key = str("Abstract".lower())
            # keywords_key = str("Keywords".lower())
            # source_key = str("Source".lower())
            # public_date_key = str("public_date")
            # meta = {
            #     title_key: title,
            #     abstract_key: "测试用例",
            #     keywords_key: ['test'],
            #     source_key: source,
            #     public_date_key: datetime.datetime.now(),
            #     "category": category,
            #     "public_range": "public",
            #     "sync_version": 0,
            #     "platform_belong": 0,
            # }
            # met = DataMeta.objects.filter(title=self.template_name)
            # for i in met:
            #     meta = template.modify_data(i, meta_dict=meta, content_dict=new_data)
            # meta = template.modify_data(met, meta_dict=meta, content_dict=new_data)
            # return meta
            return 'update successfully'
        else:
            return res


class SchemaExecutor(BaseExecutor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.template_name = kwargs.get("template_name", None)
        self.create_elements = kwargs.get("create_elements", None)
        self.type_elements = kwargs.get("type_elements", None)
        self.insert_elements = kwargs.get("insert_elements", None)
        self.insert_source = kwargs.get("insert_source", None)
        self.alter_elements = kwargs.get("alter_elements", None)
    def _convert(self, template):
        def _list(l: List):
            new_res = []
            for i in l:
                if isinstance(i, dict):
                    new_res.append(_dict(i))
                elif isinstance(i, list):
                    new_res.append(_list(i))
                else:
                    new_res.append(i)
            return new_res

        def _dict(d: Dict):
            new_d = copy.deepcopy(d)
            for key, item in d.items():
                if str(key).startswith("_"):
                    del new_d[key]
                elif isinstance(item, dict):
                    new_d[key] = _dict(item)
                elif isinstance(item, list):
                    new_d[key] = _list(item)
            return new_d

        return _dict(template)

    def _pretty(self, data: Dict):
        def _handle_type(d: Dict, pre=""):
            res = []
            for key, value in d.items():
                if key != "misc":
                    path = key if pre == "" else pre + "." + key
                else:
                    path = pre
                if key in ["t", "r", "unit"] or str(key).startswith("_"):
                    continue
                if isinstance(value, dict):
                    subs = _handle_type(value, path)
                    if len(subs) > 0:
                        res.extend(subs)
                    if "t" in value:
                        t = value['t']
                        type = str(TemplateFieldEnum(t))
                        if key == "misc":
                            res.append((path, "Element", type))
                        else:
                            res.append((path, "-", type))
            return res

        return "\n".join([f"{str(i[0])}\t{str(i[1])}\t{str(i[2])}" for i in _handle_type(data)])
    '''将逻辑计划转换为数据库可读的指令，再调用函数存入数据库'''
    def L_to_D(self, l: List):
        def _num(L: List):
            locat = L.index('number')
            unit = ''
            if 'unit' in L:
                unit = L[L.index('unit') + 2]
            dd = {L[locat + 2]: {'r': False, 't': 2, 'misc': {'unit': unit}}}
                # d.update({l[locat + 2]:{'r':False, 't':2, 'misc': {'unit':unit}}})
            return dd
        def _str(L: List):
            locat = L.index('string')
            dd = {L[locat + 2]:{'r':False, 't':1, 'misc': { }}}
            return dd
        def _ran(L: List):
            locat = L.index('range')
            unit = ''
            if 'unit' in L:
                unit = L[L.index('unit')+2]
            typ = ''
            if 'type' in L:
                typ = L[L.index('type')+2]
                if typ == 'range':
                    dd = {L[locat + 2]: {'r': False, 't': 3, 'misc': {'unit': unit, 'type': 0}}}
                elif typ == 'error':
                    dd = {L[locat + 2]: {'r': False, 't': 3, 'misc': {'unit': unit, 'type': 1}}}
            #dd = {L[locat + 2]:{'r':False, 't':3, 'misc': {'unit':unit,'type':typ}}}
            return dd
        def _ima(L: List):
            locat = L.index('image')
            dd = {L[locat + 2]:{'r':False, 't':4, 'misc': {"multi": 'False'}}}
            return dd
        def _fil(L: List):
            locat = L.index('file')
            dd = {L[locat + 2]:{'r':False, 't':5, 'misc': {"multi": 'False'}}}
            return dd
        def _cho(L: List):
            locat = L.index('choice')
            if L[3] == 'option':
                lst = L[6:-2]
                dd = {L[locat + 2]: {'r': False, 't': 6, 'misc':{'opt':lst, 'grp':[]}}}
            else:
                group = []
                lst = L[5:-1]
                for i in lst:
                    name = i[0]
                    item = i[1]
                    group.append({'name':name,'items':item})
                dd = {L[locat + 2]: {'r': False, 't': 6, 'misc':{'grp':group, 'opt':[]}}}
            return dd
        def _tab(L: List):
            a = {}
            head = []
            locat = L.index('table')
            if L[locat + 3]==')':
                single = L[locat + 5]
                if single[0]=='number':
                    a.update(_num(single))
                    head.append(single[2])
                elif single[0]=='string':
                    a.update(_str(single))
                    head.append(single[2])
                elif single[0]=='range':
                    a.update(_ran(single))
                    head.append(single[2])
                elif single[0]=='image':
                    a.update(_ima(single))
                    head.append(single[2])
                elif single[0]=='file':
                    a.update(_fil(single))
                    head.append(single[2])
                elif single[0]=='choice':
                    a.update(_cho(single))
                    head.append(single[2])
            else:
                for i in L:
                    if isinstance(i, list):
                        if i[0] == 'number':
                            a.update(_num(i))
                            head.append(i[2])
                        elif i[0] == 'string':
                            a.update(_str(i))
                            head.append(i[2])
                        elif i[0] == 'range':
                            a.update(_ran(i))
                            head.append(i[2])
                        elif i[0] == 'image':
                            a.update(_ima(i))
                            head.append(i[2])
                        elif i[0] == 'file':
                            a.update(_fil(i))
                            head.append(i[2])
                        elif i[0] == 'choice':
                            a.update(_cho(i))
                            head.append(i[2])
            a.update({'_head': head})
            dd = {L[locat + 2]:{'r':False, 't':8, 'misc': a}}
            return dd
        def _con(L: List):
            a = {}
            ord = []
            locat = L.index('container')
            if L[locat + 3]==')':
                single = L[locat + 5]
                if single[0]=='number':
                    a.update(_num(single))
                    ord.append(single[2])
                elif single[0]=='string':
                    a.update(_str(single))
                    ord.append(single[2])
                elif single[0]=='range':
                    a.update(_ran(single))
                    ord.append(single[2])
                elif single[0]=='image':
                    a.update(_ima(single))
                    ord.append(single[2])
                elif single[0]=='file':
                    a.update(_fil(single))
                    ord.append(single[2])
                elif single[0]=='choice':
                    a.update(_cho(single))
                    ord.append(single[2])
                elif single[0] == 'table':
                    a.update(_tab(single))
                    ord.append(single[2])
                elif single[0] == 'container':
                    a.update(_con(single))
                    ord.append(single[2])
                elif single[0] == 'generator':
                    a.update(_gen(single))
                    ord.append(single[2])
                elif single[0] == 'array':
                    a.update(_arr(single))
                    ord.append(single[2])
            else:
                for i in L:
                    if isinstance(i, list):
                        if i[0] == 'number':
                            a.update(_num(i))
                            ord.append(i[2])
                        elif i[0] == 'string':
                            a.update(_str(i))
                            ord.append(i[2])
                        elif i[0] == 'range':
                            a.update(_ran(i))
                            ord.append(i[2])
                        elif i[0] == 'image':
                            a.update(_ima(i))
                            ord.append(i[2])
                        elif i[0] == 'file':
                            a.update(_fil(i))
                            ord.append(i[2])
                        elif i[0] == 'choice':
                            a.update(_cho(i))
                            ord.append(i[2])
                        elif i[0] == 'table':
                            a.update(_tab(i))
                            ord.append(i[2])
                        elif i[0] == 'container':
                            a.update(_con(i))
                            ord.append(i[2])
                        elif i[0] == 'generator':
                            a.update(_gen(i))
                            ord.append(i[2])
                        elif i[0] == 'array':
                            a.update(_arr(i))
                            ord.append(i[2])
            a.update({'_ord': ord})
            dd = {L[locat + 2]:{'r':False, 't':9, 'misc': a}}
            return dd
        def _gen(L: List):
            a = {}
            opt = []
            locat = L.index('generator')
            if L[locat + 3] == ')':
                single = L[locat + 5]
                if single[0] == 'number':
                    a.update(_num(single))
                    opt.append(single[2])
                elif single[0] == 'string':
                    a.update(_str(single))
                    opt.append(single[2])
                elif single[0] == 'range':
                    a.update(_ran(single))
                    opt.append(single[2])
                elif single[0] == 'image':
                    a.update(_ima(single))
                    opt.append(single[2])
                elif single[0] == 'file':
                    a.update(_fil(single))
                    opt.append(single[2])
                elif single[0] == 'choice':
                    a.update(_cho(single))
                    opt.append(single[2])
                elif single[0] == 'table':
                    a.update(_tab(single))
                    opt.append(single[2])
                elif single[0] == 'container':
                    a.update(_con(single))
                    opt.append(single[2])
                elif single[0] == 'array':
                    a.update(_arr(single))
                    opt.append(single[2])
            else:
                for i in L:
                    if isinstance(i, list):
                        if i[0] == 'number':
                            a.update(_num(i))
                            opt.append(i[2])
                        elif i[0] == 'string':
                            a.update(_str(i))
                            opt.append(i[2])
                        elif i[0] == 'range':
                            a.update(_ran(i))
                            opt.append(i[2])
                        elif i[0] == 'image':
                            a.update(_ima(i))
                            opt.append(i[2])
                        elif i[0] == 'file':
                            a.update(_fil(i))
                            opt.append(i[2])
                        elif i[0] == 'choice':
                            a.update(_cho(i))
                            opt.append(i[2])
                        elif i[0] == 'table':
                            a.update(_tab(i))
                            opt.append(i[2])
                        elif i[0] == 'container':
                            a.update(_con(i))
                            opt.append(i[2])
                        elif i[0] == 'array':
                            a.update(_arr(i))
                            opt.append(i[2])
            print(opt)
            a.update({'_opt': opt})
            dd = {L[locat + 2]: {'r': False, 't': 10, 'misc': a}}
            return dd
        def _arr(L: List):
            a = {}
            locat = L.index('array')
            if L[locat + 3] == ')':
                single = L[locat + 5]
                if single[0] == 'number':
                    if 'unit' in single:
                        unit = single[single.index('unit') + 2]
                        a.update({'r': False, 't': 2, 'misc':{'unit':unit} })
                    else:
                        a.update({'r': False, 't': 2, 'misc':{}})
                elif single[0] == 'string':
                    a.update({'r': False, 't': 1, 'misc':{}})
                elif single[0] == 'range':
                    if 'unit' in single:
                        unit = single[single.index('unit') + 2]
                    if 'type' in single:
                        typ = single[single.index('type') + 2]
                    if typ == 'range':
                        a.update({'r': False, 't': 3, 'misc': {'unit': unit, 'type': 0}})
                    elif typ == 'error':
                        a.update({'r': False, 't': 3, 'misc': {'unit': unit, 'type': 1}})
                elif single[0] == 'image':
                    a.update({'r': False, 't': 4, 'misc':{"multi": 'False'}})
                elif single[0] == 'file':
                    a.update({'r': False, 't': 5, 'misc':{"multi": 'False'}})
                elif single[0] == 'choice':
                    if single[2] == 'option':
                        lst = single[5:-2]
                        a.update({'r': False, 't': 6, 'misc': {'opt':lst, 'grp':[]}})
                    elif single[2] == 'optiongroup':
                        group = []
                        lst = single[4:-1]
                        for i in lst:
                            name = i[0]
                            item = i[1]
                            group.append({'name': name, 'items': item})
                        a.update({'r': False, 't': 6, 'misc': {'grp': group, 'opt': []}})
                        #grpname = single[6]
                        #lst = single[8:-3]
                        #a.update({'r': False, 't': 6, 'misc': {'grp': [{'name': grpname, 'items': lst}], 'opt':[]}})
                elif single[0] == 'table':
                    if single[1] == '.':
                        misc = {}
                        head = single[2][2]
                        misc.update({'_head':head})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 8, 'misc':misc})
                    elif single[1] == '(':
                        misc = {}
                        head = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                head.append(i[2])
                                misc.update({'_head':head})
                        a.update({'r': False, 't': 8, 'misc': misc})
                elif single[0] == 'container':
                    if single[1] == '.':
                        ord = [single[2][2]]
                        misc = {}
                        misc.update({'_ord':ord})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'table':
                            misc.update(_tab(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'container':
                            misc.update(_con(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'generator':
                            misc.update(_gen(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                        elif single[2][0] == 'array':
                            misc.update(_arr(single[2]))
                            a.update({'r': False, 't': 9, 'misc':misc})
                    elif single[1] == '(':
                        misc = {}
                        ord = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                elif i[0] == 'table':
                                    misc.update(_tab(i))
                                elif i[0] == 'container':
                                    misc.update(_con(i))
                                elif i[0] == 'generator':
                                    misc.update(_gen(i))
                                elif i[0] == 'array':
                                    misc.update(_arr(i))
                                ord.append(i[2])
                                misc.update({'_ord': ord})
                        a.update({'r': False, 't': 9, 'misc': misc})
                elif single[0] == 'generator':
                    if single[1] == '.':
                        misc = {}
                        opt = [single[2][2]]
                        misc.update({'_opt':opt})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'table':
                            misc.update(_tab(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'container':
                            misc.update(_con(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                        elif single[2][0] == 'array':
                            misc.update(_arr(single[2]))
                            a.update({'r': False, 't': 10, 'misc':misc})
                    elif single[1] == '(':
                        misc = {}
                        opt = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                elif i[0] == 'table':
                                    misc.update(_tab(i))
                                elif i[0] == 'container':
                                    misc.update(_con(i))
                                elif i[0] == 'array':
                                    misc.update(_arr(i))
                                opt.append(i[2])
                                misc.update({'_opt': opt})
                        a.update({'r': False, 't': 10, 'misc': misc})
            else:
                single = L[locat + 3]
                if single[0] == 'number':
                    if 'unit' in single:
                        unit = single[single.index('unit') + 2]
                        a.update({'r': False, 't': 2, 'misc': {'unit':unit}})
                    else:
                        a.update({'r': False, 't': 2, 'misc': {}})
                elif single[0] == 'string':
                    a.update({'r': False, 't': 1, 'misc': {}})
                elif single[0] == 'range':
                    if 'unit' in single:
                        unit = single[single.index('unit') + 2]
                    if 'type' in single:
                        typ = single[single.index('type') + 2]
                    if typ == 'range':
                        a.update({'r': False, 't': 3, 'misc': {'unit': unit, 'type': 0}})
                    elif typ == 'error':
                        a.update({'r': False, 't': 3, 'misc': {'unit': unit, 'type': 1}})
                elif single[0] == 'image':
                    a.update({'r': False, 't': 4, 'misc': {"multi": 'False'}})
                elif single[0] == 'file':
                    a.update({'r': False, 't': 5, 'misc': {"multi": 'False'}})
                elif single[0] == 'choice':
                    if single[2] == 'option':
                        lst = single[5:-2]
                        a.update({'r': False, 't': 6, 'misc': {'opt':lst, 'grp':[]}})
                    elif single[2] == 'optiongroup':
                        group = []
                        lst = single[4:-1]
                        for i in lst:
                            name = i[0]
                            item = i[1]
                            group.append({'name': name, 'items': item})
                        a.update({'r': False, 't': 6, 'misc': {'grp': group, 'opt': []}})
                elif single[0] == 'table':
                    if single[1] == '.':
                        misc = {}
                        head = single[2][2]
                        misc.update({'_head': head})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 8, 'misc': misc})
                    elif single[1] == '(':
                        misc = {}
                        head = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                head.append(i[2])
                                misc.update({'_head': head})
                        a.update({'r': False, 't': 8, 'misc': misc})
                elif single[0] == 'container':
                    if single[1] == '.':
                        ord = [single[2][2]]
                        misc = {}
                        misc.update({'_ord': ord})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'table':
                            misc.update(_tab(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'container':
                            misc.update(_con(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'generator':
                            misc.update(_gen(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                        elif single[2][0] == 'array':
                            misc.update(_arr(single[2]))
                            a.update({'r': False, 't': 9, 'misc': misc})
                    elif single[1] == '(':
                        misc = {}
                        ord = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                elif i[0] == 'table':
                                    misc.update(_tab(i))
                                elif i[0] == 'container':
                                    misc.update(_con(i))
                                elif i[0] == 'generator':
                                    misc.update(_gen(i))
                                elif i[0] == 'array':
                                    misc.update(_arr(i))
                                ord.append(i[2])
                                misc.update({'_ord': ord})
                        a.update({'r': False, 't': 9, 'misc': misc})
                elif single[0] == 'generator':
                    if single[1] == '.':
                        misc = {}
                        opt = [single[2][2]]
                        misc.update({'_opt': opt})
                        if single[2][0] == 'number':
                            misc.update(_num(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'string':
                            misc.update(_str(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'range':
                            misc.update(_ran(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'image':
                            misc.update(_ima(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'file':
                            misc.update(_fil(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'choice':
                            misc.update(_cho(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'table':
                            misc.update(_tab(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'container':
                            misc.update(_con(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                        elif single[2][0] == 'array':
                            misc.update(_arr(single[2]))
                            a.update({'r': False, 't': 10, 'misc': misc})
                    elif single[1] == '(':
                        misc = {}
                        opt = []
                        for i in single:
                            if isinstance(i, list):
                                if i[0] == 'number':
                                    misc.update(_num(i))
                                elif i[0] == 'string':
                                    misc.update(_str(i))
                                elif i[0] == 'range':
                                    misc.update(_ran(i))
                                elif i[0] == 'image':
                                    misc.update(_ima(i))
                                elif i[0] == 'file':
                                    misc.update(_fil(i))
                                elif i[0] == 'choice':
                                    misc.update(_cho(i))
                                elif i[0] == 'table':
                                    misc.update(_tab(i))
                                elif i[0] == 'container':
                                    misc.update(_con(i))
                                elif i[0] == 'array':
                                    misc.update(_arr(i))
                                opt.append(i[2])
                                misc.update({'_opt': opt})
                        a.update({'r': False, 't': 10, 'misc': misc})
            dd = {L[locat + 2]: {'r': False, 't': 7, 'misc': a}}
            return dd
        res = {}
        _ord = []
        for i in l:
            if isinstance(i, list):
                if 'number' in i:
                    a = _num(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'string' in i:
                    a = _str(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'range' in i:
                    a = _ran(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'image' in i:
                    a = _ima(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'file' in i:
                    a = _fil(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'choice' in i:
                    a = _cho(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'table' in i:
                    a = _tab(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'container' in i:
                    a = _con(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'generator' in i:
                    a = _gen(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                elif 'array' in i:
                    a = _arr(i)
                    res.update(a)
                    for key in a:
                        _ord.append(key)
                else:
                    pass
        res.update({'_ord':_ord})
        return res

    def _insert_data(self, l: List):
        length = len(l)
        column = self.insert_source
        global store_dpeth
        store_dpeth = Template.objects.get(title=self.template_name).content
        print('template',store_dpeth)
        global is_arr
        is_arr = False
        def _num(L: List, S: str):
            dd = {S: float(L[1])}
            return dd
        def _str(L: List, S: str):
            dd = {S: L[1]}
            return dd
        def _ran(L: List, S: str):
            if L[3] == 'range':
                dd = {S:{'lb':float(L[-2]), 'ub':float(L[-1])}}
            else:
                dd = {S:{'val':float(L[-2]), 'err':float(L[-1])}}
            return dd
        def _cho(L: List, S: str):
            if len(L)>2:
                dd = {S:L[3]}
            else:
                dd = {S:L[1]}
            return dd
        def _fil(L: List, S: str):
            store = []
            for i in L[1:]:
                store.append(i)
            dd = {S: store}
            return dd
        def _ima(L: List, S: str):
            store = []
            for i in L[1:]:
                store.append(i)
            dd = {S: store}
            return dd
        def _tab(L: List, S: str):
            dd = []
            row = L[1:-1]
            column = L[-1]
            length = len(column)
            for i in row:
                row_content = {}
                for j in range(length):
                    if 'string' in i[j]:
                        row_content.update(_str(i[j], column[j]))
                    if 'number' in i[j]:
                        row_content.update(_num(i[j], column[j]))
                    if 'range' in i[j]:
                        row_content.update(_ran(i[j], column[j]))
                    if 'choice' in i[j]:
                        row_content.update(_cho(i[j], column[j]))
                    if 'file' in i[j]:
                        row_content.update(_fil(i[j], column[j]))
                    if 'image' in i[j]:
                        row_content.update(_ima(i[j], column[j]))
                dd.append(row_content)
            tab = {S:dd}
            return tab
        def _con(L: List, S: str):
            dd = {}
            row = L[1:-1]
            column = L[-1]
            length = len(column)
            for i in range(length):
                if 'string' in row[i]:
                    dd.update(_str(row[i], column[i]))
                if 'number' in row[i]:
                    dd.update(_num(row[i], column[i]))
                if 'range' in row[i]:
                    dd.update(_ran(row[i], column[i]))
                if 'choice' in row[i]:
                    dd.update(_cho(row[i], column[i]))
                if 'file' in row[i]:
                    dd.update(_fil(row[i], column[i]))
                if 'image' in row[i]:
                    dd.update(_ima(row[i], column[i]))
                if 'table' in row[i]:
                    dd.update(_tab(row[i], column[i]))
                if 'container' in row[i]:
                    dd.update(_con(row[i], column[i]))
                if 'array' in row[i]:
                    dd.update(_arr(row[i], column[i]))
                if 'generator' in row[i]:
                    dd.update(_gen(row[i], column[i]))
            tab = {S: dd}
            print('tab',tab)
            return tab
        def _gen(L: List, S: str):
            dd = {}
            row = L[1:-1]
            column = L[-1]
            length = len(column)
            for i in range(length):
                if 'string' in row[i]:
                    dd.update(_str(row[i], column[i]))
                if 'number' in row[i]:
                    dd.update(_num(row[i], column[i]))
                if 'range' in row[i]:
                    dd.update(_ran(row[i], column[i]))
                if 'choice' in row[i]:
                    dd.update(_cho(row[i], column[i]))
                if 'file' in row[i]:
                    dd.update(_fil(row[i], column[i]))
                if 'image' in row[i]:
                    dd.update(_ima(row[i], column[i]))
                if 'table' in row[i]:
                    dd.update(_tab(row[i], column[i]))
                if 'container' in row[i]:
                    dd.update(_con(row[i], column[i]))
                if 'array' in row[i]:
                    dd.update(_arr(row[i], column[i]))
            tab = {S: dd}
            return tab
        def _arr(L: List, S: str):
            dd = {}
            row = L[1:][0]
            print("row",row)
            global store_dpeth
            def _arrstr(LL: List, SS: str):
                dd = {SS:LL}
                return dd
            def _arrnum(LL: List, SS: str):
                num = []
                for i in LL:
                    num.append(float(i))
                dd = {SS: num}
                return dd
            def _arrran(LL: List, SS: str):
                ran = []
                for i in LL:
                    ran.append({'lb': i[0], 'ub': i[1]})
                dd.update({SS:ran})
                return dd
            def _arrerr(LL: List, SS: str):
                ran = []
                for i in LL:
                    ran.append({'val': i[0], 'err': i[1]})
                dd.update({SS:ran})
                return dd
            def _arrfil(LL: List, SS: str):
                arr = []
                for i in LL:
                    path = []
                    path.append(i[0][1:-1])
                    arr.append(path)
                dd.update({SS:arr})
                return dd
            def _arrcho(LL: List, SS: str):
                option = []
                for i in LL:
                    if len(i) > 1:
                        option.append(i[2])
                    else:
                        option.append(i[0])
                dd.update({SS: option})
                return dd
            def _arrtab(LL: List, SS: str):
                arr = []
                for i in LL:
                    tab = []
                    for j in i:
                        row = {}
                        for k in j:
                            if 'number' in k or 'string' in k:
                                row.update({k[0]:k[1]})
                            elif 'range' in k:
                                if k[3] == 'range':
                                    row.update({S: {'lb': float(L[-2]), 'ub': float(L[-1])}})
                        tab.append(row)
                    arr.append(tab)
                dd = {SS:arr}
                return dd
            def _arrgen(LL: List, SS: str):
                gen = []
                for i in LL:
                    row = {}
                    for j in i:
                        row.update({j[0]: j[1]})
                    gen.append(row)
                dd = {SS:gen}
                return dd
            if row[0] == 'string':
                dd.update(_arrstr(row[1],S))
            if row[0] == 'number':
                dd.update(_arrnum(row[1],S))
            if row[0] == 'range':
                dd.update(_arrran(row[1],S))
            if row[0] == 'error':
                dd.update(_arrerr(row[1],S))
            if row[0] == 'file':
                dd.update(_arrfil(row[1],S))
            if row[0] == 'image':
                dd.update(_arrfil(row[1],S))
            if row[0] == 'choice':
                dd.update(_arrcho(row[1:],S))
            if row[0] == 'table':
                head = store_dpeth[S]['misc']['_head']
                arrrow = row[1:]
                arrtab = []
                for i in arrrow:
                    ddd = {}
                    ii = i[:]
                    ii.insert(0,0)
                    ii.append(head)
                    ddd.update(_tab(ii,S))
                    arrtab.append(ddd[S])
                dd = {S:arrtab}
            if row[0] == 'generator':
                if '_opt' in store_dpeth[S]['misc']:
                    opt = store_dpeth[S]['misc']['_opt']
                else:
                    opt = store_dpeth[S]['misc']['misc']['_opt']
                arrrow = row[1:]
                arrgen = []
                for i in arrrow:
                    ddd = {}
                    ii = i[:]
                    ii.insert(0,0)
                    ii.append(opt)
                    ddd.update(_con(ii,S))
                    arrgen.append(ddd[S])
                dd = {S:arrgen}
            if row[0] == 'container':
                if '_ord' in store_dpeth[S]['misc']:
                    ord = store_dpeth[S]['misc']['_ord']
                else:
                    ord = store_dpeth[S]['misc']['misc']['_ord']
                arrrow = row[1:]
                arrcon = []
                for i in arrrow:
                    ddd = {}
                    ii = i[:]
                    ii.insert(0,0)
                    ii.append(ord)
                    ddd.update(_con(ii,S))
                    arrcon.append(ddd[S])
                dd = {S:arrcon}
            return dd
        a = {}
        for i in range(length):
            if l[i][0] == 'number':
                a.update(_num(l[i],column[i]))
            if l[i][0] == 'string':
                a.update(_str(l[i],column[i]))
            if l[i][0] == 'range':
                a.update(_ran(l[i],column[i]))
            if l[i][0] == 'choice':
                a.update(_cho(l[i],column[i]))
            if l[i][0] == 'file':
                a.update(_fil(l[i],column[i]))
            if l[i][0] == 'image':
                a.update(_ima(l[i],column[i]))
            if l[i][0] == 'table':
                a.update(_tab(l[i],column[i]))
            if l[i][0] == 'container':
                store_dpeth = store_dpeth[column[i]]['misc']
                print('temp-template',store_dpeth)
                a.update(_con(l[i],column[i]))
            if l[i][0] == 'generator':
                store_dpeth = store_dpeth[column[i]]['misc']
                print('temp-template',store_dpeth)
                a.update(_gen(l[i],column[i]))
            if l[i][0] == 'array':
                store_dpeth = {column[i]:store_dpeth[column[i]]['misc']}
                print('temp-template',store_dpeth)
                a.update(_arr(l[i],column[i]))
        #print(depth)
        return a
    #def next(self):
        #data = self._insert_data(self.insert_elements)
        #data = self.L_to_D(self.create_elements)
        #return data

    def next(self):
        #count = Template.objects.filter(title=self.template_name).count()
        try:
            #print(DataMeta.objects.filter(title=self.template_name).all())
            if self.create_elements!=None:
                count = Template.objects.filter(title=self.template_name).count()
                if count == 0:
                    z = self.L_to_D(self.create_elements)
                    print(z)
                    a = Category(id=1)
                    p = Template(title=self.template_name,category=a,content=z,abstract='测试用例',published=True,user_id='cmy')
                    p.save(check_pk=False)
                else:
                    p = Template.objects.get(title=self.template_name)
                    #p.content ={'b': {'r': False, 't': 10, 'misc': {'a': {'r': False, 't': 1, 'misc': {}}, 's': {'r': False, 't': 8, 'misc': {'x': {'r': False, 't': 2, 'misc': {'unit': ''}}, '_head': 'x'}}, '_opt': ['a', 's', 's']}}, '_ord': ['b']}
                    #p.save()
                    return 'template already exist'
            if self.insert_elements!=None:
                num = DataMeta.objects.filter(title=self.template_name).count()
                #print(num)
                data = self._insert_data(self.insert_elements)
                #data = {'s': 'test', 'n': 123.0, 'tab': [{'tabs': 'str1', 'tabr': {'lb': 3.0, 'ub': 4.0}}, {'tabs': 'str2', 'tabr': {'lb': 1.0, 'ub': 4.0}}], 'con': {'cons': 'str3'}}
                print("data",data)
                template = Template.objects.get(title=self.template_name)
                #print(template.id)
                # source = str(DataMeta.SourceHelper("self-production", "computation").representation())
                category = template.category
                title = self.template_name
                title_key = str("Title".lower())
                abstract_key = str("Abstract".lower())
                keywords_key = str("Keywords".lower())
                source_key = str("Source".lower())
                public_date_key = str("public_date")
                meta = {
                    title_key: title,
                    abstract_key: "测试用例",
                    keywords_key: ['test'],
                    public_date_key: datetime.datetime.now(),
                    "user_id": "cmy2",
                    "category": category,
                    "public_range": "public",
                    "sync_version": 0,
                    "platform_belong": 0,
                    "visibility":True,
                    "project":"1",
                    "subject":"2"
                }
                #print(meta)
                meta = template.add_data(meta_dict=meta, content_dict=data, uploaded_by='cmy')
                esdoc = _transform_data_to_es(meta=meta, template=template,content=data)
                #print('esdoc',esdoc,'type',type(esdoc))
                _insert_to_es(doc_list=[esdoc])
                #print('insert successfully')
                return 'insert successfully'
            if self.alter_elements != None:
                '''合并添加的模板到原模板中并且更新'''
                def merge_dicts(dict1, dict2):
                    for key in dict2:
                        if key not in dict1:
                            dict1[key] = dict2[key]
                        elif isinstance(dict1[key], dict) and isinstance(dict2[key], dict):
                            merge_dicts(dict1[key], dict2[key])
                        elif isinstance(dict1[key], list) and isinstance(dict2[key], list):
                            for value in dict2[key]:
                                if value not in dict1[key]:
                                    dict1[key].append(value)
                        else:
                            dict1[key] = dict2[key]
                '''删除列'''
                def drop_column(key, dict):
                    # print(dict)
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            drop_column(key[1:], new_dict)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            drop_column(key[1:], new_dict)
                    else:
                        del dict[k]
                        if '_ord' in dict:
                            dict['_ord'].remove(k)
                        elif '_opt' in dict:
                            dict['_opt'].remove(k)
                        elif '_head' in dict:
                            dict['_head'].remove(k)
                        #print(dict)
                        return dict
                '''删除单位'''
                def drop_unit(key, dict):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            drop_unit(key[1:], new_dict)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            drop_unit(key[1:], new_dict)
                        return dict
                    else:
                        #column = k.split('(')[0]
                        if 'unit' in dict[k]['misc']:
                            dict[k]['misc'].update({'unit': ''})
                        return dict
                '''删除选项'''
                def drop_choice(key, dict, choice):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            drop_choice(key[1:], new_dict, choice)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            drop_choice(key[1:], new_dict, choice)
                        return dict
                    else:
                        if '[' in k:
                            k = k.split('[')[0]
                            for i in choice:
                                dict[k]['misc']['misc']['opt'].remove(i)
                        else:
                            for i in choice:
                                dict[k]['misc']['opt'].remove(i)
                        return dict
                '''删除选项组内选项'''
                def drop_group(key, dict, gruop):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']['grp']
                            drop_group(key[1:], new_dict, gruop)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            drop_group(key[1:], new_dict, gruop)
                        return dict
                    else:
                        if '[' in k:
                            k = k.split('[')[0]
                            for i in gruop:
                                grp = i[0]
                                option = i[1]
                                for j in dict[k]['misc']['misc']['grp']:
                                    if j['name'] == grp:
                                        for l in option:
                                            j['items'].remove(l)
                        else:
                            for i in gruop:
                                grp = i[0]
                                option = i[1]
                                for j in dict[k]['misc']['grp']:
                                    if j['name'] == grp:
                                        for l in option:
                                            j['items'].remove(l)
                        return dict
                '''修改列名'''
                def alter_column(key, dict, alter):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            alter_column(key[1:], new_dict, alter)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            alter_column(key[1:], new_dict, alter)
                        return dict
                    else:
                        dict[alter] = dict.pop(k)
                        if '_ord' in dict:
                            if isinstance(dict['_ord'], list):
                                index = dict['_ord'].index(k)
                                dict['_ord'][index] = alter
                            else:
                                dict['_ord'] = alter
                        elif '_opt' in dict:
                            if isinstance(dict['_opt'], list):
                                index = dict['_opt'].index(k)
                                dict['_opt'][index] = alter
                            else:
                                dict['_opt'] = alter
                        elif '_head' in dict:
                            if isinstance(dict['_head'], list):
                                index = dict['_head'].index(k)
                                dict['_head'][index] = alter
                            else:
                                dict['_head'] = alter
                        return dict
                '''修改单位'''
                def alter_unit(key, dict, alter):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            alter_unit(key[1:], new_dict, alter)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            alter_unit(key[1:], new_dict, alter)
                        return dict
                    else:
                        if '[' in k:
                            k = k.split('[')[0]
                            if 'unit' in dict[k]['misc']['misc']:
                                dict[k]['misc']['misc'].update({'unit': alter})
                        else:
                            if 'unit' in dict[k]['misc']:
                                dict[k]['misc'].update({'unit': alter})
                        return dict
                '''修改选项'''
                def alter_choice(key, dict, choice, new_choice):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']
                            alter_choice(key[1:], new_dict, choice)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            alter_choice(key[1:], new_dict, choice)
                        return dict
                    else:
                        if '[' in k:
                            k = k.split('[')[0]
                            for i in range(len(choice)):
                                index = dict[k]['misc']['misc']['opt'].index(choice[i])
                                dict[k]['misc']['misc']['opt'][index] = new_choice[i]
                        else:
                            for i in range(len(choice)):
                                index = dict[k]['misc']['opt'].index(choice[i])
                                dict[k]['misc']['opt'][index] = new_choice[i]
                        return dict
                '''修改选项组信息'''
                def alter_group(key, dict, gruop, new_group):
                    k = key[0]
                    if len(key) > 1:
                        if '[' in k:
                            k = k.split('[')[0]
                            new_dict = dict.get(k, {})['misc']['misc']['grp']
                            alter_group(key[1:], new_dict, gruop, new_group)
                        else:
                            new_dict = dict.get(k, {})['misc']
                            alter_group(key[1:], new_dict, gruop, new_group)
                        return dict
                    else:
                        if '[' in k:
                            k = k.split('[')[0]
                            for i in range(len(gruop)):
                                grp = gruop[i][0]
                                option = gruop[i][1]
                                newgrp = new_group[i][0]
                                newoption = new_group[i][1]
                                for j in dict[k]['misc']['misc']['grp']:
                                    if j['name'] == grp:
                                        j['name'] = newgrp
                                        for l in range(len(option)):
                                            index = j['items'].index(option[l])
                                            j['items'][index] = newoption[l]
                        else:
                            for i in range(len(gruop)):
                                grp = gruop[i][0]
                                option = gruop[i][1]
                                newgrp = new_group[i][0]
                                newoption = new_group[i][1]
                                for j in dict[k]['misc']['grp']:
                                    if j['name'] == grp:
                                        j['name'] = newgrp
                                        for l in range(len(option)):
                                            index = j['items'].index(option[l])
                                            j['items'][index] = newoption[l]
                        return dict
                '''判断操作几个模板名对象，然后分情况对模板进行更改'''
                if isinstance(self.template_name,list):
                    for i in self.template_name:
                        p = Template.objects.get(title=i)
                        new_content = p.content
                        for j in self.alter_elements:
                            if j[0] == 'add':
                                add_content = self.L_to_D(j[1:])
                                merge_dicts(new_content,add_content)
                                print(new_content)
                                p.content = new_content
                                p.save()
                            elif j[0] == 'drop':
                                pass
                else:
                    p = Template.objects.get(title=self.template_name)
                    new_content = p.content
                    for j in self.alter_elements:
                        if j[0] == 'add':
                            add = self.L_to_D(j[1:])
                            merge_dicts(new_content, add)
                            print(new_content)
                            p.content = new_content
                            p.save()
                        elif j[0] == 'drop':
                            drop = j[1:]
                            for k in drop:
                                if len(k)==1:
                                    key = k[0].split('.')
                                    drop_column(key,new_content)
                                elif len(k)==4:
                                    key = k[0].split('.')
                                    drop_unit(key,new_content)
                                else:
                                    key = k[0].split('.')
                                    choice = k[1]
                                    if choice[0] == 'option':
                                        option = choice[3:-1]
                                        drop_choice(key,new_content,option)
                                    else:
                                        group = choice[2:]
                                        drop_group(key,new_content,group)
                                    #print(choice)
                            p.content = new_content
                            p.save()
                        elif j[0] == 'alter':
                            alter = j[1:]
                            for k in alter:
                                if len(k) == 2:
                                    key = k[0].split('.')
                                    alter_column(key,new_content,k[1])
                                elif k[1][0].lower() == 'optiongroup':
                                    key = k[0].split('.')
                                    group = k[1][2:]
                                    new_group = k[2][2:]
                                    alter_group(key,new_content,group,new_group)
                                elif k[1][0].lower() == 'option':
                                    key = k[0].split('.')
                                    choice = k[1][3:-1]
                                    new_choice = k[2][3:-1]
                                    alter_choice(key,new_content,choice,new_choice)
                                else:
                                    key = k[0].split('.')
                                    alter = k[7]
                                    #print(alter)
                                    alter_unit(key,new_content,alter)
                            p.content = new_content
                            p.save()
                return "alter success"
        except:
            raise MGEError.BAD_TEMPLATE(f"no such template:{self.template_name}")
        if self.type_elements == 'drop':
            count = Template.objects.filter(title=self.template_name).count()
            if count>0:
                Template.objects.filter(title=self.template_name).delete()
                return 'drop success'
            else:
                return 'no such template'
        if self.type_elements == 'describe':
            count = Template.objects.filter(title=self.template_name).count()
            if count>0:
                template = Template.objects.get(title=self.template_name)
                print(template.content)
                schema = self._pretty(self._convert(template.content))
                return schema
            else:
                return 'no such template'
        if self.type_elements == 'delete':
            template = Template.objects.get(title=self.template_name)
            tid = int(template.id)
            num = DataMeta.objects.filter(template_id=tid).count()
            #print(DataMeta.objects.get(title=self.template_name).to_dict())
            if num>0:
                delete_meta = DataMeta.objects.filter(template_id=tid)
                ids = []
                for i in delete_meta:
                    ids.append(i.id)
                delete_meta.delete()
                delete_meta_with_ids(meta_ids=ids)
                #update_field()
                return 'delete over'
            else:
                return 'no data'
        #p = Template.objects.filter(title=self.template_name).count()
        #Template.objects.filter(title=self.template_name).delete()
        #use = User.objects.get(pk='1366227360')
        template = Template.objects.get(title=self.template_name)
        #print(template.content)
        print(template.id)
        category = template.category
        title = self.template_name
        title_key = str("Title".lower())
        abstract_key = str("Abstract".lower())
        keywords_key = str("Keywords".lower())
        source_key = str("Source".lower())
        public_date_key = str("public_date")
        meta = {
            title_key: title,
            abstract_key: "测试用例",
            keywords_key: ['test'],
            public_date_key: datetime.datetime.now(),#2023-12-28,
            "user_id": "admin",
            "category": category,
            "published": True,
            "public_range": "public",
            "sync_version": 0,
            "platform_belong": 0,
        }
        #data = {'b':{'x':'this is a test','s':'test', 'c':{'lb':1, 'rb':2}}}
        #data = {'a':'(1,30)','b':'string1','c':[{'m':'string2','n':33}]}
        #data = {'f':['28567639新建_文本文档.20240102173536.txt'], 'k':['28567639计205-42021075-陈梦阳-87.77.20240102173528.png']}
        #data = {'c':{'lb':1, 'ub':2}}
        #data = {'c':{'val':1, 'err':0.1}}
        #data = {'a':{'b':'gen1', 'c':{'lb':1, 'ub':2}, 'l':[{'m':22}], 'x':[{'a': 'tab2'}]}}
        #data = {'a': {'l': [{'m': 22}, {'m': 33}, {'m': 44}]}}
        #meta = template.add_data(meta_dict=meta, content_dict=data ,uploaded_by='1366227360')
        #met = DataMeta.objects.get(title=self.template_name)
        #dd = DataMeta.objects.get(title=self.template_name)
        #print(dd.id)
        #dd.delete()
        #meta = template.modify_data(met, meta_dict=meta, content_dict=data)
        #print(meta.id)
        #Template.add_data(template,meta_dict={'s': {'r': False, 't': 1, 'misc': {}}, '_ord': ['s'],'title':'cmy','abstract':'test'},content_dict={'s':'set'},uploaded_by='tl141_chen')
        #Template.objects.filter(title=self.template_name).update(content=test)
        schema = self._pretty(self._convert(template.content))
        return 'over'




