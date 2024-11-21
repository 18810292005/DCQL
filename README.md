# MGEDATA

## 分支

1. master: 16年项目，部署于[https://www.mgedata.cn](https://www.mgedata.cn)，**仅维护，不再开发新功能**
2. dev: 18年项目，部署于[http://mged.nmdms.ustb.edu.cn](http://mged.nmdms.ustb.edu.cn) ，**仅维护，不再开发新功能**
3. newdev: 产品化开发分支，部署于[mgedev.micl.com.cn](http://mgedev.micl.com.cn)
4. newtest: 产品化测试分支，部署于[mgetest.micl.com.cn](http://mgetest.micl.com.cn)

## 环境搭建

#### 克隆工程

```shell
git clone https://gitee.com/ustb-mge_1/mgedata.git
```

或者配置相关公钥，使用ssh方式克隆（可实现免密码。请自行查阅相关资料了解配置方法）

```shell
git clone git@gitee.com:ustb-mge_1/mgedata.git
git checkout newdev
```

#### 配置Python及PyCharm

> 本文档仅介绍Windows系统的配置方法

1. 安装Python 3.10.13 （**安装时一定要勾选** `Add python.exe to PATH`）

   [https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe](https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe)

   ![1672798590329.jpg](https://foruda.gitee.com/images/1672798610367051776/f098e1ce_7397933.png)
2. 安装PyCharm Professional
   （必须是专业版，社区版功能不全。访问[https://www.jetbrains.com/shop/eform/students](https://www.jetbrains.com/shop/eform/students)
   申请免费的学生授权） [https://www.jetbrains.com/pycharm/download/](https://www.jetbrains.com/pycharm/download/)
3. 右键Windows开始按钮，选择“终端”。在终端内输入 `pip install poetry -i https://pypi.tuna.tsinghua.edu.cn/simple`

   ![image.png](https://foruda.gitee.com/images/1672799576788277825/926729bc_7397933.png)
4. 运行 `cd XXX`（XXX是第一步clone的mgedata文件夹的路径），运行 `poetry install`，等待安装完成
5. 运行 `poetry env info`，复制 `Virtualenv`下的 `Executable`一栏的路径（Windows终端下选中后单击右键即可复制）

   ![image.png](https://foruda.gitee.com/images/1672799941412667393/f3b7ce97_7397933.png)
6. 使用PyCharm打开第一步clone的mgedata文件夹。
7. 点击菜单栏 `Files - Settings - Project:mgedata - Python Interpreter`
   ，点击右侧 `Add Interpreter - Add Local Interpreter`

   ![image.png](https://foruda.gitee.com/images/1672799544977389300/0a3a1407_7397933.png)
8. 点击左侧 `Poetry Environment`，右侧选择 `Existing Environment`。点击 `Interpreter`
   右侧的三个点按钮，在弹出的对话框路径栏粘贴之前复制的python.exe路径。最后点击OK。![image.png](https://foruda.gitee.com/images/1672800138358447592/9c442e53_7397933.png)

   ![image.png](https://foruda.gitee.com/images/1672800164766459804/a8eb393c_7397933.png)
9. 点击PyCharm右上角的 `Current File - Edit Configurations`，在新对话框中点击左上角 `+`，选择 `Django Server`

   ![image.png](https://foruda.gitee.com/images/1672800440441663687/edb4561f_7397933.png)

   ![image.png](https://foruda.gitee.com/images/1672800522040621592/3bf694ce_7397933.png)
10. name一栏可以自定，确保Python Interpreter一栏是刚刚添加的Poetry。**同时 `Environment variables`
    一栏改为 `PYTHONUNBUFFERED=1;DJANGO_SETTINGS_MODULE=mgedata.local_settings_dev`**

    ![image.png](https://foruda.gitee.com/images/1672802251221184175/c6064c96_7397933.png)
11. 其他部分使用默认设置。

#### 配置Docker

> 使用Docker可以一键安装、配置并启动所有基础组件。也可以不使用Docker，手动配置PostgreSQL、MongoDB、ElasticSearch、RabbitMQ、memcached、bigfile等组件。

1. 在本地或者远程服务器安装、并启动docker。如果是远程服务器，需要开启docker的远程连接（自行查阅相关资料）
2. 在PyCharm的选项 `Build, Execution, Deployment - Docker`
   中配置docker连接信息，如果是本地docker，选择 `Docker For Windows`。如果是远程服务器，选择TCP
   Socket并填写服务器的IP及docker的监听端口。等待下方出现 `Connection Successful`，如果显示错误信息，需要排查解决。
   ![image.png](https://foruda.gitee.com/images/1672801627750270010/cdff97b0_7397933.png)
3. 工程目录中的 `mgedata/local_settings_dev_example.py`文件，复制一份到同级目录，命名为 `local_settings_dev.py`
   。修改其中 `SERVICE_IP`为docker所在服务器的IP。（修改的是 `local_settings_dev.py`
   ，不要修改 `local_settings_dev_example.py`）。然后复制一份docker/.env.example文件，命名为.env。

   ![image.png](https://foruda.gitee.com/images/1672801746787914850/3e67897c_7397933.png)

   ![image.png](https://foruda.gitee.com/images/1672801839546919438/5352f653_7397933.png)
4. 在PyCharm中打开 `docker/docker-compose-dev-local.yml`，点击 `services`
   处的双箭头图标，启动各种基础服务。等待PyCharm下方 `Services`
   窗口显示服务已经启动的信息。![image.png](https://foruda.gitee.com/images/1672802035735198183/6474a185_7397933.png)

   ![image.png](https://foruda.gitee.com/images/1672802108689412427/55950836_7397933.png)
5. 点击PyCharm下方的 `Terminal`
   ，激活虚拟环境（命令提示符前有虚拟环境名称，默认应该是自动激活），运行 `python manage.py migrate && python manage.py init_dev`
   ，等待执行完成。成功后会显示 超级管理员 的用户名和密码，同时会创建测试用的领域分类和项目、课题。

   ![image.png](https://foruda.gitee.com/images/1672806077268484799/1ec8b153_7397933.png)
6. （可选）继续在终端中执行 `python manage.py createadmin`，按照提示输入相关信息，注册一个其他的管理员用户。
7. 点击右上角的配置文件，选择之前配置的mgedata，点击绿色箭头按钮启动服务器。

   ![image.png](https://foruda.gitee.com/images/1672806136041227530/af684491_7397933.png)
8. 启动成功后应显示如图的信息，浏览器访问[http://127.0.0.1:8000](http://127.0.0.1:8000)（点击如图中蓝色超链接即可）将会看到系统首页，至此开发环境搭建完成。

   ![image.png](https://foruda.gitee.com/images/1672806275176924980/26994d31_7397933.png)

   ![image.png](https://foruda.gitee.com/images/1672806346073320828/5ce0bf72_7397933.png)
