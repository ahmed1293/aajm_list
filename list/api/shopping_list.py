from rest_framework import serializers, viewsets

from list.api.item import ItemSerializer
from list.models import ShoppingList


class ShoppingListSerializer(serializers.ModelSerializer):
    items = ItemSerializer(source='item_set', many=True, read_only=True)

    class Meta:
        model = ShoppingList
        fields = ['name', 'created_by', 'created_at', 'items']


class ShoppingListViewSet(viewsets.ModelViewSet):
    queryset = ShoppingList.objects.all().prefetch_related('item_set')
    serializer_class = ShoppingListSerializer
