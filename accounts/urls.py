from django.urls import path

from .views import GetUser, Login, Register, activate, EditProfile

urlpatterns = [
    path('getuser/', GetUser.as_view()),
    path('login/', Login.as_view()),
    path('register/', Register.as_view()),
    path('profile/', EditProfile.as_view()),
    path('activate/<uidb64>/<token>', activate, name='activate'),
]