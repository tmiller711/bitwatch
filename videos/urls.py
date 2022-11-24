from django.urls import path

from .views import UploadVideo, GetVideo, VideoInteract

urlpatterns = [
    path('upload', UploadVideo.as_view()),
    path('get', GetVideo.as_view()),
    path('interact/<uuid:id>', VideoInteract.as_view()),
]