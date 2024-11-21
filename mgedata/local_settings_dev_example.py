from elasticsearch_dsl import connections

from .settings import *  # noqa

DEBUG = True
SERVICE_IP = 'localhost'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mgedata',
        'HOST': SERVICE_IP,
        'PORT': 5432,
        'USER': 'micl',
        'PASSWORD': 'micl'
    }
}
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': f'{SERVICE_IP}:11211',
    }
}
CELERY_BROKER_URL = f'amqp://{SERVICE_IP}:5672/'
CELERY_RESULT_BACKEND = f'cache+memcached://{SERVICE_IP}:11211/'
me.connect('mgedata', host=f'{SERVICE_IP}')
es_conn = connections.create_connection(hosts=[f'http://{SERVICE_IP}:9200'], timeout=3600)
if not es_conn.indices.exists(index=ES_INDEX_NAME):
    es_conn.indices.create(index=ES_INDEX_NAME, mappings=ES_MAPPING)

# 邮件设置
EMAIL_USE_TLS = False
EMAIL_HOST = 'smtp.163.com'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'mgedatabase@163.com'
EMAIL_HOST_PASSWORD = 'micljdl1202'
DEFAULT_FROM_EMAIL = 'mgedatabase@163.com'
