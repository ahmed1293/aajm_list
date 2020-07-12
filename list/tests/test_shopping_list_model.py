from list.models import ShoppingList, DefaultItem


def test_can_create(admin_user):
	shopping_list = ShoppingList.objects.create(
		created_by=admin_user,
	)

	assert shopping_list.created_by == admin_user


def test_model_str(admin_user):
	shopping_list = ShoppingList.objects.create(
		created_by=admin_user,
	)

	assert str(shopping_list) == f'List {shopping_list.created_at}'


def test_can_create_with_defaults(admin_user):
	default_item_1 = DefaultItem.objects.create(name='onions', quantity=12)
	default_item_2 = DefaultItem.objects.create(name='grapes', quantity=1)

	s_list = ShoppingList.create_with_defaults(
		created_by=admin_user
	)

	assert s_list.item_set.all().count() == 2
	for default_item in (default_item_1, default_item_2):
		item = s_list.item_set.get(name=default_item.name)
		assert item.name == default_item.name
		assert item.quantity == str(default_item.quantity)
		assert item.list == s_list
		assert item.added_by == s_list.created_by
