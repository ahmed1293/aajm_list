from django.urls import path, include
from rest_framework import routers

from list.api.shopping_list import ShoppingListViewSet


app_name = 'api'

router = routers.DefaultRouter()
router.register(prefix=r'shopping-lists', viewset=ShoppingListViewSet, basename='shopping-list')

urlpatterns = [
    path('', include(router.urls))
]