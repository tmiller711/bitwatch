from rest_framework import serializers
from .models import Video

class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'description', 'video')

class GetVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('uploader', 'title', 'description', 'video', 'views', 'likes', 'dislikes')