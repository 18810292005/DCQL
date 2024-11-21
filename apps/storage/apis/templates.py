from django.http import HttpRequest

from apps.account.auth import require_role
from apps.account.models.users import UserRole, User
from apps.storage.models import Template
from mgedata.errors.models import MGEError
from mgedata.utils.general import require_methods_api, json_response


@require_methods_api(['GET'])
@require_role(UserRole.RESEARCHER)
def get_template(request: HttpRequest, tid: int):
    try:
        template = Template.objects.filter(id=tid).select_related('category', 'reviewer', 'user')[0]
        if template.public is False:
            if template.reviewer and template.reviewer.username != request.user.username:
                raise Template.DoesNotExist
    except Template.DoesNotExist:
        raise MGEError.NOT_FOUND
    result = template.to_dict()
    result["review_state"] = template.review_state
    result["reviewer"] = template.reviewer_id
    result["reviewer_institution"] = User.objects.get(username=template.reviewer_id).institution if template.reviewer_id is not None else None
    result["reviewer_real_name"] = template.reviewer.real_name if template.reviewer else None
    result["disapprove_reason"] = template.disapprove_reason
    return json_response(result)