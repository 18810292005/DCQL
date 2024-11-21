# -*- coding: utf-8 -*-
import os
import uuid
import zipfile

from PIL import Image
from PIL.Image import FLIP_LEFT_RIGHT
from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import FileResponse

# @File   : file.py
# @Author : Yuvv
# @Date   : 2017/12/3
from apps.search.core_v2.es import meta_ids_of_query
from apps.search.models import Query
from apps.storage.docs.file import RealFile
from apps.storage.models.file import DataContentFile, DataContentImage, ImageUsage, TemporaryExportedFile
from apps.storage.models.material import ProjectSubjectMember
from apps.storage.utils.data_import_export import *
from mgedata.utils.general import *


@require_GET_api
def template_file(request, tid):
    """
    get: 获取数据模板文件下载链接
        params: 数据放在 GET 部分
            type: str, required，需导出的文件类型，值为 XLSX/JSON/XML 中的一种
        return: 返回文件下载链接
    """
    check_login(request)  # 仅登录用户可以获取数据模板文件信息
    try:
        content_type = request.GET.get('type', '').upper()
        if content_type not in ('XLSX', 'JSON', 'XML'):
            raise MGEError.BAD_PARAMETER('Data type must be "XLSX", "XML" or "JSON"!')
        content_type = FileContentType[content_type]
        if not ProjectSubjectMember.objects.filter(user=request.user).exists():
            raise MGEError.PROJECT_OR_SUBJECT_NOT_FOUND("您不属于任何组织机构，无法下载填写模板")
        file = generate_data_template(template_id=tid, file_format=content_type)
        return json_response(file.get_url())
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND('Template (%s) not found' % tid)


@require_role(UserRole.RESEARCHER)
@require_methods_api(['POST'])
def uploaded_file(request):
    """
    通过文件提交数据
    """
    check_login(request)  # 仅登录用户可以获取或提交文件

    # 获取上传类型，检查正确性
    upload_filetype = request.POST.get("upload_filetype")
    try:
        sync = request.POST.get("sync")
        sync = True if sync == "true" else False
    except:
        sync = False
    if not upload_filetype or upload_filetype.upper() not in ["JSON", "EXCEL", "XML"]:
        upload_filetype = "OTHERS"
        # raise MGEError.BAD_DATA('所选的上传类型错误')
    upload_filetype = upload_filetype.upper()
    # 获取template_id检查正确性
    try:
        template_id = eval(request.POST.get("template_id"))
    except Exception as e:
        template_id = -1
        # raise MGEError.BAD_DATA('模板ID错误')

    if not request.FILES:
        raise MGEError.BAD_DATA('缺少文件字段')
    file = request.FILES.get('file')
    ext = os.path.splitext(file.name)[1].upper()
    if ext in ('.XLSX', '.JSON', '.XML'):
        file_format = FileContentType[ext[1:]]
    elif ext in ('.RAR', '.ZIP', '.7Z', '.GZ', '.XZ', '.BZ2', '.TAR'):
        file_format = FileContentType.ARCHIVE
    else:
        raise MGEError.BAD_PARAMETER('Data type `%s` is not supported!' % ext)

    import_data(file, file_format, uploaded_by=request.user,
                upload_filetype=upload_filetype, template_id=template_id, verify_only=False, sync=sync)
    return json_response()


