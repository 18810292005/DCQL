import base64
import json

import requests
from bs4 import BeautifulSoup

MGE_ADMIN_URL = 'http://mged.nmdms.ustb.edu.cn/admin'
MGE_ADMIN_LOGIN_URL = 'http://mged.nmdms.ustb.edu.cn/admin/login/?next=/admin/'
MGE_ES_URL = 'http://mged.nmdms.ustb.edu.cn/api/v2/search/query/'
MGE_TEMPLATE_URL = 'http://mged.nmdms.ustb.edu.cn/api/v1/storage/template/{template_id}'
MGE_URL = 'http://mged.nmdms.ustb.edu.cn/media/mgedata/'
MGE_DATAMETA = 'http://mged.nmdms.ustb.edu.cn/api/v2/storage/data/{oid}'


def post(query: dict, page=1, page_size=10000, return_metas=None):
    if return_metas is None:
        return_metas = '["content"]'
    return_metas = base64.b64encode(bytes(return_metas, encoding='utf-8'))
    data = json.dumps(query).encode('utf-8')
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
    }
    cookies = admin_login()
    res = requests.post(url=MGE_ES_URL,
                        params={'return_meta[]': return_metas, 'page': page, 'page_size': page_size},
                        data=data,
                        headers=headers,
                        cookies=cookies)
    if res.status_code != 201:
        raise ValueError(f'err {res.status_code} {res.text}')
    return res.json()


def admin_login(username='ghaiyan', password='19941112qweaz'):
    session = requests.Session()
    session.keep_alive = False  # 关闭多余连接
    headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.9 Safari/537.36',
        "Content-Type": 'application/x-www-form-urlencoded',
    }
    res = session.get(MGE_ADMIN_URL, headers=headers, timeout=5)
    if res.status_code != 200:
        return None
    soup = BeautifulSoup(res.text, 'lxml')
    csrf_value = soup.find('input', attrs={'name': 'csrfmiddlewaretoken'}).get('value')
    data = {
        'csrfmiddlewaretoken': csrf_value,
        'username': username,
        'password': password,
        'next': "/admin/"
    }
    res = session.post(MGE_ADMIN_LOGIN_URL, data=data, headers=headers, timeout=5)
    if res.status_code != 200:
        return None
    return session.cookies
