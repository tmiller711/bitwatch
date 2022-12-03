from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract, GetVideos, ChannelVideos, GetComments, AddComment, DeleteVideo, PlaylistVideos

urlpatterns = [
    path('upload', UploadVideo.as_view()),
    path('get', GetVideo.as_view()),
    path('delete/<uuid:id>', DeleteVideo.as_view()),
    path('getvideos', GetVideos.as_view()),
    path('getcomments/<uuid:id>', GetComments.as_view()),
    path('addcomment/<uuid:id>', AddComment.as_view()),
    path('channelvideos/<uuid:id>', ChannelVideos.as_view()),
    path('interact/<uuid:id>', VideoInteract.as_view()),
    path('playlist/<id>', PlaylistVideos.as_view()),
]