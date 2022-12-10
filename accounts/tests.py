from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from .views import Login

from .models import Account, Subscriptions

class RegisterTestCase(TestCase):
    def test_register(self):
        response = self.client.post(reverse('register'), data={
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

class LoginTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('login')
        
        account = Account(email='testuser@gmail.com', username='testuser')
        account.set_password('testpassword')
        account.is_active = True
        account.save()

    def test_login_good_data(self):
        response = self.client.post(self.login_url, data={
            'email': 'testuser@gmail.com',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, 202)
    
    def test_login_invalid_data(self):
        response = self.client.post(self.login_url, data={
            'email': 'testuser@gmail.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 404)

    def test_login_missing_data(self):
        response = self.client.post(self.login_url, data={
            'email': 'testuser@gmail.com',
        })
        self.assertEqual(response.status_code, 400)

class GetUserViewTestCase(TestCase):
    def setUp(self):
        self.get_user_url = reverse('get_user')
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

    def test_get_authenticated_user(self):
        response = self.client.get(self.get_user_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data['id'], str(self.account.id))
        self.assertEqual(data['name'], self.account.name)

    def test_get_unauthenticated_user(self):
        self.client.logout()
        response = self.client.get(self.get_user_url)
        self.assertEqual(response.status_code, 404)

    def test_get_user_by_id(self):
        self.client.logout()
        response = self.client.get(f'{self.get_user_url}{self.account.id}/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data['id'], str(self.account.id))

    def test_get_user_bad_id(self):
        self.client.logout()

        response = self.client.get(f'{self.get_user_url}/adfasdfj9saasdf/')
        self.assertEqual(response.status_code, 404)

class EditProfileTestCase(TestCase):
    def setUp(self):
        self.url = reverse('edit_profile')
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

    def test_edit_profile(self):
        response = self.client.post(self.url, data={
            'name': 'newname',
        })
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data['name'], 'newname')

class SubscriptionsTestCase(TestCase):
    def setUp(self):
        self.account1 = Account(email='testuser1@gmail.com', username='testuser1')
        self.account1.set_password('testpassword1')
        self.account1.is_active = True
        self.account1.save()

        self.account2 = Account(email='testuser2@gmail.com', username='testuser2')
        self.account2.set_password('testpassword2')
        self.account2.is_active = True
        self.account2.subscribers = 1
        self.account2.save()

        self.subscribe_url = reverse('subscribe', args=[self.account2.id])
        self.unsubscribe_url = reverse('unsubscribe', args=[self.account2.id])
        self.subscriptions_url = reverse('get_subscriptions')

        self.client.login(email='testuser1@gmail.com', password='testpassword1')

    def test_subscribe(self):
        response = self.client.get(self.subscribe_url)
        self.assertEqual(response.status_code, 200)

        subscription = Subscriptions.objects.get(user=self.account1)
        self.assertIn(self.account2, subscription.subscriptions.all())
    
    def test_unsubscribe(self):
        subscription = Subscriptions.objects.create(user=self.account1)
        subscription.subscriptions.add(self.account2)

        response = self.client.get(self.unsubscribe_url)
        self.assertEqual(response.status_code, 200)

        subscription = Subscriptions.objects.get(user=self.account1)
        self.assertNotIn(self.account2, subscription.subscriptions.all())

    def test_get_no_subscriptions(self):
        response = self.client.get(self.subscriptions_url)
        self.assertEqual(response.status_code, 200)
    
    def test_get_subscriptions(self):
        subscription = Subscriptions.objects.create(user=self.account1)
        subscription.subscriptions.add(self.account2)

        response = self.client.get(self.subscriptions_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data[0]['id'], str(self.account2.id))

# class GetHistoryTestCase(TestCase):
#     def setUp(self):
#         self.get_history_url = reverse('get_history')