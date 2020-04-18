import graphene

from list.api.graphql import shopping_list, item


class Query(shopping_list.schema.Query, item.schema.Query, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query)
