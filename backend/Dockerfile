FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Echo a message to indicate that the container was built
RUN echo "Docker container built."

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
