from apps.storage.docs.data import DataContent, DataFieldContainer, DataFieldTableRow, DataFieldTable
from apps.storage.models.data import DataMeta
from bson.objectid import ObjectId
from functools import wraps


class RollBackHelper(object):
    _data_meta_oid = None
    _data_content_oid = None
    _container_oid_list = []  # 回滚时使用，记录生成的container文档oid
    _table_oid_list = []  # 回滚时使用
    _row_oid_list = []  # 回滚时使用

    @classmethod
    def set_data_meta_id(cls, oid):
        cls._data_meta_oid = oid
        return

    @classmethod
    def set_data_content_id(cls, oid):
        cls._data_content_oid = oid
        return

    @classmethod
    def rollback_task(cls, func):
        @wraps(func)
        def inner(*args, **kwargs):
            try:
                cls.clear_oid_record_history()
                return func(*args, **kwargs)
            except Exception:
                """
                回滚
                """
                DataFieldTable.objects(pk__in=cls._table_oid_list).delete()
                DataFieldTableRow.objects(pk__in=cls._row_oid_list).delete()
                DataFieldContainer.objects(pk__in=cls._container_oid_list).delete()
                if cls._data_content_oid is not None:
                    DataContent.objects(pk=cls._data_content_oid).delete()
                if cls._data_meta_oid is not None:
                    DataMeta.objects.filter(pk=cls._data_meta_oid).delete()
                cls.clear_oid_record_history()
                raise

        return inner

    @classmethod
    def generate_object_id_for(cls, field_type):
        object_id = ObjectId()
        if field_type is DataFieldContainer.__class__:
            cls._container_oid_list.append(object_id)
        elif field_type is DataFieldTable.__class__:
            cls._table_oid_list.append(object_id)
        elif field_type is DataFieldTableRow.__class__:
            cls._row_oid_list.append(object_id)
        elif field_type is DataContent.__class__:
            cls._data_content_oid = object_id
        return object_id

    @classmethod
    def clear_oid_record_history(cls):
        cls._row_oid_list.clear()
        cls._table_oid_list.clear()
        cls._container_oid_list.clear()
        cls._data_meta_oid = None
        cls._data_content_oid = None
        return
