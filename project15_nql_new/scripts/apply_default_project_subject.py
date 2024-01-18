import os
import django


def main():
    from apps.storage.models import DataMeta, MaterialProject, MaterialSubject
    project_id = input().strip()
    subject_id = input().strip()
    try:
        project = MaterialProject.objects.get(pk=project_id)
        subject = MaterialSubject.objects.get(pk=subject_id)
    except (MaterialProject.DoesNotExist, MaterialSubject.DoesNotExist) as e:
        print('Project/Subject Id does not exist')
        exit(0)

    for ins in DataMeta.objects.all():
        other_info = ins.other_info
        if 'project' not in other_info:
            ins.other_info['project'] = project_id
            ins.other_info['subject'] = subject_id
            ins.save()


if __name__ == '__main__':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mgedata.local_settings")
    django.setup()
    main()
