import os

from django.http import HttpResponse
from django.utils.encoding import escape_uri_path

from apps.analytics.apis.v1.data import get_class_root, get_ins_or_abort, \
    get_class_trend, get_all_projects_info, query_mat_class, SubjectTrend, \
    get_trend_of_project_or_subject_cache
from apps.analytics.models import DataCounter, check_date, TemplateCounter, ProjectTrend
from apps.storage.models import DataMeta, MaterialSubject, Template
from apps.storage.models.material import MaterialCategory, MaterialProject
from apps.storage.utils.data_import_export import export_data_of_project_info
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response


@require_methods_api(['GET'])
def index(request):
    mc = get_class_root()
    return json_response(query_mat_class(mc))


@require_methods_api(['GET'])
def query_class(request, cid):
    mat_class = MaterialCategory.objects.filter(pk=cid).first()
    if mat_class is None:
        raise MGEError.NOT_FOUND
    return json_response(query_mat_class(mat_class))


@require_methods_api(['GET'])
def query_data(request, did: str):
    data = DataMeta.objects.filter(pk=did).first()
    if data is None:
        raise MGEError.NOT_FOUND
    else:
        return json_response(DataCounter.get_unique(data).to_list())


@require_methods_api(['GET'])
def query_template(request, tid):
    template: Template = get_ins_or_abort(Template, tid)
    return json_response(TemplateCounter.get_unique(template).to_list())


def get_time_range_or_abort(request):
    try:
        beg = int(request.GET['beg'])
        end = int(request.GET['end'])

        if check_date(beg, end) is False:
            raise MGEError.BAD_PARAMETER
        return beg, end
    except KeyError:
        raise MGEError.FIELD_MISSING
    except ValueError:
        raise MGEError.WRONG_FIELD_TYPE


@require_methods_api(['GET'])
def trend_of_class(request, cid):
    mat_class = get_ins_or_abort(MaterialCategory, cid)
    beg, end = get_time_range_or_abort(request)
    return json_response(get_class_trend(mat_class, beg, end))


@require_methods_api(['GET'])
def trend_of_subject(request, pid, sid):

    beg, end = get_time_range_or_abort(request)
    subject = get_ins_or_abort(MaterialSubject, sid)
    trend = SubjectTrend.get_unique(subject).get_trend_by_date(beg, end)
    templates, categories, ac_status = get_trend_of_project_or_subject_cache(sid, is_project=False)

    return json_response({
        'templates': templates,
        'categories': categories,
        'template_count':  trend[-1]["data"][2],
        'data_count': trend[-1]["data"][3],
        'trend': trend,
        'ac_status': ac_status
    })


@require_methods_api(['GET'])
def trend_of_project(request, pid):

    beg, end = get_time_range_or_abort(request)
    project = get_ins_or_abort(MaterialProject, pid)
    trend = ProjectTrend.get_unique(project).get_trend_by_date(beg, end)
    templates, categories, ac_status = get_trend_of_project_or_subject_cache(pid)

    return json_response({
        'templates': templates,
        'categories': categories,
        'template_count': trend[-1]["data"][2],
        'data_count': trend[-1]["data"][3],
        'trend': trend,
        'ac_status': ac_status
    })


@require_methods_api(['GET'])
def all_projects_info(request):
    projects_info = get_all_projects_info()
    return json_response(data=projects_info)


@require_methods_api(['GET'])
def download_all_projects_info(request):
    """
        将项目信息写入到excel表格中
    Args:
        request:
    Returns:
    """
    projects_info = get_all_projects_info()
    project_header_name = ["项目编号", "项目名", "项目负责人", "模板数", "已汇交数据量", "应汇交数据量",
                           "表格数量", "图片数量", "文件数量", "数据大小", "验收状态"]
    path = export_data_of_project_info(projects_info, project_header_name)
    try:
        file_name = os.path.basename(path)  # 文件名
        with open(path, 'rb') as f:
            response = HttpResponse(
                f.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = 'attachment;filename="{0}"'.format(
                escape_uri_path(file_name))
    except TypeError as e:
        response = HttpResponse(
            "文件名类型错误,下载失败!", content_type="text/plain;charset=utf-8")
    except IOError as e:
        print('file {} not exist {}'.format(path, e))
        response = HttpResponse(
            "文件不存在,下载失败!", content_type="text/plain;charset=utf-8")
    return response
