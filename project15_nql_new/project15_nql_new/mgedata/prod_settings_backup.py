"""
mgedata.cn 生产环境下配置
"""

from mgedata.settings import *
from celery import platforms
from elasticsearch_dsl.connections import connections

# SECRET_KEY，使用下面的命令可以生成，只能生成一次，更改会导致cookie等失效
# >>> import random
# >>> print(''.join([random.choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50)]))
SECRET_KEY = '3@sm+6c9d3pkg7q-vi0p0dzgog(0y2q3xlg$_n0n^zgy$xb)nt'

# 关闭 debug 模式
DEBUG = False

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'www.mgedata.cn',
                 'mgedata.cn', '117.121.38.246', '192.168.66.121', '192.168.66.122']

# 站点 BASE URL。要么为空即`r''`表示没有前缀，
# 不为空时末尾一定要加 / ，如 `r'mge/dev/`
SITE_BASE_URL = r''
SITE_ADDR = r'https://www.mgedata.cn'
# 使用HTTPS的时候开启

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True

# django 连接 postgresql
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mgedata',
        'HOST': '192.168.66.121',
        'PORT': 5432,
        'USER': 'micl',
        'PASSWORD': 'm0i9c8l7'
    }
}

# 缓存 memcached
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        # 'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION': '192.168.66.121:11211',
    }
}

# mongoengine 连接 mongodb
me.connect('mgedata',
           host='192.168.66.121', port=27017,
           replicaset='mgedataRepl',
           username='micl',
           password='m0i9c8l7')
# 日志配置
LOGGING['handlers']['file']['level'] = 'WARNING'
LOGGING['handlers']['file']['filename'] = '/var/log/mgedata/mge.log'

# 静态文件 （下面这几个必须设置）
STATIC_URL = '/static/mgedata/'
STATIC_ROOT = '/opt/www/_static/mgedata'
MEDIA_URL = '/media/mgedata/'
MEDIA_ROOT = '/opt/www/_media/mgedata'
AVATAR_DIR = os.path.join(MEDIA_ROOT, 'avatars')

# celery 相关设置
platforms.C_FORCE_ROOT = True
CELERY_BROKER_URL = 'amqp://micl:m1cl9ueue@192.168.66.121:5672/mgedata'
CELERY_RESULT_BACKEND = 'cache+memcached://192.168.66.121:11211/'
CELERYD_HIJACK_ROOT_LOGGER = False
CELERY_ACCEPT_CONTENT = ['application/json', 'pickle']
CELERY_RESULT_SERIALIZER = 'pickle'
CELERY_TASK_SERIALIZER = 'json'

# 站点 BASE URL。
# 要么为空即`r''`表示没有前缀，
# 不为空时末尾一定要加 / ，如 `r'mge/dev/`
SITE_BASE_URL = ''
SITE_ADDR = r'https://www.mgedata.cn'
# login_required 装饰器默认的跳转链接，注意与 BASE_URL 对应
LOGIN_URL = '/account/login/'

# elasticsearch连接
connections.create_connection(hosts=['http://192.168.66.123:9200'], timeout=3600)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_USE_TLS = False
EMAIL_HOST = 'smtp.163.com'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'mgedatabase@163.com'
EMAIL_HOST_PASSWORD = 'micljdl1202'
DEFAULT_FROM_EMAIL = 'mgedatabase@163.com'

# 是否启用第三方入口
ENABLE_ENTRANCE = True

# 大文件上传 外部服务器配置
# BIG_FILE_SERVER = 'http://222.199.197.135:8080/'

# new Sso
TOKEN_GENERATE_NAME = 'mgedata'
TOKEN_GENERATE_PASSWORD = 'mgedata@micl'
SSO_URL = 'http://10.0.3.200/mgedcs/userData/api/checkToken'
SSO_REDIRECT_URL = 'http://mgedata.ustb.edu.cn/storage/data/new'
SYSTEM_NUMBER = '02'
USER_ROLE_ORDER = {"userRole": '0', "userRoleForAcceptance": '1'}
SYSTEM_NAME = "离散汇交子系统"
# 南大通用管理平台编号：mge编号

# 数据加密
ENCRYPTED_TEMPLATES = []

# 项目课题信息同步
MATERIAL_PROJECT_VERSION_URL = 'http://10.0.3.200:8090/mgepm/megProgectInterface/getVersion'
MATERIAL_PROJECT_GET_URL = 'http://10.0.3.200:8090/mgepm/megProgectInterface/getAllProjectTopic'
