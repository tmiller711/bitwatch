# Generated by Django 4.1.3 on 2022-12-07 03:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('videos', '0013_remove_video_dislikes_remove_video_likes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='dislikes',
            field=models.ManyToManyField(blank=True, related_name='disliked_videos', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='video',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_videos', to=settings.AUTH_USER_MODEL),
        ),
    ]
