"""
用于检测excel上传的数据和excel的文件的大小是否相符合
"""


import os
import django
import pprint


def is_probably_different(xlsx_dict_1, xlsx_dict_2, sheet_names):
    for sheet_name in sheet_names:
        if len(xlsx_dict_1['values'][sheet_name]['rows']) != len(xlsx_dict_2['values'][sheet_name]['rows']):
            return True
    return False


def detecting_correctness():
    from apps.storage.models import UploadHistory
    from apps.storage.trans.db import DbToData, DbToTemplate
    from apps.storage.trans.file.xlsx import DataSetToXlsxDict, XlsxFileToXlsxDict
    from mgedata.generic.dataset import DataSet

    logs = []

    for ins in UploadHistory.objects.all():

        if ins.source is None:
            continue
        # pprint.pprint(xlsx_dict)

        file = ins.source
        ext = os.path.splitext(file.filename)[1].upper()
        if ext in ('.XLSX') and os.path.exists(ins.source.get_system_path(absolute=True)):
            data_set = None
            try:
                for meta_id in ins.meta_id_list:
                    data = DbToData(meta_id).to()
                    if data_set is None:
                        template = DbToTemplate(data['template']).to()
                        data_set = DataSet(template)
                    data_set.add_data(data)
            except ValueError:
                continue

            xlsx_dict = DataSetToXlsxDict(data_set).to()
            file_xlsx_dict = XlsxFileToXlsxDict(ins.source.get_system_path(absolute=True)).to()

            if is_probably_different(xlsx_dict, file_xlsx_dict, xlsx_dict['ord'][1:]):
                logs.append((ins.id, ins.meta_id_list))
                # pprint.pprint(xlsx_dict)
                # pprint.pprint(file_xlsx_dict)
                # break

        pprint.pprint(logs)


if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mgedata.local_settings")
    django.setup()
    detecting_correctness()
