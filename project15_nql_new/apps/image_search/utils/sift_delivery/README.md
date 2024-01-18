使用SIFT_VLAD方法的图像检索API
==========
main.py
----------
总接口文件<br>

### train(path)
功能：将path下的所有图片进行特征提取，存入数据库中，并根据所需数据进行模型训练<br>

### init()

功能：方法可以获取一个search_image.py中的SearchEngine对象<br>

### insert_image(search_engine, url)

功能：方法可以插入单张图片到数据库，SearchEngine中<br>
search_engine:init()返回的searchengine对象<br>
url:新插入的图片路径<br>

### search_image(search_engine, url, k)

功能：方法用于查询<br>
search_engine:init()返回的searchengien对象<br>
url:待查询图片领<br>
k:查询前k个图片并返回<br>



db_connect.py
----------
该文件中包含Img和Order两个mongodb文档模型和相关的方法<br>

extract_feature.py
----------
### extract_sift(img)

功能：对于使用utils.py中cv_imread方法读取的图片提取出sift特征<br>
img:使用cv_imread方法读取得到的图片<br>
return:np.array形式的sift特征<br>

### vlad_encoder(feature_value, model)

功能：使用feature_cluster.py中得到的model对sift特征进行编码<br>
feature_value:float列表形式的使用extract_sift()方法提取出的特征<br>
model:使用feature_cluster提取出的model<br>
return:np.array形式的使用vlad编码后的sift特征<br>

feature_cluster.py
----------
### feature_cluster(model_path, center_num, select_num, buf_size)

功能：分批次读取数据库中的所有Img数据，获取其保存的sift特征，并进行kmeans训练得到密码本model<br>
model_path:模型保存路径<br>
center_num:kmeans训练中心数量<br>
select_num:每次从mongodb中读取的Img条数<br>
buf_size:进行minibatch训练的数据量<br>

image_preprocess.py
----------
### image_preprocess()

供utils.py中的cv_imread方法使用，目前只用来resize图片<br>

insert_image2db.py
----------
### insert_img(img_url, model, refresh)

功能：若数据库总存在该图片则尝试获取其sift特征，若没有则读取图片后进行sift提取。若提供feature_cluster.py得到的model则可以使用extract_feature.py中的vlad_encode()将sift编码。<br>
img_url:图片路径<br>
model:feature_cluster.py提供的密码本<br>
refresh:是否重新提取特征<br>

### init_insert_imgs()

用于从一个文件夹下使用insert_img()方法批量提取图片向量到数据库中<br>





search_image.py
----------

SearchEngine对象<br>

### load_feature(skip, limit)

功能：批量读取数据库中的Img<br>
skip:跳过多少数据<br>
limit:返回多少数据<br>

### add_one_feature(url)

功能：增加单个向量<br>
url:需要增加的特征向量的路径，应该已经进行了特征提取vlad_sift保存在了数据库中<br>

### save_index(save_path)

功能：将faiss-index保存<br>
save_path:想要保存到的路径<br>

### search_init(load, load_path, model_path, train_num)

读取Img用于训练，构建index，将所有Img加入index中并保存<br>
load:是否加载保存好的faiss-index<br>
load_path:加载或保存的位置<br>
model_path:feature_cluster保存的模型路径<br>
train_num:训练faiss-index使用的数据条数<br>

### search_image(img_path, k)

构建index后可以根据输入的读取图片提取特征，进行检索<br>
img_path:图片路径<br>
k:返回前多少个相似图片<br>

settings.py
----------

各种参数<br>

utils.py
----------

### get_all_files_in_dir(dirpath)

得到某路径下的所有文件<br>
dirpath:想要提取文件的根目录<br>

### cv_imread(filePath)

读取图片<br>
filePath:图片的路径<br>
