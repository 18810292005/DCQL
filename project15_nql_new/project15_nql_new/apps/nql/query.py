import codecs
import json
import sys
from antlr4 import *

from apps.nql.executor.LP2MGE import HandleLogicPlanTree
from apps.nql.grammar.MysqlQueryLexer import MysqlQueryLexer
from apps.nql.grammar.MysqlQueryListener import MysqlQueryListener

from apps.nql.grammar.MysqlQueryParser import *
from apps.nql.logicplan.AST2LP import NQLVisitor
from mgedata.errors.models import MGEError


def main():
    lexer = MysqlQueryLexer(InputStream(
        "select 体系名称,三元零变量反应.原子百分比1,三元零变量反应.三元体系 from 热力学数据库-三元体系零变量反应信息 where ALL 三元零变量反应.原子百分比1>20 and 三元零变量反应.三元体系=Fe-C-Cr  limit 2"))
    stream = CommonTokenStream(lexer)
    parser = MysqlQueryParser(stream)
    tree = parser.simpleStatement()
    if isinstance(tree, list) and len(tree) <= 0:
        raise MGEError.PARSE_ERROR
    calculator = NQLVisitor()
    plan_tree = calculator.visitSimpleStatement(tree)
    print(plan_tree.to_dict())
    executor = HandleLogicPlanTree.handlePlan(plan_tree)
    print(executor.next())


def input_test():
    def run_query():
        query = input("Input your query:")
        lexer = MysqlQueryLexer(InputStream(str(query)))
        stream = CommonTokenStream(lexer)
        parser = MysqlQueryParser(stream)
        tree = parser.simpleStatement()
        if isinstance(tree, list) and len(tree) <= 0:
            raise MGEError.PARSE_ERROR
        calculator = NQLVisitor()
        plan_tree = calculator.visitSimpleStatement(tree)
        print(plan_tree)
        executor = HandleLogicPlanTree.handlePlan(plan_tree)
        return executor.next()

    while (True):
        output = run_query()
        if isinstance(output, dict) or isinstance(output, list):
            output = json.dumps({"results": output}, indent=4, ensure_ascii=False)
        print(output)


if __name__ == '__main__':
    main()
