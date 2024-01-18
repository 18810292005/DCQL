from elasticsearch_dsl import connections

from .settings import *  # noqa

SERVICE_IP = '192.168.81.129'

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
connections.create_connection(hosts=[f'http://{SERVICE_IP}:9200'], timeout=3600)
