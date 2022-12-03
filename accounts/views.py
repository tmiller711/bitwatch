from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, get_user_model
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.contrib import messages

from .models import Account, Subscriptions, VideoInteraction
from .serializers import LoginAccountSerializer, RegisterAccountSerializer, EditProfileSerializer, SubscriptionsSerializer, PlaylistSerializer
from .tokens import accounts_activation_token

# Create your views here.
class GetUser(APIView):
    def get(self, request, *args, **kwargs):
        # if user is signed in return their info
        if request.user.is_authenticated:
            data = {"id": request.user.id, "name": request.user.name, "username": request.user.username, 
                        "profilePic": request.user.profile_pic.url, "subscribers": request.user.subscribers}
            return Response(data, status=status.HTTP_200_OK)
        
        else:
            return Response({"Not": "Logged IN"}, status=status.HTTP_404_NOT_FOUND)

class GetUserByID(APIView):
    def get(self, request, *args, **kwargs):
        user = Account.objects.get(id=self.kwargs['id'])
        is_you = False
        if request.user == user:
           is_you = True 
        subscription_status = Subscriptions.subscription_status(request.user, user)

        data = {"id": user.id, "name": user.name, "username": user.username, "profilePic": user.profile_pic.url, "subscribers": user.subscribers,
                "subscription_status": subscription_status, "isYou": is_you}
        return Response(data, status=status.HTTP_200_OK)
        
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
            activate_email(request, account, email)
            return Response({"Account Created": "Good Stuff cuh"}, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)

class EditProfile(APIView):
    def post(self, request, *args, **kwargs):
        serializer = EditProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            profile_pic = request.data.get('profile_pic')
            name = request.data.get('name')
            user.name = name
            if profile_pic != None:
                user.update_profile_pic(user, profile_pic)
            user.save()
            data = {"profilePic": request.user.profile_pic.url}

            return Response(data, status=status.HTTP_200_OK)
        
        return Response({"Error": "Invalid"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class GetPlaylists(APIView):
    def get(self, request, format=None):
        playlists = request.user.playlists.all()
        data = PlaylistSerializer(playlists, many=True).data
        
        return Response(data)

class History(APIView):
    def get(self, request, format=None):
        data = VideoInteraction.get_history(request.user)
        return Response(data, status=status.HTTP_200_OK)

class Channel(APIView):
    def get(self, request, *args, **kwargs):
        print(self.kwargs['id'])

class GetSubscriptions(APIView):
    def get(self, request, format=None):
        subscriptions = Subscriptions.get_subscriptions(request.user)

        data = []
        for i, user in enumerate(subscriptions):
            data.append({'id': user.id, 'username': user.username, 'profilePic': user.profile_pic.url})
            # data[i] = {}
        
        print(data)
        
        return Response(data, status=status.HTTP_200_OK)

class Subscribe(APIView):
    def get(self, request, *args, **kwargs):
        try:
            id = self.kwargs['id']
            subscribe_to = Account.objects.get(id=id)
            Subscriptions.subscribe(request.user, subscribe_to)

            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Unsubscribe(APIView):
    def get(self, request, *args, **kwargs):
        try:
            id = self.kwargs['id']
            unsub_from = Account.objects.get(id=id)
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

def activate_email(request, user, to_email):
    mail_subject = "Activate your user accounts"
    message = render_to_string("template_activate_account.html", {
        'user': user.username,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': accounts_activation_token.make_token(user),
        'protocol': 'https' if request.is_secure() else 'http'
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    if email.send():
        pass
    else:
        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)