from django.urls import path
from .views import index, logout_account

urlpatterns = [
    path('', index),
    path('subscriptions/', index),
    path('history/', index),
    path('profile/', index),
    path('logout/', logout_account)
]
