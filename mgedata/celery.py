from __future__ import absolute_import

import os
from datetime import timedelta

from celery import Celery
from celery.schedules import crontab
from django.conf import settings
from kombu import Exchange, Queue
from mgedata.load_settings import load_settings

load_settings()

try:
    mge_task_logging_path = settings.MGE_TASK_LOGGING_PATH
except AttributeError:
    mge_task_logging_path = os.path.join(settings.BASE_DIR, 'mge_task.log')
app = Celery(broker=settings.CELERY_BROKER_URL)
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(settings.INSTALLED_APPS)
app.conf.beat_schedule = {
    'beat_per_day': {
        'task': 'apps.mge.tasks.beat_per_day',
        'schedule': crontab(minute=0, hour=0),
        'options': {'queue': 'verify'}
        # 'args': (*args)
    },
    'beat_per_week': {
        'task': 'apps.mge.tasks.beat_per_week',
        'schedule': crontab(day_of_week='sunday', minute=0, hour=0),
        'options': {'queue': 'verify'}
        # 'args': (*args)
    },
    'material_projects_syn': {
        'task': 'apps.storage.tasks.material_project_syn',
        'schedule': timedelta(seconds=getattr(settings, 'PROJECT_SYNC_DELTA', 3)),  # 每3秒执行一次
        'options': {'queue': 'verify'}
    },
    'ES_heat_control': {
        'task': 'apps.search.tasks.heat_control',
        'schedule': timedelta(seconds=60),
        'options': {'queue': 'verify'}
    }
}
default_exchange = Exchange('celery', type='direct')
verify_exchange = Exchange('verify', type='direct')

app.conf.task_queues = (
    Queue('celery', default_exchange, routing_key='celery'),
    Queue('verify', verify_exchange, routing_key='verify')
)
app.conf.task_default_queue = 'celery'
app.conf.task_default_exchange = 'celery'
app.conf.task_default_routing_key = 'celery'
if __name__ == '__main__':
    app.start()
