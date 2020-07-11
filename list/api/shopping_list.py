from django.db import transaction
from rest_framework import serializers, viewsets
from rest_framework.pagination import PageNumberPagination

from list.api.item import ItemSerializer
from list.api.pagination import ShortResultsSetPagination
from list.models import ShoppingList, DefaultItem, Item


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
	pagination_class = ShortResultsSetPagination

	@transaction.atomic
	def perform_create(self, serializer):
		instance = serializer.save(created_by=self.request.user)
		for default_item in DefaultItem.objects.all():
			Item.objects.create(
				name=default_item.name,
				quantity=default_item.quantity,
				list=instance,
				added_by=self.request.user
			)
