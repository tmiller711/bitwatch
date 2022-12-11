from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract, GetVideos, ChannelVideos, GetComments, AddComment, DeleteVideo, PlaylistVideos

urlpatterns = [
    path('upload', UploadVideo.as_view(), name='upload_video'),
    path('get', GetVideo.as_view(), name='get_video'),
    path('delete/<uuid:video_id>', DeleteVideo.as_view(), name='delete_video'),
    path('getvideos', GetVideos.as_view(), name='get_videos'),
    path('getcomments/<uuid:video_id>', GetComments.as_view(), name='get_comments'),
    path('addcomment/<uuid:id>', AddComment.as_view()),
    path('channelvideos/<uuid:id>', ChannelVideos.as_view()),
    path('interact/<uuid:id>', VideoInteract.as_view()),
    path('playlist/<playlist_id>', PlaylistVideos.as_view(), name='playlist_videos'),
]