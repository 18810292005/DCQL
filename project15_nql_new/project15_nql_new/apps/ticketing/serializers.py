from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    real_name = serializers.CharField(source='created_by.real_name', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'

    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()
