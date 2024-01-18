import numpy as np
import logging

import cv2
from scipy.cluster.vq import *
from .settings import *


logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)


# 对图片提取sift特征
def extract_sift(img):
    img_sift = cv2.xfeatures2d.SIFT_create()
    try:
        keypoints, descriptor = img_sift.detectAndCompute(img, None)
    except Exception as e:
        raise e
    if descriptor is None:
        descriptor = np.zeros((1, 128))
    descriptor = np.array(descriptor)
    descriptor = descriptor.reshape((1, -1))[0]
    return descriptor

# 使用model对sift特征进行编码


def vlad_encoder(feature_value, model):
    # 若sift特征为空，则使用100,128的向量
    # logging.info(type(feature_value))
    feature_value = np.array(feature_value)
    feature_value = feature_value.reshape((-1, 128))

    try:
        words, _ = vq(feature_value, model)
    except Exception as err:
        logging.error(err)
        feature_value = np.zeros((1, 128))
        words, _ = vq(feature_value, model)

    img_dist = np.zeros((model.shape[0], model.shape[1]), "float32")
    for i in range(words.shape[0]):
        voc_index = words[i]

        voc_center = model[voc_index]

        feature_dist = feature_value[i] - voc_center
        img_dist[voc_index] += feature_dist

    dist_l2 = img_dist ** 2
    dist_l2 = np.sqrt(np.sum(dist_l2))
    img_dist = np.divide(img_dist, dist_l2)
    img_dist = img_dist.reshape((1, -1))[0]
    # logging.info(np.shape(img_dist))
    return img_dist
