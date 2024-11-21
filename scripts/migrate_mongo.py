import json
import sys
from pathlib import Path

import django

from mgedata.load_settings import load_settings

if __name__ == '__main__':
    basedir = Path(__file__).parent.parent
    sys.path.append(str(basedir))
    load_settings()
    django.setup()
    from apps.storage.models.template import Template
    from apps.storage.models import MaterialCategory
    from django.conf import settings  # noqa

    settings.MEDIA_URL  # noqa
    template_json_list = []
    template_json_path = basedir / 'scripts' / 'templates.json'
    if not template_json_path.exists():
        for template in Template.objects.all():
            if '测试' in template.title or len(template.title) < 3:
                continue
            template_json_list.append(
                {
                    "title": template.title,
                    "content": template.content,
                    "category_id": template.category_id,
                }
            )
        with open(template_json_path, 'w') as f:
            f.write(json.dumps(template_json_list, ensure_ascii=False))

    category_tree = {
        'root': [],
        'id_children_map': {},
        'id_parent_map': {},
        'id_name_map': {}
    }
    root = MaterialCategory.objects.get(parent__isnull=True)


    def find_children(cat: MaterialCategory):
        category_tree['id_name_map'][cat.id] = cat.name_zh
        children = MaterialCategory.objects.filter(parent=cat)
        for child in children:
            category_tree['id_parent_map'].setdefault(child.id, cat.id)
            category_tree['id_children_map'].setdefault(cat.id, []).append(child.id)
            find_children(child)


    for category in MaterialCategory.objects.filter(parent=root):
        category_tree['root'].append(category.id)
        find_children(category)

    with open(basedir / 'scripts' / 'category_tree.json', 'w') as f:
        f.write(json.dumps(category_tree, ensure_ascii=False, indent=4))
