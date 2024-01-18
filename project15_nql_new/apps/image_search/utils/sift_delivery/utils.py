import os

import logging

import cv2
import numpy as np
from PIL import Image

from .image_preprocess import image_preprocess
from .settings import *


logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)


# 用于得到某文件夹下的所有文件（递归）
def get_all_files_in_dir(dirpath):
    file_list = []
    for root, dirs, files in os.walk(dirpath):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list

# 用于读取图片


def cv_imread(filePath):
    try:
        # 这个读出来是rgb
        if filePath.split(".")[-1] in SUPPORT_FORMAT:
            # cv_img = cv2.imdecode(np.fromfile(filePath, dtype=np.uint8), -1)
            cv_img = Image.open(filePath)
            cv_img = np.asarray(cv_img)
            # 预处理
            cv_img = image_preprocess(cv_img, max_border=MAX_BORDER)
            return cv_img
        else:
            raise Exception("error at:{}, wrong extensions.".format(filePath))

    except cv2.error as err:
        raise Exception("ReadimgError:{}".format(filePath))
