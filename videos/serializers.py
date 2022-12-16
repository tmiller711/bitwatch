from rest_framework import serializers
from .models import Video, Comment, Tag
from rest_framework.exceptions import ValidationError

class TagSerializer(serializers.ModelSerializer):
    # name = serializers.CharField()
    class Meta:
        model = Tag
        fields = ('name',)

class UploadVideoSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Tag.objects.all()
    )

    class Meta:
        model = Video
        fields = ("title", "description", "video", "thumbnail", "tags")

    def validate(self, data):
        if not data["title"]:
            raise ValidationError("Title is required.")
        if not data["video"]:
            raise ValidationError("Video is required.")
        return data

    def create(self, validated_data):
        tags = validated_data.pop("tags")
        video = Video.objects.create(**validated_data)
        for tag in tags:
            tag, created = Tag.objects.get_or_create(name=tag)
            video.tags.add
        return video

class GetVideoSerializer(serializers.ModelSerializer):
    uploaded_ago = serializers.ReadOnlyField()
    uploader_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = ('video_id', 'uploader', 'title', 'description', 'video', 'thumbnail', 'views', 'num_likes', 'num_dislikes', 'uploaded_ago', 'uploader_info')

    def get_uploader_info(self, obj):
        user = obj.uploader
        return {
            'user_id': user.id,
            'username': user.username,
            'profile_pic': user.profile_pic.url
        }

class CommentsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    created_ago = serializers.ReadOnlyField()

    def get_username(self, obj):
        # obj is a mdoel intance
        return obj.user.username

    class Meta:
        model = Comment
        fields = ('id', 'user', 'username', 'text', 'created_ago')
