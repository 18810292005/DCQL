'''
Description: 缓存
Author: liminghong.dev
Date: 2021-05-18 20:08:47
'''

import time
import uuid
from enum import IntEnum

from django.core.cache import cache


class CachedType(IntEnum):
    LIST = 0


def _get_ES_unique_id(_str: str):
    return 'ES-' + _str


def set_list_cache(_list: list, unique_id: str = ''):
    unique_id = str(uuid.uuid1()) if not unique_id else unique_id
    es_unique_id = _get_ES_unique_id(unique_id)
    value = (CachedType.LIST, time.time(), _list)
    cache.set(es_unique_id, value, 1800)
    return unique_id


def get_list_cache(unique_id: str):
    es_unique_id = _get_ES_unique_id(unique_id)
    value = cache.get(es_unique_id)
    if value is None:
        return None
    cached_type, last_time, _list = value
    return _list
