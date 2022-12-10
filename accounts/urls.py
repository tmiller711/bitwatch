from django.urls import path
import uuid

from .views import (GetUser, Login, Register, activate, EditProfile, Subscribe, Unsubscribe, GetSubscriptions, GetHistory, GetPlaylists, CreatePlaylist, UpdatePlaylist,)

urlpatterns = [
    path('getuser/<uuid:user_id>/', GetUser.as_view(), name='get_user_by_id'),
    path('getuser/', GetUser.as_view(), name='get_user'),
    path('history/', GetHistory.as_view(), name='get_history'),
    # path('channel/<uuid:id>/', Channel.as_view()),
    path('createplaylist/', CreatePlaylist.as_view(), name='create_playlist'),
    path('updateplaylist/<uuid:id>', UpdatePlaylist.as_view()),
    path('subscribe/<uuid:user_id>', Subscribe.as_view(), name='subscribe'),
    path('unsubscribe/<uuid:user_id>', Unsubscribe.as_view(), name='unsubscribe'),
    path('subscriptions/', GetSubscriptions.as_view(), name='get_subscriptions'),
    path('login/', Login.as_view(), name='login'),
    path('register/', Register.as_view(), name='register'),
    path('profile/', EditProfile.as_view(), name='edit_profile'),
    path('getplaylists/<uuid:user_id>', GetPlaylists.as_view(), name='get_playlists'),
    path('getplaylists/', GetPlaylists.as_view(), name='get_playlists'),
    path('activate/<uidb64>/<token>', activate, name='activate'),
]