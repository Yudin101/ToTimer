import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import *

@login_required
def index(request):
    return render(request, 'app/index.html')

def add_task(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        Task(user=request.user, task=data['task']).save()

        return JsonResponse({'message': 'Task added!'}, status=201)

    else:
        return HttpResponseRedirect(reverse('index'))

def load_tasks(request):
    tasks = Task.objects.filter(user=request.user)

    return JsonResponse([task.serialize() for task in tasks], safe=False)

def clear_tasks(request):
    Task.objects.filter(user=request.user).delete()

    if request.method == 'DELETE':
        return JsonResponse({'message': 'Cleared Tasks!'})
    else:
        return HttpResponseRedirect(reverse('index'))

@csrf_exempt
def check_tasks(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        task_id = data['id']

        task = Task.objects.get(user=request.user, pk=task_id)

        if data.get('checked') is not None:
            task.checked = data['checked']
        task.save()

        return JsonResponse({'message': 'Task Checked!'}, status=201)
    else:
        return HttpResponseRedirect(reverse('index'))

def user_login(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))

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
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('index'))

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

