# -*- coding: utf-8 -*-

from django.core.files import File

# @File   : file.py
# @Author : Yuvv
# @Date   : 2017/12/3
from apps.analytics.tasks import on_download
from apps.search.core_v2.es import meta_ids_of_query
from apps.search.models import Query
from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.storage.docs.file import RealFile
from apps.storage.models.file import DataContentFile, DataContentImage, ImageUsage
from apps.storage.utils.data_import_export import *
from mgedata.errors.models import MGEError
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
        file = generate_data_template(template_id=tid, file_format=content_type)
        return json_response(file.get_url())
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND('Template (%s) not found' % tid)


@require_role(UserRole.DATA_UPLOADER)
@require_methods_api(['POST'])
def uploaded_file(request):
    """
    通过文件提交数据
    """
    check_login(request)  # 仅登录用户可以获取或提交文件
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
    import_data(file, file_format, uploaded_by=request.user, verify_only=False)
    return json_response()


@require_methods_api(['POST'])
def verify_archive(request):
    """
    校验数据
    """
    check_login(request)  # 仅登录用户可以获取或提交文件
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
    import_data(file, file_format, uploaded_by=request.user, verify_only=True)
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
            meta_list = list(DataMeta.objects.filter(template_id=tid, id__in=meta_list).values_list('id', flat=True))
        else:
            meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据
    elif tid:
        meta_list = [x.id for x in DataMeta.objects.filter(template_id=tid, is_public=True).only('id')]
    else:
        meta_list = get_json_field_r(request, 'meta_id_list', list)
        meta_list = list(DataMeta.objects.filter(id__in=meta_list).values_list('id', flat=True))  # 过滤不存在的数据

    on_download.delay(meta_list)
    if len(meta_list) == 0:
        raise MGEError.NO_AVAILABLE_DATA
    task_or_url = export_data(request.user, meta_list, content_type, flat=flat, asynchronous=asynchronous,
                              excluded_fields=excluded,
                              included_fields=included, filename=filename, ocpmdm=target == 'ocpmdm')
    return json_response({'async': asynchronous, 'result': task_or_url.id if asynchronous else task_or_url})


@require_methods_api(['GET', 'POST', 'DELETE'])
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
        # check_login(request)  # 仅登录用户可以获取或提交文件
        try:
            file_content_type = FileContentType.IMAGE if request.POST.get('type') == 'image' else FileContentType.OTHERS
            if not request.FILES:
                raise MGEError.FIELD_MISSING('File must be set.')
            file_urls = list()
            if file_content_type.is_image:
                for file in request.FILES.getlist('files[]'):
                    file_urls.append(DataContentImage.add(file, filename=file.name).get_url())
            else:
                for file in request.FILES.getlist('files[]'):
                    file_urls.append(DataContentFile.add(file, filename=file.name).get_url())
            return json_response(file_urls)
        except ValueError as ex:
            raise MGEError.BAD_PARAMETER(str(ex))
    elif request.method == 'DELETE':
        check_login(request)  # 仅登录用户可以获取或提交文件
        return json_response()
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
