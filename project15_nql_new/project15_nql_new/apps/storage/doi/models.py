# -*- coding: utf-8 -*-

# @File   : models
# @Author : sodalife
# @Date   : 2018/6/14

from enum import IntEnum, unique


@unique
class DoiOperation(IntEnum):
    """
    doi 操作类型枚举
    """
    BATCH_DOI_QUERY = 1  # 批量DOI查询
    BATCH_METADATA_QUERY = 2  # 批量元数据查询
    REGISTER_DOI = 3  # 追加数据 注册DOI
    MODIFY_DOI = 4  # 修改数据


@unique
class DoiType(IntEnum):
    """
    注册 doi 的类型枚举
    """
    SINGLE_DATA = 0  # 注册单条数据的doi
    DATA_SET = 1  # 注册数据集的doi


@unique
class DoiRegisterState(IntEnum):
    UNAUDITED = 0  # 未审核状态
    APPROVED = 1  # 审核通过
    NOT_APPROVED = 2  # 审核失败
