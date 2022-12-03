from rest_framework import serializers
from .models import Account, Subscriptions, Playlist
from django.contrib.auth import get_user_model


class RegisterAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'password')


class LoginAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'password')


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

    def get_username(self, obj):
        return obj.creator.username

    class Meta:
        model = Playlist
        fields = ('id', 'name', 'creator', 'username', 'videos')