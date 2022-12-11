from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, get_user_model
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.contrib import messages
from rest_framework.permissions import IsAuthenticated
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from .models import Account, Subscriptions, Playlist, History
from videos.models import Video
from .serializers import LoginSerializer, RegisterAccountSerializer, EditProfileSerializer, SubscriptionsSerializer, PlaylistSerializer, UserSerializer
from videos.serializers import GetVideoSerializer
from .tokens import accounts_activation_token

# Create your views here.
class GetUser(APIView):
    def get(self, request, user_id=None):
        if user_id == None:
            if request.user.is_authenticated:
                user = request.user
                is_you = True
                subscription_status = False
            
            else:
                return Response({"Not": "Logged IN"}, status=status.HTTP_404_NOT_FOUND)
        
        else:
            user = get_object_or_404(Account, id=user_id)
            if user == None:
                return Response(status=status.HTTP_404_NOT_FOUND)

            is_you = request.user == user

            # check the subscription status if the user is logged in
            if request.user.is_authenticated:
                subscription_status = Subscriptions.subscription_status(request.user, user)
            else:
                subscription_status = False

        serializer = UserSerializer(user, context={"is_you": is_you, "subscription_status": subscription_status})
        return Response(serializer.data, status=status.HTTP_200_OK)

class Login(APIView):
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            account = authenticate(request, email=email, password=password)
            if account == None:
                return Response({"Invalid Credentials": "Could not authenticate user"}, status=status.HTTP_404_NOT_FOUND)

            login(request, account)
            return Response(status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class Register(APIView):
    serializer_class = RegisterAccountSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            username = serializer.data.get('username')
            password = serializer.data.get('password')

            account = Account(email=email, username=username)
            account.set_password(password)
            account.save()

            url = Account.get_activate_url(request, account)
            message = render_to_string("template_activate_account.html", {
                "url": url
            })
            mail_subject = "Activate Your Account"
            email = EmailMessage(mail_subject, message, to=[email])
            email.send()

            return Response({"success": "Please confirm your email address"}, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class EditProfile(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = EditProfileSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            user = request.user
            data = self.update_profile(user, serializer.validated_data)
            return Response(data, status=status.HTTP_200_OK)

        errors = {}
        for field, error in serializer.errors.items():
            errors[field] = error[0]

        return Response({"errors": errors}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update_profile(self, user, data):
        user.name = data.get('name')
        profile_pic = data.get('profile_pic')
        if profile_pic != None:
            user.update_profile_pic(user, profile_pic)
        user.save()
        return {'name': user.name, 'profile_pic': user.profile_pic.url}
    
class GetPlaylists(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id=None):

        # if user_id not specified return the users playlists
        if user_id is None:
            playlists = request.user.playlists.all()
            data = PlaylistSerializer(playlists, many=True).data
            
            return Response(data)
        
        # if user_id is specified return the playlists of the specified user
        else:
            channel = Account.objects.get(id=user_id)
            if channel == request.user:
                playlists = channel.playlists.all()
            else:
                playlists = Playlist.objects.filter(creator=channel, private=False)

            data = PlaylistSerializer(playlists, many=True).data

            return Response(data)

class GetHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        data = History.get_history(user=request.user)
        if data is None or len(data) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        videos = GetVideoSerializer(data, many=True).data
        return Response(videos, status=status.HTTP_200_OK)

class CreatePlaylist(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        try:
            name = request.data['name']
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.data.get('status') == "true":
            privateStatus = True
        else:
            privateStatus = False

        playlist = Playlist(creator=request.user, name=name, private=privateStatus)
        playlist.save()
        request.user.playlists.add(playlist)

        data = PlaylistSerializer(playlist).data

        return Response(data, status=status.HTTP_201_CREATED)

class UpdatePlaylist(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, playlist_id, video_id=None):
        try:
            playlist = Playlist.objects.get(id=playlist_id)
        except Playlist.DoesNotExist:
            # return 404 if the playlist does not exist
            return Response(status=status.HTTP_404_NOT_FOUND)

        if video_id is not None:
            video = Video.objects.get(video_id=video_id)
            if video is not None:
                if video in playlist.videos.all():
                    playlist.videos.remove(video)
                elif video not in playlist.videos.all():
                    playlist.videos.add(video)

        serializer = PlaylistSerializer(playlist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GetSubscriptions(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        subscriptions = Subscriptions.get_subscriptions(request.user)
        if len(subscriptions) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = UserSerializer(subscriptions, many=True).data
        
        return Response(data, status=status.HTTP_200_OK)

class Subscribe(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user_id = self.kwargs['user_id']
            subscribe_to = Account.objects.get(id=user_id)
            Subscriptions.subscribe(request.user, subscribe_to)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Unsubscribe(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user_id = self.kwargs['user_id']
            unsub_from = Account.objects.get(id=user_id)
            Subscriptions.unsubscribe(request.user, unsub_from)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = Account.objects.get(pk=uid)
    except:
        user = None

    if user is not None and accounts_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        
        login(request, user)

        return redirect('/')
    else:
        # alert the user of bad activation link
        print("bad activate link")

    return redirect('/')