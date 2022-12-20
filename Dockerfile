FROM python:3.8-slim

WORKDIR /app
RUN apt-get update && apt-get install -y ufw nginx
# RUN apt install -y ufw && apt-get install -y systemd

# install dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# setup environment variables
ENV DJANGO_SETTINGS_MODULE='bitwatch.settings.prod'
ARG AWS_KEY
ARG AWS_SECRET

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# setup static files
RUN python manage.py collectstatic --no-input

# install gunicorn
RUN pip install gunicorn

# configure nginx
RUN ufw allow 'Nginx HTTP'
COPY conf/nginx /etc/nginx/sites-enabled/
RUN rm /etc/nginx/sites-enabled/default

CMD nginx && gunicorn bitwatch.wsgi -b 0.0.0.0:8000