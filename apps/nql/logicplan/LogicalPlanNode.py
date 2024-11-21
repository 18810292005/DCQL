from enum import Enum
from typing import List


class ColumnName():
    def __init__(self, id):
        self.id = id

    def __str__(self):
        return (self.id)

    def to_dict(self):
        return str(self.id)

class Function():
    def __init__(self, func):
        self.func = func

    def __str__(self):
        return (self.func)

    def to_dict(self):
        return str(self.func)

class TemplateName():
    def __init__(self, title):
        self.title = title

    def __str__(self):
        return str(self.title)

    def to_dict(self):
        return str(self.title)

class Limit():
    def __init__(self, limit, offset=0):
        self.limit = limit
        self.offset = offset

    def __str__(self):
        return str((self.limit, self.offset))

    def to_dict(self):
        return {"limit": self.limit,"offset": self.offset}


class OrderOp(Enum):
    Asc = 'asc'
    Desc = 'desc'


class OrderBy():
    def __init__(self, title, order="asc"):
        self.title = ColumnName(title)
        self.order = OrderOp(order)

    def to_dict(self):
        return {"title": self.title.id,"order": self.order.value}

    def __str__(self):
        return str(self.to_dict())


class GroupBy():
    def __init__(self, title, order="asc"):
        self.title = ColumnName(title)
        self.order = OrderOp(order)

    def to_dict(self):
        return {"title": self.title.id,"order": self.order.value}

    def __str__(self):
        return str(self.to_dict())


class Operator():
    def __init__(self, title, order="asc"):
        self.title = ColumnName(title)
        self.order = OrderOp(order)


class ComparisonExpressionOp(Enum):
    # 定义枚举类ComparisonExpressionOp                 
    Equal = 'eq'
    NotEqual = 'ne'
    Greater = 'gt'
    Less = 'lt'
    NotLess = 'gte'
    NotGreater = 'lte'
    StartsWith = 'startswith'
    NotStartsWith = 'nstartswith'
    EndsWith = 'endswith'
    NotEndsWith = 'nendswith'
    Contains = 'contains'
    NotContains = 'ncontains'
    In = 'in'
    NotIn = 'nin'
    NotNull = 'any'
    Null = 'none'
    Like = 'like'
    Is = 'is'
    NotLike = 'nlike'
    IsNot = 'nis'


class LogicalExpressionOp(Enum):
    # 定义枚举类LogicalExpressionOp
    And = 'and'
    Or = 'or'


op_mapping = {
    # 定义字典对应枚举类
    '=': ComparisonExpressionOp.Equal,
    '>': ComparisonExpressionOp.Greater,
    '<': ComparisonExpressionOp.Less,
    '<=': ComparisonExpressionOp.NotGreater,
    '>=': ComparisonExpressionOp.NotLess,
    '<>': ComparisonExpressionOp.NotEqual,
    '!=': ComparisonExpressionOp.NotEqual,
    '<=>': ComparisonExpressionOp.NotEqual,
    'IN': ComparisonExpressionOp.In,
    'NOTIN': ComparisonExpressionOp.NotIn,
    'LIKE': ComparisonExpressionOp.Like,
    'IS': ComparisonExpressionOp.Is,
    'NOTLIKE': ComparisonExpressionOp.NotLike,
    'ISNOT': ComparisonExpressionOp.IsNot
}


class LogicalExpression():
    # 表示逻辑表达式
    def __init__(self, **kwargs):
        self.left: ComparisonExpression = kwargs.get("left", None)
        self.op: LogicalExpressionOp = kwargs.get("op", None)
        self.right: ComparisonExpression = kwargs.get("right", None)

    def to_dict(self):

        # 返回的是一个字典。该字典具有一个键 "and"，对应的值是一个包含两个元素的列表

        if self.op == LogicalExpressionOp.And.value:
            return {"and": [self.left.to_dict(), self.right.to_dict()]}
        elif self.op == LogicalExpressionOp.Or.value:
            return {"or": [self.left.to_dict(), self.right.to_dict()]}


class ComparisonExpression():
    # 表示比较表达式
    def __init__(self, **kwargs):
        self.field: ColumnName = kwargs.get("field", None)
        self.op: ComparisonExpressionOp = kwargs.get("op", None)
        self.val = kwargs.get("val", None)
        self.nested = kwargs.get("nested", "EXIST")

    def to_dict(self):
        return {"field": self.field.id, "op": self.op.value, "val": str(self.val), "nested": self.nested}

    def __str__(self):
        return str(self.to_dict())


class BaseLogicPlan():
    def __init__(self):
        self.children: List[BaseLogicPlan] = []

    def to_dict(self):
        pass

    def __str__(self):
        return str(self.to_dict())


