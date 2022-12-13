from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from .views import Login
from django.http import HttpRequest
from django.test.client import RequestFactory
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from .models import Account, Subscriptions, HistoryEntry, Playlist
from videos.models import Video
from .tokens import accounts_activation_token

class RegisterTestCase(TestCase):
    def test_register(self):
        response = self.client.post(reverse('register'), data={
            'email': 'testuser@gmail.com',
            'username': 'testuser',
            'password': 'superadmin'
        })
        self.assertEqual(response.status_code, 201)
    
        account = Account.objects.get(email='testuser@gmail.com')
        factory = RequestFactory()
        request = factory.get('/accounts/register')

        activation_url = Account.get_activate_url(request=request, user=account)
        response = self.client.get(f"http://{activation_url}")
        self.assertNotEqual(response.status_code, 404)

        account.refresh_from_db()
        self.assertTrue(account.is_active)

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
        self.assertEqual(response.status_code, 200)
    
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
        self.assertEqual(data['is_you'], False)
        self.assertEqual(data['subscription_status'], False)

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
        # Send request with valid data
        response = self.client.post(self.url, data={
            'name': 'newname',
            # 'profile_pic': 'profile_pic.jpg'  # Include a value for the profile_pic field
        }, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        
        # Check that the user's data was updated correctly
        user = Account.objects.get(username='testuser')
        self.assertEqual(user.name, 'newname')
        # self.assertEqual(user.profile_pic, 'https://example.com/profile_pic.jpg')
        
        # # Check that the response includes the updated data
        data = response.json()
        self.assertEqual(data['name'], 'newname')
        # self.assertEqual(data['profile_pic'], 'https://example.com/profile_pic.jpg')

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
        self.assertEqual(response.status_code, 404)
    
    def test_get_subscriptions(self):
        subscription = Subscriptions.objects.create(user=self.account1)
        subscription.subscriptions.add(self.account2)

        response = self.client.get(self.subscriptions_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data[0]['id'], str(self.account2.id))

class GetHistoryTestCase(TestCase):
    def setUp(self):
        self.get_history_url = reverse('get_history', kwargs={'page': 1})
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video1 = Video(uploader=self.account, title='Test Video 1')
        self.video1.save()
        self.video2 = Video(uploader=self.account, title='Test Video 2')
        self.video2.save()
        self.video3 = Video(uploader=self.account, title='Test Video 3')
        self.video3.save()

        self.history1 = HistoryEntry.objects.create(user=self.account, video=self.video1)
        self.history2 = HistoryEntry.objects.create(user=self.account, video=self.video2)
        self.history3 = HistoryEntry.objects.create(user=self.account, video=self.video3)

        self.client.login(email='testuser@gmail.com', password='testpassword')

    def test_get_history(self):
        response = self.client.get(self.get_history_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 3)
        # make this in order once I add that to the history model
        self.assertEqual(data[0]['video_id'], str(self.video3.video_id))
        self.assertEqual(data[1]['video_id'], str(self.video2.video_id))    
        self.assertEqual(data[2]['video_id'], str(self.video1.video_id))

    def test_get_history_unauthorized(self):
        self.client.logout()
        response = self.client.get(self.get_history_url)
        self.assertEqual(response.status_code, 403)
    
    def test_history_add_video(self):
        HistoryEntry.add_video(user=self.account, video=self.video2)
        response = self.client.get(self.get_history_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 3)
        # make this in order once I add that to the history model
        self.assertEqual(data[0]['video_id'], str(self.video2.video_id))
        self.assertEqual(data[1]['video_id'], str(self.video3.video_id))    
        self.assertEqual(data[2]['video_id'], str(self.video1.video_id))


class GetPlaylistsTestCase(TestCase):
    def setUp(self):
        self.get_playlists_url = reverse('get_playlists')
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

        # self.playlist = Playlist.create_playlist(user=self.account, name='Test Playlist')
        self.playlist = Playlist(creator=self.account, name='Test Playlist')
        self.playlist.save()
        self.account.playlists.add(self.playlist)

    def test_get_playlists(self):
        response = self.client.get(self.get_playlists_url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], str(self.playlist.id))
        self.assertEqual(data[0]['name'], self.playlist.name)

    def test_get_playlists_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.get_playlists_url)
        self.assertEqual(response.status_code, 403)
    
    def test_get_playlists_id(self):
        response = self.client.get(f'{self.get_playlists_url}{str(self.account.id)}')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], str(self.playlist.id))
        self.assertEqual(data[0]['name'], self.playlist.name)

