import pytest

from list.models import ShoppingList, Item


@pytest.fixture(autouse=True)
def enable_db_access(db):
    # enable DB access for all tests
    pass


@pytest.fixture
def shopping_list(admin_user):
    return ShoppingList.objects.create(
        name='food',
        created_by=admin_user,
    )


@pytest.fixture
def item_banana(shopping_list, admin_user):
    return Item.objects.create(
        name='banana',
        quantity='1',
        list=shopping_list,
        added_by=admin_user,
    )
