from list.models import ShoppingList


def test_can_create(admin_user):
    shopping_list = ShoppingList.objects.create(
        name='food',
        created_by=admin_user,
    )

    assert shopping_list.name == 'food'
    assert shopping_list.created_by == admin_user


def test_model_str(admin_user):
    shopping_list = ShoppingList.objects.create(
        name='food',
        created_by=admin_user,
    )

    assert str(shopping_list) == 'food'
