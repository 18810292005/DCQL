# 还未实现数组的嵌套，分隔符为‘|’
import hashlib
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
import logging
logger = logging.getLogger('django')


class Prpcrypt():
    """
    aes加解密算法
    """

    def __init__(self, key):
        key = key.encode('utf-8')
        hl = hashlib.md5()
        hl.update(key)
        key = hl.hexdigest().encode('utf-8')
        if len(key) > 16:
            key = key[:16]
        else:
            count = len(key)
            length = 16
            if count % length != 0:
                add = length - (count % length)
            else:
                add = 0
            key += ('\0' * add).encode('utf-8')
        self.key = key
        self.mode = AES.MODE_CBC
        self.special_string = '$|￥&@'

    def convert_list(self, context):
        string = ''
        for c in context:
            string += str(c) + self.special_string
        return string[:-1 * len(self.special_string)]

    def convert(self, context):
        if context is None:
            context = 'none\0'
        elif isinstance(context, dict):  # 转换范围型数据
            context = 'dict\0' + str(context)
        elif isinstance(context, bool):
            context = 'bool\0' + str(context)
        elif isinstance(context, int):  # 如果是整型
            context = 'int\0' + str(context)
        elif isinstance(context, float):
            context = 'float\0' + str(context)
        elif isinstance(context, list):
            res = []
            for c in context:
                res.append(self.convert(c))
            context = 'list\0' + self.convert_list(res)
        elif isinstance(context, str):
            if context == self.special_string:
                context = 'special\0' + 'special'
            else:
                context = 'str\0' + context
        else:
            logger.error('convert-error2:{}'.format(context))
            context = ''
        logger.info("convert:{}".format(context))
        return context

    def encrypt(self, context):
        """
        :param context: 明文
        :return: 密文
        """
        context = self.convert(context)
        print(context)
        context = context.encode('utf-8')
        cryptor = AES.new(self.key, self.mode, self.key)
        length = 16
        count = len(context)
        if count % length != 0:
            add = length - (count % length)
        else:
            add = 0
        context += ('\0' * add).encode('utf-8')
        cicerone = cryptor.encrypt(context)
        # 因为AES加密时候得到的字符串不一定是ascii字符集的，输出到终端或者保存时候可能存在问题
        # 所以这里统一把加密后的字符串转化为16进制字符串
        return b2a_hex(cicerone)

    def decrypt(self, context):
        cryptor = AES.new(self.key, self.mode, self.key)
        plain_context = cryptor.decrypt(a2b_hex(context))
        res = bytes.decode(plain_context).rstrip('\0')
        return self.convert_back(res)

    def convert_back(self, context: str):
        if context == '':
            return context
        context_type = context.split('\0')[0]
        if context_type == 'int':
            context = int(context[4:])
        elif context_type == 'float':
            context = float(context[6:])
        elif context_type == 'dict':
            context = eval(context[5:])
        elif context_type == 'bool':
            context = context[5:]
            if context == 'True':
                context = True
            else:
                context = False
        elif context_type == 'none':
            context = None
        elif context_type == 'list':
            context_list = context[5:].split(self.special_string)
            res = []
            for c in context_list:
                res.append(self.convert_back(c))
            context = res
        elif context_type == 'str':
            context = context[4:]
        elif context_type == 'special':
            context = self.special_string
        else:
            logger.error('convert-back-error')
        return context


if __name__ == '__main__':
    pc = Prpcrypt(key='kyskeeyskeys范德萨发色的发放的')
    e = pc.encrypt([True, 123.3, 'fjsdf', None, {'a': 234.89, 'b': 3, '属性值': True}, '中文'])
    d = pc.decrypt(e)
    print(e, d)
