import pytest
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse

from list.models import DefaultItem


def test_get_list_response(api_client):
    response = api_client.get(reverse('api:default-item-list'))

    assert response.status_code == 200
    assert len(response.data) == DefaultItem.objects.count()


def test_get_detail_response(api_client, default_item):
    response = api_client.get(reverse('api:default-item-detail', kwargs={'pk': default_item.pk}))
    assert response.status_code == 200

    data = response.json()
    assert data['name'] == default_item.name
    assert data['quantity'] == default_item.quantity


def test_post_response(api_client):
    response = api_client.post(
        path=reverse('api:default-item-list'),
        data={
            'name': 'onion',
            'quantity': '200kg',
        }
    )

    assert response.status_code == 201
    item = DefaultItem.objects.get(name='onion')
    assert item.name == 'onion'
    assert item.quantity == '200kg'


def test_put_response(api_client, default_item):
    response = api_client.put(
        path=f'{reverse("api:default-item-list")}{default_item.pk}/',
        data={
            'name': 'chicken',
            'quantity': '7',
        }
    )

    assert response.status_code == 200
    default_item.refresh_from_db()
    assert default_item.name == 'chicken'
    assert default_item.quantity == '7'


def test_patch_response(api_client, default_item):
    response = api_client.patch(
        path=f'{reverse("api:default-item-list")}{default_item.pk}/',
        data={
            'name': 'butternut squash',
        }
    )

    assert response.status_code == 200
    default_item.refresh_from_db()
    assert default_item.name == 'butternut squash'


def test_delete_response(api_client, default_item):
    response = api_client.delete(
        path=f'{reverse("api:default-item-list")}{default_item.pk}/'
    )

    assert response.status_code == 204
    with pytest.raises(ObjectDoesNotExist):
        DefaultItem.objects.get(pk=default_item.pk)

