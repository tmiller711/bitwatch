from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class GetUser(APIView):
    def get(self, request, format=None):
        # if user is signed in return their info
        if request.user.is_authenticated:
            data = {"name": request.user.name, "username": request.user.username, "profilePic": request.user.profile_pic.url}
            return Response(data, status=status.HTTP_200_OK)
        
        else:
            return Response({"Not": "Logged IN"}, status=status.HTTP_404_NOT_FOUND)