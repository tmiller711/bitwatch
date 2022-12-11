from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.paginator import Paginator
from rest_framework.exceptions import ValidationError

from .serializers import UploadVideoSerializer, GetVideoSerializer, CommentsSerializer
from .models import Video, Tag
from accounts.models import History, Account, Playlist

class UploadVideo(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UploadVideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploader=request.user)
            return Response({"Success": "Video Uploaded"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetVideos(APIView):
    def get(self, request, format=None, page=1):
        page_num = request.query_params.get('page')
        if not page_num:
            page_num = 1
        
        paginator = Paginator(Video.objects.all().order_by('uploaded').reverse(), 12)

        try:
            videos = paginator.page(page_num)
            data = GetVideoSerializer(videos, many=True).data

            return Response(data, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, format=None):
        search = request.query_params.get('search')
        videos = Video.objects.filter(title=search)
        if len(videos) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = GetVideoSerializer(videos, many=True).data

        return Response(data, status=status.HTTP_200_OK)

class PlaylistVideos(APIView):
    def get(self, request, playlist_id=None):
        try:
            playlist = Playlist.objects.get(id=playlist_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        videos = GetVideoSerializer(playlist.videos.all(), many=True).data
        if len(videos) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(videos, status=status.HTTP_200_OK)

class GetVideo(APIView):
    def post(self, request, video_id=None):
        try:
            video = Video.objects.get(video_id=video_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = GetVideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetComments(APIView):
    def get(self, request, *args, **kwargs):
        page_num = request.query_params.get('page')
        if not page_num:
            page_num = 1
        
        video = Video.objects.get(video_id=self.kwargs['video_id'])
        paginator = Paginator(video.comments.all().order_by('created').reverse(), 12)

        try:
            comments = paginator.page(page_num)
            data = CommentsSerializer(comments, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        
        except:
            return Response(status=status.HTTP_204_NO_CONTENT)

class DeleteVideo(APIView):
    # check if the user is signed in 
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            video_id = self.kwargs['video_id']
            video = Video.objects.get(uploader=request.user, video_id=video_id)
            video.delete()
            
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        video = Video.objects.get(video_id=self.kwargs['video_id'])
        comment = request.data['comment']
        new_comment = video.add_comment(self.kwargs['video_id'], request.user, comment)

        data = CommentsSerializer(new_comment).data

        return Response(data, status=status.HTTP_200_OK)

class VideoInteract(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        video_id = self.kwargs['video_id']
        try:
            video = Video.objects.get(video_id=video_id)
            action = request.data.get('action')
            if action == 'like':
                video.like(request.user)
            elif action == 'dislike':
                video.dislike(request.user)
            elif action == 'view':
                video.add_view()
                # add video to users history if they are logged in
                History.add_video(request.user, video)
            else:
                return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

            video.refresh_from_db()
            num_likes = video.num_likes
            num_dislikes = video.num_dislikes

            return Response({"num_likes": num_likes, "num_dislikes": num_dislikes}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChannelVideos(APIView):
    def get(self, request, *args, **kwargs):
        try:
            channel = Account.objects.get(id=self.kwargs['channel_id'])
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        page_num = request.query_params.get('page')
        if not page_num:
            page_num = 1
        
        paginator = Paginator(Video.objects.filter(uploader=channel).order_by('uploaded').reverse(), 9)

        try:
            videos = paginator.page(page_num)
            data = GetVideoSerializer(videos, many=True).data

            return Response(data, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_204_NO_CONTENT)