class ScanLogicPlan(BaseLogicPlan):
    def __init__(self, **kwargs):
        super().__init__()
        self.template_source = kwargs.get("template_source", None)
        self.where_conditions = kwargs.get("where_conditions", None)
        self.group_by = kwargs.get("group_by", None)
        self.having = kwargs.get("having", None)
        self.order = kwargs.get("order", None)
        self.limit = kwargs.get("limit", None)

    def to_dict(self):
        dic = {}
        if self.where_conditions is not None:
            dic.update({"where_conditions": self.where_conditions.to_dict()})
        dic.update({"template_source": self.template_source})
        dic.update({ "limit": self.limit})
        #return {
            #"template_source": self.template_source,
           # "where_conditions": self.where_conditions.to_dcit(),
          #  "limit": self.limit
        #}
        return dic


class FilterLogicPlan(BaseLogicPlan):
    def __init__(self, **kwargs):
        super().__init__()
        self.template_source = kwargs.get("template_source", None)
        self.select_elements: List[ColumnName] = kwargs.get("select_elements", None)
        self.where_conditions = kwargs.get("where_conditions", None)
        self.group_by = kwargs.get("group_by", None)
        self.having = kwargs.get("having", None)
        self.order = kwargs.get("order", None)
        self.limit = kwargs.get("limit", None)

    def to_dict(self):
        templates = []
        for item in self.template_source:
            if isinstance(item, ColumnName):
                templates.append(item.to_dict())
            elif isinstance(item, TemplateName):
                templates.append(item.to_dict())
            else:
                templates.append(item)
        elements = []
        for item in self.select_elements:
            if isinstance(item, str):
                elements.append(item)
            else:
                elements.append(item.to_dict())
        dict = {}
        dict.update({"select_elements": elements,"template_source": templates})
        if self.where_conditions is not None:
            dict.update({"where_conditions": self.where_conditions.to_dict()})
        else:
            dict.update({"where_conditions": None})
        if self.group_by is not None:
            dict.update({"group_by": self.group_by.to_dict()})
        else:
            dict.update({"group_by": None})
        if self.having is not None:
            dict.update({"having": self.having.to_dict()})
        else:
            dict.update({"having": None})
        if self.order is not None:
            dict.update({"order": self.order.to_dict()})
        else:
            dict.update({"order": None})
        if self.limit is not None:
            dict.update({"limit": self.limit.to_dict()})
        else:
            dict.update({"limit": None})
        return dict

class SchemaLogicPlan(BaseLogicPlan):
    def __init__(self, **kwargs):
        super().__init__()
        self.template_source = kwargs.get("template_source", None)
        self.create_elements = kwargs.get("create_elements", None)
        self.insert_elements = kwargs.get("insert_elements", None)
        self.where_conditions = kwargs.get("where_conditions", None)
        self.alter_elements = kwargs.get("alter_elements", None)
        self.control_elements = kwargs.get("control_elements", None)
        self.type_elements = kwargs.get("type_elements", None)

    def to_dict(self):
        templates = []
        if self.template_source is not None:
            for item in self.template_source:
                if isinstance(item, ColumnName):
                    templates.append(item.to_dict())
                elif isinstance(item, TemplateName):
                    templates.append(item.to_dict())
                else:
                    templates.append(item)
        elements = []
        if self.create_elements is not None:
            for item in self.create_elements:
                if isinstance(item, ColumnName):
                    elements.append(item.to_dict())
                else:
                    elements.append(item)
        inserts = []
        if self.insert_elements is not None:
            for item in self.insert_elements:
                if isinstance(item, ColumnName):
                    inserts.append(item.to_dict())
                else:
                    inserts.append(item)
        alters = []
        if self.alter_elements is not None:
            for item in self.alter_elements:
                if isinstance(item, ColumnName):
                    alters.append(item.to_dict())
                else:
                    alters.append(item)
        controls = []
        if self.control_elements is not None:
            for item in self.control_elements:
                if isinstance(item, ColumnName):
                    controls.append(item.to_dict())
                else:
                    controls.append(item)
        type = []
        if self.type_elements is not None:
                type.append(self.type_elements)
        dict = {}
        if self.template_source is not None:
            dict.update({"template_source": templates})
        else:
            dict.update({"template_source": None})
        if self.create_elements is not None:
            dict.update({"create_elements": elements})
        else:
            dict.update({"create_elements": None})
        if self.insert_elements is not None:
            dict.update({"insert_elements": inserts})
        else:
            dict.update({"insert_elements": None})
        if self.alter_elements is not None:
            dict.update({"alter_elements": alters})
        else:
            dict.update({"alter_elements": None})
        if self.control_elements is not None:
            dict.update({"control_elements": controls})
        else:
            dict.update({"control_elements": None})
        if self.where_conditions is not None:
            dict.update({"where_conditions": self.where_conditions.to_dict()})
        if self.type_elements is not None:
            dict.update({"type_elements": type})
        return dict