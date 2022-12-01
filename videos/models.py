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

class Comment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    # video = models.ForeignKey('videos.Video', on_delete=models.CASCADE)
    text = models.TextField(max_length=300)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

    @property
    def created_ago(self):
        time = datetime.now()
        if self.created.day == time.day:
            return str(time.hour - self.created.hour) + " hours ago"
        else:
            if self.created.month == time.month:
                return str(time.day - self.created.day) + " days ago"
            else:
                if self.created.year == time.year:
                    return str(time.month - self.created.month) + " months ago"
        return self.created

class Tag(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

    @property
    def get_tag(self, name):
        return Tag.objects.get(name=name)

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
    tags = models.ManyToManyField(Tag, related_name='tags', blank=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    comments = models.ManyToManyField(Comment, blank=True)

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
    
    # @classmethod
    # def get_comments(self, video_id):
    #     object = self.objects.get(id=video_id)
    
    #     return object.comments.all()

    @classmethod
    def add_comment(self, videoID, user, text):
        comment = Comment.objects.create(
            user = user,
            text = text
        )

        video = self.objects.get(id=videoID)
        video.comments.add(comment)

        return comment

