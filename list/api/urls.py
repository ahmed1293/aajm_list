from django.urls import path, include
from rest_framework import routers

from list.api.item import ItemViewSet
from list.api.shopping_list import ShoppingListViewSet


app_name = 'api'

router = routers.DefaultRouter()
router.register(prefix=r'shopping-lists', viewset=ShoppingListViewSet, basename='shopping-list')
router.register(prefix=r'items', viewset=ItemViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls))
]