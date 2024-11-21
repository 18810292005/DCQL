import os
import zipfile
from zipfile import ZipFile


def zip_compress(source_path, target_path, filter=None, target_root=None, exclude='__pycache__'):
    zip_file_path = check_source_and_target_path(source_path, target_path)
    print("zip_file_path:", zip_file_path)
    try:
        with zipfile.ZipFile(zip_file_path, 'w') as zf:
            add_file_to_zip(zf, source_path, target_root=target_root, exclude=exclude, filter=filter)
    except Exception as e:
        if os.path.exists(zip_file_path):
            os.remove(zip_file_path)
        raise e
    print('压缩成功，压缩文件所在目录为：{}'.format(zip_file_path))


def check_source_and_target_path(source_path, target_path):
    '''
     检查源路径是否存在，目标文件是否存在
    :return: 包含.zip结尾的目标文件路径
    '''
    if not os.path.exists(source_path):
        raise FileNotFoundError('** {} **, 文件或文件夹不存在'.format(source_path))

    if os.path.isdir(target_path):
        target_path = target_path + source_path.split('/')[-1] + '.zip'
    elif not target_path.endswith('.zip'):  # 设置保存文件的文件名为 **.zip
        target_path = target_path + '.zip'
    if os.path.exists(target_path):
        raise FileExistsError("文件** {} **, 已经存在!".format(target_path))
    return target_path


def add_file_to_zip(zf: ZipFile, source_path, exclude='__pycache__', target_root=None, filter=None):
    '''
    添加文件或文件夹到zip
    :param zf: 已打开的zip压缩包
    :param source_path: 输入路径
    :param exclude: 去除输入路径中所有包含exclude的文件
    :param target_root: 输出路径的root目录，root目录默认为source_path所在文件夹
        example: input:'/root/test' target_root:'/test'
    :param filter:  仅打包输入路径中所有包含filter的文件
    :return:
    '''
    if filter is not None:
        if not (isinstance(source_path, str) and isinstance(filter, str)):
            raise TypeError("文件路径与文件夹名称必须为字符串")

    if target_root is None:
        target_root = '/' + source_path.split('/')[-1]

    if not isinstance(zf, zipfile.ZipFile):
        raise TypeError('zf类型错误,必须为ZipFile类')

    if os.path.isfile(source_path):
        zf.write(source_path)
    else:
        for root, dirs, files in os.walk(source_path):
            for single_file in files:
                file_path = os.path.join(root, single_file)  # 源文件路径
                target_path = target_root + file_path.replace(source_path, "")  # 打包文件路径
                # target_path = os.path.join(target_root, file_path.replace(source_path, ""))
                if exclude not in target_path:
                    if filter is not None:
                        if filter in target_path:
                            zf.write(file_path, arcname=target_path)
                    else:
                        zf.write(file_path, arcname=target_path)
                else:
                    continue
