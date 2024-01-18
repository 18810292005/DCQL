import traceback
# import logging
#
# from settings import *
#
# logging.basicConfig(
# level=USE_MODE,
# format="[%(asctime)s] %(name)s:%(levelname)s: %(message)s"
# )
#
# connect(MONGODB_NAME)
import mongoengine as me
from .settings import *
import logging

# 用于存储图片的url对应的sift和sift_vlad特征，sift特征不应太长


class Img(me.Document):
    # id = StringField(primary_key=True)
    img_url = me.StringField(max_length=256, primary_key=True)
    sift_vector = me.ListField(me.FloatField(), default=list)
    sift_vlad_vector = me.ListField(me.FloatField(), default=list)

    def __str__(self):
        return "img_url:{}\tsift_vector:{}\tsift_vlad_vector:{}".format(
            self.img_url, len(self.sift_vector), len(self.sift_vlad_vector))

# 主键相同不会报错，而是相当于update，sift特征过长则放弃保存，mongodb规定文档大小，小于16m


def Img_insert(url, sift, vlad_sift=[]):
    try:
        if len(sift) > MAX_SIFT_LENGHTH:
            sift = []
        if len(url) > 256:
            raise Exception("url:{} is too long!".format(url))
        obj = Img(img_url=url, sift_vector=sift, sift_vlad_vector=vlad_sift)
        obj.save()
    except Exception as e:
        raise Exception(
            "Insert fail: sift_size:{} vlad_size:{}\n{}".format(
                len(sift),
                len(vlad_sift),
                traceback.format_exc()))


# 暂时没有使用
def Img_delete(url):
    try:
        obj = Img_search(url)
        obj.delete()
    except Exception as e:
        logging.error(e)
        logging.error(url)

# 查询不存在的url返回空列表[]，存在则返回[Img]


def Img_search(url):
    try:
        result = Img.objects(img_url=url)
    except Exception as e:
        logging.error(e)
        logging.error(url)
        return []
    return result

# 用于存储index中向量的保存顺序


class Order(me.Document):
    _id = me.IntField(primary_key=True)
    img_url = me.StringField(max_length=256, required=True)

    def __str__(self):
        return "id:{}\timg_url:{}".format(self._id, self.img_url)

# 用于插入一条记录


def Order_insert(_id, img_url):
    try:
        if len(img_url) > 256:
            raise Exception("img_url:{} is too long!".format(img_url))
        obj = Order(_id=_id, img_url=img_url)
        obj.save()
    except Exception as e:
        raise Exception("_id:{} img_url:{} {}".format(_id, img_url, e))

# 用于检索一条记录


def Order_search(_id):
    result = Order.objects(_id=_id)
    return result[0].img_url

# 批量插入记录


def record_order(urls):
    count = Order.objects.all().count()
    for url in urls:
        Order_insert(count, url)
        count += 1


class Record(me.Document):
    start_time = me.DateTimeField(primary_key=True)
    img_url = me.StringField(max_length=256, required=True)
    end_time = me.DateTimeField()


def record_insert(start_time, img_url, end_time):
    try:
        if len(img_url) > 256:
            Exception("img_url:{} is too long!".format(img_url))
        obj = Record(start_time=start_time, img_url=img_url, end_time=end_time)
        obj.save()
    except Exception as e:
        raise e


if __name__ == "__main__":
    # _insert("1212/21212",[1.2,3.4,6.7])
    # a = Img.objects.all()
    # logging.info(a)
    # _insert("1212/21212",[1.2,3.4])
    # a = _search("1212/21212")
    # # logging.info(a)
    # _update(a[0],[1.2,2.3])
    # # a = _search("1212/21212")
    # # logging.info(a)
    # _delete("1212/21212")
    # # a = _search("1212/21212")
    # logging.info(a)
    # a = Img.objects(img_url='/home/cjh/Coding/data/groundturth/adiabatic temperature change/绝热温变2.20191107104639.jpg')

    # _delete('/home/cjh/Coding/data/mge-data/0.20181219102128.png')
    # logging.info(a)

    # import datetime
    # import time
    # now = datetime.datetime.now()
    # time.sleep(1)
    # nex = datetime.datetime.now()
    # record_insert(now,"aaaa",nex)
    # Record.objects(img_url="aaaa")[0].delete()
    # logging.info(Record.objects.all())

    pass
