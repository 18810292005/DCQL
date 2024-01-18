from typing import List
from apps.certificate.models.acceptance import Acceptance


def get_ps_info_by_(acceptances: List[Acceptance]):
    rs = []
    for acceptance in acceptances:
        ps = acceptance.get_project_or_subject()
        if not acceptance.is_project:
            project = ps.project
        else:
            project = ps

        subjects = [
            {'id': subject.id, 'name': subject.name}
            for subject in project.materialsubject_set.all()
        ]
        rs.append({
            'acceptance': acceptance.to_dict(),
            'project': {'id': project.id, 'name': project.name},
            'subjects': subjects})
    return rs
