import joblib
import datetime
import logging

from apps.image_search.utils.sift_delivery import search_image, feature_cluster, insert_image2db, db_connect
from .settings import *


logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)

# 读取图片进行训练


def train(trian_dir):
    starttime = datetime.datetime.now()

    # 从指定目录下读取所有图片，计算sift特征，保存在数据库中
    insert_image2db.init_insert_imgs(trian_dir)
    logging.info("sift提取结束")
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)

    # 对数据进行聚类，得到codebook
    feature_cluster.feature_cluster(CLUSTER_MODEL_PATH,
                                    center_num=CLUSTER_CENTER_NUM,
                                    select_num=CLUSTER_SELECT_NUM,
                                    buf_size=CLUSTER_BUF_SIZE,
                                    train_num=CLUSTER_TRAIN_NUM)
    logging.info("聚类结束")
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)

    # 读取codebook
    cluster_model = joblib.load(CLUSTER_MODEL_PATH)
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)

    # 使用codebook对sift特征编码并保存到数据库中
    insert_image2db.init_insert_imgs(trian_dir, cluster_model)
    logging.info("编码结束")
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)

    # 初始化searchengine
    search_engine = search_image.SearchEngine(False,
                                              index_path=FAISS_INDEX_PATH,
                                              model_path=CLUSTER_MODEL_PATH,
                                              train_num=FAISS_TRAIN_NUM)
    logging.info("searchengine保存结束")
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)


# 初始化
def init():
    # 直接读取index文件进行初始化
    search_engine = search_image.SearchEngine(True,
                                              index_path=FAISS_INDEX_PATH,
                                              model_path=CLUSTER_MODEL_PATH,
                                              train_num=FAISS_TRAIN_NUM)

    return search_engine


def insert_img(search_engine, url):
    orig_num = search_engine.index.ntotal
    # 插入到Img数据库
    cluster_model = search_engine.model
    insert_image2db.insert_img(url, cluster_model)
    # 插入到index中
    search_engine.add_one_feature(url)
    # 在Order数据库中添加记录
    try:
        db_connect.record_order([url])
        # 保存新的index
        search_engine.save_index(FAISS_INDEX_PATH)
    except Exception as e:
        # 插入order失败应该回退faiss中的数据
        search_engine.delete_one_feature(orig_num)
        raise e


def search_img(search_engine, url, nprobe, k):
    start_time = datetime.datetime.now()
    result = search_engine.search_image(url, nprobe, k)
    end_time = datetime.datetime.now()
    db_connect.record_insert(start_time, url, end_time)
    return result

# def search_img(url,model):
#     result = search_image.vlad_match_arr(url,model)
#     return result


if __name__ == "__main__":
    # train("/home/cjh/Coding/data/groundturth")
    # search_engine = init()
    # # insert_img(search_engine, "/home/cjh/Coding/data/mge-data/1.20180706104611.jpg")

    # from utils import get_all_files_in_dir
    # files = get_all_files_in_dir("/home/cjh/Coding/data/groundturth")

    # starttime = datetime.datetime.now()
    # logging.info(len(files))
    # for file in files:
    #     try:
    #         search_img(search_engine, file, 6, 100)
    #     except Exception as e:
    #         logging.error(e)
    # logging.info((datetime.datetime.now()-starttime).seconds)
    # logging.info('-'*20)
    # logging.info(float((datetime.datetime.now()-starttime).seconds)/len(files))

    from .utils import get_all_files_in_dir
    files = get_all_files_in_dir("/home/cjh/Coding/data/groundturth")

    cluster_model = joblib.load(CLUSTER_MODEL_PATH)
    starttime = datetime.datetime.now()
    logging.info(len(files))
    count = 0
    for file in files:
        try:
            res = search_img(file, cluster_model)
        except Exception as e:
            logging.error(e)
        count += 1
        logging.info(count)
    logging.info((datetime.datetime.now() - starttime).seconds)
    logging.info('-' * 20)
    logging.info(float((datetime.datetime.now() - starttime).seconds) / len(files))

    print(res[:10])
    pass
