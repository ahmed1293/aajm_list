import graphene
from graphene_django import DjangoObjectType

from list.models import ShoppingList


class _ShoppingList(DjangoObjectType):
    class Meta:
        model = ShoppingList


class Query(graphene.ObjectType):
    shopping_list = graphene.Field(_ShoppingList, id=graphene.Int())
    shopping_lists = graphene.List(_ShoppingList)

    def resolve_shopping_list(self, _, **kwargs):
        if _id := kwargs.get('id'):
            return ShoppingList.objects.get(id=_id)

    def resolve_shopping_lists(self, _):
        return ShoppingList.objects.all().prefetch_related('item_set')


schema = graphene.Schema(query=Query)
