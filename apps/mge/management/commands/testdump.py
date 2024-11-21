import sys

from django.apps import apps
from django.conf import settings
from django.core.management import CommandError
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import models
from django.db import connections
from django.db.utils import ProgrammingError


class Command(BaseCommand):
    help = (
        "导出数据库的数据至json文件，用作测试的fixture"
    )

    def __init__(self, *args, **kwargs):
        self._dump_db_conn = None
        self._excluded_apps = []
        self._db_user = None

        super().__init__(*args, **kwargs)

    def add_arguments(self, parser):
        parser.add_argument(
            '-x', '--include-extra', dest='include_extra', action='append', default=[],
            help='额外包含某个app所有model（默认只包含account和storage的所有model）'
        )
        parser.add_argument('-i', '--include-only', dest='include_only', action='append', default=[],
                            help='指定只包含某个app的所有model')
        parser.add_argument('-d', '--init', dest='init', action='store_true',
                            help='拷贝settings中设置的数据库至临时数据库，并抽取部分数据作为dump的来源。如果临时数据库不存在，自动使用此选项')
        parser.add_argument('-f', '--with-files', dest='preserve', action='store_true', help='保留数据的附件与图片，默认不保留')
        parser.add_argument('-o', '--output', dest='output', action='store', default='test_fixture.json')

    def handle(self, *args, **options):
        included_apps = ['account', 'storage']
        installed = list(apps.app_configs.keys())
        only = options.pop('include_only')
        extra = options.pop('include_extra')
        init = options.pop('init')
        output = options.pop('output')
        preserve = options.pop('preserve')
        if not output:
            raise CommandError("缺少参数output")
        if only and extra:
            raise CommandError("--include-extra和--include-only不能同时使用")
        if only:
            included_apps = []
            names = only
        else:
            names = extra

        for label_or_model in names:
            if label_or_model not in installed:
                raise CommandError(f'app "{label_or_model}" 不存在或者未安装')
            included_apps.append(label_or_model)

        self._excluded_apps = list(set(installed) - set(included_apps))
        db_to_dump = '__mgedata_dump_db_name__'
        db_conn_name = '__mgedata__dump_conn_name__'
        if settings.DATABASES.get(db_conn_name, {}).get('NAME', '') != db_to_dump:
            org_conn = settings.DATABASES['default']
            dump_conn = {'NAME': db_to_dump, 'ENGINE': org_conn['ENGINE'], 'USER': org_conn['USER'],
                         'PASSWORD': org_conn['PASSWORD'], 'HOST': org_conn['HOST'], 'PORT': org_conn['PORT'],
                         'TEST': {'MIRROR': 'default'}}
            import json
            msg = json.dumps({db_conn_name: dump_conn}, indent=4)
            raise CommandError('\n' + msg + "\n先添加以上配置（不包括最外层的花括号）至settings.DATABASES，然后重新运行此命令")

        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        self._db_user = db_user
        self._dump_db_conn = connections[db_conn_name]
        cursor = connections['default'].cursor()
        create_new = False
        if init:
            try:
                cursor.execute(f"drop database {db_to_dump}")
            except ProgrammingError as e:
                if 'does not exist' not in str(e):
                    raise
            create_new = True
        else:
            cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_to_dump}'")
            if cursor.fetchone() is None:  # 临时数据库不存在
                create_new = True
        if create_new:
            try:
                print(f"复制数据库{db_name}...")
                cursor.execute(f"CREATE DATABASE {db_to_dump} with template {db_name} owner {db_user}")
                self.shrink_database(db_conn_name, preserve)
            except KeyboardInterrupt:
                print("\n正在取消...")
                self._dump_db_conn.close()
                cursor.execute(f"drop database {db_to_dump}")
                sys.exit()

        print("dump数据库...")
        options_to_pass = {'exclude': self._excluded_apps}
        options_to_pass.update(options)
        options_to_pass['database'] = db_conn_name
        with open(output, 'w') as fp:
            call_command('dumpdata', *args, **options_to_pass, stdout=fp)
        print("完成")

    def shrink_database(self, db_conn_name, preserve_files):
        from django.db.models import Q
        from apps.storage.models.data import DataMeta, Template, DataContentFile, DataContentImage, FileUsage, ImageUsage, \
            UploadHistory
        from apps.storage.models.data import DataUploadSourceMap, DoiRegisterInfo, DataScore, DataSet
        from apps.storage.models.file import TemporaryDataTemplate, TemporaryExportedFile, TemporaryUploadedFile, \
            UploadedSourceFile
        from apps.account.models.users import User
        from apps.storage.models.material import MaterialSubject, MaterialProject

        for model in apps.get_models():
            self.disable_triggers(model)

        print('清理临时上传文件...')
        for t in (
                DataUploadSourceMap,
                UploadHistory,
                DataScore,
                DoiRegisterInfo,
                DataSet,
                UploadedSourceFile,
                TemporaryUploadedFile,
                TemporaryExportedFile,
                TemporaryDataTemplate,
        ):
            self.truncate_table(t)
        for app_label in self._excluded_apps:
            print(f'清理app "{app_label}" ...')
            for model in apps.app_configs[app_label].get_models():
                try:
                    self.truncate_table(model)
                except ProgrammingError as e:
                    if 'does not exist' not in str(e):
                        raise

        if not preserve_files:
            print("清理附件与图片...")
            self.truncate_table(FileUsage)
            self.truncate_table(ImageUsage)
            self.truncate_table(DataContentFile)
            self.truncate_table(DataContentImage)

        template_count = Template.objects.using(db_conn_name).count()
        for i, t in enumerate(Template.objects.using(db_conn_name).all()):
            print(f"\r抽取测试模板与数据......{int(i / template_count * 100)}%", end="")
            q = DataMeta.objects.using(db_conn_name).filter(template=t)
            if q.count() > 3:
                q = q.order_by('id')
                _id = q[3].id
                qs = DataMeta.objects.using(db_conn_name).filter(template=t, id__gt=_id)
                qs._raw_delete(qs.db)
            elif q.count() == 0:
                t.delete()
        DataMeta.objects.using(db_conn_name).all().update(dataset=None)
        print("\r抽取测试模板与数据...          ")
        print("抽取测试用户...")
        for model in apps.app_configs['account'].get_models():
            if model != User:
                self.truncate_table(model)

        data_owners = DataMeta.objects.using(db_conn_name).all().values_list('user_id')
        leaders = User.objects.using(db_conn_name).filter(
            Q(real_name__in=MaterialProject.objects.using(db_conn_name).all().values_list('leader')) &
            Q(real_name__in=MaterialSubject.objects.using(db_conn_name).all().values_list('leader'))
        ).values_list('username')

        User.objects.using(db_conn_name).filter(~Q(username__in=data_owners) & ~Q(username__in=leaders)).delete()
        if preserve_files:
            print("清理无效附件...")
            qs = FileUsage.objects.using(db_conn_name).filter(
                ~Q(id__in=DataMeta.objects.using(db_conn_name).all().values('id')))
            qs._raw_delete(qs.db)
            qs = DataContentFile.objects.using(db_conn_name).filter(
                ~Q(id__in=FileUsage.objects.using(db_conn_name).all().values('file_id')))
            qs._raw_delete(qs.db)
            print("清理无效图片...")
            qs = ImageUsage.objects.using(db_conn_name).filter(
                ~Q(id__in=DataMeta.objects.using(db_conn_name).all().values('id')))
            qs._raw_delete(qs.db)
            qs = DataContentImage.objects.using(db_conn_name).filter(
                ~Q(id__in=ImageUsage.objects.using(db_conn_name).all().values('file_id')))
            qs._raw_delete(qs.db)

    def trigger(self, model: models.Model, enable: bool):
        table_name = model._meta.db_table
        if enable:
            sql = f'ALTER TABLE "{table_name}" ENABLE TRIGGER ALL;'
        else:
            sql = f'ALTER TABLE "{table_name}" DISABLE TRIGGER ALL;'

        with self._dump_db_conn.cursor() as cursor:
            try:
                cursor.execute(sql)
            except ProgrammingError as e:
                if 'denied' in str(e):
                    raise CommandError(f'用户{self._db_user}'
                                       f'没有superuser权限！'
                                       f'可以使用superuser执行'
                                       f' "alter user {self._db_user} with superuser;" '
                                       f'来授予权限')
                elif 'does not exist' in str(e):
                    pass
                else:
                    raise

    def disable_triggers(self, model: models.Model):
        self.trigger(model, False)

    def enable_triggers(self, model: models.Model):
        self.trigger(model, True)

    def truncate_table(self, model: models.Model):
        table_name = model._meta.db_table
        with self._dump_db_conn.cursor() as cursor:
            try:
                cursor.execute(f'DELETE from {table_name}')
            except ProgrammingError as e:
                if 'does not exist' not in str(e):
                    raise
