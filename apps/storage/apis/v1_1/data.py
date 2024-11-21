# -*- coding: utf-8 -*-

# @File   : data.py
# @Author : Yuvv
# @Date   : 2017/12/10

from django.db import transaction

from apps.account.auth import require_role
from apps.account.models.users import UserRole
from apps.search.core_v2.es import insert_meta_with_ids
from apps.storage.apis.v1_1.material import ProjectView
from apps.storage.models.data import DataMeta
from apps.storage.models.material import MaterialProject, MaterialSubject, ProjectSubjectMember
from apps.storage.models.template import Template, TemplateField
from apps.storage.utils.serializers.common import ParsingError, ParsingErrorEnum
from mgedata.errors.models import MGEError
from mgedata.utils.general import json_response, require_methods_api, load_request_body, get_param


def _submit_a_data(json_data, uploaded_by) -> DataMeta:
    meta = json_data.get('meta', None)
    if meta is None:
        raise MGEError.FIELD_MISSING('`meta` field required.')
    if not isinstance(meta, dict):
        raise MGEError.BAD_DATA('`meta` must be an dict.')
    if 'project' not in meta:
        raise MGEError.FIELD_MISSING('`project` field required.')
    if 'subject' not in meta:
        raise MGEError.FIELD_MISSING('`subject` field required.')

    content = json_data.get('content', None)
    if content is None:
        raise MGEError.FIELD_MISSING('`content` field required.')
    if not isinstance(content, dict):
        raise MGEError.BAD_DATA('`content` must be an dict.')
    try:
        template = Template.objects.get(pk=meta.get('tid'))
        if template.public is False and int(meta.get('visibility')) != 3:
            raise MGEError.FIELD_MISSING('模板为私有模板，因此该数据的`visibility`只能是私有.')
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND(f"模板不存在(id={meta.get('tid')})")
    # 判断必填
    for field in template.fields:
        check_required(field, content.get(field.field_name))
    try:
        with transaction.atomic():
            dm = template.add_data(meta, content, uploaded_by=uploaded_by, check_uploaded_files=True)
            # TODO 检查是否属于项目和课题
    except ParsingError as e:
        raise MGEError.BAD_DATA(e.message)
    except ValueError as e:
        raise MGEError.BAD_DATA(str(e))
    return dm


@require_role(UserRole.RESEARCHER)
@require_methods_api(['POST'])
def data_full(request):
    """
    提交一个完整数据
    post:
        params: request.body 部分为包含数据全部字段的 dict，dict 包括 meta 和 content 两部分
            meta 部分要包含 category(id) 和 tid 字段
        return: 成功则返回对应提交成功的 DataMeta 的 id
    """
    data = load_request_body(request, dict)
    with transaction.atomic():
        dm = _submit_a_data(data, request.user.username)
        insert_meta_with_ids([dm.id])

    return json_response(dm.id, status_code=201)



@require_methods_api(['GET'])
def get_institutes(request):
    name = get_param("name", allow_none=True)
    _queryset = list(MaterialProject.objects.order_by('id').all().select_related('leader'))
    project_id_map = {project.id: project for project in _queryset}
    project_id_users_map = {}
    for record in ProjectSubjectMember.objects.filter(
            project_id__in=[project.id for project in _queryset],
            subject__isnull=True
    ).select_related('user'):
        project_id_users_map.setdefault(record.project_id, set()).add(record.user)
    user_set: set
    for project_id, user_set in project_id_users_map.items():
        user_set.remove(project_id_map[project_id].leader)
    projects = [ins.to_dict_members(project_id_users_map) for ins in _queryset]
    _queryset = list(MaterialSubject.objects.order_by('id').all().select_related('leader', 'project'))
    subject_id_map = {subject.id: subject for subject in _queryset}
    subject_id_users_map = {}
    for record in ProjectSubjectMember.objects.filter(
            subject_id__in=[subject.id for subject in _queryset]
    ).select_related('user'):
        subject_id_users_map.setdefault(record.subject_id, set()).add(record.user)
    for subject_id, user_set in subject_id_users_map.items():
        user_set.remove(subject_id_map[subject_id].leader)
    subjects = [ins.to_dict_members(subject_id_users_map) for ins in _queryset]
    institutes = {}
    for project in projects:
        project["child"] = {}
        project["level"] = 1
        institutes[project["id"]] = project
    for subject in subjects:
        subject["level"] = 2
        if subject["project_id"] in institutes:
            institutes[subject["project_id"]]["child"][subject["id"]] = subject
    if name is not None:
        institutes = search_by_name(institutes, name)
    return json_response({'institutes': institutes})


