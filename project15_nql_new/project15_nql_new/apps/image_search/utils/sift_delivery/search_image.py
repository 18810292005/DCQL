
import faiss
import numpy as np
import joblib
import logging

from apps.image_search.utils.sift_delivery import extract_feature, db_connect, utils
# import extract_feature
# import db_connect
# import utils
from .settings import *


logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)


class SearchEngine():

    def __init__(self, load, index_path, model_path, train_num):
        self.search_init(load, index_path, model_path, train_num)

    # 在数据库中跳过skip个，查找limit个数据返回，主要用于分批次遍历整个数据库

    def load_feature(self, skip, limit):
        try:
            imgs = db_connect.Img.objects().limit(limit).skip(skip)
        except Exception as e:
            logging.error(e)
            return [], None

        imgs_url = []
        sift_vlad_vectors = None
        for img in imgs:
            if len(img.sift_vlad_vector) != 0:
                if sift_vlad_vectors is None:
                    sift_vlad_vectors = img.sift_vlad_vector
                else:
                    sift_vlad_vectors = np.vstack((sift_vlad_vectors, img.sift_vlad_vector))
                imgs_url.append(img.img_url)
        sift_vlad_vectors = sift_vlad_vectors.astype('float32')
        return imgs_url, sift_vlad_vectors

    # 增加以后应调用record_order，并调用save_index保存最新index
    def add_one_feature(self, url):
        img = db_connect.Img.objects(img_url=url)[0]
        # logging.info(img)
        self.index.add(np.array(img.sift_vlad_vector).astype('float32').reshape((1, -1)))

    def delete_one_feature(self, idx):
        self.index.remove_ids(faiss.IDSelectorRange(int(idx), int(idx) + 1))

    # 保存index到指定位置
    def save_index(self, save_path):
        faiss.write_index(self.index, save_path)

    # 初始化search_engine

    def search_init(self, load, load_path, model_path, train_num):
        self.model = joblib.load(model_path)
        if load:
            self.index = faiss.read_index(load_path)
        else:
            # 此时应该清除Order中的所有数据
            db_connect.Order.objects.all().delete()
            # init的时候无需读入所有数据，应该读入train_num条用于训练index
            # 分每批次50个读入数据，注意需要转换成float32类型
            logging.info("start read for train")
            features = None
            for i in range(int(train_num / FAISS_SELECT_NUM) + 1):
                urls, t_features = self.load_feature(i * FAISS_SELECT_NUM, FAISS_SELECT_NUM)
                if len(t_features) != 0:
                    if features is None:
                        features = t_features
                    else:
                        features = np.vstack((features, t_features))
            features = features.astype('float32')

            # 根据读入数据的维度构建index
            logging.info("start construct index")
            self.index = faiss.index_factory(np.shape(features)[1], FAISS_FATORY_MODE)
            # 使用读取的数据进行训练
            logging.info("start train")
            self.index.train(features)

            # 此时读入所有数据,但是应该分50每批次导入到构建好的index中
            logging.info("start read all data")
            count = db_connect.Img.objects.all().count()
            for i in range(int(count / FAISS_SELECT_NUM) + 1):
                urls, features = self.load_feature(i * FAISS_SELECT_NUM, FAISS_SELECT_NUM)
                if urls is not []:
                    self.index.add(features)
                    db_connect.record_order(urls)
            # 对模型进行保存
            self.save_index(load_path)

    # 检索最相近的前k个图片，需要提供图片路径，返回距离及图片url列表
    def search_image(self, img_path, nprobe=6, k=10):
        self.index.nprobe = nprobe
        try:
            img = utils.cv_imread(img_path)
        except Exception as e:
            raise e

        sift = extract_feature.extract_sift(img)
        # logging.info(type(sift))

        sift_vlad = extract_feature.vlad_encoder(sift, self.model)
        search_feature = sift_vlad.reshape(1, -1)

        D, indexs = self.index.search(search_feature, k)
        Res = []

        if -1 in indexs[0]:
            logging.info("search result will less than {}, please raise nprobe({})".format(k, FAISS_FATORY_MODE))

        for index in indexs[0]:
            # logging.info(index)
            if index == -1:
                break
            try:
                url = db_connect.Order_search(index)
            except Exception as e:
                raise e
            Res.append(url)

        return D, Res


def arr_dist(arr1, arr2):
    dist = arr1 - arr2
    dist = dist ** 2
    dist = np.sqrt(np.sum(dist))
    return dist


def vlad_match_arr(img_path, model):
    try:
        img = utils.cv_imread(img_path)
    except Exception as e:
        raise e

    sift = extract_feature.extract_sift(img)
    # logging.info(type(sift))

    sift_vlad = extract_feature.vlad_encoder(sift, model)
    search_feature = sift_vlad.reshape(1, -1)
    feature_dist = []
    urls = []
    count = db_connect.Img.objects.all().count()
    for i in range(count):
        temp_img = db_connect.Img.objects.limit(1).skip(i)[0]
        temp_vlad = temp_img.sift_vlad_vector
        img_url = temp_img.img_url
        try:
            dist = arr_dist(search_feature, temp_vlad)
        except Exception as e:
            print(img_url)
            continue
        feature_dist.append(dist)
        urls.append(img_url)
    feature_dist = np.array(feature_dist)
    sort_index = np.argsort(feature_dist)
    rank_list = [urls[i] for i in sort_index]
    return rank_list


if __name__ == "__main__":
    a = SearchEngine(True, "./index.idx", "./cluster_centers.model")
    d, res = a.search_image("/home/cjh/Coding/data/groundturth/creep curve/1.20190630145419.jpg")
    logging.info(res)
    pass
