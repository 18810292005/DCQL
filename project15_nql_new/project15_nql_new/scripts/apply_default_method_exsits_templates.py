import os
import django


def main():
    from apps.storage.models import MaterialMethodTemplateRelation, MaterialMethod, Template
    ins = MaterialMethod.objects.get(name_zh='实验')
    for tpl in Template.objects.all():
        MaterialMethodTemplateRelation.objects.create(template=tpl, method=ins)


if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mgedata.local_settings")
    django.setup()
    main()
