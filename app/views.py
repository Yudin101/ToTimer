from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import *

@login_required
def index(request):
    return render(request, 'app/layout.html')

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'app/login.html', {
                'message': 'Invalid username and/or password'
            })
    else:
        return render(request, 'app/login.html')

def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm-password']

        if password != confirm_password:
            return render(request, 'app/register.html', {
                'message': 'Passwords must match'
            })

        try:
            user = User.objects.create_user(username=username, password=password)
            user.save()
        except IntegrityError:
            return render(request, 'app/register.html', {
                'message': 'Username already taken'
            })

        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'app/register.html')

