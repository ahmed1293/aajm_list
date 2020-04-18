from django.contrib.auth import get_user_model
from django.db import models


class ShoppingList(models.Model):

    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def create_with_defaults(name, created_by):
        instance = ShoppingList.objects.create(name=name, created_by=created_by)
        defaults = [
            Item(name=default.name, quantity=default.quantity, list=instance, added_by=created_by)
            for default in DefaultItem.objects.all()
        ]
        Item.objects.bulk_create(defaults)
        return instance

    def __str__(self):
        return self.name


class BaseItem(models.Model):

    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=255, default=1)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class Item(BaseItem):

    list = models.ForeignKey('ShoppingList', on_delete=models.CASCADE)
    added_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    is_checked = models.BooleanField(default=False)


class DefaultItem(BaseItem):
    pass
