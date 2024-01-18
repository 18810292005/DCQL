import traceback
import joblib
import logging

from apps.image_search.utils.sift_delivery import db_connect, extract_feature
from .utils import cv_imread, get_all_files_in_dir
from .settings import *

logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)

# 插入图片到数据库中


def insert_img(img_url, model=None, refresh=False):
    # 读取图片
    try:
        result = list(db_connect.Img_search(img_url))
        if not refresh and len(result) != 0 and len(result[0].sift_vector) != 0:
            sift = result[0].sift_vector
        else:
            img = cv_imread(img_url)
            # 提取sift特征
            sift = extract_feature.extract_sift(img)

        if model is None:
            if refresh or len(result) == 0 or len(result[0].sift_vector) == 0:
                db_connect.Img_insert(img_url, sift)
        else:
            # 如果model存在就进行编码后保存到数据库中
            vlad_sift = extract_feature.vlad_encoder(sift, model)
            db_connect.Img_insert(img_url, sift, vlad_sift)

    except Exception:
        logging.error("img_url:{}".format(img_url))
        logging.error(traceback.format_exc())

    return


def init_insert_imgs(file_path, model=None):
    files = get_all_files_in_dir(file_path)
    count = 0
    for file in files:
        # try:
        count += 1
        if count % 100 == 0:
            logging.info(count)
        insert_img(file, model)

        # except Exception as e:
        #     logging.info(file)
        #     continue


if __name__ == "__main__":
    # insert_img('/home/cjh/Coding/data/mge-data/0.20181219102128.png')
    # a = db_connect.Img.objects.all()
    # logging.info(a)
    # insert_img("/home/cjh/Coding/data/groundturth/thermal
    # conductiviy/Y_Thermal_conductivity_based_on_CALPHAD.20191119163135.png")

    model = joblib.load("./cluster_centers.model")
    init_insert_imgs("/home/cjh/Coding/data/groundturth", model)
    pass
