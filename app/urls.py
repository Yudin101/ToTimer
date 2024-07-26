from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name= 'logout'),
    path('register/', views.register, name='register'),

    # API Routes
    path('add/', views.add_task, name='add'),
    path('load/', views.load_tasks, name='load'),
    path('clear/', views.clear_tasks, name='clear'),
    path('check/', views.check_tasks, name='check'),
]