from django.contrib import admin

from list.models import ShoppingList, Item


class ItemInline(admin.TabularInline):
    model = Item
    extra = 0


class ShoppingListAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'created_by',
        'created_at',
    )
    inlines = [ItemInline]


class ItemAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'quantity',
        'list',
        'added_by',
        'added_at'
    )


admin.site.register(ShoppingList, ShoppingListAdmin)
admin.site.register(Item, ItemAdmin)
