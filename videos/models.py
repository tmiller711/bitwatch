from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

def video_path(instance, filename):
    filename = (f"{str(instance.id)}.mp4")
    return '/'.join(['videos', filename])

def thumbnail_path(instance, filename):
    filename = (f"{str(instance.id)}.png")
    return '/'.join(['thumbnails', filename])

class Video(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploader = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=50, unique=True)
    video = models.FileField(upload_to=video_path)
    thumbnail = models.ImageField(upload_to=thumbnail_path)
    description = models.TextField(max_length=1000)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    tag = models.ManyToManyField('Tag', blank=True)
    uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    @property
    def uploaded_ago(self):
        time = datetime.now()
        if self.uploaded.day == time.day:
            return str(time.hour - self.uploaded.hour) + " hours ago"
        else:
            if self.uploaded.month == time.month:
                return str(time.day - self.uploaded.day) + " days ago"
            else:
                if self.uploaded.year == time.year:
                    return str(time.month - self.uploaded.month) + " months ago"
        return self.uploaded


class Tag(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name