def search_by_name(data, search_term):
    def search_node(node, search_term):
        if isinstance(node, dict):
            if 'name' in node and search_term.lower() in node['name'].lower():
                return node

            new_node = {}
            found_in_children = False

            for key, value in node.items():
                if key == 'child':
                    matched_children = {}
                    for child_key, child_value in value.items():
                        found_child = search_node(child_value, search_term)
                        if found_child:
                            matched_children[child_key] = found_child
                            found_in_children = True
                    if matched_children:
                        new_node[key] = matched_children
                else:
                    new_node[key] = value

            if found_in_children or ('name' in node and search_term.lower() in node['name'].lower()):
                return new_node
            else:
                return None

        elif isinstance(node, list):
            result = [search_node(item, search_term) for item in node]
            result = [item for item in result if item]  # 移除 None 项
            return result if result else None

        return None

    result = {}
    for key, value in data.items():
        found = search_node(value, search_term)
        if found:
            result[key] = found
    return result


def check_required(field_meta: TemplateField, field_value):
    global current_path_str
    current_path_str = field_meta.external_field_path_str
    t = field_meta.field_type
    if field_value in (None, [None], [], [""]):
        if field_meta.required:
            raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)
        return None
    if t.is_array or t.is_table or t.is_file or t.is_image:
        if not isinstance(field_value, list):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                               o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
        if len(field_value) == 0:
            if field_meta.required:
                raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)
    elif t.is_container or t.is_generator:
        if not isinstance(field_value, dict):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                               o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
        if len(field_value) == 0:
            if field_meta.required:
                raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)
    if t.is_container:
        for sub_field in field_meta.sub_fields:
            check_required(sub_field, field_value.get(sub_field.field_name))
    elif t.is_array:
        for raw_element in field_value:
            check_required(field_meta.element_field, raw_element)
    elif t.is_table:
        for row in field_value:
            for header in field_meta.sub_fields:
                check_required(header, row.get(header.field_name))
    elif t.is_number and field_meta.required:
        try:
            float(field_value)
        except ValueError:
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                               o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
    elif t.is_string and field_meta.required:
        if field_value == "":
            raise ParsingError(ParsingErrorEnum.FIELD_MISSING, o1=current_path_str)
    elif t.is_range and field_meta.required:
        if not isinstance(field_value, dict):
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                               o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
        if "lb" not in field_value or "ub" not in field_value:
            raise ParsingError(ParsingErrorEnum.INVALID_VALUE, o1=str(field_value),
                               o2=field_meta.field_type.description, o3=field_meta.external_field_path_str)
    elif t.is_choice and field_meta.required:
        choices = field_meta.choices_list
        if field_value not in choices:
            raise ParsingError(ParsingErrorEnum.INVALID_CHOICE_VALUE, o1=field_value,
                               o2=', '.join(choices))
    elif t.is_generator:
        try:
            selected_field = list(field_value.keys())[0]
            try:
                check_required(field_meta[selected_field], field_value[selected_field])
            except KeyError:
                raise ParsingError(ParsingErrorEnum.UNKNOWN_FIELD, o1=selected_field)
        except IndexError:
            pass
