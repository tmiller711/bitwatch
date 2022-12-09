from django.test import TestCase, Client
from django.contrib.auth.models import User
from .views import Login

from .models import Account

class RegisterTestCase(TestCase):
    def test_register(self):
        response = self.client.post('/api/account/register/', data={
            'email': 'testuser@gmail.com',
            'username': 'testuser',
            'password': 'superadmin'
        })
        self.assertIn('url', response.data)
        self.assertIn('token', response.data)

        activation_link = response.data['url']
        token = response.data['token']
        response = self.client.get(activation_link)

        self.assertEqual(response.status_code, 302)

class BogoutTestCase(TestCase):
    def test_logout(self):
        response = self.client.get('/logout')
        self.assertEqual(response.status_code, 301)
    
class LoginTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        
        account = Account(email='testuser@gmail.com', username='testuser')
        account.set_password('testpassword')
        account.is_active = True
        account.save()

    def test_login_success(self):
        response = self.client.post('/api/account/login/', data={
            'email': 'testuser@gmail.com',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, 202)
