import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse

from list.api.item import ItemSerializer
from list.models import ShoppingList, DefaultItem, Item


def test_get_list_response(api_client):
	response = api_client.get(reverse('api:shopping-list-list'))

	assert response.status_code == 200
	assert response.data['count'] == ShoppingList.objects.count()


def test_get_detail_response(api_client, shopping_list, item_banana):
	response = api_client.get(reverse('api:shopping-list-detail', kwargs={'pk': shopping_list.pk}))
	assert response.status_code == 200

	data = response.json()
	assert data['id'] == shopping_list.id
	assert data['created_by'] == shopping_list.created_by.username
	assert ItemSerializer(item_banana).data in data['items']


def test_post_response(api_client):
	response = api_client.post(
		path=reverse('api:shopping-list-list'),
	)

	assert response.status_code == 201
	assert ShoppingList.objects.get(id=response.json()['id'])


def test_delete_response(api_client, shopping_list):
	response = api_client.delete(
		path=f'{reverse("api:shopping-list-list")}{shopping_list.pk}/'
	)

	assert response.status_code == 204
	with pytest.raises(ObjectDoesNotExist):
		ShoppingList.objects.get(pk=shopping_list.pk)


def test_default_items_created_in_post(api_client):
	DefaultItem.objects.create(
		name='default',
		quantity='2'
	)

	response = api_client.post(
		path=reverse('api:shopping-list-list'),
	)

	new_list = ShoppingList.objects.get(id=response.json()['id'])
	assert new_list.item_set.count() == 1
	assert Item.objects.get(name='default', quantity='2', list=new_list)
