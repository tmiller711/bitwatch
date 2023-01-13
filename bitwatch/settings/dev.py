from .base import *
import os

SECRET_KEY = 'django-insecure-1y8rq(3w90)@&#)!$-9-@j^dr3d24j^yvjfwqa-n1ml%l43!3t'
DEBUG = True
ALLOWED_HOSTS = ['6b01-2601-2c0-8b82-a940-00-58a6.ngrok.io', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
