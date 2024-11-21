import json
import random
import uuid
from pathlib import Path

from django.conf import settings  # noqa
from django.core.management.base import BaseCommand
from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.account.models import User
from apps.search.core_v2.es import insert_meta_with_ids
from apps.storage.models import DataVisibility
from apps.storage.models.material import CategoryTree, Category, MaterialProject, MaterialSubject
from apps.storage.models.template import Template, TemplateField


class Command(BaseCommand):
    def add_arguments(self, parser):
        # --with-data, default=False
        parser.add_argument('--with-data', action='store_true', default=False)
        # --batch-size, default=100
        parser.add_argument('--batch-size', type=int, default=100)
        parser.add_argument('--categories-only', action='store_true', default=False, help='Only create categories')
        parser.add_argument('--users-only', action='store_true', default=False, help='Only create users')

    def handle(self, *args, **options):
        # categories_only，users_only只能有一个
        if options['categories_only'] and options['users_only']:
            raise ValueError('categories_only and users_only cannot be set at the same time')
        base_dir = Path(settings.BASE_DIR)
        admin = User.objects.filter(username='admin').first()

        if not admin:
            admin = User(
                username='admin',
                real_name='管理员',
                role=4,
                email='admin@localhost.com',
                is_staff=True,
                is_superuser=True,
                institution='北京科技大学'
            )
            password = 'C_gW9ziT8P-hfBL_c4J4tzATu'
            admin.set_password(password)
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'超级管理员: admin {password}'))

        if not Category.objects.count():
            with transaction.atomic():
                with open(base_dir / 'scripts' / 'category_tree.json', 'r', encoding='utf-8') as f:
                    category_tree = json.load(f)
                    for _id, name in category_tree['id_name_map'].items():
                        while True:
                            try:
                                Category.objects.get_or_create(id=_id, name_zh=name)
                                break
                            except IntegrityError:
                                name += '+'

                    tree = CategoryTree(tree_json=category_tree, version=uuid.uuid4())
                    tree.generate_tree()
                    tree.save()
        if options['categories_only']:
            return

        test_users = [
            ('王雪', 'wangxue', 'wangxue@localhost.com'),
            ('黄伟', 'huangwei', 'huangwei@localhost.com'),
            ('周芳', 'zhoufang', 'zhoufang@localhost.com'),
            ('吴刚', 'wugang', 'wugang@localhost.com'),
            ('郑娟', 'zhengjuan', 'zhengjuan@localhost.com'),
            ('李峰', 'lifeng', 'lifeng@localhost.com'),
            ('朱艳', 'zhuyan', 'zhuyan@localhost.com'),
            ('刘秀英', 'liuxiuying', 'liuxiuying@localhost.com'),
            ('陈军', 'chenjun', 'chenjun@localhost.com'),
            ('杨艳', 'yangyan', 'yangyan@localhost.com'),
            ('张勇', 'zhangyong', 'zhangyong@localhost.com'),
            ('赵敏', 'zhaomin', 'zhaomin@localhost.com'),
            ('孙敏', 'sunmin', 'sunmin@localhost.com'),
            ('马强', 'maqiang', 'maqiang@localhost.com'),
            ('胡丽', 'huli', 'huli@localhost.com'),
            ('林秀兰', 'linxiulan', 'linxiulan@localhost.com'),
            ('赖军', 'laijun', 'laijun@localhost.com'),
            ('高娜', 'gaona', 'gaona@localhost.com'),
            ('许杰', 'xujie', 'xujie@localhost.com'),
            ('徐明', 'xuming', 'xuming@localhost.com'),
            ('邓丽', 'dengli', 'dengli@localhost.com'),
            ('彭强', 'pengqiang', 'pengqiang@localhost.com'),
            ('梁秀英', 'liangxiuying', 'liangxiuying@localhost.com'),
            ('于娟', 'yujuan', 'yujuan@localhost.com'),
            ('莫艳', 'moyan', 'moyan@localhost.com'),
            ('何强', 'heqiang', 'heqiang@localhost.com'),
            ('吕霞', 'lvxia', 'lvxia@localhost.com'),
            ('丁伟', 'dingwei', 'dingwei@localhost.com'),
            ('田秀兰', 'tianxiulan', 'tianxiulan@localhost.com'),
            ('苏勇', 'suyong', 'suyong@localhost.com'),
            ('韩军', 'hanjun', 'hanjun@localhost.com'),
            ('冯静', 'fengjing', 'fengjing@localhost.com'),
            ('曹杰', 'caojie', 'caojie@localhost.com'),
            ('卢娟', 'lujuan', 'lujuan@localhost.com'),
            ('钟勇', 'zhongyong', 'zhongyong@localhost.com'),
            ('姜艳', 'jiangyan', 'jiangyan@localhost.com'),
            ('谢娟', 'xiejuan', 'xiejuan@localhost.com'),
            ('游勇', 'youyong', 'youyong@localhost.com'),
            ('邹明', 'zouming', 'zouming@localhost.com'),
            ('沈静', 'shenjing', 'shenjing@localhost.com'),
            ('施静', 'shijing', 'shijing@localhost.com'),
            ('卓敏', 'zhuomin', 'zhuomin@localhost.com'),
            ('夏静', 'xiajing', 'xiajing@localhost.com'),
            ('胥芳', 'xufang', 'xufang@localhost.com'),
            ('柳军', 'liujun', 'liujun@localhost.com')
        ]
        usernames = [username for _, username, _ in test_users]
        institutions = ['清华大学', '北京大学', '北京科技大学', '北京航空航天大学', '北京理工大学', '中国人民大学',
                        '北京师范大学', '上海交通大学', '复旦大学', '同济大学', '华东师范大学', '上海大学',
                        '华东理工大学',
                        '东华大学', '南京大学', '东南大学', '南京航空航天大学', '南京理工大学', '河海大学',
                        '南京师范大学',
                        '南京农业大学', '浙江大学', '杭州电子科技大学', '浙江工业大学', '浙江理工大学', '中国美术学院',
                        '宁波大学', '杭州师范大学', '四川大学', '电子科技大学', '西南交通大学', '西南财经大学',
                        '西南大学',
                        '重庆大学', '重庆邮电大学', ]

        if User.objects.filter(username__in=usernames).count() < len(test_users):
            User.objects.filter(username__in=usernames).delete()
            with transaction.atomic():
                for real_name, username, email in test_users:
                    user = User(username=username, email=email, real_name=real_name, role=2)
                    user.institution = random.choice(institutions)
                    user.set_password('C_gW9ziT8P-hfBL_c4J4tzATu')
                    try:
                        user.save()
                    except Exception as e:
                        print(e)
        if options['users_only']:
            return

        template_json_path = base_dir / 'scripts' / 'templates.json'
        with open(template_json_path, 'r', encoding='utf-8') as f:
            template_json_list = json.load(f)
        titles = [template['title'] for template in template_json_list]
        if Template.objects.filter(title__in=titles).count() < len(titles):
            Template.objects.filter(title__in=titles).delete()
            with transaction.atomic():
                for template in template_json_list:
                    try:
                        Template.objects.get_or_create(
                            title=template['title'],
                            content=template['content'],
                            category_id=template['category_id'],
                            user_id=random.choice(usernames),
                            abstract=template['title'],
                            reviewer_id=random.choice(usernames),
                            review_state=1,
                            published=True,
                        )
                    except IntegrityError as e:
                        if 'duplicate key' in str(e):
                            continue

        project_id_subjects_map = {

        }
        if not MaterialProject.objects.count():
            with open(base_dir / 'scripts' / 'random_projects.txt', 'r', encoding='utf-8') as f:
                random_projects = [line.strip() for line in f]
            with transaction.atomic():
                for project in set(random_projects):
                    p = MaterialProject.objects.create(
                        # random string, 10 letters+digits
                        pk=''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=10)),
                        name=project,
                        leader_id=random.choice(usernames),
                    )
                    p.add_members([admin, p.leader])
                    for i in range(2):
                        s = MaterialSubject.objects.create(
                            pk=''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=10)),
                            name=f'{p.id}-subject-{i}',
                            project=p,
                            leader_id=random.choice(usernames),
                        )
                        s.add_members([admin, s.leader])
                        project_id_subjects_map.setdefault(p.id, []).append(s.id)
        if options['with_data']:
            self.add_data(usernames, project_id_subjects_map, **options)

    def add_data(self, usernames, project_id_subjects_map, **options):
        assert usernames
        if not project_id_subjects_map:
            for project in MaterialProject.objects.all():
                project_id_subjects_map[project.id] = list(
                    MaterialSubject.objects.filter(project=project).values_list('id', flat=True))
        random_strings = []
        random_titles = []
        with open(Path(settings.BASE_DIR) / 'scripts' / 'LCCC-base_valid.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            for _list in data:
                for string in _list:
                    random_strings.append(string.replace(' ', ''))
        with open(Path(settings.BASE_DIR) / 'scripts' / 'random_strings.txt', 'r', encoding='utf-8') as f:
            for line in f:
                random_titles.append(line.strip())
        random.seed(random.randint(0, 1000000))

        def _recursive(field_meta: TemplateField):
            if field_meta.field_type.is_container:
                value = {}
                for sub_field in field_meta.sub_fields:
                    value[sub_field.field_name] = _recursive(sub_field)
            elif field_meta.field_type.is_generator:
                value = {}
                sub_field = random.choice(field_meta.sub_fields)
                value[sub_field.field_name] = _recursive(sub_field)
            elif field_meta.field_type.is_table:
                value = []
                for i in range(random.randint(2, 5)):
                    row = {}
                    for sub_field in field_meta.sub_fields:
                        row[sub_field.field_name] = _recursive(sub_field)
                    value.append(row)
            elif field_meta.field_type.is_array:
                value = []
                for i in range(random.randint(2, 5)):
                    value.append(_recursive(field_meta.sub_fields[0]))
            elif field_meta.field_type.is_number:
                value = random.choice([
                    lambda: random.randint(-100000, 100000),  # random int
                    lambda: random.random() * 1000000,  # random float
                ])()
            elif field_meta.field_type.is_string:
                value = random.choice(random_strings)
            elif field_meta.field_type.is_file:
                value = ['_fs/data_files/test_file1.zip', '_fs/data_files/test_file2.txt']
            elif field_meta.field_type.is_image:
                value = ['_fs/data_files/test_image1.jpg', '_fs/data_files/test_image2.jpg']
            elif field_meta.field_type.is_choice:
                try:
                    value = random.choice(field_meta.choices_list)
                except Exception:
                    raise NotImplementedError
            elif field_meta.field_type.is_range_error(field_meta.range_type):
                value = {
                    'val': random.choice([
                        lambda: random.randint(-100000, 100000),  # random int
                        lambda: random.random() * 1000000,  # random float
                    ])(),
                    'err': random.random()
                }
            elif field_meta.field_type.is_range_interval(field_meta.range_type):
                value = {
                    'lb': random.choice([
                        lambda: random.randint(-100000, 100000),  # random int
                        lambda: random.random() * 1000000,  # random float
                    ])(),
                    'ub': random.choice([
                        lambda: random.randint(-100000, 100000),  # random int
                        lambda: random.random() * 1000000,  # random float
                    ])(),
                }

            else:
                raise ValueError(f'Unknown field type: {field_meta.field_type.name}')
            return value

        project_id_list = list(project_id_subjects_map.keys())

        # 生成测试数据
        template_count = Template.objects.count()
        for i_template, template in enumerate(Template.objects.all()):
            try:
                if '_ord' not in template.content:
                    pass
            except NotImplementedError:
                continue  # 无效的模板

            with transaction.atomic():
                created_ids = []
                for i in range(options['batch_size']):
                    data = {}
                    for field in template.fields:
                        data[field.field_name] = _recursive(field)
                    project_id = random.choice(project_id_list)
                    subject_ids = project_id_subjects_map[project_id]
                    from apps.storage.models.data import DataMeta
                    state = random.choice([0, 1])
                    meta = DataMeta.objects.create(
                        title=random.choice(random_titles),
                        user_id='admin',
                        template_id=template.id,
                        category_id=template.category_id,
                        review_state=state,
                        visibility=DataVisibility.PUBLIC,
                        reviewer_id=random.choice(usernames) if state == 1 else None,
                        review_time=None if state == 0 else timezone.now(),
                        project_id=project_id,
                        subject_id=random.choice(subject_ids),
                        dc_id='5a582de883043483ffcb99e6',
                        abstract=random.choice(random_strings),
                        keywords=[
                            ''.join(random.choices(
                                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+|~,.;\'[]{}',
                                k=5
                            )) for _ in range(5)
                        ],
                    )
                    created_ids.append(meta.id)
                    template.modify_data(meta, meta_dict=None, content_dict=data, only_content=True)
                    print(f'template {i_template + 1}/{template_count}')
                insert_meta_with_ids(created_ids)
