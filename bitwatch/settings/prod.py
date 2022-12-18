import os
from .base import *

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = False
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bitwatch',
        'USER': 'postgres',
        'PASSWORD': os.environ['DB_PASS'],
        'HOST': 'localhost',
        'PORT': '',
    }
}