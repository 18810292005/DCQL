from rest_framework import serializers
from apps.account.models.users import AdminMaterialCategory


class AdminMaterialCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')
    category_id = serializers.IntegerField(source='category.id')
    granter = serializers.CharField(source='granter.username')
    user = serializers.CharField(source='user.username')

    class Meta:
        model = AdminMaterialCategory
        fields = ('category_id', 'category_name', 'granter', 'user')
