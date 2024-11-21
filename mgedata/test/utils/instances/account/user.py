from django.contrib.auth.hashers import make_password

from apps.account.models.users import *
from mgedata.test.utils.instances.instances import INSTANCES


def user_create():
    if "user" in INSTANCES:
        return INSTANCES[INSTANCES.index("user") + 1]
    user = User(
        username='test',
        real_name='testReal',
        email='123@123.com',
        password=make_password('123456')
    )
    user.save()
    user.password = '123456'
    INSTANCES.extend(["user", user])
    return user
