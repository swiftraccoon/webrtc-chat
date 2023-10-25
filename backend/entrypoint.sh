#!/bin/bash

# Echo debug information
echo "Debug: Starting entrypoint.sh"

# Start Django application
python manage.py runserver 0.0.0.0:8000
