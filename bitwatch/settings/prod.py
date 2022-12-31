import os 
from .base import *
import boto3
import json

session = boto3.session.Session()
client = session.client(
    service_name='secretsmanager',
    region_name='us-east-2',
    aws_access_key_id=os.environ['AWS_KEY'],
    aws_secret_access_key=os.environ['AWS_SECRET']
)

response = client.get_secret_value(
    SecretId='bitwatch-secrets'
)
secret_value = response['SecretString']
secrets = json.loads(secret_value)


SECRET_KEY = secrets['DJANGO_SECRET_KEY']
DEBUG = False
ALLOWED_HOSTS = ['172.31.21.247', '0.0.0.0', '127.0.0.1']
STATIC_ROOT = '/app/static/'

CSRF_TRUSTED_ORIGINS = ['http://18.222.194.21', 'https://bitwatch.net', 'https://www.bitwatch.net']

INSTALLED_APPS.append('storages')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bitwatch',
        'USER': 'postgres',
        'PASSWORD': secrets['DB_PASS'],
        'HOST': 'database-2.cwsv3haacda5.us-east-2.rds.amazonaws.com',
        'PORT': '',
    }
}

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_ACCESS_KEY_ID = secrets['AWS_KEY']
AWS_SECRET_ACCESS_KEY = secrets['AWS_SECRET']
AWS_STORAGE_BUCKET_NAME = 'bitwatch-media'
AWS_S3_REGION_NAME = 'us-east-2'
AWS_QUERYSTRING_AUTH = False

SECURE_CROSS_ORIGIN_OPENER_POLICY = None