import base64
from enum import Enum

from rest_framework import exceptions, serializers


class Operator(Enum):
    In = 'in'
    Contains = 'contains'
    IContains = 'icontains'
    GreaterThan = 'gt'
    LessThan = 'lt'


def _transform(query):
    keys = query.keys()
    # result的元素是三元组：(field, operator, value)
    result = []
    for key in keys:
        value = query.get(key)
        field_and_op = key.split('__')
        length = len(field_and_op)
        if length > 2:
            raise exceptions.NotAcceptable()
        field = field_and_op[0]
        operator = field_and_op[1] if len(field_and_op) == 2 else None
        if field.endswith('[]'):
            if operator is None:
                operator = Operator.In

            if value.find(',') == -1:
                # 经过base64编码的数组
                if value.startswith('WyJ') or value.startswith('Wyl'):
                    value = value.replace('.', '/')
                    try:
                        decoded = base64.b64decode(value).decode('utf-8')
                        if decoded[0] != '[' or decoded[-1] != ']':
                            continue
                        arr = [x.strip() for x in decoded[1:-1].split(',')]
                        str_list = []
                        for item in arr:
                            if arr[0] != '"' or arr[-1] != '"':
                                raise ValueError
                            item = item[1: -1]
                            str_list.append(item)
                        result.append((field[:-2], operator, str_list))
                    except UnicodeDecodeError:
                        continue
                    except ValueError:
                        continue
                else:
                    result.append((field[:-2], operator, value.split(',')))
            else:
                result.append((field[:-2], operator, value.split(',')))
        else:
            result.append((field, operator, value))
    return result


def _serializer_field_name_to_model_field_name(serializer, field_name):
    """
    把序列化后的字段名称转换成数据库定义的字段名称
    """
    if field_name in serializer.fields:
        # 外键需要把点转换成双下划线
        return serializer.fields[field_name].source.replace('.', '__')
    else:
        raise exceptions.NotAcceptable()


def _get_order_by(serializer, field_name):
    descending = field_name.startswith('-')
    if descending:
        field_name = field_name[1:]
    source = _serializer_field_name_to_model_field_name(serializer, field_name)
    return '-' + source if descending else source


class AutoFilterMixin(object):
    """
    通过serializer的字段和请求的参数自动过滤和排序
    URL形式：/api/v1/items?id_gt=21&status[]=1,2,3&t_type=1&order_by=-time
    语法：
    - 字段：id=1 id__gt=2
    - 整数数组：status[]=1,2,3
    - 字符串的数组：对数组进行base64编码并替换/为.，即base64(["1", "2"]).replace('/', '.')
    - 排序：order_by=time，按照time排序；order_by=-time，按照time排序并倒序
    对于order_by，在order_by存在的情况下不会考虑order_by[]的内容
    """
    # 需要过滤的字段列表
    # 注意这里的字段都是位于serializer中的
    # 如果是 '__all__'那么会自动生成所有的
    filter_fields = None
    # 允许排序的字段列表
    # 注意这里的字段都是位于serializer中的
    # 如果是 '__all__' 那么允许使用任何字段进行排序
    sortable_fields = None

    def pre_filter_queryset(self, queryset):
        """
        预过滤内容，例如根据用户是否为ROOT过滤
        """
        return queryset

    def filter_queryset(self, queryset):
        queryset = self.pre_filter_queryset(queryset)
        if self.filter_fields is None:
            return queryset

        serializer = self.get_serializer()
        # keys是允许查询的字段列表
        keys = serializer.fields.keys() if self.filter_fields == '__all__' else self.filter_fields

        user_query_list = _transform(self.request.query_params)
        # 通过用户给出的查询参数，合成数据库的查询语句
        filter_dict = {}
        for query in user_query_list:
            if query[0] in keys:
                field_name = _serializer_field_name_to_model_field_name(serializer, query[0])
                field = serializer.fields[query[0]]

                value = query[2]
                if isinstance(field, serializers.BooleanField):
                    if value in ['true', '1', 'yes', 'True']:
                        value = True
                    elif value in ['false', '0', 'no', 'False']:
                        value = False
                    else:
                        raise exceptions.NotAcceptable(detail='Invalid bool field')
                elif isinstance(field, serializers.IntegerField):
                    try:
                        value = int(value)
                    except ValueError:
                        raise exceptions.NotAcceptable(detail='Invalid integer field')
                # TODO 加入operator
                # f'{field_name}__{operator}
                filter_dict[field_name] = value

        # 获得排序参数order_by
        # 这里要捕获数据库查询产生的异常

        _sortable_fields = self.sortable_fields if self.sortable_fields is not None else serializer.fields.keys()

        try:
            order_field_name = self.request.query_params.get('order_by')
            if order_field_name is not None and order_field_name in _sortable_fields:
                source = _get_order_by(serializer, order_field_name)
                return queryset.filter(**filter_dict).order_by(source)
            # order_by不存在的情况下，使用order_by[]
            order_field_array = self.request.query_params.get('order_by[]')
            if order_field_array is not None and order_field_name in _sortable_fields:
                names = order_field_array.split(',')
                return queryset.filter(**filter_dict).order_by(*[_get_order_by(serializer, name) for name in names])
            # 否则不排序
            return queryset.filter(**filter_dict)
        except ValueError:
            raise exceptions.NotAcceptable()
        except exceptions.ValidationError:
            raise exceptions.NotAcceptable()
