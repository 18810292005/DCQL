import shutil
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core import serializers
from django.core.management.base import BaseCommand
from django.db import IntegrityError

from apps.search.core_v2.es import Manager
from apps.storage.models.data import DataMeta, Template
from mgedata.errors.models import MGEException, MGEError


def restore_pg(json_path):
    duplicated_meta_list = []
    successful_meta_list = []
    template_id_list = set()
    with open(json_path, 'r') as fp:
        objs = serializers.deserialize(
            'json', fp, handle_forward_references=True,
        )
        objs = list(objs)
        for obj in objs:
            if isinstance(obj.object, DataMeta):
                obj.object.update_es_time = None
                template_id_list.add(obj.object.template_id)

        last_count = len(objs)
        allow_loop = True
        while objs:  # FIXME performance
            temp_objs = objs[:]
            for obj in temp_objs:
                try:
                    obj.save(force_insert=True)
                    objs.remove(obj)
                    if isinstance(obj.object, DataMeta):
                        successful_meta_list.append(obj.object.id)
                except (MGEException, IntegrityError) as e:
                    if 'duplicate' in str(e) or e in (MGEError.BAD_EMAIL, MGEError.BAD_USERNAME):
                        objs.remove(obj)
                        if isinstance(obj.object, DataMeta) or getattr(obj.object, 'model', None) == 'datameta':
                            duplicated_meta_list.append(obj.object.id)
                    elif 'is not present' in str(e):
                        if allow_loop:
                            continue
                        raise
                    else:
                        raise
            if len(objs) == last_count:
                allow_loop = False
            last_count = len(objs)

    return successful_meta_list, duplicated_meta_list, list(template_id_list)


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--dumpfile', '-f', dest='dumpfile')

    def handle(self, *args, **options):
        with TemporaryDirectory() as temp_dir:
            temp_dir = Path(temp_dir)
            shutil.unpack_archive(options['dumpfile'], extract_dir=temp_dir, format='zip')
            # print("Copying attachments...", end='')
            # with open(temp_dir / 'files.json', encoding='utf-8') as fp:
            #     files = json.load(fp)
            # for rel, filename in files.items():
            #     dst = Path(settings.MEDIA_ROOT) / rel
            #     os.makedirs(dst.parent, exist_ok=True)
            #     shutil.copy(temp_dir / filename, dst)
            # with open(temp_dir / 'mongo.json', encoding='utf-8') as fp:
            #     content = fp.read()
            #     mongo_objects = json.loads(content)
            # seen = set()
            # for table in (DataContent, DataFieldTable, DataFieldTableRow, DataFieldContainer):
            #     print(f"\rInserting {table.__name__}...", end='')
            #     objs = mongo_objects.get(table.__name__, [])
            #     for obj in objs:
            #         if "_id" not in obj:
            #             print(obj)
            #         seen.add(obj["_id"])
            #         obj["id"] = obj["_id"]
            #         obj.pop('_id', None)
            #         try:
            #             table(**obj).save()
            #         except NotUniqueError:
            #             pass
            print("\rInserting PostgreSQL...          ", end='')
            successful_meta_list, duplicated_meta_list, template_id_list = restore_pg(str(temp_dir / 'pg.json'))

        out = StringIO()
        print("\rInserting ElasticSearch...")
        with redirect_stdout(out):
            for template in Template.objects.filter(id__in=list(template_id_list)):
                Manager.update_template(template)
        print(f"\r{len(successful_meta_list)} meta(s) inserted: {repr(successful_meta_list)}")
        print(f"{len(duplicated_meta_list)} meta(s) already exist(s): {repr(duplicated_meta_list)}")
        print("Success")
