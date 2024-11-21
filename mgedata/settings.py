# -*- coding: utf-8 -*-
"""
Django settings for mgedata project.
"""

import os
import time

import mongoengine as me
from celery import platforms
from django.utils.translation import gettext_lazy

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SECRET_KEY = 'iij1wj@!bz&^vue3c(x%evl&65@l&h%t8po+rzc2kbc(^&=96r'
ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'daterange_filter',
    'apps.mge',
    'apps.storage',
    'apps.account',
    'apps.search',
    'apps.analytics',
    'apps.service',
    'apps.task',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'mgedata.utils.middleware.MGEExceptionMiddleware',
    'mgedata.utils.middleware.TimezoneMiddleware',
    'mgedata.utils.middleware.GlobalRequestMiddleware',
    'mgedata.utils.middleware.TokenLoginMiddleware',
    'mgedata.utils.middleware.OnlineCountMiddleware',
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

X_FRAME_OPTIONS = 'ALLOWALL'

ROOT_URLCONF = 'mgedata.urls'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mgedata',
        'HOST': 'localhost',
        'PORT': 5432,
        'USER': 'micl',
        'PASSWORD': 'micl'
    }
}

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

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
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

USE_I18N = True

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
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
# account settings
AUTH_USER_MODEL = 'account.User'
AVATAR_DIR = os.path.join(MEDIA_ROOT, 'avatars')

# celery 设置（主要是RabbitMQ连接和memcached后端）
platforms.C_FORCE_ROOT = True
CELERY_BROKER_URL = f'amqp://localhost:5672/'
CELERY_RESULT_BACKEND = f'cache+memcached://localhost:11211/'
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
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'file': {
            'level': 'INFO',
            'filters': ['require_debug_false'],
            'class': 'logging.handlers.RotatingFileHandler',  # 容易出现 IOError，添加 noreload 参数即可
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'maxBytes': 25 * 1024 * 1024,
            'backupCount': 40,
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
    }
}

PDF_API = None
# 邮件的设置
# DEFAULT_FROM_EMAIL = 'admin@mgedata.cn'
EMAIL_USE_TLS = False
EMAIL_HOST = 'smtp.163.com'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'mgedatabase@163.com'
EMAIL_HOST_PASSWORD = 'micljdl1202'
DEFAULT_FROM_EMAIL = 'mgedatabase@163.com'

SITE_BASE_URL = ''

# login_required 装饰器默认的跳转链接，注意与 BASE_URL 对应
LOGIN_URL = '/account/login/'

FILE_UPLOAD_PERMISSIONS = 0o777

VER = time.strftime('%Y%m%d%H%M%S')

# 是否启用第三方入口
ENABLE_ENTRANCE = False

TEMP_DIR = None  # 导入和导出数据时使用的临时目录，设为None则使用系统默认路径

WHITE_LIST = []  # ip白名单 具体内容在local_settings中填写
MEDIA_PREFIX = '_fs'
DATA_IMAGE_PREFIX = MEDIA_PREFIX + '/data_images'  # 附件图片相对于media文件夹的存储路径
DATA_FILE_PREFIX = MEDIA_PREFIX + '/data_files'  # 附件文件相对于media文件夹的存储路径
VALIDATE_FILE_PREFIX = MEDIA_PREFIX + '/validate'  # 离线校验文件相对于media文件夹的存储路径
THESAURUS_FILE_PREFIX = MEDIA_PREFIX + '/thesaurus'  # 词库文件相对于media文件夹的存储路径
SILENCED_SYSTEM_CHECKS = ["fields.W904"]
MAX_NUM_OF_IMPORT = 100000  # 最大导入数量

ES_MAPPING = {
    "properties": {
        "id": {"type": "long"},
        "template_id": {"type": "long"},
        "category_id": {"type": "long"},
        "project_id": {"type": "keyword"},
        "subject_id": {"type": "keyword"},
        "review_state": {"type": "short"},
        "visibility": {"type": "short"},
        "add_time": {"type": "date"},
        "summary": {
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "title": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "doi": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "keywords": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "abstract": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "project": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "subject": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "category": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "template": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text"},
            },
            "type": "keyword",
        },
        "username": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "real_name": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
        "institution": {
            "ignore_above": 512,
            "fields": {
                "text": {"type": "text", "analyzer": "ik_max_word"},
            },
            "type": "keyword",
        },
    }
}
ES_INDEX_NAME = 'mgedata'
