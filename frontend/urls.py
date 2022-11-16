from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('subscriptions/', index),
    path('history/', index),
    path('profile/', index)
]
