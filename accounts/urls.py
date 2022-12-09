from django.urls import path
import uuid

from .views import (GetUser, GetUserByID, Login, Register, activate, EditProfile, Subscribe, Unsubscribe, GetSubscriptions, GetHistory, GetUserPlaylists, CreatePlaylist, UpdatePlaylist,
                    PlaylistByID)

urlpatterns = [
    path('getuser/<uuid:id>/', GetUserByID.as_view()),
    path('getuser/', GetUser.as_view()),
    path('history/', GetHistory.as_view()),
    # path('channel/<uuid:id>/', Channel.as_view()),
    path('createplaylist/', CreatePlaylist.as_view()),
    path('updateplaylist/<uuid:id>', UpdatePlaylist.as_view()),
    path('subscribe/<uuid:id>', Subscribe.as_view()),
    path('unsubscribe/<uuid:id>', Unsubscribe.as_view()),
    path('subscriptions/', GetSubscriptions.as_view()),
    path('login/', Login.as_view()),
    path('register/', Register.as_view()),
    path('profile/', EditProfile.as_view()),
    path('getplaylists/<uuid:id>', PlaylistByID.as_view()),
    path('getplaylists/', GetUserPlaylists.as_view()),
    path('activate/<uidb64>/<token>', activate, name='activate'),
]