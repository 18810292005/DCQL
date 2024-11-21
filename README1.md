# MGEDATA DCQL 使用说明

### DCQL相关文件存放在 'mgedata/apps/nql' 目录下，包含四个文件夹和一个query.py文件


### 使用时在pycharm的终端依次输入以下命令进入python环境并调用输入语句的函数
```shell
python manage.py shell
from apps.nql.query import input_test
input_test()
```
### 其中默认pycharm终端目录为根目录mgedata，若不一致需要更改第二条命令函数的索引
### 
### 之后进行语句的输入，输入一条并回车代表接受指令，下面进行一个简单示例的演示
#### 1.查看模板信息，可以同时用来检查模板是否存在，需注意不可以出现两条重名模板
```shell
describe 测试
```
#### 2.根据需求创建模板，这里展示一个包含数值型’num‘的模板
```shell
create template test number (num,unit=kg)
```
#### 3.如果模板第一次创建且之前没有同名模板存在过此时模板下没有数据，进行数据的插入（此处为三条）
```shell
insert into test (num) values (number 3.3)
insert into test (num) values (number 4.0)
insert into test (num) values (number 4.8)
```
#### 4.之后需要再开一个终端页面进行数据库的更新，根据模板的id号进行更新（这里5051为id号）
```shell
python manage.py es update_templates --template_ids 5051
```
#### 5.在原窗口进行数据的检索，得到结果为json格式，在终端可见
```shell
select * from test
## 可以进行条件检索，例如
## select * from easy where num>4
```
#### 6.数据的更改，对特定字段数据进行更改，此处也需要对数据库进行更新
```shell
update test set num = 3.3 where num=6.0
```
#### 7.清空数据（不会删除模板）
```shell
delete from test
```
#### 8.删除模板
```shell
drop template test
```

