import shutil
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

import django
import requests
from django.core.management import call_command
from patoolib import extract_archive
from tqdm import tqdm

from mgedata.load_settings import load_settings

API_HOST = 'http://mged.nmdms.ustb.edu.cn'
API_USERNAME = 'automation'
API_PASSWORD = 'krep_haic*THEG4geg'


def download(url: str, path: str, title: str):
    resp = requests.get(url, stream=True)
    total = int(resp.headers.get('content-length', 0))
    with open(path, 'wb') as file, tqdm(desc=title, total=total, unit='iB', unit_scale=True, unit_divisor=1024) as bar:
        for data in resp.iter_content(chunk_size=1024):
            size = file.write(data)
            bar.update(size)


if __name__ == '__main__':
    basedir = Path(__file__).parent.parent
    migrations_path = Path(basedir / 'migrations_dump.zip')
    metadump_path = Path(basedir / 'metadump_dump.zip')
    if not migrations_path.exists():
        r = requests.post(f'{API_HOST}/api/migrations', json={'username': API_USERNAME, 'password': API_PASSWORD})
        if r.status_code != 200:
            raise Exception(str(r.content))
        migrations_url = r.json()['data']
        download(f'{API_HOST}/{migrations_url}', str(migrations_path), '迁移文件')

    if not metadump_path.exists():
        r = requests.post(f'{API_HOST}/api/coredump', json={'username': API_USERNAME, 'password': API_PASSWORD})
        if r.status_code != 200:
            raise Exception(str(r.content))
        dump_url = r.json()['data']
        download(f'{API_HOST}/{dump_url}', str(metadump_path), "测试数据")
    with TemporaryDirectory() as tmp_dir:
        tmp_dir = Path(tmp_dir)
        extract_archive(migrations_path, outdir=tmp_dir)
        for m_file in Path('..').glob('apps/*/migrations/*'):
            if m_file.is_file() and m_file.name != '__init__.py':
                m_file.unlink()
        shutil.copytree(Path(tmp_dir) / 'apps/', basedir / 'apps', dirs_exist_ok=True)

    sys.path.append(str(basedir))
    load_settings()
    django.setup()
    call_command('migrate')
    call_command('metarestore', '-f', metadump_path)
