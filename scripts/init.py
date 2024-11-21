import sys
from pathlib import Path

import django

from mgedata.load_settings import load_settings

if __name__ == '__main__':
    basedir = Path(__file__).parent.parent

    sys.path.append(str(basedir))
    load_settings()
    django.setup()
    from apps.account.models.users import User
    from apps.storage.models.material import MaterialProject, MaterialSubject, MaterialMethod, CategoryTree
    from apps.storage.models.template import Template, MaterialMethodTemplateRelation
    from django.db import transaction

    if not User.objects.filter(username='admin').exists():
        with transaction.atomic():
            user: User = User(
                username='admin',
                password='admin',
                email='admin@localhost',
                is_superuser=True,
                is_staff=True,
            )
            user.roles = 255
            user.real_name = '管理员'
            user.institution = '北京科技大学'
            user.set_password('admin')
            user.save()
            project = MaterialProject.objects.get_or_create(id='test_project', name='测试项目', leader=user)
            subject = MaterialSubject.objects.get_or_create(
                id='test_subject', name='测试课题',
                project=project[0],
                leader=user,
            )
            method, _ = MaterialMethod.objects.get_or_create(
                name_zh='测试方法',
            )

            v, _ = CategoryTree.get_tree()
            v, cat1 = CategoryTree.add_category(v, '测试分类1')
            v, cat2 = CategoryTree.add_category(v, '测试分类2')
            v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
            v, cat1_2 = CategoryTree.add_category(v, '测试分类1-2', cat1.id)
            v, cat2_1 = CategoryTree.add_category(v, '测试分类2-1', cat2.id)
            v, cat2_2 = CategoryTree.add_category(v, '测试分类2-2', cat2.id)
            v, cat1_1_1 = CategoryTree.add_category(v, '测试分类1-1-1', cat1_1.id)
            v, cat1_1_2 = CategoryTree.add_category(v, '测试分类1-1-2', cat1_1.id)
            v, cat1_2_1 = CategoryTree.add_category(v, '测试分类1-2-1', cat1_2.id)
            v, cat1_2_2 = CategoryTree.add_category(v, '测试分类1-2-2', cat1_2.id)
            v, cat2_1_1 = CategoryTree.add_category(v, '测试分类2-1-1', cat2_1.id)
            v, cat2_1_2 = CategoryTree.add_category(v, '测试分类2-1-2', cat2_1.id)
            v, cat2_2_1 = CategoryTree.add_category(v, '测试分类2-2-1', cat2_2.id)
            v, cat2_2_2 = CategoryTree.add_category(v, '测试分类2-2-2', cat2_2.id)
            t, _ = Template.objects.get_or_create(
                content={'_ord': ['特征', 'test_string', 'test_number', 'test_image'],
                         '特征': {'r': True, 't': 1, 'misc': {}},
                         'test_image': {'r': False, 't': 4, 'misc': {'multi': False}},
                         'test_number': {'r': False, 't': 2, 'misc': {'unit': ''}},
                         'test_string': {'r': False, 't': 1, 'misc': {}}},
                abstract='本项目根据材料基因工程未来新数据采集和汇交特点，将汇交数据分为三类科学数据：离散型材料数据、高通量计算/实验平台数据和数据库数据，以及采集自各个国家级科技项目的项目管理类数据，针对每一类数据特点分别研发专门的数据汇交软件与子系统，建立数据汇交、管理与服务标准规范，重点研发智能检索与推送、不确定性量化分析与挖掘等技术，构建集成各种汇交软件、支持项目数据汇交、支持数据质量控制与挖掘应用、科技项目管理服务一体化的国家材料基因工程数据汇交与管理服务技术平台。',
                constraints="""{"identifier": "特征"}""",
                title="测试模板",
                user=user,
                category=cat1_1_1,
                published=True,
            )
            MaterialMethodTemplateRelation.objects.create(
                template=t,
                method=method
            )
