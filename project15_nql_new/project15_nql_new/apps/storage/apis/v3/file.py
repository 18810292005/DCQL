import tempfile

from django.views import View
from django.http import HttpRequest

from mgedata.utils.general import json_response, get_param, MGEError

from apps.storage.models.file import TemporaryExportedFile, FileContentType

from apps.storage.trans.file.xlsx.dataset import DataSetToXlsxDict, XlsxDictToXlsxFile
from apps.storage.trans.db.template import DbToTemplate
from apps.storage.trans.db.data import DbToData
from mgedata.generic.dataset import DataSet


def create_data_set(template_id, data_id_list):
    try:
        template = DbToTemplate(template_id).to()
        dataset = DataSet(template)
        for meta_id in data_id_list:
            dataset.add_data(DbToData(meta_id).to())
    except (ValueError, TypeError) as e:
        raise MGEError.BAD_DATA(str(e))
    return dataset


def data_set_to_xlsx_file(dataset):
    xlsx_dict = DataSetToXlsxDict(dataset).to()
    f = tempfile.NamedTemporaryFile()
    XlsxDictToXlsxFile(xlsx_dict).to(f.name)
    ret = TemporaryExportedFile.add(f, FileContentType.XLSX, filename='test', randomize=False)
    return ret


class DataSetView(View):

    def get(self, request: HttpRequest):
        format = get_param('format', allow_none=False, allowed=['xlsx'], force=True)
        data_id = get_param('data_id', allow_none=False, force=True)
        template_id = get_param('template_id', allow_none=False, convert_to=int, force=True)

        try:
            id_list = list(map(int, data_id.split(',')))
        except ValueError as e:
            raise MGEError.BAD_DATA(f'{data_id} must be integers seperated by comma')

        dataset = create_data_set(template_id, id_list)
        ins = data_set_to_xlsx_file(dataset)

        return json_response(ins.get_url())
