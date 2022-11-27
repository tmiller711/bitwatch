from rest_framework import serializers
from .models import Video

class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'description', 'video')

class GetVideoSerializer(serializers.ModelSerializer):
    uploaded_ago = serializers.ReadOnlyField()
    
    class Meta:
        model = Video
        fields = ('id', 'uploader', 'title', 'description', 'video', 'thumbnail', 'views', 'likes', 'dislikes', 'uploaded_ago')