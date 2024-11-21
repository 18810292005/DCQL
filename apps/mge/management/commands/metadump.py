"""
Original Script: https://github.com/davedash/django-fixture-magic
"""
import json
import random
import re
import shutil
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.exceptions import FieldError, ObjectDoesNotExist
from django.core.management.base import BaseCommand, CommandError
from django.core.serializers import serialize
from django.db import models

from apps.storage.docs import DataContent, DataFieldTable, DataFieldTableRow, DataFieldContainer
from apps.storage.models.data import DataMeta, DataContentFile, DataContentImage, MaterialMethod, MaterialProject, \
    MaterialSubject

serialize_me = []
seen = {}


def remove_oid(string):
    while True:
        pattern = re.compile('{\s*"\$oid":\s*(\"[a-z0-9]{1,}\")\s*}')
        match = re.search(pattern, string)
        if match:
            string = string.replace(match.group(0), match.group(1))
        else:
            return string


def reorder_json(data, models, ordering_cond=None):
    """Reorders JSON (actually a list of model dicts).
    This is useful if you need fixtures for one model to be loaded before
    another.
    :param data: the input JSON to sort
    :param models: the desired order for each model type
    :param ordering_cond: a key to sort within a model
    :return: the ordered JSON
    """
    if ordering_cond is None:
        ordering_cond = {}
    output = []
    bucket = {}
    others = []

    for model in models:
        bucket[model] = []

    for object in data:
        if object['model'] in bucket.keys():
            bucket[object['model']].append(object)
        else:
            others.append(object)
    for model in models:
        if model in ordering_cond:
            bucket[model].sort(key=ordering_cond[model])
        output.extend(bucket[model])

    output.extend(others)
    return output


def get_fields(obj, *exclude_fields):
    try:
        return [f for f in obj._meta.fields if f.name not in exclude_fields]
    except AttributeError:
        return []


def get_m2m(obj, *exclude_fields):
    try:
        return [f for f in obj._meta.many_to_many if f.name not in exclude_fields]
    except AttributeError:
        return []


def serialize_fully(exclude_fields):
    index = 0
    exclude_fields = exclude_fields or ()

    while index < len(serialize_me):
        for field in get_fields(serialize_me[index], *exclude_fields):
            if isinstance(field, models.ForeignKey):
                add_to_serialize_list(
                    [serialize_me[index].__getattribute__(field.name)])
        for field in get_m2m(serialize_me[index], *exclude_fields):
            add_to_serialize_list(
                serialize_me[index].__getattribute__(field.name).all())

        index += 1

    serialize_me.reverse()


def add_to_serialize_list(objs):
    for obj in objs:
        if obj is None:
            continue
        if not hasattr(obj, '_meta'):
            add_to_serialize_list(obj)
            continue

        meta = obj._meta.proxy_for_model._meta if obj._meta.proxy else obj._meta
        model_name = getattr(meta, 'model_name',
                             getattr(meta, 'module_name', None))
        key = "%s:%s:%s" % (obj._meta.app_label, model_name, obj.pk)

        if key not in seen:
            serialize_me.append(obj)
            seen[key] = 1


def get_all_related_objects(model, exclude_fields):
    return [
        f for f in model._meta.get_fields() if
        (f.one_to_many or f.one_to_one) and
        f.auto_created and not f.concrete and f.name not in exclude_fields
    ]


