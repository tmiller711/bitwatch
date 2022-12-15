from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract, GetVideos, ChannelVideos, GetComments, AddComment, DeleteVideo, PlaylistVideos, SearchVideos

urlpatterns = [
    path('upload', UploadVideo.as_view(), name='upload_video'),
    path('get/<uuid:video_id>', GetVideo.as_view(), name='get_video'),
    path('delete/<uuid:video_id>', DeleteVideo.as_view(), name='delete_video'),
    path('getvideos/<int:page>', GetVideos.as_view(), name='get_videos'),
    path('search/<str:query>/<str:sort_by>/<int:page>', SearchVideos.as_view(), name='search'),
    path('getcomments/<uuid:video_id>/<int:page>', GetComments.as_view(), name='get_comments'),
    path('addcomment/<uuid:video_id>', AddComment.as_view(), name='add_comment'),
    path('channelvideos/<uuid:channel_id>/<int:page>', ChannelVideos.as_view(), name='channel_videos'),
    path('interact/<uuid:video_id>', VideoInteract.as_view(), name='interact'),
    path('playlist/<playlist_id>', PlaylistVideos.as_view(), name='playlist_videos'),
]