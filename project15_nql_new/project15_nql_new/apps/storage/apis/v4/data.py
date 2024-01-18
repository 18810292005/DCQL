from io import StringIO

from django.db.models import Q
from django.views import View

from apps.account.models import User
from apps.search.tasks import import_to_es
from apps.storage.models import DataMeta, Template, UploadHistory
from apps.storage.utils.serializers.common import DataMode, ParsingError
from apps.storage.utils.serializers.json import JSONHandler
from mgedata.utils.general import *
from .key_tools.tools import KeyHelper
from ...models.platform import Platforms


class DataUploadV4(View):

    def post(self, request: HttpRequest):
        """
        通过key的不登录方法提交数据
        以json文件上传的格式，通过表单批量提交数据
        :param request: httprequest
        :return: 上传数据的id列表
        """
        try:
            key = get_json_field_r(request, 'key')
            uploaded_by = get_json_field_r(request, 'upload_by')
            json_data = get_json_field_r(request, 'data')
            platform_code = get_json_field_r(request, 'platform_code')

            if platform_code is None:
                return json_response("汇交平台编号缺失", status_code=403)
            elif Platforms.verify_platform_code(platform_code) is not True:
                return json_response("汇交平台编号不正确", status_code=403)

            user = User.objects.filter(Q(username=uploaded_by) | Q(email=uploaded_by))
            if user.count() == 0:
                return json_response(msg='用户不存在', status_code=403)

            if user.count() > 1:
                return json_response(list(user.values('username')), msg='用户不唯一', status_code=403)

            user = user.first()

            if not KeyHelper.checkout_key(key):
                return json_response(msg='key error', status_code=403)

            fp = StringIO()
            handler = JSONHandler(DataMode.READ, is_api=True)
            json.dump(json_data, fp)
            fp.seek(0)
            temp_dir = mkdtemp()
            meta_list = list()
            meta_list.extend(handler.read_data(fp, user.username, temp_dir))
            DataMeta.importing_objects.filter(id__in=meta_list).update(importing=False, platform_belong=platform_code)
            fp.close()
            h = UploadHistory(user_id=user.username, source=None, meta_id_list=meta_list, via_file=True,
                              count=len(meta_list),
                              category=handler.template.category, platform_belong=platform_code)
            h.save()
            import_to_es.delay(meta_list)
            return json_response(data={"id_list": meta_list})

        except ValueError as ex:
            raise MGEError.BAD_PARAMETER(str(ex))
        except ParsingError as e:
            raise MGEError.BAD_DATA(e.message)


class DataSyncCommitView(View):

    def post(self, request: HttpRequest):
        """
        客户端同步本地数据到私有空间的方法
        :param request: http request
        :return: datameta.id or conflict error
        """

        try:
            version = get_json_field_r(request, 'version')
            modify_data_content = get_json_field_r(request, 'data')
            dm_id = modify_data_content.get('meta').get('id')
            old_data_meta = DataMeta.objects.get(pk=dm_id)
            if old_data_meta.is_public:
                return json_response(status_code=400, msg="data already public")
            if old_data_meta.sync_version < version:
                template = old_data_meta.template
                new_version = self._modify_a_data(modify_data_content, old_data_meta, template, version)
                return json_response({'id': dm_id, 'new_version': new_version})
            else:
                return json_response(status_code=400, msg="version conflict")

        except ValueError as e:
            raise MGEError.BAD_PARAMETER(str(e))
        except DataMeta.DoesNotExist as e:
            raise MGEError.NOT_FOUND(str(e))

    @staticmethod
    def _modify_a_data(data: dict, data_meta: DataMeta, template: Template, new_version):
        meta = data['meta']
        source = meta.get('source', {})
        meta["reference"] = source.get('reference')
        meta["source"] = ' '.join([DataMeta.SourceHelper.REPRESENTATION_HEADER,
                                   DataMeta.SourceHelper.VERSION_1,
                                   source.get('methods'),
                                   source.get('source'),
                                   DataMeta.SourceHelper.REPRESENTATION_END])
        content = data['content']
        template.modify_data(data_meta, meta_dict=meta, content_dict=content)
        data_meta.sync_version = new_version
        data_meta.save()
        return new_version

    @staticmethod
    def put(request: HttpRequest):
        """
        公开私有空间数据的方法,并同步到es
        :param request:
        :return:
        """
        id_list = get_json_field_r(request, 'id_list')
        if not isinstance(id_list, list):
            return json_response(status_code=400, msg="error id_list not a list object")
        try:
            for id in id_list:
                data_meta = DataMeta.objects.get(pk=id)
                data_meta.is_public = True
                data_meta.save()

            import_to_es.delay(id_list)
            return json_response(id_list)
        except DataMeta.DoesNotExist as e:
            raise MGEError.NOT_FOUND(str(e))
