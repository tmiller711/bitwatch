from rest_framework import serializers
from .models import Video, Comment, Tag

class TagSerializer(serializers.ModelSerializer):
    # name = serializers.CharField()
    class Meta:
        model = Tag
        fields = ('name',)

class UploadVideoSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = ('title', 'description', 'video', 'tags')

class GetVideoSerializer(serializers.ModelSerializer):
    uploaded_ago = serializers.ReadOnlyField()
    
    class Meta:
        model = Video
        fields = ('video_id', 'uploader', 'title', 'description', 'video', 'thumbnail', 'views', 'num_likes', 'num_dislikes', 'uploaded_ago')

class CommentsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    created_ago = serializers.ReadOnlyField()

    def get_username(self, obj):
        # obj is a mdoel intance
        return obj.user.username

    class Meta:
        model = Comment
        fields = ('id', 'user', 'username', 'text', 'created_ago')