@require_role(UserRole.RESEARCHER)
@require_methods_api(['POST'])
def batch_uploaded_file(request):
    """
    通过文件提交数据
    """
    check_login(request)  # 仅登录用户可以获取或提交文件

    # 获取上传类型，检查正确性
    upload_filetype = request.POST.get("upload_filetype")
    try:
        files_str = request.POST.get("files_path")
        files_str = json.loads(files_str)
        files_name = list(files_str.keys())
        files_path = list(files_str.values())
    except:
        files_path = []
        files_name = []
    try:
        sync = request.POST.get("sync")
        sync = True if sync == "true" else False
    except:
        sync = False
    if not upload_filetype or upload_filetype.upper() not in ["JSON", "EXCEL", "XML"]:
        upload_filetype = "OTHERS"
        # raise MGEError.BAD_DATA('所选的上传类型错误')
    upload_filetype = upload_filetype.upper()
    # 获取template_id检查正确性
    try:
        template_id = eval(request.POST.get("template_id"))
    except Exception as e:
        template_id = -1
        # raise MGEError.BAD_DATA('模板ID错误')
    # files = json.loads(request.POST.get("files"))
    try:
        status = {"error": "文件上传失败"}
        if not request.FILES and len(files_path) == 0:
            raise MGEError.FIELD_MISSING('必须提供文件')
        once_succeed = False
        once_failed = False
        if len(files_path) != 0:
            files = []
            try:
                for file in files_path:
                    if settings.DEBUG:
                        file = open(file.replace('/media/_fs/data_files', 'media/_fs/data_files'), "rb")
                        files.append(file)
                    else:
                        file = DataContentFile.objects.get(
                            file=file.replace('/media/_fs/data_files', '_fs/data_files')).file
                        files.append(file)
            except FileNotFoundError as e:
                raise MGEError.SUMMIT_ERROR("文件 " + str(e.filename) + " 找不到或未上传成功")
        else:
            files = request.FILES.getlist('files')
        idx = 0
        for file in files:
            status["error"] = ""
            if len(files_path) != 0:
                file_key = files_name[idx]
            else:
                file_key = file.name
            idx = idx + 1
            if file_key in status:
                file_key = file_key + "(" + str(uuid.uuid4()) + ")"
            try:
                status[file_key] = {"error": ""}
                ext = os.path.splitext(file.name)[1].upper()
                if ext in ('.XLSX', '.JSON', '.XML'):
                    file_format = FileContentType[ext[1:]]
                elif ext in ('.RAR', '.ZIP', '.7Z', '.GZ', '.XZ', '.BZ2', '.TAR'):
                    file_format = FileContentType.ARCHIVE
                else:
                    raise MGEError.BAD_PARAMETER('Data type `%s` is not supported!' % ext)
                result = import_data(file, file_format, uploaded_by=request.user,
                                     upload_filetype=upload_filetype, template_id=template_id, verify_only=False,
                                     sync=sync)
                status[file_key] = result
                once_succeed = True
            except Exception as e:
                once_failed = True
                status[file_key] = {"error": str(e)}
        if not once_failed:
            return json_response(status)
        elif once_succeed and once_failed:
            raise MGEError.SUMMIT_PART_ERROR(status)
        else:
            raise MGEError.SUMMIT_ERROR(status)
    except ValueError as ex:
        raise MGEError.BAD_PARAMETER(str(ex))


@require_methods_api(['POST'])
def verify_archive(request):
    """
    校验数据
    """
    check_login(request)  # 仅登录用户可以获取或提交文件
    # 获取上传类型，检查正确性
    upload_filetype = request.POST.get("upload_filetype")
    if not upload_filetype or upload_filetype.upper() not in ["JSON", "EXCEL", "XML"]:
        upload_filetype = "OTHERS"
        # raise MGEError.BAD_DATA('所选的上传类型错误')
    upload_filetype = upload_filetype.upper()
    # 获取template_id检查正确性
    try:
        template_id = eval(request.POST.get("template_id"))
    except Exception as e:
        template_id = -1
        # raise MGEError.BAD_DATA('模板ID错误')
    if not request.FILES:
        raise MGEError.BAD_DATA('缺少文件字段')
    file = request.FILES.get('file')
    ext = os.path.splitext(file.name)[1].upper()
    if ext in ('.XLSX', '.JSON', '.XML'):
        file_format = FileContentType[ext[1:]]
    elif ext in ('.RAR', '.ZIP', '.7Z', '.GZ', '.XZ', '.BZ2', '.TAR'):
        file_format = FileContentType.ARCHIVE
    else:
        raise MGEError.BAD_PARAMETER('Data type `%s` is not supported!' % ext)
    import_data(file, file_format, uploaded_by=request.user,
                upload_filetype=upload_filetype, template_id=template_id, verify_only=True)
    return json_response()


