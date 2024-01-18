"""
为Matcloud数据生成一个外部链接，放置到data meta的other info里面

For MGE与Matcloud 的检索融合
"""

import os
import django


def generate_external_links_for_template(template_id, link_generator):
    from apps.storage.models import DataMeta
    from apps.storage.trans.db.data import DbToData

    queryset = DataMeta.objects.filter(template_id=template_id)
    data = DbToData(101459).to()
    for ins in queryset:
        data = DbToData(ins.id).to()
        other_info = ins.other_info or {}
        field = data['content']['component']['sample']['material']['id']
        if field.get_value() is not None:
            other_info['external_link'] = link_generator(
                field.value
            )
        elif 'external_link' in other_info:
            del other_info['external_link']
        ins.other_info = other_info
        ins.save()


if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mgedata.local_settings")
    django.setup()
    generate_external_links_for_template(206, lambda x: f'https://matcloud.mgedata.cn/search/view/Data.Structure/{x}')
