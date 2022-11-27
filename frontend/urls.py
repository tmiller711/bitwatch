from django.urls import path, re_path
from .views import index, logout_account

urlpatterns = [
    path('', index),
    path('subscriptions/', index),
    path('history/', index),
    path('profile/', index),
    path('logout/', logout_account),
    path('login/', index),
    path('register/', index),
    path('upload/', index),
    path('watch/', index),
    path('channel/', index)
]
