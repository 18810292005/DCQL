# -*- coding: utf-8 -*-
# @File   : models
# @Author : sodalife
# @Date   : 2018/6/14
import time
from bson import ObjectId
from apps.storage.models import DataMeta
from xml.dom.minidom import Document
from django.urls import reverse
from django.conf import settings

from mgedata.errors.models import MGEError
import os
from apps.storage.doi.models import DoiType
from typing import Union, List
import requests
import json
from apps.storage.tasks import register_doi_task
import logging

logger = logging.getLogger('django')


def generate_doi(did: DataMeta, project: str, type: str):
    """
    :param did: 注册DOI 数据的 DataMeta对象 主要用于
    :param project: 支撑项目 用于生成 DOI
    :param type: 注册的DOI类型
    :return: 返回生成的单条数据的DOI
    """
    L = []
    classification = '10.12110/mater' + (did.category.doi_prefix or '')
    L.append(classification)
    L.append(project)
    date = time.strftime('%Y%m%d', time.gmtime())
    L.append(date)
    L.append(type)
    sequence = ObjectId()
    L.append(str(sequence))
    return '.'.join(L)


def generate_doi_xml(dataset_title, data: DataMeta, dataset_contributor, project: str, type):
    """
    :param dataset_title: 数据集的标题
    :param data: 待注册的单条数据对象
    :param dataset_contributor: 数据集的责任者
    :param project: 所属的项目
    :return: 生成的 xml文件的文件路径
    """
    doc = Document()
    timestamp = time.strftime('%Y%m%d%H%M%S')
    objectid = ObjectId()

    doi_batch = doc.createElement('doi_batch')
    doi_batch.setAttribute('version', '1.0.0')
    doc.appendChild(doi_batch)

    head = doc.createElement('head')
    doi_batch.appendChild(head)

    doi_batch_id = doc.createElement('doi_batch_id')
    doi_batch_id_text = doc.createTextNode(str(objectid))  # 批处理的文件号(必须唯一) 考虑到多个用户并发的情况这里要换成 ObjectId
    head.appendChild(doi_batch_id)
    doi_batch_id.appendChild(doi_batch_id_text)

    timestamp_tag = doc.createElement('timestamp')  # 时间戳 标识批处理产生的时间和版本
    timestamp_tag_text = doc.createTextNode(timestamp)
    head.appendChild(timestamp_tag)
    timestamp_tag.appendChild(timestamp_tag_text)

    depositor = doc.createElement('depositor')  # 数据的存储者
    head.appendChild(depositor)

    depositor_name = doc.createElement('name')
    depositor_name_text = doc.createTextNode('国家材料基因工程专用数据库')  # 数据存储机构的名称
    depositor.appendChild(depositor_name)
    depositor_name.appendChild(depositor_name_text)

    depositor_email = doc.createElement('email_address')
    depositor_email_text = doc.createTextNode('huanghy@mater.ustb.edu.cn')  # 数据存储机构的电子邮件----具体内容？？？
    depositor.appendChild(depositor_email)
    depositor_email.appendChild(depositor_email_text)

    registrant = doc.createElement('registrant')
    registrant_text = doc.createTextNode('国家重点研发计划项目管理办公室(MGE)')  # 注册机构的信息
    head.appendChild(registrant)
    registrant.appendChild(registrant_text)

    body = doc.createElement('body')
    doi_batch.appendChild(body)

    science_data = doc.createElement('science_data')
    body.appendChild(science_data)

    database = doc.createElement('database')
    science_data.appendChild(database)

    # ******************   数据库的责任者信息  这里不填 在提交的时候会报错  **********************
    contributors = doc.createElement('contributors')  # 责任者信息  现在是必填的  可以弄成灵活可选的  至少包含一个责任者或者机构名
    database.appendChild(contributors)

    # person_name = doc.createElement('person_name')  # 把这个数据库的责任者的个人信息删掉
    # person_name_text = doc.createTextNode('李明')  # 责任者的姓名 可以是可选的
    # person_name.setAttribute('sequence', 'first')  # 责任者的顺序 可选项:  first additional 可选
    # person_name.setAttribute('contributor_role', 'author')  # 责任者的角色  可选项： author editor translator
    # person_name.appendChild(person_name_text)
    # contributors.appendChild(person_name)

    organization = doc.createElement('organization')
    organization_text = doc.createTextNode('国家重点研发计划办公室')
    organization.setAttribute('sequence', 'first')  # 可选 first additional
    organization.setAttribute('contributor_role', 'author')  # 可选 author editor translator
    organization.appendChild(organization_text)
    contributors.appendChild(organization)
    # *********************************************************

    titles = doc.createElement('titles')
    database.appendChild(titles)

    title = doc.createElement('title')
    title_text = doc.createTextNode('国家材料基因工程专用数据库')
    titles.appendChild(title)
    title.appendChild(title_text)

    description = doc.createElement('description')
    description_text = doc.createTextNode('材料基因工程专用数据库和材料大数据技术是以数据库建设、数据汇交等为主要目标的国家科研项目')  # 数据库的描述信息
    database.appendChild(description)
    description.appendChild(description_text)

    publisher = doc.createElement('publisher')  # 数据库发布机构的名称  必选
    database.appendChild(publisher)

    publisher_name = doc.createElement('publisher_name')  # 数据库发布机构的名称
    publisher_name_text = doc.createTextNode('国家重点项目研发组办公室')
    publisher.appendChild(publisher_name)
    publisher_name.appendChild(publisher_name_text)

    publisher_place = doc.createElement('publisher_place')  # 数据库发布机构的地址
    publisher_place_text = doc.createTextNode('北京市海淀区学院路30号北京科技大学')
    publisher.appendChild(publisher_place)
    publisher_place.appendChild(publisher_place_text)

    # ********************  下面是为整个数据库注册 DOI 但是现在的万方的bug  *********
    doi_data_database = doc.createElement('doi_data')
    database.appendChild(doi_data_database)

    doi_database = doc.createElement('doi')
    test_doi = '10.12110/mater.alpha' + str(ObjectId())
    doi_database_text = doc.createTextNode(test_doi)
    doi_data_database.appendChild(doi_database)
    doi_database.appendChild(doi_database_text)

    doi_timestamp_database = doc.createElement('timestamp')
    doi_timestamp_text_database = doc.createTextNode(timestamp)
    doi_data_database.appendChild(doi_timestamp_database)
    doi_timestamp_database.appendChild(doi_timestamp_text_database)

    resource_database = doc.createElement('resource')
    doi_data_database.appendChild(resource_database)

    URL_DATABASE = doc.createCDATASection('https://www.mgedata.cn/')
    resource_database.appendChild(URL_DATABASE)
    # *************************************************************

    dataset = doc.createElement('dataset')
    dataset.setAttribute('dataset_type', 'record')
    science_data.appendChild(dataset)

    contributors_dataset = doc.createElement('contributors')  # 数据集的责任者信息 可选的
    dataset.appendChild(contributors_dataset)

    person_name_dataset = doc.createElement('person_name')
    person_name_dataset_text = doc.createTextNode(dataset_contributor)  # 数据集的责任者姓名 这里可以有多个

    person_name_dataset.setAttribute('sequence', 'first')  # first additional
    person_name_dataset.setAttribute('contributor_role', 'author')  # author editor translator
    contributors_dataset.appendChild(person_name_dataset)
    person_name_dataset.appendChild(person_name_dataset_text)

    titles_dataset = doc.createElement('titles')
    dataset.appendChild(titles_dataset)

    title_dataset = doc.createElement('title')
    title_dataset_text = doc.createTextNode(dataset_title)  # 这个数据集或数据记录的信息
    titles_dataset.appendChild(title_dataset)
    title_dataset.appendChild(title_dataset_text)

    dataset_date = doc.createElement('dataset_date')
    dataset.appendChild(dataset_date)

    creation_date = doc.createElement('creation_date')  # 创建时间 这里直接用的是 数据库中数据的创建时间
    dataset_date.appendChild(creation_date)

    creation_date_year = doc.createElement('year')
    creation_date_year_text = doc.createTextNode(data.add_time.strftime('%Y'))
    creation_date.appendChild(creation_date_year)
    creation_date_year.appendChild(creation_date_year_text)

    creation_date_month = doc.createElement('month')
    creation_date_month_text = doc.createTextNode(data.add_time.strftime('%m'))
    creation_date.appendChild(creation_date_month)
    creation_date_month.appendChild(creation_date_month_text)

    creation_date_day = doc.createElement('day')
    creation_date_day_text = doc.createTextNode(data.add_time.strftime('%d'))
    creation_date.appendChild(creation_date_day)
    creation_date_day.appendChild(creation_date_day_text)

    # 下面数据的出版时间和数据的修改时间是可选的
    publication_date = doc.createElement('publication_date')  # 数据的出版时间 这里默认采用的 当前生成的北京时间
    publication_date.setAttribute('media_type', 'online')
    dataset_date.appendChild(publication_date)

    publication_date_year = doc.createElement('year')
    publication_date_year_text = doc.createTextNode(time.strftime('%Y'))
    publication_date.appendChild(publication_date_year)
    publication_date_year.appendChild(publication_date_year_text)

    publication_date_month = doc.createElement('month')
    publication_date_month_text = doc.createTextNode(time.strftime('%m'))
    publication_date.appendChild(publication_date_month)
    publication_date_month.appendChild(publication_date_month_text)

    publication_date_day = doc.createElement('day')
    publication_date_day_text = doc.createTextNode(time.strftime('%d'))
    publication_date.appendChild(publication_date_day)
    publication_date_day.appendChild(publication_date_day_text)

    format_dataset = doc.createElement('format')
    format_text = doc.createTextNode('text')
    format_dataset.setAttribute('MIME_type', 'text/plain')
    dataset.appendChild(format_dataset)
    format_dataset.appendChild(format_text)

    doi_data = doc.createElement('doi_data')
    dataset.appendChild(doi_data)

    doi = doc.createElement('doi')  # 某条数据或数据集的doi
    if type == DoiType.SINGLE_DATA:
        dataset_doi = generate_doi(data, project, 'db')  # 自动生成的doi号
    else:
        dataset_doi = generate_doi(data, project, 'ds')
    doi_text = doc.createTextNode(dataset_doi)  # 这个是生成的doi  XXX数据的doi
    doi_data.appendChild(doi)
    doi.appendChild(doi_text)

    doi_timestamp = doc.createElement('timestamp')
    doi_timestamp_text = doc.createTextNode(timestamp)  # 注册 doi 注册时候的时间戳 用于区分DOI数据的版本
    doi_data.appendChild(doi_timestamp)
    doi_timestamp.appendChild(doi_timestamp_text)

    resource = doc.createElement('resource')
    doi_data.appendChild(resource)

    if type == DoiType.SINGLE_DATA:
        dataset_url = settings.SITE_ADDR + settings.SITE_BASE_URL + reverse('storage:show_data',
                                                                            kwargs={'did': data.id})
    else:
        dataset_url = settings.SITE_ADDR + settings.SITE_BASE_URL + reverse('storage:doi_link', kwargs={
            'doi': dataset_doi})
    URL = doc.createCDATASection(dataset_url)
    resource.appendChild(URL)

    temp_dir = settings.DOI_DIR  # 将生成的xml 写入到文件中去
    tempfile_name = str(objectid) + '.xml'
    file_path = os.path.join(temp_dir, tempfile_name)
    with open(file_path, 'w', encoding='utf-8') as f:
        doc.writexml(f, indent='', addindent='\t', newl='\n', encoding='utf-8')
    return file_path, dataset_doi