@require_POST_api
@login_required_api
def data_export(request):
    """
    get: 导出数据到临时文件，生成任务ID
        params: 数据放在 GET 部分
            type: str, required，需导出的文件类型，值为 XLSX/JSON/XML 中的一种
            num: int, 数量限制，获取最新的几条，-1 为不限制，如果设置了此值则 dids 无效
            dids: list，如果设置则为导出此列表中包含的所有数据
        return: 返回文件下载链接
    """
    check_login(request)  # 仅登录用户可以获取数据模板文件信息

    if get_json_field_r(request, 'format', str) == "pdf":
        response = HttpResponse(content_type="application/pdf")
        # response = FileResponse(open(r"apps\storage\apis\v2\output.pdf", 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="modified.pdf"'
        response.write(open(r"apps\storage\apis\v2\output.pdf", 'rb').read())
        return response
    else:
        content_type = FileContentType[get_json_field_r(request, 'format', str, allowed=('XLSX', 'JSON', 'XML'))]
        flat = get_json_field_r(request, 'flat', bool, allow_none=True)
        asynchronous = get_json_field_r(request, 'async', bool, allow_none=True, default=True)
        tid = get_json_field_r(request, 'tid', str, allow_none=True)
        target = get_json_field_r(request, 'target', str, allow_none=True, default='').lower()
        filename = get_json_field_r(request, 'filename', allow_none=True)
        excluded = get_json_field_r(request, 'excluded_fields', list, allow_none=True) or ()
        included = get_json_field_r(request, 'included_fields', list, allow_none=True) or ()
        query_id = get_json_field_r(request, 'query_id', int, allow_none=True)
        if excluded and included:
            included = ()
        if query_id:
            try:
                ins = Query.objects.get(pk=query_id)
            except Query.DoesNotExist as e:
                raise MGEError.BAD_PARAMETER(str(e))
            meta_list = meta_ids_of_query(ins.q, ins.download)
            if tid:
                meta_list = list(
                    DataMeta.objects.filter(template_id=tid, id__in=meta_list).values_list('id', flat=True))
            else:
                meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据
        elif tid:
            meta_list = [x.id for x in DataMeta.objects.filter(template_id=tid).only('id')]
        else:
            meta_list = get_json_field_r(request, 'meta_id_list', list)
            meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据

        if len(meta_list) == 0:
            raise MGEError.NO_AVAILABLE_DATA("数据已丢失或被删除")
        task_or_url = export_data(request.user, meta_list, content_type, flat=flat, asynchronous=asynchronous,
                                  excluded_fields=excluded,
                                  included_fields=included, filename=filename, ocpmdm=target == 'ocpmdm')
        return json_response({'async': asynchronous, 'result': task_or_url.id if asynchronous else task_or_url})


@require_POST_api
@login_required_api
def batch_data_export(request):
    check_login(request)  # 仅登录用户可以获取数据模板文件信息
    batches = load_request_body(request)["batches"]
    task_or_urls = []
    for batch in batches:
        content_type = FileContentType[get_field(batch, 'format', str, allowed=('XLSX', 'JSON', 'XML'))]
        flat = get_field(batch, 'flat', bool, allow_none=True)
        asynchronous = get_field(batch, 'async', bool, allow_none=True, default=True)
        tid = get_field(batch, 'tid', str, allow_none=True)
        target = get_field(batch, 'target', str, allow_none=True, default='').lower()
        filename = get_field(batch, 'filename', allow_none=True)
        excluded = get_field(batch, 'excluded_fields', list, allow_none=True) or ()
        included = get_field(batch, 'included_fields', list, allow_none=True) or ()
        query_id = get_field(batch, 'query_id', int, allow_none=True)
        if excluded and included:
            included = ()
        if query_id:
            try:
                ins = Query.objects.get(pk=query_id)
            except Query.DoesNotExist as e:
                raise MGEError.BAD_PARAMETER(str(e))
            meta_list = meta_ids_of_query(ins.q, ins.download)
            if tid:
                meta_list = list(
                    DataMeta.objects.filter(template_id=tid, id__in=meta_list).values_list('id', flat=True))
            else:
                meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据
        elif tid:
            meta_list = [x.id for x in DataMeta.objects.filter(template_id=tid).only('id')]
        else:
            meta_list = get_json_field_r(request, 'meta_id_list', list)
            meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据

        if len(meta_list) == 0:
            raise MGEError.NO_AVAILABLE_DATA
        task_or_url = export_data(request.user, meta_list, content_type, flat=flat, asynchronous=asynchronous,
                                  excluded_fields=excluded,
                                  included_fields=included, filename=filename, ocpmdm=target == 'ocpmdm')
        task_or_urls.append(task_or_url.id if asynchronous else task_or_url)
    if not asynchronous and len(task_or_urls) > 1:
        temp_dir = None
        try:
            temp_dir = mkdtemp()
            file_dir = os.path.join(temp_dir, 'files')
            os.makedirs(file_dir, exist_ok=True)
            random_number = f'{random.randint(0, 9999):04d}'
            archive_name = f'{timezone.now().strftime("%Y%m%d%H%M%S")}_{random_number}'
            archive = os.path.join(temp_dir, archive_name)
            mge_make_archive(archive, 'zip', root_dir=file_dir)
            archive += '.zip'
            archive_name += '.zip'
            zip_file_path = archive
            with zipfile.ZipFile(zip_file_path, "w") as zipf:
                for task_or_url in task_or_urls:
                    head, tail = os.path.split(task_or_url)
                    # DEBUG 的时候用这个
                    # temp_exported_file = os.path.join(head[len("/"):], tail)
                    temp_exported_file = task_or_url
                    zipf.write(temp_exported_file)
            with open(zip_file_path, 'rb') as f:
                url = TemporaryExportedFile.add(f, content_type=FileContentType.ARCHIVE, filename=archive_name,
                                                randomize=False).get_url()
        finally:
            shutil.rmtree(temp_dir)
        task_or_urls = [url]
    return json_response({'async': asynchronous, 'result': task_or_urls})


