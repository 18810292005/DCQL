from django.core.management.base import BaseCommand

from apps.storage.models.file import DataContentFile, DataContentImage, FileUsage, ImageUsage
from apps.storage.models.data import DataMeta
from apps.storage.docs.file import RealFile
from mgedata.errors.models import MGEError

from apps.storage.apis.v2.data import data_to_dict, template_to_dict
from time import time


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('migration', choices=['false', 'true'])

    def handle(self, *args, **options):
        """
        将本地文件全量迁移至monogDB
        :param request:
        :return:
        """

        """
        文件全量迁移方法
        """
        migrating = options['migration']

        def migrate(dataset):
            count = 0
            error = 0
            for item in dataset:
                path = item.get_system_path(absolute=True)
                try:
                    fp = open(path, 'rb+')
                    if isinstance(item, DataContentImage):
                        item.real_file_id = RealFile.add(item.pk, fp, "image/jpeg")
                    elif isinstance(item, DataContentFile):
                        item.real_file_id = RealFile.add(item.pk, fp, "application/octet-stream")
                    else:
                        raise MGEError.BAD_PARAMETER
                    item.save()
                    count += 1
                    fp.close()
                except FileNotFoundError:
                    print("not found file")  # 6个文件未找到
                    error += 1
                    pass
            return [count, error]

        if migrating == 'true':
            images = DataContentImage.objects.all()
            [c, e] = migrate(images)
            files = DataContentFile.objects.all()
            migrate(files)

        is_migrated = False

        def template_check(items):

            def check_filed(field):
                value = field[1]
                if 't' in value:
                    if value['t'] in [4, 5]:
                        return field[0], True
                    elif value['t'] in [7, 8, 9, 10]:
                        tmp = check_filed(('misc', value['misc']))
                        if tmp is not None:
                            return field[0], tmp
                        else:
                            return
                    else:
                        return
                elif '_head' in value:  # 表格类没有t属性 单独列出来讨论
                    step = list()
                    for v in value['_head']:
                        tmp = check_filed((v, value[v]))
                        if tmp is not None:
                            step.append(tmp)
                    if len(step) == 0:
                        return
                    else:
                        return field[0], step
                elif '_ord' in value:
                    step = list()
                    for v in value['_ord']:
                        tmp = check_filed((v, value[v]))
                        if tmp is not None:
                            step.append(tmp)
                    if len(step) == 0:
                        return
                    else:
                        return field[0], step
                else:
                    return

            r = check_filed((0, items))
            if r is not None:
                return r[1]
            else:
                return []

        def change_data_by_pos(positions, data):

            def change_field_by_pos(_pos, _data_dict):
                nonlocal is_migrated
                if isinstance(_data_dict, str):
                    return
                if _pos[1] is True and _pos[0] in _data_dict:
                    for path in range(0, len(_data_dict[_pos[0]])):
                        # print(_data_dict[_pos[0]][path] + " " + str(count))
                        if (path == len(_data_dict[_pos[0]]) - 1) and (
                                "api/v1/storage/file/data/content" in _data_dict[_pos[0]][path]):
                            is_migrated = True
                            return
                        for image in images:
                            if image.file.get_url() == _data_dict[_pos[0]][path]:
                                _data_dict[_pos[0]][path] = image.file.get_api()
                                # print("change image")
                        for file in files:
                            if file.file.get_url() == _data_dict[_pos[0]][path]:
                                _data_dict[_pos[0]][path] = file.file.get_api()
                                # print("change file")
                    return
                elif isinstance(_pos[1], tuple) and _pos[0] in _data_dict:
                    change_field_by_pos(_pos[1], _data_dict[_pos[0]])
                elif isinstance(_pos[1], list) and isinstance(_data_dict, list):
                    for data_item in range(0, len(_data_dict)):
                        for pos_item in _pos[1]:
                            change_field_by_pos(pos_item, _data_dict[data_item])
                elif isinstance(_pos[1], list) and isinstance(_data_dict, dict):
                    for pos_item in _pos[1]:
                        change_field_by_pos(pos_item, _data_dict)
                else:
                    # print("error\n" + str(_pos) + "\n" + str(_data_dict) + "\n" + str(count))
                    # 此情况为模版'r'为false 导致字段不存在
                    return

            for p in positions:
                change_field_by_pos(p, data)
            # TODO
            return data

        # start
        data_metas = DataMeta.objects.all()[:]
        # data_metas = DataMeta.objects.filter(pk=72169)
        template_not_exist = 0
        template_ignore_map = list()
        template_checked_map = dict()
        summary = open("migrationg-summary", 'w')
        count = 0
        times = 0
        start_time = time()
        print("migration start at:" + str(start_time) + "\nnumber of data needed migrations is " + str(
            data_metas.count()))
        summary.write(
            "migration start at:" + str(start_time) + "\nnumber of data needed migrations is " + str(
                data_metas.count()))
        for data_meta in data_metas:
            count += 1
            times += 1
            if times >= 400:  # TODO 用文件记录迁移完成的meta_id 测试导出文件
                times = 0
                print("count is:" + str(count) + "\nignore_map_len: " + str(
                    len(template_ignore_map)) + "\nchecked_map_len: " + str(len(
                        template_checked_map)) + "\ntemplate_not_exist: " + str(template_not_exist))

            if data_meta.template_id in template_ignore_map:
                continue
            elif data_meta.template_id in template_checked_map:
                images = ImageUsage.objects.filter(meta=data_meta)
                files = FileUsage.objects.filter(meta=data_meta)
                if len(images) == 0 and len(files) == 0:
                    continue
                pos = template_checked_map[data_meta.template_id][0]
                checked_template = template_checked_map[data_meta.template_id][1]
                data_dict = data_to_dict(data_meta, False)['content']
                content_dict = change_data_by_pos(pos, data_dict)
                if is_migrated:
                    is_migrated = False
                    continue
                checked_template.modify_data(data_meta, data_meta.to_dict(), content_dict, True)
                summary.write(str(data_meta.pk) + "\n")
            else:
                template = data_meta.template
                if template is None:
                    template_not_exist += 1
                    summary.write(str(data_meta.pk) + " 错误数据，没有模板" + str(count) + "\n")
                    continue
                template_dict = template_to_dict(template, False)['content']
                pos = template_check(template_dict)
                if len(pos) == 0:
                    template_ignore_map.append(template.pk)
                    continue
                else:
                    template_checked_map[template.pk] = [pos, template]
                images = ImageUsage.objects.filter(meta=data_meta)
                files = FileUsage.objects.filter(meta=data_meta)
                if len(images) == 0 and len(files) == 0:
                    continue
                data_dict = data_to_dict(data_meta, False)['content']
                content_dict = change_data_by_pos(pos, data_dict)
                if is_migrated:
                    is_migrated = False
                    continue
                template.modify_data(data_meta, data_meta.to_dict(), content_dict, True)
                summary.write(str(data_meta.pk) + "\n")
        end_time = time()
        print("migration end at " + str(end_time) + "cost all : " + str(end_time - start_time))
        summary.write("migration end at " + str(end_time) + "cost all : " + str(end_time - start_time))
        summary.flush()
        summary.close()
        return
