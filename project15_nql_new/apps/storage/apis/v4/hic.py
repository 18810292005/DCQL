from apps.storage.models.data import DataMeta
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from apps.storage.apis.v2.data import data_to_dict


def get_hic_files(req):
    if req.method == 'GET':
        try:
            x_forwarded_for = req.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = req.META.get('REMOTE_ADDR')
            if not settings.DEBUG:
                if ip != settings.HIC_HOST:
                    return HttpResponse(status=403)
            template_id = req.GET.get('template_id')  # 获取所有的hic数据id
            if template_id:
                data_ids = list(DataMeta.objects.filter(template__id=template_id).values_list('id', flat=True))
                return JsonResponse({"data_ids": data_ids})
            else:
                id = req.GET.get('id')
                if id:
                    data = DataMeta.objects.get(id=id)
                    data_dict = data_to_dict(data=data, meta_only=False)
                    return JsonResponse(data_dict)
                else:
                    return HttpResponse(status=404)
        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)
    else:
        return HttpResponse(status=403)