class CreatePlaylistTestCase(TestCase):
    def setUp(self):
        self.create_playlist_url = reverse('create_playlist')
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

    def test_create_playlist(self):
        response = self.client.post(self.create_playlist_url, data={
            'name': 'Test Playlist'
        })
        self.assertEqual(response.status_code, 201)

        data = response.json()
        self.assertIn('id', data)
        self.assertEqual(data['name'], 'Test Playlist')
    
    def test_create_playlist_missing_data(self):
        response = self.client.post(self.create_playlist_url, data={
            # No name provided
        })
        self.assertEqual(response.status_code, 400)

    def test_create_playlist_unauthenticated(self):
        self.client.logout()
        response = self.client.post(self.create_playlist_url, data={
            'name': 'Test Playlist'
        })
        self.assertEqual(response.status_code, 403)

class UpdatePlaylistTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

        # self.playlist = Playlist.create_playlist(user=self.account, name='Test Playlist')
        self.playlist = Playlist(creator=self.account, name='Test Playlist')
        self.playlist.save()
        self.account.playlists.add(self.playlist)

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )

        self.update_playlist_url = reverse('update_playlist', kwargs={'playlist_id': str(self.playlist.id), 'video_id': str(self.video.video_id)})

    def test_update_playlist(self):
        response = self.client.put(self.update_playlist_url, data={
            'name': 'Updated Playlist',
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data['id'], str(self.playlist.id))
        self.assertEqual(data['name'], 'Updated Playlist')

    def test_update_playlist_unauthenticated(self):
        self.client.logout()
        response = self.client.put(self.update_playlist_url, data={
            'name': 'Updated Playlist'
        })
        self.assertEqual(response.status_code, 403)

    def test_update_playlist_invalid_id(self):
        url = reverse('update_playlist', kwargs={'playlist_id': 'd1728f10-327c-40fb-be6b-01ba1233c5ee', 'video_id': 'd1728f10-327c-40fb-be6b-01ba1233c5ee'})
        response = self.client.put(f'{self.update_playlist_url}adfasdfj9saasdf/', data={
            'name': 'Updated Playlist'
        })
        self.assertEqual(response.status_code, 404)

class DeletePlaylistTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

        self.playlist = Playlist(creator=self.account, name='Test Playlist')
        self.playlist.save()
        self.account.playlists.add(self.playlist)
        
        self.url = reverse('delete_playlist', kwargs={'playlist_id': self.playlist.id})

    def test_delete_playlist(self):
        response = self.client.delete(self.url)

        # assert that the video was deleted and a 200 status was returned
        self.assertEqual(response.status_code, 200)
        with self.assertRaises(Playlist.DoesNotExist):
            Playlist.objects.get(id=self.playlist.id)

    def test_delete_404_playlist(self):
        self.playlist.delete()
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, 404)

    def test_delete_playlist_unauthenticated(self):
        self.client.logout()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 403)

class ResetPasswordTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

    def test_reset_password(self):
    
        account = Account.objects.get(email='testuser@gmail.com')
        factory = RequestFactory()
        request = factory.get('/accounts/register')

        activation_url = Account.get_activate_url(request=request, user=account)
        response = self.client.get(f"http://{activation_url}")
        self.assertNotEqual(response.status_code, 404)

        account.refresh_from_db()
        self.assertTrue(account.is_active)

class TestResetPassword(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.uidb64 = urlsafe_base64_encode(force_bytes(self.account.pk))
        self.token = accounts_activation_token.make_token(self.account)

        self.url = reverse('reset', kwargs={'uidb64': self.uidb64, 'token': self.token})

    def test_reset_password(self):
        response = self.client.post(self.url, data={'password': 'newpassword'})
        self.assertEqual(response.status_code, 200)

        # Assert that the user's password has been successfully reset
        account = Account.objects.get(pk=self.account.pk)
        self.assertTrue(account.check_password('newpassword'))

    def test_reset_password_bad_token(self):
        url = reverse('reset', kwargs={'uidb64': self.uidb64, 'token': 'asdflkjaslf'})
        response = self.client.post(url, data={'password': 'newpassword'})
        self.assertEqual(response.status_code, 400)
        
    def test_reset_password_bad_uid(self):
        url = reverse('reset', kwargs={'uidb64': 'ladjlajflasdlf', 'token': self.token})
        response = self.client.post(url, data={'password': 'newpassword'})
        self.assertEqual(response.status_code, 400)

    def test_reset_password_no_password(self):
        url = reverse('reset', kwargs={'uidb64': self.uidb64, 'token': self.token})
        response = self.client.post(url, data={'password': ''})
        self.assertEqual(response.status_code, 400)


class SendResetTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.url = reverse('send_reset')

    def test_send_reset(self):
        response = self.client.post(self.url, data={'email': self.account.email})
        self.assertEqual(response.status_code, 200)

    def test_send_reset_bad_email(self):
        response = self.client.post(self.url, data={'email': 'bademail@gmail.com'})
        self.assertEqual(response.status_code, 404)
