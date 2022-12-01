# Generated by Django 4.1.3 on 2022-12-01 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0005_alter_video_tags'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='tags',
        ),
        migrations.AddField(
            model_name='video',
            name='tag',
            field=models.ManyToManyField(blank=True, to='videos.tag'),
        ),
    ]
