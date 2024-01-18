from django.http.request import HttpRequest
from django.views import View

from apps.storage.trans.api import DataToApiResponseBody, ApiToData
from apps.storage.trans.db import DbToData, DataToDb, DeletedDbToData, DataToOriginDb
from apps.storage.models import UploadHistory, MaterialCategory, DataPublicRange
from apps.account.auth import check_login
from mgedata.utils.general import json_response
from mgedata.errors.models import MGEError


class DataManager(View):

    def get(self, request: HttpRequest, meta_id=None):
        if meta_id is None:
            raise MGEError.NOT_FOUND

        try:
            data = DbToData(meta_id).to()
            return json_response(DataToApiResponseBody(data).to())
        except ValueError as e:
            raise MGEError.BAD_REQUEST(str(e))

    def post(self, request: HttpRequest):
        check_login(request, is_api=True)
        try:
            data = ApiToData(request).to()
            data.check()
            trans = DataToDb(data)
            meta_id = trans.to()
            h = UploadHistory(user_id=request.user, meta_id_list=[meta_id], via_file=False,
                              count=1, category=MaterialCategory.objects.get(pk=data['category']))
            h.save()
            return json_response(meta_id)
        except (ValueError, TypeError, AttributeError, KeyError, MaterialCategory.DoesNotExist) as e:
            try:
                trans.roll_back()
            except UnboundLocalError:
                pass
            raise MGEError.BAD_DATA(str(e))

    def delete(self, request: HttpRequest, meta_id=None):
        check_login(request, is_api=True)
        if meta_id is None:
            raise MGEError.NOT_FOUND
        try:
            _ = DeletedDbToData(meta_id).to()
        except (ValueError, TypeError, AttributeError, KeyError) as e:
            raise MGEError.BAD_DATA(str(e))
        return json_response()

    def patch(self, request: HttpRequest, meta_id=None):
        check_login(request, is_api=True)
        try:
            origin_data = DbToData(meta_id).to()
            data = ApiToData(request).to()
            data['id'] = meta_id
            data.check()
            trans = DataToOriginDb(data)
            meta_id = trans.to()
            return json_response(meta_id)
        except (ValueError, TypeError, AttributeError, KeyError) as e:
            try:
                DataToOriginDb(origin_data).to()
            except UnboundLocalError:
                pass
            raise MGEError.BAD_DATA(str(e))


class DataPublicManager(View):

    def get(self, request: HttpRequest):
        return json_response(DataPublicRange.to_tree())
