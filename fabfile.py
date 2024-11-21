from mgedata.local_settings import GATE_WAY, WEB_SERVER, LOCAL_PORT, REMOTE_PORT
from fabric import Connection, task
from functools import wraps


# 使用前请先配置好GATE_WAY, WEB_SERVER, LOCAL_PORT, REMOTE_PORT等变量

def dig_to_host_task(func):
    # fixme 非严格装饰器写法 不要当作装饰器学习!!! 仅为了封装功能
    @wraps(func)
    def real_func(*args, **kwargs):
        try:
            # ProxyJump方式挖隧道
            gate_connection = Connection(
                host=GATE_WAY['host'],
                port=GATE_WAY['port'],
                connect_kwargs={
                    'password': GATE_WAY['password'],
                },
                connect_timeout=10,
                user='micl'
            )

            web_connection = Connection(
                host=WEB_SERVER['host'],
                port=WEB_SERVER['port'],
                connect_kwargs={
                    'password': WEB_SERVER['password']
                },
                connect_timeout=10,
                gateway=gate_connection,
                user='micl',
            )
            # 此处local_port 和本地接口保持一致
            with web_connection.forward_remote(
                    local_port=LOCAL_PORT,
                    remote_port=REMOTE_PORT
            ):
                with web_connection.cd('/opt/www/sites/mgedata/'):
                    # 采用前缀方式执行命令
                    with web_connection.prefix('source /opt/py36env/bin/activate'):
                        func(*args, connection=web_connection, **kwargs)
            web_connection.close()
            gate_connection.close()

        except KeyboardInterrupt:
            if web_connection:
                web_connection.close()
            if gate_connection:
                gate_connection.close()
        except Exception as e:
            print(str(e))
            if web_connection:
                web_connection.close()
            if gate_connection:
                gate_connection.close()
        return

    # 此处直接执行函数 而非返回装饰函数
    return real_func()


@task
def test_connect(c):
    """
    测试服务器链接是否正常
    :param c:
    :return:
    """

    @dig_to_host_task
    def work(connection: Connection):
        connection.config.sudo.password = WEB_SERVER['password']
        connection.run("sudo netstat -tpln | grep ssh")


@task
def auto_update_mge(c):
    """
    自动更新服务器代码
    :param c:
    :return:
    """

    @dig_to_host_task
    def work(connection: Connection):
        # BUG 在隧道中无法设置环境变量
        # web_connection.config.run.env = {
        #     'http_proxy': f'http://127.0.0.1:{REMOTE_PORT}',
        #     'https_proxy': f'http://127.0.0.1:{REMOTE_PORT}'
        # }

        # 检查隧道连接
        connection.config.sudo.password = WEB_SERVER['password']
        connection.run("sudo netstat -tpln | grep ssh")

        with connection.prefix(f'export http_proxy=http://127.0.0.1:{REMOTE_PORT} && export '
                               f'https_proxy=$http_proxy'):
            with connection.prefix(
                    f'git remote set-url gitee-origin https://gitee.com/ustb-mge_1/mgedata.git'):
                # pty=True 启动交互模式 默认false 无法输入git账号密码
                connection.run('./update.sh', pty=True)


@task
def celery(c, command):
    """
    celery远程控制 (start，stop，restart，status)
    :param c:
    :param command: start，stop，restart，status
    :return:
    """

    @dig_to_host_task
    def work(connection: Connection):
        if command == 'start':
            connection.run('sudo /etc/init.d/celeryd start')
        elif command == 'stop':
            connection.run('sudo /etc/init.d/celeryd stop')
        elif command == 'status':
            connection.run('python manage.py get_celery_status')
            connection.run('sudo /etc/init.d/celeryd status')
        elif command == 'restart':
            connection.run('sudo /etc/init.d/celeryd restart')
        else:
            print(f'错误的命令 {command}')


@task
def celery_beat(c, command):
    """
    celery-beat远程控制 (start，stop，restart，status)
    :param c:
    :param command:
    :return:
    """

    @dig_to_host_task
    def work(connection: Connection):
        if command == 'start':
            connection.run('sudo /etc/init.d/celerybeat start')
        elif command == 'stop':
            connection.run('sudo /etc/init.d/celerybeat stop')
        elif command == 'status':
            connection.run('sudo /etc/init.d/celerybeat status')
        elif command == 'restart':
            connection.run('sudo /etc/init.d/celerybeat restart')
        else:
            print(f'错误的命令 {command}')


@task
def mge(c, command):
    """
    控制MGE项目维护或者上线 (on, off)
    :param c:
    :param command:
    :return:
    """

    @dig_to_host_task
    def work(connection):
        if command == 'on':
            connection.run('/etc/nginx/scripts/mge on')
        elif command == 'off':
            connection.run('/etc/nginx/scripts/mge off')
        else:
            print(f'错误的命令 {command}')


@task
def touch_manage(c):
    """
    touch manage.py 刷新服务器
    :param c:
    :return:
    """

    @dig_to_host_task
    def work(connection):
        connection.run('touch manage.py')
        connection.run('python manage.py compilemessages')


@task
def pull_dev_branch(c):
    """代码更新"""

    @dig_to_host_task
    def work(connection):
        # 检查隧道连接
        connection.config.sudo.password = WEB_SERVER['password']
        connection.run("sudo netstat -tpln | grep ssh")

        with connection.prefix(f'export http_proxy=http://127.0.0.1:{REMOTE_PORT} && export '
                               f'https_proxy=$http_proxy'):
            with connection.prefix(f'git remote set-url gitee-origin https://gitee.com/ustb-mge_1/mgedata.git'):
                # pty=True 启动交互模式 默认false 无法输入git账号密码
                connection.run('git pull gitee-origin dev', pty=True)


@task
def retract_data_by_history(c, history_ids):
    """
    根据上传历史id撤回数据 id之间用,分割
    :param history_ids:
    :param c:
    :return:
    """

    @dig_to_host_task
    def work(connection):
        for h_id in history_ids.split(','):
            connection.run(f'python manage.py retract_data {h_id}')


@task
def import_data(c, file_path, email):
    """
    根据压缩包路径和email导入已经上传到服务器本地的数据
    :param c:
    :param file_path:
    :param email:
    :return:
    """

    @dig_to_host_task
    def work(connection):
        connection.run(f'python manage.py import_data_from_file {file_path} {email}')

@task
def downline_mge(c):
    """
    下线服务
    """
    @dig_to_host_task
    def work(connection):
        connection.run(f'sudo uwsgi --stop /var/run/uwsgi_mgedata.pid')

@task
def update_frontend(c):
    """前端更新"""
    @dig_to_host_task
    def work(connection):
        # 检查隧道连接
        connection.config.sudo.password = WEB_SERVER['password']
        connection.run("sudo netstat -tpln | grep ssh")
        with connection.cd('/opt/www/sites/mgedata-frontend/'):
            with connection.prefix(f'export http_proxy=http://127.0.0.1:{REMOTE_PORT} && export '
                                   f'https_proxy=$http_proxy'):
                connection.run('./webpack.sh', pty=True)


@task
def local_test(c):
    """
    本地测试代码用
    :param c:
    :return:
    """
    out = c.run('echo asdasd')
    print(out)

