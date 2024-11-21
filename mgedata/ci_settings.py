# -*- coding: utf-8 -*-
"""
Django settings for mgedata project.
"""

import os

from celery import platforms
from django.utils.translation import gettext_lazy
import mongoengine as me
import time

SERVICE_IP = '127.0.0.1'
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '43r#ca$@a6r2%^pfwsow=wno8t6xo#zxn9x(jr12c5)h6j=!0t'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'oauth2_provider',
    'corsheaders',
    'rest_framework',
    'apps.mge',
    'apps.storage',
    'apps.account',
    'apps.search',
    'apps.analytics',
    'apps.service',
    'apps.ticketing',
    'apps.task',
    'apps.sso_server',
    'apps.image_search',
    'apps.certificate'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'mgedata.utils.middleware.MGEExceptionMiddleware',
    'mgedata.utils.middleware.TimezoneMiddleware',
    'mgedata.utils.middleware.GlobalRequestMiddleware',
    'apps.service.middleware.UserVisitsMiddleware',
    'mgedata.utils.middleware.TrackUserMiddleware',
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'oauth2_provider.backends.OAuth2Backend',
)

ROOT_URLCONF = 'mgedata.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'mgedata.context_processors.site_settings',
                'mgedata.context_processors.inject_media_url',
                'mgedata.context_processors.inject_user_roles'
            ],
            'builtins': ['mgedata.filters_and_tags'],
        },
    },
]

WSGI_APPLICATION = 'mgedata.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'zh-hans'

LANGUAGES = (
    ('en-us', gettext_lazy('English')),
    ('zh-hans', gettext_lazy('简体中文')),
)

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = False

USE_L10N = True

USE_TZ = True

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# account settings
AUTH_USER_MODEL = 'account.User'
AVATAR_DIR = os.path.join(MEDIA_ROOT, 'avatars')

# TODO: just test gitlab CI
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'project_ci_test',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'postgres',
        'PORT': '5432'
    }
}

# 缓存 memcached
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION': SERVICE_IP + ':11211',
    }
}

# mongoengine 连接 mongodb。默认本地默认端口，如需修改取消注释修改
me.connection.disconnect()
me.connect('mgedata',
           host=SERVICE_IP, port=27017,
           username='root',
           password='root')

# celery 设置（主要是RabbitMQ连接和memcached后端）
platforms.C_FORCE_ROOT = True
CELERY_BROKER_URL = f'amqp://{SERVICE_IP}:5672/'
CELERY_RESULT_BACKEND = f'cache+memcached://{SERVICE_IP}:11211/'
CELERYD_HIJACK_ROOT_LOGGER = False
CELERY_ACCEPT_CONTENT = ['application/json', 'pickle']
CELERY_RESULT_SERIALIZER = 'pickle'
CELERY_TASK_SERIALIZER = 'json'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        # 'file': {
        #     'level': 'INFO',
        #     'filters': ['require_debug_false'],
        #     'class': 'logging.handlers.RotatingFileHandler',  # 容易出现 IOError，添加 noreload 参数即可
        #     'filename': os.path.join(BASE_DIR, 'debug.log'),
        #     'maxBytes': 25 * 1024 * 1024,
        #     'backupCount': 40,
        #     'formatter': 'verbose'
        # },
        # 'sentry': {
        #     'level': 'ERROR',
        #     'class': 'raven.contrib.django.handlers.SentryHandler',
        # },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'oauthlib': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        # 'celery.task': {
        #     'handlers': ['console', 'sentry'],
        #     'level': 'DEBUG',
        #     'propagate': False,
        # },
    },
}

# 邮件的设置
DEFAULT_FROM_EMAIL = 'admin@mgedata.cn'

# 站点 BASE URL。要么为空即`r''`表示没有前缀，
# 不为空时末尾一定要加 / ，如 `r'mge/dev/`
SITE_BASE_URL = r''
SITE_ADDR = r'https://www.mgedata.cn'
# login_required 装饰器默认的跳转链接，注意与 BASE_URL 对应
LOGIN_URL = '/account/login/'
# celery 设置（主要是RabbitMQ连接和memcached后端）
CELERY_BROKER_URL = 'amqp://guest:guest@rabbitmq:5672'
CELERY_RESULT_BACKEND = 'cache+memcached://127.0.0.1:11211/'
CELERY_TIMEZONE = 'Asia/Shanghai'
CELERY_ACCEPT_CONTENT = ['application/json', 'pickle']
CELERY_RESULT_SERIALIZER = 'pickle'
CELERY_TASK_SERIALIZER = 'json'
# 是否启用第三方入口
ENABLE_ENTRANCE = True

FILE_UPLOAD_PERMISSIONS = 0o777

VER = time.strftime('%Y%m%d%H%M%S')

# OAuth2 的配置
CORS_ORIGIN_ALLOW_ALL = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'mgedata.utils.pagination.MgePageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'URL_FORMAT_OVERRIDE': None,
}

# 大文件上传 外部服务器配置
# BIG_FILE_SERVER = 'http://222.199.197.135:8080/'


# new Sso
TOKEN_GENERATE_NAME = 'mgedata'
TOKEN_GENERATE_PASSWORD = 'mgedata@micl'
SSO_URL = 'http://60.205.217.38:8888/userData/api/checkToken'
SYSTEM_ID = 'd442f93723f94d0f93a1db4b2ce5c930'
SSO_REDIRECT_URL = 'http://www.mgedata.cn:8000/storage/template/new'
# 数据加密
ENCRYPTED_TEMPLATES = []

# 项目课题信息同步
MATERIAL_PROJECT_SYN_URL = 'http://60.205.217.38:8787/mgepm/megProgectInterface/getAllProjectTopic'

# 是否启用第三方入口
ENABLE_ENTRANCE = False

TEMP_DIR = None  # 导入和导出数据时使用的临时目录，设为None则使用系统默认路径

WHITE_LIST = []  # ip白名单 具体内容在local_settings中填写

PROJECT_SYNC_DELTA = 30  # 项目同步时长，单位为秒
