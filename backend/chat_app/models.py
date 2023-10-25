from django.db import models

class ChatHistory(models.Model):
    room_name = models.CharField(max_length=255)
    user = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class UserInfo(models.Model):
    username = models.CharField(max_length=255, unique=True)
    # Add other fields like email, etc.

class RoomDetails(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
