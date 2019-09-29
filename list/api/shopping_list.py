from rest_framework import serializers, viewsets

from list.api.item import ItemWithoutListSerializer
from list.models import ShoppingList


class ShoppingListSerializer(serializers.ModelSerializer):
    items = ItemWithoutListSerializer(source='item_set', many=True, read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", required=False)

    class Meta:
        model = ShoppingList
        fields = ['name', 'created_by', 'created_at', 'items']


class ShoppingListViewSet(viewsets.ModelViewSet):
    queryset = ShoppingList.objects.all().prefetch_related('item_set').order_by('-created_at')
    serializer_class = ShoppingListSerializer

