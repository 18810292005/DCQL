import datetime

from django.utils import timezone

from oauth2_provider.models import Application
from oauth2_provider.models import AccessToken

from apps.storage.models import Template


def create_oauth2_application(user, name, redirect_uri):
    return Application.objects.create(
        client_type=Application.CLIENT_CONFIDENTIAL,
        authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
        user=user,
        name=name,
        redirect_uris=redirect_uri)


def create_oauth2_access_token(user, application):
    return AccessToken.objects.create(
        user=user, token='1234567890',
        application=application,
        scope='read write',
        expires=timezone.now() + datetime.timedelta(days=1)
    )


def create_material_category_tree(category_model, category_forest):
    """
    :param category_model: Django Model
    :param category_forest:

    For example
    [
        {'name_zh': '语文', 'name_en': 'Chinese', 'children': []}
        {'name_zh': '理科', 'name_en': 'L', 'children': [
                {'name_zh': '数学', 'name_en': 'math'}
            ]
        }
    ]

    :return: None
    """
    def create_sub_tree(sub_tree, parent, level):
        cur = category_model.objects.create(
            parent=parent,
            leaf=(len(sub_tree.get('children', [])) == 0),
            level=level,
            name_zh=sub_tree['name_zh'],
            name_en=sub_tree['name_en'],
            hidden=sub_tree.get('hidden', False),
            is_public=sub_tree.get('is_public', True))
        for child in sub_tree.get('children', []):
            create_sub_tree(child, cur, level + 1)

    root = category_model.objects.create(
        leaf=False,
        level=0,
        name_zh='全局根节点',
        name_en='root'
    )

    for tree in category_forest:
        create_sub_tree(tree, root, 1)


def create_template(title, abstract, category, template_content):
    return Template.objects.create(title=title,
                                   abstract=abstract,
                                   category=category,
                                   content=template_content)
