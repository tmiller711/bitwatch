from django.shortcuts import render, redirect
from django.contrib.auth import logout

# Create your views here.
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

def logout_account(request):
    logout(request)
    return redirect("/")
