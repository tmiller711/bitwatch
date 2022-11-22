from django.urls import path

from .views import UploadVideo

urlpatterns = [
    path('upload', UploadVideo.as_view()),
]