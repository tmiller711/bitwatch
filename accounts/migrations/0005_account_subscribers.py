# Generated by Django 4.1.3 on 2022-11-23 02:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_account_profile_pic'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='subscribers',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
