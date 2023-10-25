INSTALLED_APPS = [
    'channels',
    'django.contrib.contenttypes',
    'django.contrib.auth',
]
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}
ASGI_APPLICATION = 'chat_app.asgi.application'

# settings.py

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Add your server's IP or domain name
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
