from sklearn.cluster import MiniBatchKMeans
import joblib
import numpy as np
import logging

from apps.image_search.utils.sift_delivery import db_connect
from .settings import *

logging.basicConfig(
    level=USE_MODE,
    format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
)


# 读取数据库中非空的sift_vector项，进行聚类形成模型
# @profile
def feature_cluster(model_path, center_num=100, select_num=10, buf_size=100000, train_num=0):
    kmeans = MiniBatchKMeans(n_clusters=center_num, random_state=0, batch_size=buf_size)

    feature_buf = None
    count = 0
    if train_num <= 0:
        train_num = db_connect.Img.objects().all().count()
    for i in range(int(train_num / select_num)):
        imgs = db_connect.Img.objects().limit(select_num).skip(i * select_num)
        # logging.info(imgs)

        for img in imgs:
            if len(img.sift_vector) != 0:
                temp_feature = np.array(img.sift_vector)
                temp_feature = temp_feature.reshape((-1, 128))

                if feature_buf is None:
                    feature_buf = temp_feature
                else:
                    feature_buf = np.vstack((feature_buf, temp_feature))
                count += np.shape(temp_feature)[0]
                if count > buf_size:
                    # logging.info("start cluster")
                    kmeans = kmeans.partial_fit(feature_buf[:buf_size, :])
                    feature_buf = feature_buf[buf_size + 1:, :]
                    count -= buf_size

    kmeans = kmeans.partial_fit(feature_buf)
    # 对模型进行持久化
    joblib.dump(kmeans.cluster_centers_, model_path, compress=3)


if __name__ == "__main__":
    # test()
    feature_cluster("./cluster_centers.model")
    pass
