import graphene
from graphene_django import DjangoObjectType

from list.models import Item


class _Item(DjangoObjectType):
    class Meta:
        model = Item


class Query(graphene.ObjectType):
    item = graphene.Field(_Item, id=graphene.Int())
    items = graphene.List(_Item)

    def resolve_item(self, _, **kwargs):
        if _id := kwargs.get('id'):
            return Item.objects.get(id=_id)

    def resolve_items(self, _):
        return Item.objects.all().select_related('list')


schema = graphene.Schema(query=Query)
