from rest_framework import serializers, viewsets

from list.api.item import ItemSerializer
from list.models import ShoppingList


class ShoppingListSerializer(serializers.ModelSerializer):
    items = ItemSerializer(source='item_set', many=True, read_only=True)
    created_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", required=False)
    created_by = serializers.CharField(source='created_by.username', required=False, allow_null=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'name', 'created_by', 'created_at', 'items']


class ShoppingListViewSet(viewsets.ModelViewSet):
    queryset = ShoppingList.objects.all().prefetch_related('item_set').order_by('-created_at')
    serializer_class = ShoppingListSerializer

    def perform_create(self, serializer):
        # TODO: use self.request.data to create using defaults
        serializer.save(created_by=self.request.user)

