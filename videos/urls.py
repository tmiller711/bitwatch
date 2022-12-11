from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract, GetVideos, ChannelVideos, GetComments, AddComment, DeleteVideo, PlaylistVideos

urlpatterns = [
    path('upload', UploadVideo.as_view(), name='upload_video'),
    path('get', GetVideo.as_view(), name='get_video'),
    path('delete/<uuid:video_id>', DeleteVideo.as_view(), name='delete_video'),
    path('getvideos', GetVideos.as_view(), name='get_videos'),
    path('getcomments/<uuid:video_id>', GetComments.as_view(), name='get_comments'),
    path('addcomment/<uuid:video_id>', AddComment.as_view(), name='add_comment'),
    path('channelvideos/<uuid:channel_id>', ChannelVideos.as_view(), name='channel_videos'),
    path('interact/<uuid:video_id>', VideoInteract.as_view(), name='interact'),
    path('playlist/<playlist_id>', PlaylistVideos.as_view(), name='playlist_videos'),
]