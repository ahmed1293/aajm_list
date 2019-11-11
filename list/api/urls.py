from django.urls import path, include
from rest_framework import routers

from list.api.item import ItemViewSet, DefaultItemViewSet
from list.api.shopping_list import ShoppingListViewSet
from list.api.user import UserViewSet

app_name = 'api'

router = routers.DefaultRouter()
router.register(prefix=r'shopping-lists', viewset=ShoppingListViewSet, basename='shopping-list')
router.register(prefix=r'items', viewset=ItemViewSet, basename='item')
router.register(prefix=r'default-items', viewset=DefaultItemViewSet, basename='default-item')
router.register(prefix=r'users', viewset=UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls))
]