from rest_framework import serializers, viewsets

from list.api.pagination import StandardResultsSetPagination
from list.models import Item, DefaultItem


class ItemSerializer(serializers.ModelSerializer):
	added_at = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S", required=False)
	added_by = serializers.CharField(source='added_by.username', required=False, allow_null=True)

	class Meta:
		model = Item
		fields = ['id', 'name', 'quantity', 'list', 'added_by', 'added_at', 'is_checked']


class ItemViewSet(viewsets.ModelViewSet):
	queryset = Item.objects.all()
	serializer_class = ItemSerializer
	pagination_class = StandardResultsSetPagination

	def perform_create(self, serializer):
		serializer.save(added_by=self.request.user)


class DefaultItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = DefaultItem
		fields = ['id', 'name', 'quantity']


class DefaultItemViewSet(viewsets.ModelViewSet):
	queryset = DefaultItem.objects.all()
	serializer_class = DefaultItemSerializer