# 上传doi 的xml文件
# def upload_file(file_path: str, uploadFile):
#     upload_result = uploadFile.upload(file_path, 'mtest', 'mtest',
#                                       DoiOperation.REGISTER_DOI)
#     new_filename = upload_result.getNewFileNames()[0]
#     reg_result = None
#     while True:
#         reg_result = uploadFile.getDoiRegResult(new_filename, 'mtest', 'mtest')
#         if reg_result is not None and reg_result.getQueryMsg() == '查询成功':
#             state = reg_result.getState()
#             if state == '已完成':
#                 break
#             elif state == '出现异常':  # 校验异常
#                 shutil.rmtree(os.path.dirname(file_path))
#                 raise MGEError.DOI_VERIFICATION_ABNORMAL
#             elif state == '不合格':
#                 shutil.rmtree(os.path.dirname(file_path))
#                 raise MGEError.DOI_UNQUALIFIED
def upload_file(file_path: str):
    param = {'filepath': file_path, 'username': 'MGEdata', 'password': 'MGEdata4doi'}
    r = requests.get('http://127.0.0.1:8080/register', params=param)
    upload_result = json.loads(r.text).get('result')
    logger.debug(json.loads(r.text))
    if upload_result == '出现异常':
        # shutil.rmtree(os.path.dirname(file_path))
        raise MGEError.DOI_VERIFICATION_ABNORMAL
    elif upload_result == '不合格':
        # shutil.rmtree(os.path.dirname(file_path))
        raise MGEError.DOI_UNQUALIFIED


def register_doi(dataset_title: str, data_reg: Union[DataMeta, List[DataMeta]], dataset_contributor: str,
                 project: str):
    if isinstance(data_reg, DataMeta):
        result = generate_doi_xml(dataset_title, data_reg, dataset_contributor, project, DoiType.SINGLE_DATA)
    else:
        first_data = data_reg[0]
        result = generate_doi_xml(dataset_title, first_data, dataset_contributor, project, DoiType.DATA_SET)
    file_path = result[0]
    doi = result[1]
    upload_file(file_path)
    if isinstance(data_reg, DataMeta):
        data_reg.doi = doi
        data_reg.save()
    else:
        data_ids = []
        for data in data_reg:
            data_ids.append(data.id)
        register_doi_task.delay(data_ids, doi)
    # shutil.rmtree(os.path.dirname(file_path))
    return doi
