# MGEDATA DCQL User Manual

### DCQL related files are stored in the 'mgedata/apps/nql' directory, which contains four folders and a query.py file


### When using, enter the following commands in the pycharm terminal in sequence to enter the python environment and call the function of the input statement
```shell
python manage.py shell
from apps.nql.query import input_test
input_test()
```
### The default pycharm terminal directory is the root directory mgedata. If it is inconsistent, you need to change the index of the second command function.
### 
### Then enter the statement. Enter a line and press Enter to accept the command. The following is a simple example demonstration.
#### 1.View template information. You can also use it to check whether the template exists. Please note that there cannot be two templates with the same name.
```shell
describe Test
```
#### 2.Create a template according to your needs. Here is a template containing the numeric type 'num'
```shell
create template test number (num,unit=kg)
```
#### 3.If the template is created for the first time and there is no template with the same name before, there is no data under the template, so insert data (here are three items)
```shell
insert into test (num) values (number 3.3)
insert into test (num) values (number 4.0)
insert into test (num) values (number 4.8)
```
#### 4.After that, you need to open another terminal page to update the database according to the template ID number (here 5051 is the ID number)
```shell
python manage.py es update_templates --template_ids 5051
```
#### 5.Retrieve data in the original window and get the result in json format, which can be seen in the terminal
```shell
select * from test
## You can perform conditional searches, such as
## select * from easy where num>4
```
#### 6.Changes to data: Changes to specific field data also require updates to the database
```shell
update test set num = 3.3 where num=6.0
```
#### 7.Clear data (will not delete templates)
```shell
delete from test
```
#### 8.Deleting a template
```shell
drop template test
```

