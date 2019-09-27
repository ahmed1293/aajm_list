from rest_framework import serializers, viewsets

from list.models import Item


class ItemSerializer(serializers.ModelSerializer):
    added_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")

    class Meta:
        model = Item
        fields = ['name', 'quantity', 'list', 'added_by', 'added_at']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
