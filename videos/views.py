from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator


from .serializers import UploadVideoSerializer, GetVideoSerializer, CommentsSerializer
from .models import Video, Tag
from accounts.models import VideoInteraction, Account, Playlist

class UploadVideo(APIView):
    def post(self, request, format=None):
        serializer = UploadVideoSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            title = request.data.get('title')
            description = request.data.get('description')
            video = request.data.get('video')
            thumbnail = request.data.get('thumbnail')
            tags = request.data.get('tags')

            new_vid = Video(uploader=request.user, title=title, description=description, video=video, thumbnail=thumbnail)
            new_vid.save()

            tag = Tag.objects.get(name=tags)
            new_vid.tags.add(tag.id)
            
            new_vid.save()

            return Response({"Success": "Video Uploaded"}, status=status.HTTP_201_CREATED)
        else:
            print('fail')
            return Response({"message": "upload failed"}, status=status.HTTP_400_BAD_REQUEST)

class GetVideos(APIView):
    def get(self, request, format=None):
        page_num = request.query_params.get('page')
        if not page_num:
            page_num = 1
        
        paginator = Paginator(Video.objects.all().order_by('uploaded').reverse(), 12)
        videos = paginator.page(page_num)


        data = GetVideoSerializer(videos, many=True).data
        
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        search = request.data.get('search')
        videos = Video.objects.filter(title=search)
        data = GetVideoSerializer(videos, many=True).data

        return Response(data, status=status.HTTP_200_OK)

class PlaylistVideos(APIView):
    def get(self, request, *args, **kwargs):
        try:
            playlist = Playlist.objects.get(id=self.kwargs['id'])
            videos = GetVideoSerializer(playlist.videos.all(), many=True).data

            return Response(videos, status=status.HTTP_200_OK)

        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetVideo(APIView):
    def post(self, request, format=None):
        video = Video.objects.get(video_id=request.data.get('id'))

        serializer = GetVideoSerializer(video)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetComments(APIView):
    def get(self, request, *args, **kwargs):
        video = Video.objects.get(video_id=self.kwargs['id'])
        comments = video.comments.all().order_by('created').reverse()
        data = CommentsSerializer(comments, many=True).data

        return Response(data, status=status.HTTP_200_OK)

class DeleteVideo(APIView):
    # check if the user is signed in 
    def get(self, request, *args, **kwargs):
        try:
            video_id = self.kwargs['id']
            video = Video.objects.get(user=request.user, video_id=video_id)
            video.delete()
            
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddComment(APIView):
    def post(self, request, *args, **kwargs):
        video = Video.objects.get(video_id=self.kwargs['id'])
        comment = request.data['comment']
        new_comment = video.add_comment(self.kwargs['id'], request.user, comment)

        data = CommentsSerializer(new_comment).data

        return Response(data, status=status.HTTP_200_OK)

class VideoInteract(APIView):
    def post(self, request, *args, **kwargs):
        video_id = self.kwargs['id']
        try:
            video = Video.objects.get(video_id=video_id)
            action = request.data.get('action')
            if action == 'like':
                video.like(request.user)
            elif action == 'dislike':
                video.dislike(request.user)
            elif action == 'view':
                video.add_view()
            else:
                return Response({"message": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

            video.refresh_from_db()
            num_likes = video.num_likes
            num_dislikes = video.num_dislikes

            return Response({"num_likes": num_likes, "num_dislikes": num_dislikes}, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # video = Video.objects.get(id=self.kwargs['id'])
        # if video == None:
        #     return Response({"Error": "Video does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # try:
        #     interaction = self.request.data['interaction']
        #     if interaction == "like":
        #         VideoInteraction.like_video(request.user, video)

        #     elif interaction == "dislike":
        #         VideoInteraction.dislike_video(request.user, video)

        #     elif interaction == "view":
        #         VideoInteraction.add_view(request.user, video)
            
        #     # need to update the video after changing likes/dislikes
        #     video = Video.objects.get(id=video.id)
        #     data = {'likes': int(video.likes), 'dislikes': int(video.dislikes)}
            
        #     return Response(data, status=status.HTTP_200_OK)

        # except:
        #     return Response({"message": "failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChannelVideos(APIView):
    def get(self, request, *args, **kwargs):
        channel = Account.objects.get(id=self.kwargs['id'])
        videos = Video.objects.filter(uploader=channel)

        data = GetVideoSerializer(videos, many=True).data
        
        return Response(data, status=status.HTTP_200_OK)
