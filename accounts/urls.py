from django.urls import path

from .views import GetUser

urlpatterns = [
    path('getuser/', GetUser.as_view())
]