from rest_framework import serializers
from .models import Account, Subscriptions, Playlist
from django.contrib.auth import get_user_model


class RegisterAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password')


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()


class EditProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('name', 'profile_pic')

class SubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriptions
        fields = ('subscriptions',)

class PlaylistSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    thumbnail = serializers.SerializerMethodField(read_only=True)

    def get_username(self, obj):
        return obj.creator.username

    def get_thumbnail(self, obj):
        try:
            return str(obj.videos.all()[0].thumbnail.url)
        except:
            return None

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'creator', 'username', 'videos', 'private', 'thumbnail')

class UserSerializer(serializers.ModelSerializer):
    is_you = serializers.SerializerMethodField(read_only=True)
    subscription_status = serializers.SerializerMethodField(read_only=True)

    def get_is_you(self, obj):
        try:
            return self.context['is_you']
        except:
            return False

    def get_subscription_status(self, obj):
        try:
            return self.context['subscription_status']
        except:
            return False
    
    class Meta:
        model = Account
        fields = (
            "id",
            "email",
            "username",
            "name",
            "phone",
            "theme",
            "profile_pic",
            "subscribers",
            "is_you",
            "subscription_status",
        )