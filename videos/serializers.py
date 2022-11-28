from rest_framework import serializers
from .models import Video, Comment

class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'description', 'video')

class GetVideoSerializer(serializers.ModelSerializer):
    uploaded_ago = serializers.ReadOnlyField()
    
    class Meta:
        model = Video
        fields = ('id', 'uploader', 'title', 'description', 'video', 'thumbnail', 'views', 'likes', 'dislikes', 'uploaded_ago')

class CommentsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    created_ago = serializers.ReadOnlyField()

    def get_username(self, obj):
        # obj is a mdoel intance
        return obj.user.username

    class Meta:
        model = Comment
        fields = ('id', 'user', 'username', 'text', 'created_ago')
