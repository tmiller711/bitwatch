import os 
from .base import *

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DEBUG = False
ALLOWED_HOSTS = ['172.31.21.247']
STATIC_ROOT = '/home/ubuntu/static/'

CSRF_TRUSTED_ORIGINS = ['http://18.223.98.240']

INSTALLED_APPS.append('storages')

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

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_ACCESS_KEY_ID = os.environ['AWS_KEY']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET']
AWS_STORAGE_BUCKET_NAME = 'bitwatch-media'
AWS_S3_REGION_NAME = 'us-east-2'
AWS_QUERYSTRING_AUTH = False

SECURE_CROSS_ORIGIN_OPENER_POLICY = None