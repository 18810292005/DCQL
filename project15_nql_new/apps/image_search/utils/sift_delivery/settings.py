# USE_MODE=20为打印info，30打印warning及以上
USE_MODE = 20
# db_connect.py/order_connect.py
# mongodb数据库名称, 如有数据库密码也应写于此处
MONGODB_NAME = "IMG_FEATURE"
# 限制sift特征的最大长度，否则会超过16m
MAX_SIFT_LENGHTH = 100000

# feature_cluster.py
# 使用extract_feature.py创建的聚类模型存储及加载位置
CLUSTER_MODEL_PATH = "./apps/image_search/utils/sift_delivery/model/cluster_centers.model"
# Kmeans求取的中心数量
CLUSTER_CENTER_NUM = 100
# 每次从数据库请求多少条数据
CLUSTER_SELECT_NUM = 4
# 每次参与minibatch训练的条数
CLUSTER_BUF_SIZE = 50000
# 使用多少条数据进行聚类训练
CLUSTER_TRAIN_NUM = 4000

# search_image.py
# 使用search_image.py创建的index存储及加载位置
FAISS_INDEX_PATH = './apps/image_search/utils/sift_delivery/model/index.idx'
# 每次从数据库中读取多少条数据
FAISS_SELECT_NUM = 50
# 使用多少条数据训练faiss
FAISS_TRAIN_NUM = 4000
# FAISS使用的工厂模式
FAISS_FATORY_MODE = "IVF100,Flat"


# 支持读取的文件后缀格式
SUPPORT_FORMAT = ['jpg', 'jpeg', 'JPG', 'JPEG', 'png', 'PNG', 'tif', 'bmp', 'TIF', 'BMP']
# 读取图片时等比例压缩后的最大边长
MAX_BORDER = 480

# imamge_search insert
INSERTED = True
