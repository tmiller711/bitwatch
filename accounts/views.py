from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login

from .models import Account
from .serializers import LoginAccountSerializer, RegisterAccountSerializer

# Create your views here.
class GetUser(APIView):
    def get(self, request, format=None):
        # if user is signed in return their info
        if request.user.is_authenticated:
            data = {"name": request.user.name, "username": request.user.username, "profilePic": request.user.profile_pic.url}
            return Response(data, status=status.HTTP_200_OK)
        
        else:
            return Response({"Not": "Logged IN"}, status=status.HTTP_404_NOT_FOUND)

class Login(APIView):
    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')

        if len(email) > 0 and len(password) > 0:
            try:
                account = authenticate(request, email=email, password=password)
            except:
                return Response({"Invalid Credentials": "Could not authenticate user"}, status=status.HTTP_404_NOT_FOUND)

            login(request, account)
            return Response({"Logged In": "Good Stuff cuh"}, status=status.HTTP_202_ACCEPTED)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class Register(APIView):
    serializer_class = RegisterAccountSerializer

    def post(self, request, format=None):
        # make it so users can be duplicates and other stuff that you need to check. Then send a different response for each one

        # replace this stuff by using a serializer
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            username = serializer.data.get('username')
            password = serializer.data.get('password')

            account = Account(email=email, username=username)
            account.set_password(password)
            account.save()
            # activate_email(request, account, email)
            return Response({"Account Created": "Good Stuff cuh"}, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)