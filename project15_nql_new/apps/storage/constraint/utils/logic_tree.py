from copy import deepcopy
from enum import Enum
from typing import List

from django.utils.translation import ugettext as _


class LogicNode(Enum):
    AND = 'AND'
    OR = 'OR'
    LEAF = 'LEAF'

    @staticmethod
    def keys():
        return [member.name for member in LogicNode]

    @staticmethod
    def values():
        return [member.value for member in LogicNode]


class Node:
    """
    Represents a logic node in a logic tree.
    Each node contains an operator (represented by a string) and children
    """

    def __init__(self, logic_node: LogicNode = LogicNode.LEAF, children: List['Node'] = None, identifier=None,
                 inverted=False):
        assert not (logic_node == LogicNode.LEAF and children)  # leaves can't have children
        self.children = children[:] if children else []
        self.identifier = str(identifier) or id(self)
        for child in self.children:
            assert isinstance(child, Node)
        self.logic_node = logic_node
        self.inverted = inverted

    def copy(self):
        return self._new_instance(self.logic_node, self.children, self.identifier, self.inverted)

    @classmethod
    def _new_instance(cls, logic_node: LogicNode = LogicNode.LEAF, children: List['Node'] = None, identifier=None,
                      inverted=False):
        """
        Magically cast Node instance to cls instance,
        so that __init__ of cls can have a different set of parameters, when used in cls.merge(...)
        """
        node = Node(logic_node=logic_node, children=children, identifier=identifier, inverted=inverted)
        node.__class__ = cls
        return node

    @classmethod
    def merge(cls, left: 'Node', right: 'Node', logic_node: LogicNode, identifier=None) -> 'Node':
        """
        merge two node together using a logic operator (AND/OR)
        """
        if logic_node == LogicNode.LEAF:
            raise ValueError(_("Cannot merge two nodes using LogicNode.LEAF"))
        if left == right:
            return left
        if left.is_empty():
            return right
        if right.is_empty():
            return left
        """
        If either left or right node has the same logic operator as 'logic_node',
        we can reuse it (let's call it inplace_node) and its 'children' list to do the merge.
        """
        inplace_node = None
        other_node = None
        if left.logic_node == logic_node:
            inplace_node = left
            other_node = right
        elif right.logic_node == logic_node:
            inplace_node = right
            other_node = left
        if inplace_node is not None:
            inplace_node = inplace_node.copy()
            if len(other_node.children) == 1 or other_node.logic_node == inplace_node.logic_node:
                """
                The children of the two nodes can be merged if:
                the other node has only one child (in this case the logic operator of that node doesn't matter), or
                these two nodes have the same logic node: AND(A,B), AND(C,D) -> AND(A,B,C,D)
                """
                inplace_node.children.extend(other_node.children)
                # other_node.children = None  # release
            else:
                inplace_node.children.append(other_node)
            return inplace_node
        new_node = cls._new_instance(logic_node=logic_node, children=[left, right], identifier=identifier)
        return new_node

    def is_empty(self):
        return self.logic_node != LogicNode.LEAF and not self.children

    def invert(self):
        self.inverted = not self.inverted
        if self.logic_node == LogicNode.AND:
            self.logic_node = LogicNode.OR
        elif self.logic_node == LogicNode.OR:
            self.logic_node = LogicNode.AND
        for child in self.children:
            child.invert()

    def __str__(self):
        return self.pretty_string()

    def to_expr(self, with_parentheses=False) -> str:
        if self.logic_node == LogicNode.LEAF:
            return self.leaf_expr()
        children_expr = [child.to_expr(with_parentheses=True) for child in self.children]
        expr = f' {self.logic_node.value} '.join(expr for expr in children_expr)
        if with_parentheses:
            expr = f"({expr})"
        print(expr)
        return expr

    def leaf_expr(self) -> str:
        """
        Convert leaf node to expression. Subclasses should override this function.
        e.g: X AND (X OR X), here Xes will be replaced by leaf_expr().
        """
        return self.identifier

    def pretty_string(self, depth=0) -> str:
        """
        For debug purposes
        """
        attributes = [str(self.identifier)]
        if self.inverted and self.logic_node == LogicNode.LEAF:
            attributes.append('inverted')
        string = f"{''.join(depth * ['    '])}{self.logic_node.value}({', '.join(attributes)})"
        if not self.children:
            return string
        children_num = len(self.children)
        if children_num == 1:
            word = 'child'
        else:
            word = 'children'
        string += f', {children_num} {word}:\n'
        for i, child in enumerate(self.children):
            string += child.pretty_string(depth + 1)
            if i != children_num - 1:
                string += '\n'
        return string

    def to_dict(self) -> dict:
        res = {'identifier': str(self.identifier)}
        if self.logic_node == LogicNode.LEAF:
            if self.inverted:
                res['inverted'] = True
            return res
        res['logic'] = self.logic_node.value
        children = []
        for child in self.children:
            children.append(child.to_dict())
        res['children'] = children
        return res

    def __or__(self, other) -> 'Node':
        return self.__class__.merge(self, other, LogicNode.OR)

    def __and__(self, other):
        return self.__class__.merge(self, other, LogicNode.AND)

    def __invert__(self) -> 'Node':
        copied = deepcopy(self)
        copied.invert()
        return copied

    def __eq__(self, other: 'Node'):
        return (self.logic_node == other.logic_node and
                self.children == other.children and
                self.identifier == other.identifier and
                self.inverted == other.inverted)
