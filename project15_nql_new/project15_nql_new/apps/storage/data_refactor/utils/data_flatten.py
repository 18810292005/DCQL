def json_flat(j: dict, field='.', **kwargs):
    expand_array = kwargs.get("expand_array", False)  # 是否逐个处理数组中的元素
    expand_dict = kwargs.get("expand_dict", True)  # 将dict拆分，还是作为数组返回
    expand_table = kwargs.get("expand_table", "column")

    def _handle_special(path, data, name, type):
        # 处理特殊的数据，如：Table
        if type == "Table":
            if expand_table == "column":
                return _handle_list(path, data, name, False)
            elif expand_table == "row":
                paths = set()
                for row in data:
                    paths = set(list(row.keys())) | paths
                final_datas = []
                for row in data:
                    row_data = [row.get(p, None) for p in paths]
                    final_datas.append(row_data)
                return _handle_list(path, data, name, True)
        else:
            return flatten(path, data, name)

    def _handle_dict(path, data, name):
        if data == {}:
            return {name: None}
        if '_type' in data:
            return _handle_special(path, data['_data'], name, data['_type'])
        flat_results = dict()
        for k, v in data.items():
            if path != '':
                flat = flatten(path + field + k, v, name + field + k)
            else:
                flat = flatten(k, v, k)
            for k, v in flat.items():
                flat_results[k] = v
        return flat_results

    def _handle_list(path, data, name, force_expand=None, force_gather=None):
        def _combine(flats_list, paths):
            flat = dict()
            flats_list_len = len(flats_list)
            for p in paths:
                flat_arr = []
                for i in range(flats_list_len):
                    if p in flats_list[i]:
                        flat_arr.append(flats_list[i][p])
                    else:
                        flat_arr.append(None)
                flat[p] = flat_arr
            return flat

        def _expand(flats_list, paths):
            flat = dict()
            for data in flats_list:
                flat.update(data)
            return flat

        if data == []:
            return {name: []}
        if force_expand is None:
            force_expand = expand_array
        paths = set()
        flat_results = []
        for i in range(len(data)):
            if not expand_array:  # 不展开数组
                new_name = path
            else:
                new_name = f"{name}{field}{str(i)}"
            flattened = flatten(path, data[i], new_name)
            flat_paths = set(flattened.keys())
            paths = paths | flat_paths
            flat_results.append(flattened)
        if not force_expand:  # 不展开数组
            return _combine(flat_results, paths)
        else:
            return _expand(flat_results, paths)

    def _handle_basic(path, data, name):
        return {name: data}

    def flatten(path, data, name=""):
        if name == "":
            name = path
        if isinstance(data, dict):
            return _handle_dict(path, data, name)
        elif isinstance(data, list):
            return _handle_list(path, data, name)
        else:
            return _handle_basic(path, data, name)

    return flatten('', j)
