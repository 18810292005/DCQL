from enum import Enum

from django.core.cache import cache
from django.db import models


class CacheTimeType(Enum):

    ONE_HOUR = 60*60
    HALF_DAY = 60*60*12
    ONE_DAY = 60*60*24
    TWO_DAY = 60*60*24*2
    ONE_WEEK = 60*60*24*7


class CacheKeyManager:

    @staticmethod
    def get_key(model, func: str, identifier='all'):
        """
        根据对应的名称,构建缓存key,数据库名称-功能名-标识符
        Args:
            model:      model 对象/name
            func:       功能名 models.Model from django.db import models
            identifier: 标识符(通常是model的id)
        Returns:
        """
        try:
            if isinstance(model, models.Model) or isinstance(model, models.base.ModelBase):
                return f"{model._meta.object_name}:{func}:{identifier}"
            elif isinstance(model, str):
                return f"{model}:{func}:{identifier}"
            else:
                raise ValueError('model params type should be str or models.Model')
        except Exception as e:
            raise e


class CacheKeySet:
    projects_info_field = "all_projects_info"
    # 访问量，下载量，模板数，数据数目
    analytics_field = 'analytics'
    # 获取class分类统计信息
    class_trend_field = 'class_trend_field'
    # 项目课题子课题趋势
    project_or_subject_trend_field = "project_subject_trend_field"
    # 项目验收字段
    project_acceptance_field = "project_acceptance"


class DataStatisticsCache:

    @staticmethod
    def set_data_cache(cache_key: str, cache_value, cache_time):
        """
        设置数据统计缓存,如果存在则覆盖
        Args:
            cache_key:       缓存字段,通过类CacheKeyManager管理
            cache_value:     缓存值，支持数值或者列表传入
            cache_time:      缓存时间
        """
        cache.set(cache_key, cache_value, cache_time)

    @staticmethod
    def add(cache_key, cache_value, cache_time=None):
        """
        当缓存中键不存在时向缓存中写入键值，可以设置有效期
        Args:
            cache_key: 键
            cache_value: 值
            cache_time: 有效期时间
        return:
        """
        return cache.add(cache_key, cache_value, cache_time)

    @staticmethod
    def get_data_cache(cache_key, default=None) -> list:
        """
        Args:
            cache_key: 键
            default: 默认值
        return:
        """
        value = cache.get(cache_key)
        if value is None:
            return default
        return value

    @staticmethod
    def get_many(cache_key: list, default=None):
        """
        批量获取 缓存 数据
        Args:
            cache_key: 键list
            default: 默认值
        return:
        """
        if isinstance(cache_key, list):
            default = default if default else {}
            value_dict = cache.get_many(cache_key)
            if value_dict is None:
                return default
            return value_dict
        else:
            raise ValueError('cache_key type should be list')

    @staticmethod
    def delete_data_cache(cache_key):
        """
        删除 缓存 数据
        Args:
            cache_key: 键list
        return:
        """
        cache.delete(cache_key)
