from django.http import JsonResponse
from mgedata.utils.general import require_methods_api
from apps.storage.models.data import DataMeta, DataSet, DoiRegisterInfo
from apps.account.auth import login_required_api
from mgedata.utils.general import json_response
import json


# register doi for a data set
@login_required_api
@require_methods_api(['POST'])
def doi_api(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            user = request.user
            dataset_ids = body.get('dataset_ids', [])
            datasets = DataSet.objects.filter(pk__in=dataset_ids)
            for dataset in datasets:
                if user != dataset.user:
                    continue
                elif dataset.doi is not None:
                    continue
                else:
                    data_reg = DataMeta.objects.filter(dataset=dataset)
                    data_ids = []
                    for d in data_reg:
                        data_ids.append(d.pk)
                    # doi = register_doi(d.title, data_reg, d.contributor, d.project)
                    # d.doi = doi
                    # d.save()
                    # content[d.pk] = doi
                    doiregisterinfo = DoiRegisterInfo()
                    doiregisterinfo.data_ids = data_ids
                    doiregisterinfo.title = dataset.title
                    doiregisterinfo.project = dataset.project
                    doiregisterinfo.contributor = dataset.contributor
                    doiregisterinfo.applicant = user.username
                    doiregisterinfo.dataset_id = dataset.pk
                    doiregisterinfo.save()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        return json_response()
