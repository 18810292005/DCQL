import codecs
import sys
from antlr4 import *
import unittest

from apps.nql.grammar.MysqlQueryLexer import MysqlQueryLexer
from apps.nql.grammar.MysqlQueryListener import MysqlQueryListener

from apps.nql.grammar.MysqlQueryParser import *
from apps.nql.logicplan.AST2LP import NQLVisitor


def main(query):
    lexer = MysqlQueryLexer(InputStream(
        query))
    stream = CommonTokenStream(lexer)
    parser = MysqlQueryParser(stream)
    tree = parser.simpleStatement()
    calculator = NQLVisitor()
    plan_tree = calculator.visitSimpleStatement(tree)
    print(plan_tree.to_dict())


if __name__ == '__main__':
    main(
      #  "select * from 测试1")
     #   "create template cmy array (x,number (unit = kg) number (unit = mg))")
    #  "create template cmy array (x).string")
   # "create template cmy array (x).container.string(ss)")
      #  "create template a array(c).container.table(b).choice(a,option=[a1,a2,a3])")
      #  "show user cmy,gzy,zcc with password,role")
      #  "update user cmy with password c0927,ddcc299")
       # "drop user cmy,gzy")
      #  "create user cmy with password c0927,role gzy,zcc ")
     #   "grant ALL PRIVILEGES,all on templates to cmy")
       # "create role cmy with zcc,gzy,create on template b")
       # "alter template a,b alter b (b),(c),col,col,cho option=[a] (a),option=[b] (a)")
       # "alter template a,b drop b option=[a] (a) ")
       #   "alter template a,b drop b OPTIONGROUP=[a[b,c]] (a)")
       # "alter template a,b add string(b)")
      #  "alter on template a")
      #  "update a set b = c where a.name = 'qqq'")
   # "delete from a where a.name = 'qqq'")
    #    "select 体系名称,三元零变量反应.原子百分比1,三元零变量反应.三元体系 from 热力学数据库-三元体系零变量反应信息 where ALL 三元零变量反应.原子百分比1>20 and 三元零变量反应.三元体系=Fe-C-Cr group by sno desc limit 2 offset 2")
   # "select sno,name from student group by sno desc having pay_for_per_month>10000")
    #  "select sno,name from student order by sno desc,name asc;")
   # "select distinct a.id,b from a where a.name = 'qqq'")
   # "select a,b,c,b.NSRZT from 工商库 where a>1 limit 2 offset 2")
   #"select 体系名称,三元零变量反应.原子百分比1,三元零变量反应.三元体系 from 热力学数据库-三元体系零变量反应信息 where ALL 三元零变量反应.原子百分比1>20 and 三元零变量反应.三元体系=Fe-C-Cr limit 3")
    # "select distinct a[0][1].id from a where a.name IS NOT a")
   # "create template a container b (number b (c),string c,range b (c) error,choice b (c (d,e),f (g,h)),CONTAINER gg (file b multiple,number b (c)))")
   #   "create template cmy container (b).table (s).number (x) ")
    #  "create TEMPLATE a range (b unit=c,type=error)")
    #  "create TEMPLATE a file b multiple,number b (c),choice b (c)")
   #   "create template a choice (b,option=[c,d,e])")
     # "create template cho51 choice (b,optiongroup=[a [c,d,e],l [i,j,k]])")
   #  "create template a choice b (c (d,e),f (g,h)),string b,choice b (c,d,e),number b (c)")
   # "create template a number (b)")
   # "select MAX(a) from a where a.name IN (b,c)")
   # "select count(distinct a,b) from a,b ")
   #  "describe a")
   #    "drop template b")
     #   "create template choandran table (t,range (a,unit=kg,type=range),range (b,unit=mg,type=error),choice (c,option=[i,j,k]),choice (d,optiongroup=[a [l,m,n]]))")
      # 'insert into choandran1 (x) values (table a,b ((range type=range (3,4),range type=error (3,0.1)),(range type=range (3.2,4.1),range type=error (5,0.2))))')
      #  "insert into table33 (s,x) values (string test),(table l ((string abb),(string bba)))")
      #  "insert into con21 (x) values (container a,b,c,l (string test,number 2.3,range type=range (2,3),table s ((string aaaa),(string bbbb))))")
    #    'insert into file31 (b) values (table f,k ((file "28567639新建_文本文档.20240102173536.txt",image "28567639计205-42021075-陈梦阳-87.77.20240102173528.png"),(file "nql.txt",image "28567639计205-42021075-陈梦阳-87.77.20240102173528.png")))')
     #  'insert into b (c,d) values (string a),(number 33.99),(range type=error (3,4)),(file "28567639新建_文本文档.20240102173536.txt"),(image "28567639计205-42021075-陈梦阳-87.77.20240102173528.png"),(choice a (abb))')
    #'insert into b (c,d) values (file ("b","c"),table((string a,number 5),(number 2,range(2,3),choice gr(c))))')
    # 'insert into b (c,d) values (container(string b,file "b",number 7))')
        
      #  "insert into arr22 (x) values (array string[a,b,c])")
    #   "insert into arr (a) values (array number[1,2,3])")
    #    "insert into arrerr (x) values (array error[(1,3),(2,4),(5,6)])")
     #    'insert into arrfile (x) values (array file["28567654新建_文本文档.20240110102434.txt","28567654nql.20240110102442.txt","28567654new.20240110102455.g4"])')
   # "create template choice41 array (x).choice (optiongroup = [a[a,b,c],i[l,m,n]])")
        #  "create template choice44 array (x).choice (optiongroup = [s[a,b,c],i[l,m,n]])")
      #    "insert into choice44 (x) values (array choice[s(m),i(l)])")
      # "create template choice42 array (x).choice (option=[a,b,c])")
     #  "insert into choice42 (x) values (array choice[a,b,c])")
    #   'insert into arr (a) values (array choice [a])')
   #     'insert into arr (a) values (array choice [a(bcc),b])')
  #   'insert into gen2 (b)  values (generator s table x ((number 12.4),(number 3.41)))')
         'insert into arr (a) values (array table [((number 2),(string c)),((number 4),(string abbcad))])')
     # 'insert into b (c,d) values (array image [("b","c")])')
      #  'insert into b (c,d) values (array choice [a,c(d),e(f)])')
        # 'insert into b (c,d) values (array container [(string c,file "b"),(choice gr(c),range(2,3))])')
    # 'insert into b (c,d) values (array table [((string c,file "b"),(choice gr(c),range(2,3))),((number 2))])')
      #   'insert into b (c,d) values (array generator [(string c (v),range a ((2,3))),(table e ((string c)),container e (string c)),(container f (string c))])')
    #  'insert into b (c,d) values (generator table a ((range (2,3),string a,number 5,choice gr(c)),(number 7,file "b")))')
   # 'insert into b (c,d) values (generator container a (range (2,3),number 5,choice gr(c)),file "b",generator table a ((range (2,3),string a,number 5,choice gr(c)),(number 7,file "b")))')
   #   'insert into b (c,d) values (generator array table a ([((string c,number 2),(range (2,3)))]))')
      # 'insert into b (c,d) values (generator array container a ([(string c,number 2),(range (2,3))]))')
   # 'insert into b (c,d) values (generator array generator a ([(string c (b))]))')
     #   'insert into b (c,d) values (array range [(2,3),(4,5)])')
  #   "create template cmy string (s),number (b unit=kg),range (c unit=c,type=range)")
     #   "create template a table (b).string (s)")
  #  "create template a table (b,string (s),string (x),range (c unit=c,type=range))")
  #  "create template a GENERATOR b (number b (c),choice b (c (d,e),f (g,h)),table gg (number b (c),string c,range b (c) error,choice b (c (d,e),f (g,h))))")
   # "create template a array b (GENERATOR (number b (c),choice b (c (d,e),f (g,h)),table gg (number b (c),string c,range b (c) error,choice b (c (d,e),f (g,h)))))")


'''
class my_test(unittest.TestCase):
    def test01(self):
        main("select distinct a[0][1].id from a where a.name IS NOT a")

class my_test(unittest.TestCase):
    def test02(self):
        main("select a,b,c,b.NSRZT from 工商库 where (a+b)>1")
'''
'''
class my_test(unittest.TestCase):
    def test03(self):
        main("select 体系名称,三元零变量反应.原子百分比1,三元零变量反应.三元体系 from 热力学数据库-三元体系零变量反应信息 where ALL 三元零变量反应.原子百分比1>20 and 三元零变量反应.三元体系=Fe-C-Cr group by sno desc limit 2 offset 2")

class my_test(unittest.TestCase):
    def test02(self):
        main("select 2 from a where a.name IN 'qqq' limit 2")
'''