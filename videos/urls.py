from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract, GetVideos, ChannelVideos

urlpatterns = [
    path('upload', UploadVideo.as_view()),
    path('get', GetVideo.as_view()),
    path('getvideos', GetVideos.as_view()),
    path('channelvideos/<uuid:id>', ChannelVideos.as_view()),
    path('interact/<uuid:id>', VideoInteract.as_view()),
]