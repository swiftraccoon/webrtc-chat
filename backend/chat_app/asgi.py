import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat_app.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat_app.settings")

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(chat_app.routing.websocket_urlpatterns)
        ),
    }
)

# Added debugging statement
print("Debug: ASGI application initialized.")
