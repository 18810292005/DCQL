import copy
from typing import List, Dict

from apps.storage.models import Template
from apps.storage.models.template import TemplateField
from mgedata.errors.models import MGEError


def get_field_by_path_without_number(template: Template, path_old):
    path = ".".join([l for l in str(path_old).split(".") if not l.startswith("_")])
    # print(path)
    template_path_field_mapping = template.field_path_str_field_map
    # print(template_path_field_mapping)
    template_path_field_mapping = dict(
        sorted(template_path_field_mapping.items(), key=lambda x: len(x[0]), reverse=True))
    user_path_path_str_mapping = {".".join([part for part in item.split(".") if not part.isdigit()]): item for item in
                                  template_path_field_mapping.keys()}
    # print(user_path_path_str_mapping)
    # print(user_path_path_str_mapping.get(path,""))
    template_field = template_path_field_mapping.get(user_path_path_str_mapping.get(path, ""), None)
    # print(template_field)
    return template_field


def generate_path_for_es(template: Template, path):
    def _wrap(rest_nodes, pre=""):
        if len(rest_nodes) == 0:
            return pre
        rest_nodes_new = rest_nodes[1:]
        if pre != "":
            current_path = pre + "." + rest_nodes[0]
        else:
            current_path = rest_nodes[0]

        if rest_nodes[0].startswith("_"):
            current_path += "." + rest_nodes_new[0]
            rest_nodes_new = rest_nodes_new[1:]

        # print(current_path)
        current_path_field: TemplateField = get_field_by_path_without_number(template=template,
                                                                             path_old=current_path)
        if current_path_field is None:
            return {}

        if current_path_field.field_type.is_es_in_array:
            rest_nodes_new.insert(0, "_value")
        return _wrap(rest_nodes=rest_nodes_new, pre=current_path)

    nodes = str(path).split(".")
    return _wrap(nodes)


def get_element(data: dict, key: str, default='', type='s'):
    """
    循环遍历key, 用##号分割数据
    如_value##晶体各向异性
    """

    def _get_from_any(content, key_list: List):
        if len(key_list) == 0:
            return content
        if isinstance(content, dict):
            return _get_from_dict(content, key_list)
        elif isinstance(content, list):
            return _get_from_list(content, key_list)

    def _get_from_dict(content: Dict, key_list: List):
        key_list_new = copy.deepcopy(key_list)
        key = key_list_new.pop(0)
        d = content.get(key)
        return {key: _get_from_any(d, key_list_new)}

    def _get_from_list(content, key_list: List):
        new_res = []
        for d in content:
            new_res.append(_get_from_any(d, key_list))
        return new_res

    try:
        key_list = key.split('.')
        try:
            value = _get_from_any(data, key_list)
        except:
            value = default
        return value
    except KeyError:
        pass
    return default


def merge_nested_dicts(dicts: List[Dict], handle_list_dict_nested=True):
    res = {}
    for d in dicts:
        res = merge_two_nested_dict(res, d, handle_list_dict_nested)
    return res


def merge_two_nested_dict(dict1, dict2, handle_list_dict_nested=True):
    dict_new = copy.deepcopy(dict1)
    for k, v in dict2.items():
        if k in dict1.keys():
            if isinstance(v, dict):
                dict_new[k] = merge_two_nested_dict(dict_new[k], v, handle_list_dict_nested)
            elif isinstance(v, list):
                dict_new[k] = _merge_two_list(dict_new[k], v, handle_list_dict_nested)
            else:
                dict_new[k] = v
        else:
            dict_new[k] = v
    return dict_new


# 合并两个list。如果list中的元素不一致，则报错。如果list中的元素是dict，则调用merge_two_nested_dict
def _merge_two_list(list1, list2, handle_list_dict_nested):
    list1_type = type(list1[0])
    list2_type = type(list2[0])
    if list1_type != list2_type:
        raise MGEError.BAD_JSON("同一字段下数据模式不一致，请检查数据库是否存在污染")
    list_new = []
    if list1_type is dict:
        if handle_list_dict_nested:
            for i in range(len(list1)):
                list_new.append(merge_two_nested_dict(list1[i], list2[i], handle_list_dict_nested))
        else:
            list_new.extend(list1)
            list_new.extend(list2)
    elif list1_type is list:
        for i in range(len(list1)):
            list_new.append(_merge_two_list(list1[i], list2[i], handle_list_dict_nested))
    else:
        list_new.extend(list1)
        list_new.extend(list2)
    return list_new


def pretty_output_sheet(data):
    output = ""

    # 计算每列的最大宽度
    max_widths = [max(len(str(item)) for item in column) for column in zip(*data)]

    # 输出表头
    for i, item in enumerate(data[0]):
        output += "{:<{}}  ".format(item, max_widths[i])
    output += "\n"

    # 输出分隔线
    for width in max_widths:
        output += '-' * width + '  '
    output += "\n"

    # 输出数据行
    for row in data[1:]:
        for i, item in enumerate(row):
            output += "{:<{}}  ".format(item, max_widths[i])
        output += "\n"
