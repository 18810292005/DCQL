# 此文件用于同步南大通用account数据
import logging

import requests
from celery import shared_task
from django.conf import settings
from django.db import transaction

from apps.account.models import User
from apps.storage.models import MaterialSubject, MaterialProject
from mgedata.utils.general import require_GET_api, json_response, get_param

logger = logging.getLogger('django')


@require_GET_api
def sync_all_user_project_and_subject(request):
    rebuild = get_param('rebuild', convert_to=bool, allow_none=True)
    sync_pms_all_user_project_and_subject.delay(rebuild)
    return json_response()


@shared_task
def sync_pms_all_user_project_and_subject(rebuild=False):
    try:
        for subject in MaterialSubject.objects.all():
            pml_url = 'http://pms.nmdms.ustb.edu.cn/mgepm/megProgectInterface/getTopicUserByNumber/{}'.format(
                subject.id)
            res = requests.get(pml_url)
            if res.status_code == 200:
                res = res.json()
                sync_user_list = res['ketixiaozuchengyuan'] + res['fuzeren']
                with transaction.atomic():
                    new_subject_users = []
                    for user_dict in sync_user_list:
                        if user_dict is None:
                            continue
                        email = user_dict['mail']  # 返回的username其实是realname并不能保证唯一
                        user = User.objects.filter(email=email).first()
                        if user is None:
                            user = User.make_for_sso(email=email, real_name=user_dict['username'])  # 未同步权限,用户SSO登陆时自动同步
                        new_subject_users.append(user.username)

                    if rebuild:
                        subject.user.clear()
                        subject.project.members.clear()

                    old_subject_users = subject.user.values_list('username', flat=True)
                    add_subject_users = set(new_subject_users).difference(set(old_subject_users))
                    remove_subject_users = set(old_subject_users).difference(set(new_subject_users))
                    for username in add_subject_users:
                        user = User.objects.get(username=username)
                        user.my_subjects.add(subject)
                        user.my_projects.add(subject.project)
                    for username in remove_subject_users:
                        user = User.objects.get(username=username)
                        if user.my_subjects.count() == 1:
                            try:
                                user.my_projects.remove(subject.project)
                            except MaterialProject.DoesNotExist:
                                pass
                        subject.user.remove(user)
            else:
                logger.warning('sync_user_project_and_subject:{}'.format(res.json() + {'subject': subject.id}))
        return json_response()
    except Exception as e:
        logger.error('sync_user_project_and_subject:{}'.format(e))
        return json_response(msg=str(e), status_code=400)


def sync_pms_user_project_and_subject(email, pms_user_id):
    """
    用于登录时同步南大通用项目/课题信息
    1.在SsoLoginView中已经处理了用户不存在的问题，这里用户不存在时直接返回
    2.系统每3秒同步一次项目课题信息 material_project_syn # celery.py 47
      如果用户登录时项目课题信息未同步，直接返回，在下次登录时再同步
    Args:
        email: 南大通用与本系统保存相同的用户email信息
        pms_user_id:南大通用用户id信息，用于请求同步接口
    """
    if settings.DEBUG:
        return
    try:
        user = User.objects.get(email=email)
        pml_url = settings.USER_PROJECT_AND_SUBJECT_URL.replace('{id}', str(pms_user_id))
        res = requests.get(pml_url)
        if res.status_code == 200:
            res = res.json()['data']
            raw_material_projects = res['mgeProjectInterfaceList']
            raw_material_subjects = res['mgeTopicInterfaceList']

            # 同步项目信息
            for raw_material_project in raw_material_projects:
                try:
                    material_project = MaterialProject.objects.get(id=raw_material_project['number'])
                    if user.my_projects.filter(id=material_project.id).count() == 0:
                        user.my_projects.add(material_project)
                except MaterialProject.DoesNotExist:
                    continue

            # 同步课题信息
            for raw_material_subject in raw_material_subjects:
                try:
                    material_subject = MaterialSubject.objects.get(id=raw_material_subject['number'])
                    if user.my_subjects.filter(id=material_subject.id).count() == 0:
                        user.my_subjects.add(material_subject)
                        user.my_projects.add(material_subject.project)
                except MaterialSubject.DoesNotExist:
                    continue
    except User.DoesNotExist:
        return
    except Exception as e:
        logger.error('SSO:sync_pms_user_project_and_subject:{}'.format(e))
