import pytest

from list.models import ShoppingList


@pytest.fixture
def shopping_list(admin_user):
    return ShoppingList.objects.create(
        name='food',
        created_by=admin_user,
    )
