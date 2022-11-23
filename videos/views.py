from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UploadVideoSerializer, GetVideoSerializer
from .models import Video

class UploadVideo(APIView):
    def post(self, request, format=None):
        serializer = UploadVideoSerializer(data=request.data)
        if serializer.is_valid():
            title = request.data.get('title')
            description = request.data.get('description')
            video = request.data.get('video')

            new_vid = Video(uploader=request.user, title=title, description=description, video=video)
            new_vid.save()

            return Response({"Success": "Video Uploaded"}, status=status.HTTP_201_CREATED)
        else:
            print('fail')
            return Response({"message": "upload failed"}, status=status.HTTP_400_BAD_REQUEST)
        

class GetVideo(APIView):
    def post(self, request, format=None):
        video = Video.objects.get(id=request.data.get('id'))

        serializer = GetVideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)
