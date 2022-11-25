from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager
from django.contrib.auth import get_user_model
from django.conf import settings
import os
from django.db.models import F

# from videos.models import Video

class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


def upload_path(instance, filename):
    filename = (f"{instance.username}.png")
    return '/'.join(['images', filename])

# Create your models here.
class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    theme = models.CharField(max_length=30, default="light")
    profile_pic = models.ImageField(null=True, blank=True, default="images/default.png", upload_to=upload_path)
    subscribers = models.PositiveIntegerField(default=0)

    date_joined = models.DateTimeField(
        verbose_name="date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyAccountManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def remove_profile_pic(self):
        if self.profile_pic.name != 'images/default.png':
            os.remove(os.path.join(settings.MEDIA_ROOT, str(self.profile_pic.name)))
    
class VideoInteraction(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    liked_videos = models.ManyToManyField('videos.Video', related_name='liked_videos')
    disliked_videos = models.ManyToManyField('videos.Video', related_name='disliked_videos')

    @classmethod
    def like_video(self, current_user, video):
        object, create = self.objects.get_or_create(
            user = current_user
        )

        if video in object.liked_videos.all():
            object.liked_videos.remove(video)
            video.likes = F('likes') - 1
        elif video in object.disliked_videos.all():
            object.disliked_videos.remove(video)
            object.liked_videos.add(video)
            video.dislikes = F('dislikes') - 1
            video.likes = F('likes') + 1
        else:
            object.liked_videos.add(video)
            video.likes = F('likes') + 1

        video.save()

    @classmethod
    def dislike_video(self, current_user, video):
        object, create = self.objects.get_or_create(
            user = current_user
        )
        if video in object.disliked_videos.all():
            object.disliked_videos.remove(video)
            video.dislikes = F('dislikes') - 1
        elif video in object.liked_videos.all():
            object.liked_videos.remove(video)
            object.disliked_videos.add(video)
            video.dislikes = F('dislikes') + 1
            video.likes = F('likes') - 1
        else:
            object.disliked_videos.add(video)
            video.dislikes = F('dislikes') + 1
        
        video.save()

    # possibly add method to like, unlike, etc that not only removes but also increments likes/dislikes on video
    # @classmethod
    # def unlike(object, video):
    #     object.liked_videos.remove(video)
    #     video.likes = F('likes') - 1

    @property
    def get_liked_vids(self):
        return self.liked_videos

    def __str__(self):
        return self.user.username

class Subscriptions(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    subscriptions = models.ManyToManyField(get_user_model(), blank=True, related_name='subs')

    @classmethod 
    def subscribe(self, user, subscribe_to):
        object, create = self.objects.get_or_create(
            user = user
        )
        object.subscriptions.add(subscribe_to)
        subscribe_to.subscribers = F('subscribers') + 1
        subscribe_to.save()

    @classmethod
    def unsubscribe(self, user, unsubscribe_from):
        object, create = self.objects.get_or_create(
            user = user
        )
        object.subscriptions.remove(unsubscribe_from)
        unsubscribe_from.subscribers = F('subscribers') - 1
        unsubscribe_from.save()

    @classmethod
    def subscription_status(self, user, check_user):
        object, create = self.objects.get_or_create(
            user = user
        )
        if check_user in object.subscriptions.all():
            return True
        else:
            return False
        
    def __str__(self):
        return self.user.username