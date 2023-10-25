from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatHistory, UserInfo, RoomDetails


def create_room(request):
    # Implement logic to create a room
    room_name = request.POST.get('room_name')
    RoomDetails.objects.create(name=room_name)
    return JsonResponse({'status': 'success'})


def join_room(request):
    # Implement logic to join a room
    room_name = request.POST.get('room_name')
    # Add logic to add user to the room
    return JsonResponse({'status': 'success'})


def get_chat_history(request):
    # Implement logic to get chat history
    room_name = request.POST.get('room_name')
    chat_history = ChatHistory.objects.filter(room_name=room_name)
    return JsonResponse({'status': 'success', 'chat_history': chat_history})


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })
