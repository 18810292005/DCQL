import copy
from collections import defaultdict
from typing import List, Dict
import datetime
from apps.nql.executor import MGESearch
from apps.account.models import User
from apps.nql.executor.utils.utils import get_field_by_path_without_number, get_element, generate_path_for_es, \
    merge_nested_dicts
from apps.nql.logicplan.LogicalPlanNode import ColumnName, Limit
from apps.search.core_v2.helps import Service
from apps.search.core_v2.query import MultiTemplateQueryFactory
from apps.storage.models import Template, DataMeta
from apps.storage.models.template import TemplateField, TemplateFieldEnum
from mgedata.errors.models import MGEError
from apps.storage.models import MaterialCategory
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
        return res


class ScanExecutor(BaseExecutor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.conditions = kwargs.get("conditions", None)
        self.template_name = kwargs.get("template_name", None)
        self.limit = kwargs.get("num", None)
        if self.limit is None:
            self.limit = Limit(limit=50, offset=0)

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
        return {"data": [data]}

    def next(self):
        _query = MultiTemplateQueryFactory.produce(self._construct_query())
        print(_query)
        sr = Service.search(index='template_*', _query=_query, size=self.limit.limit, from_=self.limit.offset)
        _hits = sr['hits']['hits']
        res = []
        for d in _hits:
            res.append(d['_source']['content'])
        # print(res)
        return res


class SchemaExecutor(BaseExecutor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.template_name = kwargs.get("template_name", None)
        self.create_elements = kwargs.get("create_elements", None)
        self.type_elements = kwargs.get("type_elements", None)
        self.insert_elements = kwargs.get("insert_elements", None)
        self.insert_source = kwargs.get("insert_source", None)
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
                    head = single[2]
                elif single[0]=='string':
                    a.update(_str(single))
                    head = single[2]
                elif single[0]=='range':
                    a.update(_ran(single))
                    head = single[2]
                elif single[0]=='image':
                    a.update(_ima(single))
                    head = single[2]
                elif single[0]=='file':
                    a.update(_fil(single))
                    head = single[2]
                elif single[0]=='choice':
                    a.update(_cho(single))
                    head = single[2]
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
                    ord = single[2]
                elif single[0]=='string':
                    a.update(_str(single))
                    ord = single[2]
                elif single[0]=='range':
                    a.update(_ran(single))
                    ord = single[2]
                elif single[0]=='image':
                    a.update(_ima(single))
                    ord = single[2]
                elif single[0]=='file':
                    a.update(_fil(single))
                    ord = single[2]
                elif single[0]=='choice':
                    a.update(_cho(single))
                    ord = single[2]
                elif single[0] == 'table':
                    a.update(_tab(single))
                    ord = single[2]
                elif single[0] == 'container':
                    a.update(_con(single))
                    ord = single[2]
                elif single[0] == 'generator':
                    a.update(_gen(single))
                    ord = single[2]
                elif single[0] == 'array':
                    a.update(_arr(single))
                    ord = single[2]
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
                    opt = single[2]
                elif single[0] == 'string':
                    a.update(_str(single))
                    opt = single[2]
                elif single[0] == 'range':
                    a.update(_ran(single))
                    opt = single[2]
                elif single[0] == 'image':
                    a.update(_ima(single))
                    opt = single[2]
                elif single[0] == 'file':
                    a.update(_fil(single))
                    opt = single[2]
                elif single[0] == 'choice':
                    a.update(_cho(single))
                    opt = single[2]
                elif single[0] == 'table':
                    a.update(_tab(single))
                    opt = single[2]
                elif single[0] == 'container':
                    a.update(_con(single))
                    opt = single[2]
                elif single[0] == 'array':
                    a.update(_arr(single))
                    opt = single[2]
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
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 8, 'misc':_num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 8, 'misc':_str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 8, 'misc':_ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 8, 'misc':_ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 8, 'misc':_fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 8, 'misc':_cho(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
                        a.update({'r': False, 't': 8, 'misc': misc})
                elif single[0] == 'container':
                    if single[1] == '.':
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 9, 'misc':_num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 9, 'misc':_str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 9, 'misc':_ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 9, 'misc':_ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 9, 'misc':_fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 9, 'misc':_cho(single[2])})
                        elif single[2][0] == 'table':
                            a.update({'r': False, 't': 9, 'misc':_tab(single[2])})
                        elif single[2][0] == 'container':
                            a.update({'r': False, 't': 9, 'misc':_con(single[2])})
                        elif single[2][0] == 'generator':
                            a.update({'r': False, 't': 9, 'misc':_gen(single[2])})
                        elif single[2][0] == 'array':
                            a.update({'r': False, 't': 9, 'misc':_arr(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
                        a.update({'r': False, 't': 9, 'misc': misc})
                elif single[0] == 'generator':
                    if single[1] == '.':
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 10, 'misc':_num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 10, 'misc':_str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 10, 'misc':_ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 10, 'misc':_ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 10, 'misc':_fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 10, 'misc':_cho(single[2])})
                        elif single[2][0] == 'table':
                            a.update({'r': False, 't': 10, 'misc':_tab(single[2])})
                        elif single[2][0] == 'container':
                            a.update({'r': False, 't': 10, 'misc':_con(single[2])})
                        elif single[2][0] == 'array':
                            a.update({'r': False, 't': 10, 'misc':_arr(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 8, 'misc': _num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 8, 'misc': _str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 8, 'misc': _ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 8, 'misc': _ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 8, 'misc': _fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 8, 'misc': _cho(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
                        a.update({'r': False, 't': 8, 'misc': misc})
                elif single[0] == 'container':
                    if single[1] == '.':
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 9, 'misc': _num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 9, 'misc': _str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 9, 'misc': _ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 9, 'misc': _ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 9, 'misc': _fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 9, 'misc': _cho(single[2])})
                        elif single[2][0] == 'table':
                            a.update({'r': False, 't': 9, 'misc': _tab(single[2])})
                        elif single[2][0] == 'container':
                            a.update({'r': False, 't': 9, 'misc': _con(single[2])})
                        elif single[2][0] == 'generator':
                            a.update({'r': False, 't': 9, 'misc': _gen(single[2])})
                        elif single[2][0] == 'array':
                            a.update({'r': False, 't': 9, 'misc': _arr(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
                        a.update({'r': False, 't': 9, 'misc': misc})
                elif single[0] == 'generator':
                    if single[1] == '.':
                        if single[2][0] == 'number':
                            a.update({'r': False, 't': 10, 'misc': _num(single[2])})
                        elif single[2][0] == 'string':
                            a.update({'r': False, 't': 10, 'misc': _str(single[2])})
                        elif single[2][0] == 'range':
                            a.update({'r': False, 't': 10, 'misc': _ran(single[2])})
                        elif single[2][0] == 'image':
                            a.update({'r': False, 't': 10, 'misc': _ima(single[2])})
                        elif single[2][0] == 'file':
                            a.update({'r': False, 't': 10, 'misc': _fil(single[2])})
                        elif single[2][0] == 'choice':
                            a.update({'r': False, 't': 10, 'misc': _cho(single[2])})
                        elif single[2][0] == 'table':
                            a.update({'r': False, 't': 10, 'misc': _tab(single[2])})
                        elif single[2][0] == 'container':
                            a.update({'r': False, 't': 10, 'misc': _con(single[2])})
                        elif single[2][0] == 'array':
                            a.update({'r': False, 't': 10, 'misc': _arr(single[2])})
                    elif single[1] == '(':
                        misc = {}
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
        column = self.insert_source[0]
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
            if row[0] == 'string':
                dd.update({S:row[1]})
            if row[0] == 'number':
                num = []
                for i in row[1]:
                    num.append(float(i))
                dd.update({S:num})
            if row[0] == 'range':
                ran = []
                lbub = row[1]
                for i in lbub:
                    ran.append({'lb':i[0],'ub':i[1]})
                dd.update({S:ran})
            if row[0] == 'error':
                ran = []
                lbub = row[1]
                for i in lbub:
                    ran.append({'val': i[0], 'err': i[1]})
                dd.update({S: ran})
            if row[0] == 'file':
                arr = []
                file = row[1]
                for i in file:
                    path = []
                    path.append(i[0][1:-1])
                    arr.append(path)
                dd.update({S:arr})
            if row[0] == 'image':
                arr = []
                image = row[1]
                for i in image:
                    path = []
                    path.append(i[0][1:-1])
                dd.update({S: arr})
            if row[0] == 'choice':
                option = []
                choice = row[1:]
                for i in choice:
                    if len(i)>1:
                        option.append(i[2])
                    else:
                        option.append(i[0])
                dd.update({S:option})
            if row[0] == 'table':
                dd = {}
                dd.update(_tab(L,S))
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
                a.update(_con(l[i],column[i]))
            if l[i][0] == 'generator':
                a.update(_gen(l[i],column[i]))
            if l[i][0] == 'array':
                a.update(_arr(l[i],column[i]))
        return a

    def next(self):
        count = Template.objects.filter(title=self.template_name).count()
        try:
            print(DataMeta.objects.filter(title=self.template_name).all())
            if self.create_elements!=None:
                if count == 0:
                    z = self.L_to_D(self.create_elements)
                    print(z)
                    a = MaterialCategory(id=22)
                    p = Template(title=self.template_name,category=a,content=z,abstract='测试用例')
                    p.save(check_pk=False)
                else:
                    return 'template already exist'
            if self.insert_elements!=None:
                num = DataMeta.objects.filter(title=self.template_name).count()
                print(num)
                if num == 0:
                    data = self._insert_data(self.insert_elements)
                    print(data)
                    template = Template.objects.get(title=self.template_name)
                    print(template.id)
                    source = str(DataMeta.SourceHelper("self-production", "computation").representation())
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
                        source_key: source,
                        public_date_key: datetime.datetime.now(),
                        "category": category,
                        "public_range": "public",
                        "sync_version": 0,
                        "platform_belong": 0,
                    }
                    meta = template.add_data(meta_dict=meta, content_dict=data, uploaded_by='1366227360')
                else:
                    data = self._insert_data(self.insert_elements)
                    print(data)
                    template = Template.objects.get(title=self.template_name)
                    print(template.id)
                    source = str(DataMeta.SourceHelper("self-production", "computation").representation())
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
                        source_key: source,
                        public_date_key: datetime.datetime.now(),
                        "category": category,
                        "public_range": "public",
                        "sync_version": 0,
                        "platform_belong": 0,
                    }
                    met = DataMeta.objects.get(title=self.template_name)
                    meta = template.modify_data(met, meta_dict=meta, content_dict=data)
                return meta
        except:
            raise MGEError.BAD_TEMPLATE(f"no such template:{self.template_name}")
        if self.type_elements == 'drop':
            if count>0:
                Template.objects.filter(title=self.template_name).delete()
            else:
                return 'no such template'
        if self.type_elements == 'describe':
            if count>0:
                template = Template.objects.get(title=self.template_name)
                print(template.content)
                schema = self._pretty(self._convert(template.content))
                return schema
            else:
                return 'no such template'
        if self.type_elements == 'delete':
            num = DataMeta.objects.filter(title=self.template_name).count()
            if num>0:
                DataMeta.objects.get(title=self.template_name).delete()
                return 'delete over'
            else:
                return 'no data'
        #p = Template.objects.filter(title=self.template_name).count()
        #Template.objects.filter(title=self.template_name).delete()
        #use = User.objects.get(pk='1366227360')
        template = Template.objects.get(title=self.template_name)
        #print(template.content)
        print(template.id)
        source = str(DataMeta.SourceHelper("self-production", "computation").representation())
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
            source_key: source,
            public_date_key: datetime.datetime.now(),#2023-12-28,
            "category": category,
            "public_range": "public",
            "sync_version": 0,
            "platform_belong": 0,
        }
        #data = {'b':{'x':'this is a test','s':'test', 'c':{'lb':1, 'rb':2}}}
        #data = {'a':'(1,30)','b':'string1','c':[{'m':'string2','n':33}]}
        #data = {'b':[{'s': 35}]}
        #data = {'f':['28567639新建_文本文档.20240102173536.txt'], 'k':['28567639计205-42021075-陈梦阳-87.77.20240102173528.png']}
        #data = {'b':'c', 'd':'e'}
        #data = {'c':{'lb':1, 'ub':2}}
        #data = {'c':{'val':1, 'err':0.1}}
        #data = {'x':[{'lb':1, 'ub':2}]}
        #, 'x': [{'a': 'tab2', 'b': 'tab23', 'c': {'lb': 4, 'ub': 5}
        #data = {'a':{'b':'gen1', 'c':{'lb':1, 'ub':2}, 'l':[{'m':22}], 'x':[{'a': 'tab2'}]}}
        #data = {'a': {'l': [{'m': 22}, {'m': 33}, {'m': 44}]}}
        #meta = template.add_data(meta_dict=meta, content_dict=data ,uploaded_by='1366227360')
        #met = DataMeta.objects.get(title=self.template_name)
        #dd = DataMeta.objects.get(title=self.template_name)
        #print(dd.id)
        #dd.delete()
        #data = {'s':'sttte'}
        #meta = template.modify_data(met, meta_dict=meta, content_dict=data)
        #print(meta.id)
        #Template.add_data(template,meta_dict={'s': {'r': False, 't': 1, 'misc': {}}, '_ord': ['s'],'title':'cmy','abstract':'test'},content_dict={'s':'set'},uploaded_by='tl141_chen')
        #Template.objects.filter(title=self.template_name).update(content=test)
        schema = self._pretty(self._convert(template.content))
        return 'over'
