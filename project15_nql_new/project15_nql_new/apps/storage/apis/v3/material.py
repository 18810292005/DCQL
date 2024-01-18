from django.views.generic import View

from mgedata.utils.general import json_response
from django.http.response import JsonResponse
from apps.storage.models.material import MaterialMethod
from apps.storage.models.template import Template, MaterialMethodTemplateRelation


class MaterialMethodView(View):

    def get(self, request, *args, **kwargs):
        return json_response([child.to_tree() for child in MaterialMethod.objects.filter(parent=None)])


class MaterialMethodLeavesView(View):
    def get(self, request, *args, **kwargs):
        material_method_leaves = list(MaterialMethod.objects.filter(children=None).values('id'))
        for material_method_leaf in material_method_leaves:
            material_method_leaf['name'] = MaterialMethod.objects.get(id=material_method_leaf['id']).name
        return json_response(material_method_leaves)


class TemplateMaterialMethodView(View):
    """
    返回对应模板的数据产生方式
    """

    def get(self, request):
        try:
            template_id = request.GET.get('template_id')
            template = Template.objects.get(id=template_id)
            category = template.category
            category_id = category.id
            category_name = category.name
            mr = MaterialMethodTemplateRelation.objects.get(template=template_id)
            method = mr.method
            res = {
                "method_id": method.id,
                "method_name": method.name,
                "category_id": category_id,
                "category_name": category_name
            }
            return JsonResponse(res)
        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)
