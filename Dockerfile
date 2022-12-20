FROM python:3.8-slim

WORKDIR /app
RUN apt-get update && apt-get install -y sudo

# install dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# setup database
ENV DB_PASS='june302004'

RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# setup web servers
RUN pip install gunicorn
RUN apt-get install -y nginx

COPY conf/nginx /etc/nginx/sites-enabled/

ENV DJANGO_SETTINGS_MODULE='bitwatch.settings.prod'
ENV DJANGO_SECRET_KEY='lasdjfoisajf90sad9jf90sdajf0sda90fsad90f09sadf09sdaj90fj9s0af90j'

CMD ["gunicorn", "bitwatch.wsgi", "-b", "0.0.0.0:8000"]