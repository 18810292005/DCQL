import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile, TemporaryDirectory

import requests
from patoolib import extract_archive

API_HOST = 'http://mged.nmdms.ustb.edu.cn'
API_USERNAME = 'automation'
API_PASSWORD = 'krep_haic*THEG4geg'

if __name__ == '__main__':
    r = requests.post(f'{API_HOST}/api/migrations', json={'username': API_USERNAME, 'password': API_PASSWORD})
    if r.status_code != 200:
        raise Exception(str(r.content))
    migrations_url = r.json()['data']
    r = requests.post(f'{API_HOST}/api/coredump', json={'username': API_USERNAME, 'password': API_PASSWORD})
    if r.status_code != 200:
        raise Exception(str(r.content))
    dump_url = r.json()['data']
    migrations_tar = NamedTemporaryFile(suffix='.zip')
    dump_tar = NamedTemporaryFile(suffix='.zip')
    migrations_tar.write(requests.get(f'{API_HOST}/{migrations_url}').content)
    dump_tar.write(requests.get(f'{API_HOST}/{dump_url}').content)
    with TemporaryDirectory() as tmp_dir:
        tmp_dir = Path(tmp_dir)
        extract_archive(dump_tar.name, outdir=tmp_dir)
        extract_archive(migrations_tar.name, outdir=tmp_dir)
        for m_file in Path('.').glob('apps/*/migrations/*'):
            if m_file.is_file() and m_file.name != '__init__.py':
                m_file.unlink()
        shutil.copytree(Path(tmp_dir) / 'apps/', 'apps', dirs_exist_ok=True)
        shutil.copy(tmp_dir / 'pg.json', '.')
