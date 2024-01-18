from rest_framework import viewsets
from apps.account.models.users import AdminMaterialCategory
from .rest.serializers import AdminMaterialCategorySerializer


class AdminCategoryViewSet(viewsets.ModelViewSet):

    queryset = AdminMaterialCategory.objects.all()
    serializer_class = AdminMaterialCategorySerializer
