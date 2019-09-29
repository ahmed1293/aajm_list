from rest_framework import serializers, viewsets

from list.models import Item


class ItemSerializer(serializers.ModelSerializer):
    added_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", required=False)

    class Meta:
        model = Item
        fields = ['id', 'name', 'quantity', 'list', 'added_by', 'added_at', 'is_checked']


class ItemWithoutListSerializer(ItemSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'quantity', 'added_by', 'added_at', 'is_checked']


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
