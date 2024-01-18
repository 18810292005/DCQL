"""
WSGI config for mgedata project.

It exposes the WSGI callable as a module-level variable named ``application``.

"""

import os

from django.core.wsgi import get_wsgi_application

from mgedata.settings import BASE_DIR

if os.getenv('MGEDATA_CN_PRODUCTION', False):
    settings_path = 'mgedata.prod_settings'
elif os.getenv('MGEDATA_CN_GITLABCI', False):
    settings_path = 'mgedata.ci_settings.py'
elif os.path.exists(os.path.join(BASE_DIR, 'mgedata/local_settings.py')):
    settings_path = 'mgedata.local_settings'
else:
    settings_path = 'mgedata.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_path)


def mge_get_wsgi_application():
    wsgi_application = get_wsgi_application()
    from apps.mge.models import PersistentVariables, PVEnum
    PersistentVariables.set_variable(PVEnum.MATERIAL_PROJECT_LOCK.value, True)
    return wsgi_application


application = mge_get_wsgi_application()
