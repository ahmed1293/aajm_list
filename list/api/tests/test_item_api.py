import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse

from list.models import Item, ShoppingList


def test_get_list_response(api_client):
    response = api_client.get(reverse('api:item-list'))

    assert response.status_code == 200
    assert len(response.data) == Item.objects.count()


def test_get_detail_response(api_client, item_banana):
    response = api_client.get(reverse('api:item-detail', kwargs={'pk': item_banana.pk}))
    assert response.status_code == 200

    data = response.json()
    assert data['name'] == item_banana.name
    assert data['quantity'] == item_banana.quantity
    assert data['added_by'] == item_banana.added_by.username


def test_post_response(api_client, admin_user, shopping_list):
    api_client.force_login(admin_user)
    response = api_client.post(
        path=reverse('api:item-list'),
        data={
            'name': 'onion',
            'quantity': '200kg',
            'list': shopping_list.pk
        }
    )

    assert response.status_code == 201
    item = Item.objects.get(name='onion')
    assert item.name == 'onion'
    assert item.quantity == '200kg'
    assert item.list == shopping_list
    assert item.added_by == admin_user


def test_put_response(api_client, admin_user, item_banana, shopping_list):
    other_list = ShoppingList.objects.create(
        name='FOOD',
        created_by=admin_user,
    )

    response = api_client.put(
        path=f'{reverse("api:item-list")}{item_banana.pk}/',
        data={
            'name': 'chicken',
            'quantity': '7',
            'list': other_list.pk
        }
    )

    assert response.status_code == 200
    item_banana.refresh_from_db()
    assert item_banana.name == 'chicken'
    assert item_banana.quantity == '7'
    assert item_banana.list == other_list
    assert item_banana.added_by == admin_user


def test_patch_response(api_client, admin_user, item_banana, shopping_list):
    previous_value = item_banana.is_checked
    response = api_client.patch(
        path=f'{reverse("api:item-list")}{item_banana.pk}/',
        data={
            'is_checked': not previous_value,
        }
    )

    assert response.status_code == 200
    item_banana.refresh_from_db()
    assert item_banana.is_checked is not previous_value


def test_delete_response(api_client, admin_user, item_banana, shopping_list):
    response = api_client.delete(
        path=f'{reverse("api:item-list")}{item_banana.pk}/'
    )

    assert response.status_code == 204
    with pytest.raises(ObjectDoesNotExist):
        Item.objects.get(pk=item_banana.pk)

