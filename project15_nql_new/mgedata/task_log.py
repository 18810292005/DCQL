import os
import logging
import sys
from django.conf import settings
from mgedata.celery import mge_task_logging_path
from celery.app.log import TaskFormatter


task_logger = logging.getLogger("mge_worker_log")
task_logger.setLevel(logging.INFO)
file_hander = logging.handlers.RotatingFileHandler(mge_task_logging_path, maxBytes=1024 * 1024 * 30, backupCount=5) ## 可能会有多进程io error
file_hander.setFormatter(TaskFormatter('time: %(asctime)s @@@ log_level: %(levelname)s \
@@@ task_name: %(task_name)s @@@ task_id(celery): %(task_id)s \
@@@ description: %(message)s @@@ func_name: %(func_name)s @@@ lines: %(line)s @@@ file_path: %(filepath)s'))

task_logger.addHandler(file_hander)

def currentframe():
    """
    通过堆栈信息获取函数执行位置的相关信息
    """
    try:
        raise Exception
    except Exception:
        return sys.exc_info()[2].tb_frame.f_back.f_back

def mge_task_log(description = "", keywords: dict = {}, level = logging.INFO): 
    """
    :param description: 描述信息
    :param level: 日志级别
    :param keywords 关键字信息
    :return:
    """
    f = currentframe()
    keywords_str = ""
    for k,value in keywords.items():
        keywords_str = keywords_str + f" @@@ {k}: {value}"
    task_logger.log(level, description + keywords_str, 
    extra={"func_name": f.f_code.co_name,
     "line": f.f_lineno, "filepath": f.f_code.co_filename})