def _verify_image(file: InMemoryUploadedFile):
    try:
        im = Image.open(file.file)
        im.verify()
        file.file.seek(0)
        im = Image.open(file.file)
        im.transpose(FLIP_LEFT_RIGHT)
        file.file.seek(0)
        return True
    except Exception as e:
        return False


@require_methods_api(['GET', 'POST'])
@require_role(UserRole.RESEARCHER)
def uploaded_data_content_file(request):
    """
    post: 提交数据文件（数据文件格式需符合原来生成的模板）
        params: 数据放在 POST 部分
            file: 提交的数据文件
        return: 提交成功的文件的 id
    delete:
        params: none
        return: none
    """
    if request.method == 'POST':
        try:
            file_content_type = FileContentType.IMAGE if request.POST.get('type') == 'image' else FileContentType.OTHERS
            if not request.FILES:
                raise MGEError.FIELD_MISSING('File must be set.')
            file_urls = list()
            if file_content_type.is_image:
                table = DataContentImage
            else:
                table = DataContentFile
            for file in request.FILES.getlist('files[]'):
                if file_content_type.is_image and not _verify_image(file):
                    raise MGEError.BAD_IMAGE('Invalid image file.')
                basename, ext = os.path.splitext(file.name)
                file.name = f'{uuid.uuid4()}{ext}'
                file_urls.append(table.add(file, filename=file.name, randomize=False).get_url())
            return json_response(file_urls)
        except ValueError as ex:
            raise MGEError.BAD_PARAMETER(str(ex))
    # 文件下载api
    elif request.method == 'GET':
        real_file_id = request.GET.get('id')
        if not real_file_id:
            raise MGEError.FIELD_MISSING('id must be set.')
        elif len(real_file_id) != 24:
            raise MGEError.BAD_PARAMETER('invalid id.')
        file = RealFile.get(real_file_id)
        if file.file.content_type == "application/octet-stream":
            abstract_file = DataContentFile.objects.filter(pk=file.abstract_file_id)
        else:
            abstract_file = DataContentImage.objects.filter(pk=file.abstract_file_id)
        if file is None or len(abstract_file) == 0:
            return HttpResponse(status=404)
        else:
            file_name = abstract_file.first().file.url
            file_name = file_name.split("/")[-1]
            response = HttpResponse(file.file.read(), content_type=file.file.content_type)
            response['Content-Disposition'] = 'attachment; filename=' + file_name
            return response


@require_POST_api
def big_file_upload_confirm(request):
    file_path = get_json_field_r(request, 'path')
    file_name = get_json_field_r(request, 'name')
    basename, ext = os.path.splitext(file_name)
    if not ext:
        ext = ''
    new_filename = f'{basename}.{datetime.now().strftime("%Y%m%d%H%M%S")}{ext}'

    instance = DataContentFile()
    with open(file_path, 'rb') as f:
        instance.file.save(new_filename, File(f))
    # delete file
    os.remove(file_path)
    return json_response(instance.get_url())


@require_GET_api
def all_data_images(request):
    results = [ins.get_url() for ins in DataContentImage.objects.all()]
    return json_response(results)


@require_GET_api
def all_images_with_meta(request):
    usage = ImageUsage.objects.all()
    res_list = list()
    for use in usage:
        res_list.append({'url': use.file.get_url(), 'meta': use.meta.to_dict(meta_only=True)})
    return json_response(res_list)
