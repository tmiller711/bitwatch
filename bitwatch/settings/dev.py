from .base import *
import os

SECRET_KEY = 'django-insecure-1y8rq(3w90)@&#)!$-9-@j^dr3d24j^yvjfwqa-n1ml%l43!3t'
DEBUG = True
ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
