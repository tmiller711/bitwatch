from django.urls import path

from .views import GetUser, Login, Register

urlpatterns = [
    path('getuser/', GetUser.as_view()),
    path('login/', Login.as_view()),
    path('register/', Register.as_view()),
]