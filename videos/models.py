from django.db import models
from django.contrib.auth import get_user_model

def upload_path(instance, filename):
    filename = (f"{str(instance.title)}.mp4")
    return '/'.join(['videos', filename])

class Video(models.Model):
    uploader = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=50, unique=True)
    video = models.FileField(upload_to=upload_path)
    description = models.TextField(max_length=1000)
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    tag = models.ManyToManyField('Tag')


    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name