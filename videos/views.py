from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import UploadVideoSerializer, GetVideoSerializer, CommentsSerializer
from .models import Video
from accounts.models import VideoInteraction, Account

class UploadVideo(APIView):
    def post(self, request, format=None):
        serializer = UploadVideoSerializer(data=request.data)
        if serializer.is_valid():
            title = request.data.get('title')
            description = request.data.get('description')
            video = request.data.get('video')
            thumbnail = request.data.get('thumbnail')

            new_vid = Video(uploader=request.user, title=title, description=description, video=video, thumbnail=thumbnail)
            new_vid.save()

            return Response({"Success": "Video Uploaded"}, status=status.HTTP_201_CREATED)
        else:
            print('fail')
            return Response({"message": "upload failed"}, status=status.HTTP_400_BAD_REQUEST)

class GetVideos(APIView):
    def get(self, request, format=None):
        videos = Video.objects.all()

        data = GetVideoSerializer(videos, many=True).data
        
        return Response(data, status=status.HTTP_200_OK)
        

class GetVideo(APIView):
    def post(self, request, format=None):
        video = Video.objects.get(id=request.data.get('id'))

        serializer = GetVideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetComments(APIView):
    def get(self, request, *args, **kwargs):
        video = Video.objects.get(id=self.kwargs['id'])
        comments = video.comments.all()
        data = CommentsSerializer(comments, many=True).data

        print(data)
        return Response(data, status=status.HTTP_200_OK)

class AddComment(APIView):
    def post(self, request, *args, **kwargs):
        video = Video.objects.get(id=self.kwargs['id'])
        comment = request.data['comment']
        new_comment = video.add_comment(self.kwargs['id'], request.user, comment)

        data = CommentsSerializer(new_comment).data

        return Response(data, status=status.HTTP_200_OK)

class VideoInteract(APIView):
    def post(self, request, *args, **kwargs):
        video = Video.objects.get(id=self.kwargs['id'])
        if video == None:
            return Response({"Error": "Video does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            interaction = self.request.data['interaction']
            if interaction == "like":
                VideoInteraction.like_video(request.user, video)

            elif interaction == "dislike":
                VideoInteraction.dislike_video(request.user, video)

            elif interaction == "view":
                VideoInteraction.add_view(request.user, video)
            
            # need to update the video after changing likes/dislikes
            video = Video.objects.get(id=video.id)
            data = {'likes': int(video.likes), 'dislikes': int(video.dislikes)}
            
            return Response(data, status=status.HTTP_200_OK)

        except:
            return Response({"message": "failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChannelVideos(APIView):
    def get(self, request, *args, **kwargs):
        channel = Account.objects.get(id=self.kwargs['id'])
        videos = Video.objects.filter(uploader=channel)

        data = GetVideoSerializer(videos, many=True).data
        
        return Response(data, status=status.HTTP_200_OK)
