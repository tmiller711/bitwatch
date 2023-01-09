from celery import shared_task
from time import sleep
from django.core.mail import EmailMessage

@shared_task
def send_email_task(mail_subject, message, to_email):
    sleep(10)
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()

    return None