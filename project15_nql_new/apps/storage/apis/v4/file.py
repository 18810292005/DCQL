from django.views import View
from django.http import HttpRequest
from .key_tools.tools import KeyHelper
from apps.storage.models.file import DataContentFile, DataContentImage
from apps.storage.utils.data_import_export import *
from mgedata.utils.general import *
from mgedata.errors.models import MGEError


class FileUploadV4(View):

    @staticmethod
    def post(request: HttpRequest):
        """
        通过key的不登录方法提交文件
        :param request:
        :return: 成功上传的文件的路径
        """
        try:
            if not request.FILES:
                raise MGEError.FIELD_MISSING('File must be set.')
            key = request.POST.get('key')
            filename_list = request.POST.get('filenames[]')
            file_list = request.FILES.getlist('files[]')
            file_content_type = FileContentType.IMAGE if request.POST.get('type') == 'image' else FileContentType.OTHERS

            if not KeyHelper.checkout_key(key):
                return json_response(msg='key error', status_code=404)

            file_urls = list()

            if filename_list and isinstance(filename_list, str):
                filename_list = filename_list.split(',')
            else:
                filename_list = []

            if file_content_type.is_image:
                for i, file in enumerate(file_list):
                    file_urls.append(DataContentImage.add(file,
                                                          filename=filename_list[i] if i < len(
                                                              filename_list) else file.name
                                                          ).get_url())
            else:
                for i, file in enumerate(file_list):
                    file_urls.append(DataContentFile.add(file,
                                                         filename=filename_list[i] if i < len(
                                                             filename_list) else file.name
                                                         ).get_url())
            return json_response(file_urls)
        except ValueError as ex:
            raise MGEError.BAD_PARAMETER(str(ex))
