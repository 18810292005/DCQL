import os
import zipfile
import tempfile
from shutil import copyfileobj

from apps.storage.models.file import DataContentFile, DataContentImage


class FileRegister:

    def __init__(self):
        self._file_paths = []
        self._serial_number = 0
        self._archive = tempfile.NamedTemporaryFile()
        self._zipfile = zipfile.ZipFile(self._archive.name, 'w', zipfile.ZIP_DEFLATED)

    def register(self, path, type: str, directory=None, ):
        self._file_paths.append(path)
        fp, file_name = self._read_by_path(path, type, self._serial_number)
        if fp is not None:
            self._zipfile.write(fp.name,
                                os.path.join(directory, file_name)
                                if directory else file_name)
            fp.close()
        self._serial_number += 1

    def _register_api(self, url):
        pass

    def _read_by_path(self, path, type, serial_number):
        try:
            if type == 'image':
                ins = DataContentImage.objects.get(file=path)
            elif type == 'file':
                ins = DataContentFile.objects.get(file=path)
            else:
                print('Not ok')
                return None, None
        except (DataContentImage.DoesNotExist, DataContentFile.DoesNotExist) as e:
            print('Not ok')
            return None, None

        ret_file = tempfile.NamedTemporaryFile('wb')
        copyfileobj(ins.file, ret_file)
        ret_name = '.'.join([str(serial_number), os.path.basename(ins.filename)])
        return ret_file, ret_name

    def get_archive_name_and_finish_register(self):
        self._zipfile.close()
        return self._archive.name

    def close(self):
        self._archive.close()
