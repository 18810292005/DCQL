from antlr4 import CommonTokenStream, InputStream

from apps.nql.executor.LP2MGE import HandleLogicPlanTree
from apps.nql.grammar.MysqlQueryLexer import MysqlQueryLexer
from apps.nql.grammar.MysqlQueryParser import MysqlQueryParser
from apps.nql.logicplan.AST2LP import NQLVisitor
from mgedata.test import MGETestCase


class NQLTester(MGETestCase):
    def setUp(self):
        pass

    def test_select(self):
        # lexer = MysqlQueryLexer(InputStream(
        #     "select 体系结构 from 热力学数据库-三元体系零变量反应信息 where 三元零变量反应.三元体系=Fe-C-Cr  limit 1"))
        lexer = MysqlQueryLexer(InputStream(
            "afc"))
        stream = CommonTokenStream(lexer)
        parser = MysqlQueryParser(stream)
        tree = parser.simpleStatement()
        calculator = NQLVisitor()
        plan_tree = calculator.visitSelectStatement(tree)
        print(plan_tree.to_dict())
        executor = HandleLogicPlanTree.handlePlan(plan_tree)
        print(executor.next())
