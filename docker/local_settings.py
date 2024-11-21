import mongoengine
from elasticsearch_dsl import connections

from .settings import *  # noqa

SERVICE_IP = 'localhost'

mongoengine.connect('mge', host='mongodb', port=27017)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'mge',
        'HOST': 'postgres',
        'PORT': 5432,
        'USER': 'mge',
        'PASSWORD': 'm1cl@1202'
    }
}
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': f'memcached:11211',
    }
}
CELERY_BROKER_URL = f'amqp://rabbitmq:5672/'
CELERY_RESULT_BACKEND = f'cache+memcached://memcached:11211/'
CORS_ORIGIN_WHITELIST = [
    "localhost:8080",
    "localhost:8000",
    "mgedev.micl.com.cn",
]
STATIC_ROOT = '/static'
MEDIA_ROOT = '/media'
es_conn = connections.create_connection(hosts=['http://es01:9200'], timeout=3600)
if not es_conn.indices.exists(index=ES_INDEX_NAME):
    es_conn.indices.create(index=ES_INDEX_NAME, mappings=ES_MAPPING)
