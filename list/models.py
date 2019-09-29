from django.contrib.auth import get_user_model
from django.db import models


class ShoppingList(models.Model):

    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Item(models.Model):

    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=255, default=1)
    list = models.ForeignKey('ShoppingList', on_delete=models.CASCADE)
    added_by = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    is_checked = models.BooleanField(default=False)

    def __str__(self):
        return self.name
