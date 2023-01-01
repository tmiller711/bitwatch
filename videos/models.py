from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime
from django.db.models import F
from django.utils.timesince import timesince

def video_path(instance, filename):
    filename = (f"{str(instance.video_id)}.mp4")
    return '/'.join(['videos', filename])

def thumbnail_path(instance, filename):
    filename = (f"{str(instance.video_id)}.png")
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
        timesince_str = timesince(self.created)
        return timesince_str.split(',')[0] + ' ago'

class Tag(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

    # @classmethod
    # def get_tag(cls, name):
    #     return cls.objects.get(name=name)

class Video(models.Model):
    video_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploader = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=50, unique=True)
    video = models.FileField(upload_to=video_path)
    thumbnail = models.ImageField(upload_to=thumbnail_path)
    description = models.TextField(max_length=1000)
    views = models.PositiveIntegerField(default=0)
    likes = models.ManyToManyField(get_user_model(), related_name='liked_videos', blank=True)
    dislikes = models.ManyToManyField(get_user_model(), related_name='disliked_videos', blank=True)  
    tags = models.ManyToManyField(Tag, related_name='tags', blank=True)
    uploaded = models.DateTimeField(auto_now_add=True)
    comments = models.ManyToManyField(Comment, blank=True)

    def __str__(self):
        return self.title
    
    @property
    def uploaded_ago(self):
        timesince_str = timesince(self.uploaded)
        return timesince_str.split(',')[0] + ' ago'
    
    @classmethod
    def add_comment(cls, video_id, user, text):
        comment = Comment.objects.create(
            user = user,
            text = text
        )

        video = cls.objects.get(video_id=video_id)
        video.comments.add(comment)

        return comment

    def like(self, user):
        # check if the video is already disliked by the given user
        liked = self.likes.filter(pk=user.pk).exists()
        disliked = self.dislikes.filter(pk=user.pk).exists()

        # if the video is not already disliked, add a like
        if liked:
            self.likes.remove(user)
        elif not disliked:
            self.likes.add(user)
        # if the video is already disliked, remove the dislike and add a like
        else:
            self.dislikes.remove(user)
            self.likes.add(user)

        self.save()

    def dislike(self, user):
        # check if the video is already liked by the given user
        liked = self.likes.filter(pk=user.pk).exists()
        disliked = self.dislikes.filter(pk=user.pk).exists()

        # if the video is already disliked, remove the dislike
        if disliked:
            self.dislikes.remove(user)
        # if the video is not already liked, add a dislike
        elif not liked:
            self.dislikes.add(user)
        # if the video is already liked, remove the like and add a dislike
        else:
            self.likes.remove(user)
            self.dislikes.add(user)

        self.save()

    def liked_by(self, user):
        # check if the video is liked by the given user
        return self.likes.filter(pk=user.pk).exists()

    def disliked_by(self, user):
        # check if the video is disliked by the given user
        return self.dislikes.filter(pk=user.pk).exists()
    
    def add_view(self):
        self.views = F('views') + 1
        self.save()

    @property
    def num_likes(self):
        return self.likes.count()

    @property
    def num_dislikes(self):
        return self.dislikes.count()
    
    @property
    def like_ratio(self):
        if self.dislikes.count() == 0 and self.likes.count() > 0:
            return self.likes.count()

        if self.likes.count() == 0:
            return 0

        return (self.likes.count()-self.dislikes.count()) / self.likes.count() 

