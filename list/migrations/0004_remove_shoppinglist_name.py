# Generated by Django 2.2.11 on 2020-07-11 23:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0003_defaultitem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shoppinglist',
            name='name',
        ),
    ]