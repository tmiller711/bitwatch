from rest_framework import serializers
from .models import Video

class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'description', 'video')