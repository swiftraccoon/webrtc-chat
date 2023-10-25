#!/bin/bash
set -e

echo "Debug: Starting entrypoint.sh"

# Check Python version
echo "Debug: Checking Python version..."
python --version

# Check Django version
echo "Debug: Checking Django version..."
python -m django --version

# Check environment variables
echo "Debug: Checking environment variables..."
env

# Check if manage.py exists
if [ -f "manage.py" ]; then
    echo "Debug: manage.py exists."
else
    echo "Debug: manage.py does not exist. Exiting."
    exit 1
fi

# Start Django
echo "Debug: About to start Django directly..."
python manage.py runserver 0.0.0.0:8001 --verbosity 3 || (echo "Debug: Django failed to start" && exit 1)

# Keep the script running
tail -f /dev/null
