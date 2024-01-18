from functools import wraps

INSTANCES = []


def instance(func):
    @wraps(func)
    def inner(self):
        INSTANCES.clear()
        func(self)
        return

    return inner


def instance_v2(func):
    @wraps(func)
    def inner(self):
        INSTANCES.clear()
        func(self)
        return

    return inner
