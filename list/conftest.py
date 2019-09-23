import pytest

from list.models import ShoppingList


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