class Command(BaseCommand):
    help = ('Dump specific objects from the database into JSON that you can '
            'use in a fixture.')
    args = "<[--get-related | -k] [--natural]  [--natural-primary]  '\
    '[--natural-foreign] [--query] object_class id [id ...]>"

    def add_arguments(self, parser):
        """Add command line arguments to parser"""

        # Required Args
        parser.add_argument(dest='ids', default=None, nargs='*',
                            help='Use a list of ids e.g. 0 1 2 3')

        parser.add_argument('--output-dir', '-o', dest='output_dir', required=False, default='.',
                            help='Output directory path of dump')

        parser.add_argument('--exclude-fields', '-e', default=[], nargs='*',
                            help='List of excluded fields (works for all models)')
        parser.add_argument('--natural', '-n',
                            action='store_true', dest='natural',
                            default=False,
                            help='Use natural foreign and primary keys '
                                 'if they are available.')
        parser.add_argument('--natural-primary',
                            action='store_true', dest='natural_primary',
                            default=False,
                            help='Use natural primary keys if they are available.')
        parser.add_argument('--natural-foreign',
                            action='store_true', dest='natural_foreign',
                            default=False,
                            help='Use natural foreign keys if they are available.')
        parser.add_argument('--query',
                            dest='query', default=None,
                            help=('Use a json query rather than list of ids '
                                  'e.g. \'{\"pk__in\": [id, ...]}\''))

    def handle(self, *args, **options):
        error_text = ('%s\nTry calling dump_object with --help argument or ' +
                      'use the following arguments:\n %s' % self.args)
        try:
            query = options['query']
            ids = options['ids']
            if ids and query:
                raise CommandError(error_text % 'either use query or id list, not both')
            if not (ids or query):
                ids = random.sample(list(range(DataMeta.objects.first().id - 1)), 200)
        except IndexError:
            raise CommandError(error_text % 'No object_class or filter clause supplied.')
        except ValueError:
            raise CommandError(
                error_text %
                "object_class must be provided in the following format: app_name.model_name"
            )
        except AssertionError:
            raise CommandError(error_text % 'No filter argument supplied.')

        print("Analyzing DataMeta...", end='', flush=True)

        if query:
            objs = DataMeta.objects.filter(**json.loads(query))
        else:
            objs = DataMeta.objects.filter(pk__in=ids)

        fields = get_all_related_objects(DataMeta, options['exclude_fields'])

        related_fields = [rel.get_accessor_name() for rel in fields]

        for obj in objs:
            for rel in related_fields:
                try:
                    if hasattr(getattr(obj, rel), 'all'):
                        add_to_serialize_list(getattr(obj, rel).all())
                    else:
                        add_to_serialize_list([getattr(obj, rel)])
                except FieldError:
                    pass
                except ObjectDoesNotExist:
                    pass

        add_to_serialize_list(objs)
        add_to_serialize_list(MaterialMethod.objects.all())
        add_to_serialize_list(MaterialProject.objects.all())
        add_to_serialize_list(MaterialSubject.objects.all())
        serialize_fully(options['exclude_fields'])

        natural_foreign = (options.get('natural', False) or
                           options.get('natural_foreign', False))
        natural_primary = (options.get('natural', False) or
                           options.get('natural_primary', False))

        file_path_map = {}

        with TemporaryDirectory() as temp_dir:
            temp_dir = Path(temp_dir)
            count = 0
            meta_id_list = set()
            print("\rCopying attachments...      ", end='')
            for obj in serialize_me:
                if isinstance(obj, (DataContentFile, DataContentImage)):
                    if obj.size > 100 * 1024:
                        continue
                    count += 1
                    dst = temp_dir / f'{count}-{obj.filename}'
                    try:
                        shutil.copy(obj.file.path, dst)
                    except FileNotFoundError:
                        continue
                    file_path_map[obj.file.name] = dst.name
                elif isinstance(obj, DataMeta):
                    meta_id_list.add(obj.id)
            with open(temp_dir / 'files.json', 'w', encoding='utf-8') as fp:
                fp.write(json.dumps(file_path_map, ensure_ascii=False, indent=4))
            meta_id_list = list(meta_id_list)
            print("\rDumping DataMeta...            ", end='')
            with open(temp_dir / 'pg.json', 'w', encoding='utf-8') as fp:
                obj_list = [o for o in serialize_me if o is not None]
                data = serialize('json', obj_list, indent=4,
                                 use_natural_foreign_keys=natural_foreign,
                                 use_natural_primary_keys=natural_primary)
                fp.write(data)

            mongo_map = {}
            with open(temp_dir / 'mongo.json', 'w', encoding='utf-8') as fp:
                for table in (DataContent, DataFieldTable, DataFieldContainer, DataFieldTableRow):
                    print(f"\rDumping {table.__name__}...", end='')
                    docs = table.objects(_meta_id__in=meta_id_list).to_json(ensure_ascii=False)
                    mongo_map[table.__name__] = json.loads(docs)
                dumped = json.dumps(mongo_map, ensure_ascii=False, indent=4)
                dumped = remove_oid(dumped)
                fp.write(dumped)

            print("\rMaking archive...            ", end='')
            res = shutil.make_archive(
                base_name=str(Path(options['output_dir']) / 'dump'),
                format='zip',
                root_dir=temp_dir,
                base_dir='.'
            )
            print("\rDump created at " + res)

        # Clear the list. Useful for when calling multiple
        # dump_object commands with a single execution of django
        del serialize_me[:]
        seen.clear()
