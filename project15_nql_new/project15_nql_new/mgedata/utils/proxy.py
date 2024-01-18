from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from proxy.views import proxy_view


@csrf_exempt
def big_file_proxy(request, path):
    remote_url = ''.join((settings.BIG_FILE_SERVER, path))
    # file参数含有"[", "]"会出错，这里做一个替换.
    if request.method == "POST":
        file = request.FILES['file']
        if file:
            if "[" in file.name or "]" in file.name:
                data = request.POST.copy()
                file.name = file.name.replace('[', '_').replace(']', '_')
                data['file'] = file.name
                request.POST = data
    return proxy_view(request, remote_url)
