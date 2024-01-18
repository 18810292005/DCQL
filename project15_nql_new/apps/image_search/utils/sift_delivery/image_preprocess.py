import cv2
import numpy as np
import logging

from .settings import *

logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)


# 对图片进行缩放
def image_preprocess(img, max_border=720):
    if img is None:
        logging.error("image is None preprocess will return None! ")
        return None

    # 对图片进行缩放，灰度化
    x, y = np.shape(img)[0:2]
    _max = max(x, y)
    if _max > max_border:
        x = int(x * max_border / _max)
        y = int(y * max_border / _max)
        img = cv2.resize(img, (y, x))

    if len(np.shape(img)) != 2:
        img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    else:
        img_gray = img

    return img_gray
