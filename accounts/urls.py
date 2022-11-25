from django.urls import path

from .views import GetUser, GetUserByID, Login, Register, activate, EditProfile, Subscribe, Unsubscribe

urlpatterns = [
    path('getuser/<int:id>/', GetUserByID.as_view()),
    path('getuser/', GetUser.as_view()),
    path('subscribe/<int:id>', Subscribe.as_view()),
    path('unsubscribe/<int:id>', Unsubscribe.as_view()),
    path('login/', Login.as_view()),
    path('register/', Register.as_view()),
    path('profile/', EditProfile.as_view()),
    path('activate/<uidb64>/<token>', activate, name='activate'),
]