# Generated by Django 2.2.5 on 2019-09-29 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('list', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='is_checked',
            field=models.BooleanField(default=False),
        ),
    ]