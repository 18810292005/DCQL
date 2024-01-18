import json
import os
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse

from apps.storage.apis.v4.key_tools.tools import KeyHelper
from apps.storage.models import DataMeta, MaterialProject, Template, MaterialCategory
from apps.storage.utils.serializers import ExcelHandler, DataMode

from mgedata.errors.models import MGEError
from mgedata.utils.general import require_GET_api, get_param, json_response


# 生成离线文件 [离线校验文件 词库文件]
class ExportOfflineFiles:
    def __init__(self, dir_path):
        self._template_file_name = 'template_db.json'
        self._other_info_file_name = 'other_info_db.json'
        self._thesaurus_file_name = ''
        if Path(dir_path).is_dir():
            self.dir_path = dir_path
        else:
            raise ValueError("dir_path")

    def generate_other_info_db(self):
        other_info_dict = dict(
            (ins.name, [DataMeta.OtherInfoHelper.subject_representation(s.pk) for s in ins.materialsubject_set.all()])
            for ins in MaterialProject.objects.all())
        with open(os.path.join(self.dir_path, self._other_info_file_name), 'w') as fp:
            json.dump(other_info_dict, fp, ensure_ascii=False)

        export_url = settings.SITE_ADDR + os.path.join(settings.MEDIA_URL, settings.VALIDATE_FILE_PREFIX,
                                                       self._other_info_file_name)
        return export_url

    def generate_template_db(self):
        template_json_db = {}
        for template in Template.objects.all():
            template_json_db[template.id] = template.content
        with open(os.path.join(self.dir_path, self._template_file_name), 'w') as fp:
            json.dump(template_json_db, fp, ensure_ascii=False)
        export_url = settings.SITE_ADDR + os.path.join(settings.MEDIA_URL, settings.VALIDATE_FILE_PREFIX,
                                                       self._template_file_name)
        return export_url

    def generate_material_category_thesaurus(self, category: MaterialCategory):
        words = []
        templates = Template.objects.filter(category=category)
        for template in templates:
            handler = ExcelHandler(DataMode.WRITE, template=template)
            path_str = handler._path_str_coordinate_map.keys()
            for field in path_str:
                word = str(field).split('.')[-1].strip()
                if word not in words:
                    words.append(word)
        self._thesaurus_file_name = category.name + '.txt'
        file_path = os.path.join(self.dir_path, self._thesaurus_file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
        with open(file_path, 'w') as fp:
            fp.write('\n'.join(words))
        return settings.SITE_ADDR + os.path.join(settings.MEDIA_URL, settings.THESAURUS_FILE_PREFIX,
                                                 self._thesaurus_file_name)


@require_GET_api
def export_offline_validate_files(request):
    """
    导出离线校验文件
    Returns:
        other_info_url: 项目课题信息json文件下载url
        template_url:   template-{id:template.content}信息json文件下载url
    """
    key = get_param('key', allow_none=False, convert_to=str)
    if not KeyHelper.checkout_offline_update_key(key):
        return HttpResponse(status=403)
    path_dir = os.path.join(settings.MEDIA_ROOT, settings.VALIDATE_FILE_PREFIX)
    export_files = ExportOfflineFiles(path_dir)
    template_url = export_files.generate_template_db()
    other_info_url = export_files.generate_other_info_db()
    return json_response({'other_info_url': other_info_url, 'template_url': template_url})


@require_GET_api
def export_thesaurus(request):
    """
    按材料类别导出词库信息,一个材料类别对应一个词库
    Args:
        category_id: 材料类别id
        rebuild: 是否重新构建词库
    Returns:
        file_name:返回文件的文件名
        thesaurus_url:词库文件下载的url
    """
    key = get_param('key', allow_none=False, convert_to=str)
    category_id = get_param('id', allow_none=False, convert_to=int)
    rebuild = get_param('rebuild', allow_none=False, convert_to=bool)
    if not KeyHelper.checkout_thesaurus_key(key):
        return HttpResponse(status=403)
    try:
        category = MaterialCategory.objects.get(id=category_id)
        if category.leaf:
            path_dir = os.path.join(settings.MEDIA_ROOT, settings.THESAURUS_FILE_PREFIX)
            file_path = os.path.join(path_dir, category.name + '.txt')
            if rebuild or not os.path.exists(file_path):
                export_files = ExportOfflineFiles(path_dir)
                thesaurus_url = export_files.generate_material_category_thesaurus(category)
            else:
                thesaurus_url = settings.SITE_ADDR + os.path.join(settings.MEDIA_URL, settings.THESAURUS_FILE_PREFIX,
                                                                  category.name + '.txt')
            return json_response({'file_name': category.name + '.txt', 'thesaurus_url': thesaurus_url})
        else:
            json_response({'error': '不能导出父类别词库'}, status=404)
    except MaterialCategory.DoesNotExist:
        raise MGEError.NOT_FOUND
