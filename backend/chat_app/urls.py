from django.urls import path
from . import views

urlpatterns = [
    # ... (existing URL patterns)
    path('chat/<str:room_name>/', views.room, name='room'),
]
