# Generated by Django 4.1.3 on 2022-12-09 04:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid
import videos.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=300)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('video_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50, unique=True)),
                ('video', models.FileField(upload_to=videos.models.video_path)),
                ('thumbnail', models.ImageField(upload_to=videos.models.thumbnail_path)),
                ('description', models.TextField(max_length=1000)),
                ('views', models.PositiveIntegerField(default=0)),
                ('uploaded', models.DateTimeField(auto_now_add=True)),
                ('comments', models.ManyToManyField(blank=True, to='videos.comment')),
                ('dislikes', models.ManyToManyField(blank=True, related_name='disliked_videos', to=settings.AUTH_USER_MODEL)),
                ('likes', models.ManyToManyField(blank=True, related_name='liked_videos', to=settings.AUTH_USER_MODEL)),
                ('tags', models.ManyToManyField(blank=True, related_name='tags', to='videos.tag')),
                ('uploader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
