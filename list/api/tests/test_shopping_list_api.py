import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse

from list.api.item import ItemWithoutListSerializer
from list.models import ShoppingList


def test_get_list_response(api_client):
    response = api_client.get(reverse('api:shopping-list-list'))

    assert response.status_code == 200
    assert len(response.data) == ShoppingList.objects.count()


def test_get_detail_response(api_client, shopping_list, item_banana):
    response = api_client.get(reverse('api:shopping-list-detail', kwargs={'pk': shopping_list.pk}))
    assert response.status_code == 200

    data = response.json()
    assert data['id'] == shopping_list.id
    assert data['name'] == shopping_list.name
    assert data['created_by'] == shopping_list.created_by.pk
    assert ItemWithoutListSerializer(item_banana).data in data['items']


def test_post_response(api_client, admin_user):
    response = api_client.post(
        path=reverse('api:shopping-list-list'),
        data={'name': 'test_list', 'created_by': admin_user.pk}
    )

    assert response.status_code == 201
    assert ShoppingList.objects.get(name='test_list')


def test_put_response(api_client, admin_user, shopping_list):
    response = api_client.put(
        path=f'{reverse("api:shopping-list-list")}{shopping_list.pk}/',
        data={'name': 'new_name', 'created_by': admin_user.pk}
    )

    assert response.status_code == 200
    shopping_list.refresh_from_db()
    assert shopping_list.name == 'new_name'
    assert shopping_list.created_by == admin_user


def test_patch_response(api_client, shopping_list):
    response = api_client.patch(
        path=f'{reverse("api:shopping-list-list")}{shopping_list.pk}/',
        data={
            'name': 'new_name',
        }
    )

    assert response.status_code == 200
    shopping_list.refresh_from_db()
    assert shopping_list.name == 'new_name'


def test_delete_response(api_client, shopping_list):
    response = api_client.delete(
        path=f'{reverse("api:shopping-list-list")}{shopping_list.pk}/'
    )

    assert response.status_code == 204
    with pytest.raises(ObjectDoesNotExist):
        ShoppingList.objects.get(pk=shopping_list.pk)
