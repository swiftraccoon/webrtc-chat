from django.urls import path
from . import views

urlpatterns = [
    path('create_room/', views.create_room, name='create_room'),
    path('join_room/', views.join_room, name='join_room'),
    path('get_chat_history/', views.get_chat_history, name='get_chat_history'),
    # Add more URL patterns as needed
]