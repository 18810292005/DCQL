# # -*- coding: utf-8 -*-
#
# # @File   : tasks.py
# # @Author : Yuvv
# # @Date   : 2018/2/5
# #
# # """
# # 用于将旧版没有添加 path 等的数据迁移到新版
# # """
# #
# # import mongoengine as me
# # from bson.objectid import ObjectId
# # from gridfs import GridFS
# #
# # from apps.storage.models import DataMeta, Template, ObjectFile
# # from apps.storage.models.file import ObjectFileType, ObjectContentType
# # from apps.storage.models.template import TemplateFieldEnum
# #
# # db = me.connection.get_db()
# #
# # # collections
# # coll_dc = db.data_content
# # coll_ctn = db.data_field_container
# # coll_table = db.data_field_table
# # coll_row = db.data_field_table_row
# #
# #
# # def drop_test_data(*authors):
# #     for author in authors:
# #         print('dropping %s\'s data...' % author)
# #         for dm in DataMeta.objects.filter(author=author):
# #             dm.delete()
# #         print('dropped.')
# #
# #
# # def do_rename():
# #     # 字段重命名
# #     print('\nstart rename...')
# #     coll_row.update_many({'tid': {'$not': {'$eq': None}}}, {'$rename': {'tid': '_owner_id'}})
# #     print('Row: `tid` -> `_owner_id` complete.')
# #     coll_table.update_many({'owner': {'$not': {'$eq': None}}}, {'$rename': {'owner': '_owner_id'}})
# #     print('Table: `owner` -> `_owner_id` complete.')
# #     coll_ctn.update_many({'_owner': {'$not': {'$eq': None}}}, {'$rename': {'_owner': '_owner_id'}})
# #     print('Container: `_owner` -> `_owner_id` complete.')
# #
# #
# # def do_file_migrate():
# #     # 将 gridfs 中的文件迁移到 ObjectFile，新建集合`oid_url_map`: oid, of_id, url
# #     fs = GridFS(db)
# #     fs_img = GridFS(db, 'images')
# #
# #     print('\nstart file migrate...')
# #     for img in db.data_field_image.find():
# #         oid_url_map = db.oid_url_map.find_one({'oid': img['_id']})
# #         if oid_url_map:
# #             continue
# #         print('migrating image: ', str(img['_id']), img['name'])
# #         img_file = fs_img.get(img['image'])
# #         of = ObjectFile.add(ObjectContentType.DATA_IMAGE, ObjectFileType.DATA_CONTENT, img_file,
# #                             name=img['name'], author=img['author'])
# #         db.oid_url_map.insert_one({'oid': img['_id'], 'of_id': of.id, 'url': of.get_file_url()})
# #         print('image(%s) migrated' % str(img['_id']))
# #
# #     for file in db.data_field_file.find():
# #         oid_url_map = db.oid_url_map.find_one({'oid': file['_id']})
# #         if oid_url_map:
# #             continue
# #         print('migrating file:', str(file['_id']), file['name'])
# #         f_file = fs.get(file['file'])
# #         of = ObjectFile.add(ObjectContentType.DATA_FILE, ObjectFileType.DATA_CONTENT, f_file,
# #                             name=file['name'], author=file['author'])
# #         db.oid_url_map.insert_one({'oid': file['_id'], 'of_id': of.id, 'url': of.get_file_url()})
# #         print('file(%s) migrated' % str(file['_id']))
# #
# #
# # def do_id_init():
# #     # 初始化 tid 和 meta id
# #     print('\nstart `tid` and `meta_id` init...')
# #     for dm in DataMeta.objects.all():
# #         coll_dc.update_one({'_id': ObjectId(dm.dc_id)},
# #                            {'$set': {'_meta_id': dm.id,
# #                                      '_tid': dm.tid}})
# #
# #     for it in coll_dc.find():
# #         coll_ctn.update_many({'_owner_id': it['_id']}, {'$set': {'_meta_id': it['_meta_id'],
# #                                                                  '_tid': it['_tid']}})
# #         coll_table.update_many({'_owner_id': it['_id']}, {'$set': {'_meta_id': it['_meta_id'],
# #                                                                    '_tid': it['_tid']}})
# #     print('data content complete.')
# #
# #     for it in coll_ctn.find({'_meta_id': {'$not': {'$eq': None}}}):
# #         coll_ctn.update_many({'_owner_id': it['_id']}, {'$set': {'_meta_id': it['_meta_id'],
# #                                                                  '_tid': it['_tid']}})
# #         coll_table.update_many({'_owner_id': it['_id']}, {'$set': {'_meta_id': it['_meta_id'],
# #                                                                    '_tid': it['_tid']}})
# #     print('data field container complete.')
# #
# #     for it in coll_table.find({'_meta_id': {'$not': {'$eq': None}}}):
# #         coll_row.update_many({'_owner_id': it['_id']}, {'$set': {'_meta_id': it['_meta_id'],
# #                                                                  '_tid': it['_tid']}})
# #     print('data field table and row complete.')
# #
# #
# # def update_object_file(of_id, meta_id, owner_id, path):
# #     of = ObjectFile.objects.get(pk=of_id)
# #     of.misc['meta_id'] = meta_id
# #     of.misc['owner_id'] = owner_id
# #     of.misc['path'] = path
# #     of.save(update_fields=('misc',))
# #
# #
# # def do_field_value_update():
# #     # 更新字段值，将 t, val 去掉
# #     # fixme: 并不完善，数组套生成器和生成器套数组没有处理
# #     print('\nstart field value update...')
# #     for coll in (coll_dc, coll_ctn, coll_row):
# #         for it in coll.find():
# #             print(coll.name, str(it['_id']), 'updating...')
# #             for f_name, f_value in it.items():
# #                 if isinstance(f_value, dict):
# #                     if f_value.get('_t') in (TemplateFieldEnum.IMAGE, TemplateFieldEnum.FILE):
# #                         urls = list()
# #                         for fid in f_value.get('val'):
# #                             oid_url_map = db.oid_url_map.find_one({'oid': ObjectId(fid)})
# #                             urls.append(oid_url_map['url'])
# #                         coll.update_one({'_id': it['_id']}, {'$set': {f_name: urls}})
# #                     elif f_value.get('_t') in (TemplateFieldEnum.CONTAINER, TemplateFieldEnum.TABLE):
# #                         coll.update_one({'_id': it['_id']}, {'$set': {f_name: f_value.get('val')}})
# #                     elif f_value.get('_t') == TemplateFieldEnum.GENERATOR:
# #                         if isinstance(f_value.get('val'), dict) and f_value.get('val').get('_t'):
# #                             val = f_value.get('val').get('val')
# #                         else:
# #                             val = f_value.get('val')
# #                         coll.update_one({'_id': it['_id']},
# #                                         {'$set': {f_name: dict(val=val, sel=f_value.get('_n'))}})
# #                 elif isinstance(f_value, list) and len(f_value):
# #                     if isinstance(f_value[0], dict):
# #                         arr_values = list()
# #                         if f_value[0].get('_t') in (TemplateFieldEnum.IMAGE, TemplateFieldEnum.FILE):
# #                             for arr_v in f_value:
# #                                 urls = list()
# #                                 for fid in arr_v.get('val'):
# #                                     oid_url_map = db.oid_url_map.find_one({'oid': ObjectId(fid)})
# #                                     urls.append(oid_url_map['url'])
# #                                 arr_values.append(urls)
# #                         elif f_value[0].get('_t') in (TemplateFieldEnum.CONTAINER, TemplateFieldEnum.TABLE):
# #                             for arr_v in f_value:
# #                                 arr_values.append(arr_v.get('val'))
# #                         elif f_value[0].get('_t') == TemplateFieldEnum.GENERATOR:
# #                             for arr_v in f_value:
# #                                 if isinstance(arr_v.get('val'), dict) and arr_v.get('val').get('_t'):
# #                                     val = arr_v.get('val').get('val')
# #                                 else:
# #                                     val = arr_v.get('val')
# #                                 arr_values.append(dict(val=val, sel=arr_v.get('_n')))
# #
# #                         if arr_values:
# #                             coll.update_one({'_id': it['_id']}, {'$set': {f_name: arr_values}})
# #
# #
# # def do_path_update():
# #     # 主要是更新 path，会把图片和文件型的meta_id, tid, path一起更新
# #     def get_tc(tid):
# #         _tc = tc_dict.get(tid)
# #         if not _tc:
# #             _tc = Template.objects.get(pk=dc['_tid']).content
# #             tc_dict[tid] = _tc
# #         return _tc
# #
# #     def update_of(url, meta_id, owner_id, path):
# #         oid_url_map = db.oid_url_map.find_one({'url': url})
# #         update_object_file(oid_url_map['of_id'], meta_id, owner_id, path)
# #         print(db.oid_url_map.name, owner_id, path)
# #
# #     def update_table(oid, path, head_misc):
# #         coll_table.update_one({'_id': oid}, {'$set': {'_path': path}})
# #         coll_row.update_many({'_owner_id': oid}, {'$set': {'_path': path}})
# #         print(coll_table.name, oid, path)
# #         table = coll_table.find_one({'_id': oid})
# #         for h_name in head_misc['_head']:
# #             if head_misc[h_name]['t'] == TemplateFieldEnum.IMAGE or \
#                   head_misc[h_name]['t'] == TemplateFieldEnum.FILE:
# #                 for row in coll_row.find({'_owner_id': oid}):
# #                     for url in row[h_name]:
# #                         update_of(url, table['_meta_id'], str(oid), path + '.' + h_name)
# #
# #     def update_container(oid, path, ctn_misc):
# #         coll_ctn.update_one({'_id': oid}, {'$set': {'_path': path}})
# #         print(coll_ctn.name, oid, path)
# #         ctn = coll_ctn.find_one({'_id': oid})
# #         for ctn_f_name in ctn_misc['_ord']:
# #             update_field(ctn_misc[ctn_f_name], ctn.get(ctn_f_name), path + '.' + ctn_f_name,
# #                          meta_id=ctn['_meta_id'], owner_id=str(ctn['_id']))
# #
# #     def update_field(t_field, f_value, path=None, **kwargs):
# #         if t_field['t'] == TemplateFieldEnum.IMAGE or t_field['t'] == TemplateFieldEnum.FILE:
# #             for url in f_value:
# #                 update_of(url, kwargs['meta_id'], kwargs['owner_id'], path)
# #         elif t_field['t'] == TemplateFieldEnum.TABLE:
# #             update_table(f_value, path, t_field['misc'])
# #         elif t_field['t'] == TemplateFieldEnum.CONTAINER:
# #             update_container(f_value, path, t_field['misc'])
# #         elif t_field['t'] == TemplateFieldEnum.ARRAY:
# #             for it in f_value:
# #                 update_field(t_field['misc'], it, path, **kwargs)
# #         elif t_field['t'] == TemplateFieldEnum.GENERATOR:
# #             update_field(t_field['misc'][f_value['sel']], f_value['val'], path + '.' + f_value['sel'], **kwargs)
# #
# #     print('start path update...')
# #     tc_dict = {}
# #     for dc in coll_dc.find():
# #         tc = get_tc(dc['_tid'])
# #         for tf_name in tc['_ord']:
# #             update_field(tc[tf_name], dc.get(tf_name), tf_name,
# #                          meta_id=dc['_meta_id'], owner_id=str(dc['_id']))
# #
# #
# # def check_update():
# #     from apps.storage.utils.serializers import JSONSerializer
# #     from tempfile import mkdtemp
# #     import os
# #
# #     tmp_dir = mkdtemp()
# #     for t in Template.objects.filter(ref_count__gt=0):
# #         print('Now serialize template:', t.id)
# #         JSONSerializer.serialize(t, DataMeta.objects.filter(tid=t.id), os.path.join(tmp_dir, '%d.json' % t.id))
# #
# #     print('TempDir: ', tmp_dir)   # 到这里，全部导出成功则说明没问题
# #
# #
# # def main():
# #     drop_test_data('yuvv', 'Harold Chen', 'jasper', 'lzy',
# #                    'ghaiyan', 'duhan', 'Lily', 'leiyuting', '刘世龙')
# #     do_rename()
# #     do_file_migrate()
# #     do_id_init()
# #     do_field_value_update()
# #     do_path_update()
# #     check_update()
# #
# #
# # if __name__ == '__main__':
# #     main()
#
# from django.db.models import Avg, Max, Min, Sum
# from apps.storage.models.data import DataSizeRecord, MaterialCategory
# from apps.storage.models.file import *
# from apps.storage.models.data import DataMeta
# from apps.storage.models.template import Template
# from apps.storage.docs.data import DataFieldContainer, DataContent, DataFieldTableRow
#
# #
# # def run():
# #     id_url_set = set()
# #
# #     for doc in DataFieldTableRow.objects:
# #         for field in doc:
# #             if isinstance(doc[field], list):
# #                 for element in doc[field]:
# #                     if isinstance(element, str) and element.startswith('_fs'):
# #                         id_url_set.add((doc['_meta_id'], element))
# #     for doc in DataContent.objects:
# #         for field in doc:
# #             if isinstance(doc[field], list):
# #                 for element in doc[field]:
# #                     if isinstance(element, str) and element.startswith('_fs'):
# #                         id_url_set.add((doc['_meta_id'], element))
# #     for doc in DataFieldContainer.objects:
# #         for field in doc:
# #             if isinstance(doc[field], list):
# #                 for element in doc[field]:
# #                     if isinstance(element, str) and element.startswith('_fs'):
# #                         id_url_set.add((doc['_meta_id'], element))
# #
# #     for meta_id, url in id_url_set:
# #         DataFileMap(meta_id=meta_id, file=url).save()
# #
# #
# # def delete_trash_mongo_documents():
# #     id_list = [x.id for x in DataMeta.objects.all().only('id')]
# #     DataFieldTableRow.objects(_meta_id__nin=id_list).delete()
# #     DataFieldTable.objects(_meta_id__nin=id_list).delete()
# #     DataFieldContainer.objects(_meta_id__nin=id_list).delete()
# #     DataContent.objects(_meta_id__nin=id_list).delete()
#
# # def run():
# #     tids = set()
# #     for template in Template.objects.all():
# #         def _into(field: TemplateField):
# #             if field.field_type.is_generator:
# #                 tids.add(template.id)
# #                 return
# #             for sub in ([field.element_field] if field.field_type.is_array else field.sub_fields):
# #                 _into(sub)
# #
# #         for field in template.fields:
# #             _into(field)
# #
# #     for tid in tids:
# #         for doc in DataFieldTableRow.objects(_tid=tid):
# #             for field in doc:
# #                 value = doc[field]
# #                 if isinstance(value, dict):
# #                     if 'sel' in value and 'val' in value:
# #                         _meta_id = doc['_meta_id']
# #                         _tid = doc['_tid']
# #                         _path = f'{doc["_path"]}.{field}'
# #                         new = DataFieldContainer(_meta_id=_meta_id, _tid=_tid, _path=_path, _owner_id=doc.id)
# #                         new[value['sel']] = value['val']
# #                         new.save()
# #                         doc[field] = new.id
# #                         doc.save()
# #
# #         for doc in DataContent.objects(_tid=tid):
# #             for field in doc:
# #                 value = doc[field]
# #                 if isinstance(value, dict):
# #                     if 'sel' in value and 'val' in value:
# #                         _meta_id = doc['_meta_id']
# #                         _tid = doc['_tid']
# #                         _path = f'{field}'
# #                         new = DataFieldContainer(_meta_id=_meta_id, _tid=_tid, _path=_path, _owner_id=doc.id)
# #                         new[value['sel']] = value['val']
# #                         new.save()
# #                         doc[field] = new.id
# #                         doc.save()
# #
# #         for doc in DataFieldContainer.objects(_tid=tid):
# #             for field in doc:
# #                 value = doc[field]
# #                 if isinstance(value, dict):
# #                     if 'sel' in value and 'val' in value:
# #                         _meta_id = doc['_meta_id']
# #                         _tid = doc['_tid']
# #                         _path = f'{doc["_path"]}.{field}'
# #                         new = DataFieldContainer(_meta_id=_meta_id, _tid=_tid, _path=_path, _owner_id=doc.id)
# #                         new[value['sel']] = value['val']
# #                         new.save()
# #                         doc[field] = new.id
# #                         doc.save()
#
# # def calculate_hash(path):
# #     try:
# #         with open(path) as fp:
# #             m = hashlib.md5()
# #             while True:
# #                 data = fp.read(1024)
# #                 if not data:
# #                     break
# #                 m.update(data)
# #             return m.hexdigest()
# #     except FileNotFoundError:
# #         return "123"
# #
# #
# # def list_files():
# #     if not os.path.exists(CONTENT_FILE_ENTRIES_OUTPUT_PATH):
# #         for template in Template.objects.all():
# #             def _into(field_meta: TemplateField):
# #                 t = field_meta.field_type
# #                 if t.is_file or t.is_image:
# #                     key = f'{template.id}.{field_meta.external_field_path_str.split(".")[-1]}'
# #                     entries[key] = t
# #                     print(key)
# #                 elif t.is_array:
# #                     _into(field_meta.element_field)
# #                 else:
# #                     for sub_field in field_meta.sub_fields:
# #                         _into(sub_field)
# #
# #             for field in template.fields:
# #                 _into(field)
# #         images = {}
# #         files = {}
# #         entries = {}
# #         for doc in DataFieldTableRow.objects:
# #             for field in doc:
# #                 if isinstance(doc[field], list):
# #                     for element in doc[field]:
# #                         if isinstance(element, str) and element.startswith('_fs'):
# #                             meta_id = doc['_meta_id']
# #                             template_id = doc['_tid']
# #                             t = entries[f'{template_id}.{field}']
# #                             if t.is_image:
# #                                 if meta_id not in images:
# #                                     images[meta_id] = []
# #                                 images[meta_id].append(element)
# #                             else:
# #                                 if meta_id not in files:
# #                                     files[meta_id] = []
# #                                 files[meta_id].append(element)
# #
# #         for doc in DataContent.objects:
# #             for field in doc:
# #                 if isinstance(doc[field], list):
# #                     for element in doc[field]:
# #                         if isinstance(element, str) and element.startswith('_fs'):
# #                             meta_id = doc['_meta_id']
# #                             template_id = doc['_tid']
# #                             t = entries[f'{template_id}.{field}']
# #                             if t.is_image:
# #                                 if meta_id not in images:
# #                                     images[meta_id] = []
# #                                 images[meta_id].append(element)
# #                             else:
# #                                 if meta_id not in files:
# #                                     files[meta_id] = []
# #                                 files[meta_id].append(element)
# #         for doc in DataFieldContainer.objects:
# #             for field in doc:
# #                 if isinstance(doc[field], list):
# #                     for element in doc[field]:
# #                         if isinstance(element, str) and element.startswith('_fs'):
# #                             meta_id = doc['_meta_id']
# #                             template_id = doc['_tid']
# #                             t = entries[f'{template_id}.{field}']
# #                             if t.is_image:
# #                                 if meta_id not in images:
# #                                     images[meta_id] = []
# #                                 images[meta_id].append(element)
# #                             else:
# #                                 if meta_id not in files:
# #                                     files[meta_id] = []
# #                                 files[meta_id].append(element)
# #
# #         entries = {'files': files, 'images': images}
# #         with open(CONTENT_FILE_ENTRIES_OUTPUT_PATH, 'w') as fp:
# #             json.dump(entries, fp)
# #     else:
# #         with open(CONTENT_FILE_ENTRIES_OUTPUT_PATH) as fp:
# #             entries = json.load(fp)
# #     print(len(entries))
# #     # print(file_entries)
# #     # print(image_entries)
# #     # meta_id_list = list(id_url_set_map.keys())
# #     # meta_id_list.sort()
# #     # for meta_id in meta_id_list:
# #     #     l = id_url_set_map[meta_id]
# #     #     for file_path in l:
# #     #         hash_value = calculate_hash(os.path.join(settings.MEDIA_ROOT, file_path))
#
# # def update_path():
# #     for t in Template.objects.all():
# #         pass
# #
# #
# # def update_table():
# #     for table in DataFieldTable.objects().timeout(False):
# #         rows = DataFieldTableRow.objects(_owner_id=table.pk).timeout(False)
# #         for index, row in enumerate(rows):
# #             row._row_num = index + 1
# #             row.save()
# #         table.rows = rows
# #         table.row_count = len(rows)
#
# import sys
#
#
# def count_a_template(template):
#     template_id = template.id
#     total_size = 0
#     file_size = 0
#     image_size = 0
#     meta_id_list = DataMeta.objects.filter(template_id=template_id)
#     files = FileUsage.objects.filter(meta_id__in=meta_id_list)
#     images = ImageUsage.objects.filter(meta_id__in=meta_id_list)
#     for file in files:
#         try:
#             file_size += file.file.file.size
#         except FileNotFoundError:
#             pass
#     for image in images:
#         try:
#             image_size += image.file.file.size
#         except FileNotFoundError:
#             pass
#     for doc in DataContent.objects(_tid=template_id):
#         total_size += sys.getsizeof(doc)
#     for doc in DataFieldContainer.objects(_tid=template_id):
#         total_size += sys.getsizeof(doc)
#     for doc in DataFieldTableRow.objects(_tid=template_id):
#         total_size += sys.getsizeof(doc)
#
#     print(f"模板名：\"{template.title}\", 文档大小：{total_size/1024}KB, "
#           f"文件大小：{file_size/1024}KB, 图片大小：{image_size/1024}KB")
#     return total_size, file_size, image_size
#
#
# #
# #
# # def stat():
# #     template_id_map = {292: (2640, 0, 0), 279: (0, 0, 0), 278: (0, 0, 0), 273: (0, 0, 0), 277: (0, 0, 0),
# #                        264: (1514160, 0, 0), 263: (532920, 0, 0), 260: (0, 0, 0), 259: (0, 0, 0), 262: (0, 0, 0),
# #                        261: (2400, 0, 22455), 180: (10026600, 0, 225622733), 258: (223080, 0, 0),
# #                        185: (1568400, 0, 40907962), 221: (595200, 0, 0), 257: (0, 0, 0), 256: (0, 0, 0),
# #                        255: (0, 0, 0),
# #                        254: (18360, 0, 0), 253: (58080, 0, 4330888), 248: (85080, 0, 552242), 250: (0, 0, 0),
# #                        247: (13200, 0, 0), 245: (12546240, 27174221814, 0), 240: (0, 0, 0), 242: (0, 0, 0),
# #                        244: (0, 0, 0), 243: (0, 0, 0), 239: (0, 0, 0), 228: (0, 0, 0), 233: (0, 0, 0),
# #                        235: (960, 0, 0),
# #                        232: (0, 0, 0), 229: (0, 0, 0), 206: (6312720, 0, 0), 222: (72240, 0, 1112753),
# #                        227: (179520, 0, 1314853), 219: (0, 0, 0), 224: (1495440, 0, 0),
# 225: (480, 13732908, 1044844),
# #                        220: (1130280, 0, 42346217), 211: (1052760, 0, 19154053), 218: (15360, 0, 0),
# #                        213: (112320, 0, 0), 212: (103080, 0, 1191296), 216: (299400, 0, 2449100), 215: (0, 0, 0),
# #                        214: (13200, 0, 1638032), 174: (106320, 0, 181236), 210: (390360, 0, 9455704),
# #                        177: (348360, 0, 19091903), 207: (85320, 0, 1153504), 209: (476880, 0, 3698376),
# #                        204: (8400, 0, 0), 205: (139440, 0, 0), 202: (1560, 0, 0), 194: (2160, 0, 0),
# #                        178: (744960, 0, 95860970), 172: (2745480, 0, 212992360), 191: (88800, 0, 0),
# #                        182: (230400, 0, 0), 193: (5520, 0, 687094), 190: (1542480, 0, 0), 183: (847800, 0, 0),
# #                        189: (1789080, 0, 207604537), 192: (0, 0, 0), 188: (2453880, 0, 0), 93: (0, 0, 0),
# #                        122: (417840, 314081740, 269584403), 186: (0, 0, 0), 141: (23520, 0, 0),
# 130: (1384320, 0, 0),
# #                        158: (2640, 0, 0), 155: (548280, 0, 0), 154: (480, 0, 0), 153: (24360, 0, 0),
# #                        150: (7288680, 0, 0), 149: (0, 0, 0), 148: (0, 0, 0), 136: (0, 0, 0), 137: (0, 0, 0),
# #                        138: (3814680, 0, 0), 125: (0, 0, 0), 123: (0, 0, 0), 120: (0, 0, 0), 124: (0, 0, 0),
# #                        114: (0, 0, 0), 115: (0, 0, 0), 116: (0, 0, 0), 119: (0, 0, 0), 112: (0, 0, 0),
# 113: (0, 0, 0),
# #                        117: (0, 0, 0), 118: (0, 0, 0), 110: (0, 0, 0), 105: (0, 0, 0), 90: (46800, 0, 0),
# #                        82: (10680, 0, 0), 91: (0, 0, 0), 92: (0, 0, 0), 86: (2864760, 0, 0), 81: (0, 0, 0),
# #                        79: (0, 0, 0), 54: (0, 0, 0), 77: (368040, 0, 0), 68: (3276600, 0, 0), 58: (0, 0, 0),
# #                        47: (5520, 0, 0), 50: (17640, 0, 1748508), 46: (1680, 0, 141836), 51: (6960, 0, 467592),
# #                        48: (480, 0, 165910), 49: (5400, 0, 0), 52: (0, 0, 0), 44: (0, 0, 0), 53: (3720, 0, 0),
# #                        29: (0, 0, 0), 22: (0, 0, 0), 25: (0, 0, 0), 13: (9890880, 0, 0),
# 17: (11158680, 0, 13633380),
# #                        14: (0, 0, 0), 8: (0, 0, 0), 11: (0, 0, 0)}
# #
# #     category_map = {}
# #     category_id_data_count_map = {}
# #     from apps.storage.models.material import MaterialCategory
# #
# #     for template in Template.objects.all():
# #         category = template.category
# #         while category.parent and category.parent.parent:
# #             category = category.parent
# #         if category.id not in category_map:
# #             category_map[category.id] = 0, 0, 0
# #         total, file, image = category_map[category.id]
# #         if template.id not in template_id_map:
# #             continue
# #         a, b, c = template_id_map[template.id]
# #         total += a
# #         file += b
# #         image += c
# #         category_map[category.id] = total, file, image
# #         if category.id not in category_id_data_count_map:
# #             category_id_data_count_map[category.id] = 0
# #         category_id_data_count_map[category.id] += DataMeta.objects.filter(template=template).count()
# #
# #     for c_id in category_map.keys():
# #         total, file, image = category_map[c_id]
# #         total /= 1024
# #         file /= 1024
# #         image /= 1024
# #         if total >= 1000:
# #             total = '%.2fMB' % (total / 1024)
# #         else:
# #             total = '%.2fKB' % total
# #         if file >= 1000:
# #             file = '%.2fMB' % (file / 1024)
# #         else:
# #             file = '%.2fKB' % file
# #         if image >= 1000:
# #             image = '%.2fMB' % (image / 1024)
# #         else:
# #             image = '%.2fKB' % image
# #
# #         print(
# # f"分类：{MaterialCategory.objects.get(id=c_id).name_zh}
# # 数据个数：{category_id_data_count_map.get(c_id, 0)} MongoDB文档大小：{total}
# # 文件型附件大小：{file}，图片型附件大小：{image}")
#
#
# def count_size():
#     for meta in DataMeta.objects.all():
#         mongo_size = 0
#         file_size = 0
#         image_size = 0
#         files = FileUsage.objects.filter(meta=meta)
#         images = ImageUsage.objects.filter(meta=meta)
#         for file_usage in files:
#             try:
#                 file_size += file_usage.file.file.size
#             except FileNotFoundError:
#                 pass
#         for image_usage in images:
#             try:
#                 image_size += image_usage.file.file.size
#             except FileNotFoundError:
#                 pass
#         for doc in DataContent.objects(_meta_id=meta.id):
#             mongo_size += sys.getsizeof(doc)
#         for doc in DataFieldContainer.objects(_meta_id=meta.id):
#             mongo_size += sys.getsizeof(doc)
#         for doc in DataFieldTableRow.objects(_meta_id=meta.id):
#             mongo_size += sys.getsizeof(doc)
#
#         DataSizeRecord(meta=meta, mongo_size=mongo_size, file_size=file_size, image_size=image_size).save()
#
#
# def stat():
#     category_id_template_map = {}
#     for template in Template.objects.all():
#         c = template.category
#         while c.level > 1:
#             c = c.parent
#         if c.id not in category_id_template_map:
#             category_id_template_map[c.id] = []
#         category_id_template_map[c.id].append(template.id)
#
#     total_count = DataMeta.objects.count()
#     for cid in category_id_template_map.keys():
#         category = MaterialCategory.objects.get(id=cid)
#         meta = DataMeta.objects.filter(template_id__in=category_id_template_map[cid])
#         data_count = meta.count()
#         if data_count == 0:
#             continue
#         size_records = DataSizeRecord.objects.filter(meta__in=meta)
#         mongo_avg = list(size_records.aggregate(Avg('mongo_size')).values())[0] or 0
#         mongo_max = list(size_records.aggregate(Max('mongo_size')).values())[0] or 0
#         mongo_min = list(size_records.aggregate(Min('mongo_size')).values())[0] or 0
#         mongo_total = list(size_records.aggregate(Sum('mongo_size')).values())[0] or 0
#
#         file_avg = list(size_records.aggregate(Avg('file_size')).values())[0] or 0
#         file_max = list(size_records.aggregate(Max('file_size')).values())[0] or 0
#         file_min = list(size_records.filter(file_size__gt=0).aggregate(Min('file_size')).values())[0] or 0
#         file_total = list(size_records.aggregate(Sum('file_size')).values())[0] or 0
#
#         image_avg = list(size_records.aggregate(Avg('image_size')).values())[0] or 0
#         image_max = list(size_records.aggregate(Max('image_size')).values())[0] or 0
#         image_min = list(size_records.filter(image_size__gt=0).aggregate(Min('image_size')).values())[0] or 0
#         image_total = list(size_records.aggregate(Sum('image_size')).values())[0] or 0
#
#         print(category.name_zh)
#         print(f"共{data_count}条数据，占总数据比例{'%.2f' % (data_count/total_count*100)}%")
#         print(f"MongoDB文档总容量：{'%.2fKB' % (mongo_total/1024)}")
#         print(f"平均MongoDB文档容量：{'%.2fKB' % (mongo_avg/1024)}")
#         print(f"最小MongoDB文档容量：{'%.2fKB' % (mongo_max/1024)}")
#         print(f"最大MongoDB文档容量：{'%.2fKB' % (mongo_min/1024)}")
#         print(f"文件附件总容量：{'%.2fMB' % (file_total/1024/1024)}")
#         print(f"平均文件附件容量：{'%.2fMB' % (file_avg/1024/1024)}")
#         print(f"最小文件附件容量：{'%.2fMB' % (file_min/1024/1024)}")
#         print(f"最大文件附件容量：{'%.2fMB' % (file_max/1024/1024)}")
#         print(f"图片附件总容量：{'%.2fMB' % (image_total/1024/1024)}")
#         print(f"平均图片附件容量：{'%.2fMB' % (image_avg/1024/1024)}")
#         print(f"最小图片附件容量：{'%.2fMB' % (image_min/1024/1024)}")
#         print(f"最大图片附件容量：{'%.2fMB' % (image_max/1024/1024)}")
#         print()
