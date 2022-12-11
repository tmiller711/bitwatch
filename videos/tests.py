from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
import base64

from accounts.models import Account, Playlist
from .models import Tag, Video, Comment

# Create your tests here.
class UploadVideoTestCase(TestCase):
    def setUp(self):
        self.url = reverse('upload_video')
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        tag = Tag(name='Gaming')
        tag.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')

    def test_upload_video(self):
        thumbnail_data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAUA" + "AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO" + "9TXL0Y4OHwAAAABJRU5ErkJggg==")
        video_file = SimpleUploadedFile("video.mp4", thumbnail_data, content_type="video/mp4")
        thumbnail_file = SimpleUploadedFile("thumbnail.png", thumbnail_data, content_type="image/png")

        response = self.client.post(self.url, data={
            'title': 'test video',
            'description': 'test description',
            'tags': 'Gaming',
            'video': video_file,
            'thumbnail': thumbnail_file
        })
        self.assertEqual(response.status_code, 201)
    
    def test_upload_no_data(self):
        response = self.client.post(self.url, data={
            'title': 'test video32'
        })
        self.assertEqual(response.status_code, 400)

class GetVideosTestCase(TestCase):
    def setUp(self):
        self.url = reverse('get_videos', kwargs={'page': 1})
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )

    def test_get_all_videos(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data[0]['title'], 'Test Video')
    
    def test_get_no_videos(self):
        url = reverse('get_videos', kwargs={'page': 10})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 204)

class SearchVideosTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        self.url = reverse('search', kwargs={'query': str(self.video.title)})

    def test_get_video_search(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data[0]['title'], 'Test Video')

    def test_get_bad_search(self):
        url = reverse('search', kwargs={'query': 'd1728f10-327c-40fb-be6b-01ba1233c5ee'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


class PlaylistVideosTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )

        self.playlist = Playlist.objects.create(
            creator=self.account,
            name='Test Playlist'
        )
        self.playlist.videos.add(self.video)
        self.url = reverse('playlist_videos', kwargs={'playlist_id': str(self.playlist.id)})
    
    def test_playlist_videos_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertNotEqual(len(data), 0)
        self.assertEqual(data[0]['title'], 'Test Video')

    def test_playlist_videos_bad_id(self):
        url = reverse('playlist_videos', kwargs={'playlist_id': '4332acd8-f3a0-4ad7-9fef-57a835cb9c56'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
    
    # def test_playlist_videos_no_id(self):
    #     url = reverse('playlist_videos', kwargs={'playlist_id': ''})
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 400)

class GetVideoTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        self.url = reverse('get_video', kwargs={'video_id': self.video.video_id})

    def test_get_video_success(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data['title'], 'Test Video')

    def test_get_video_bad_id(self):
        url = reverse('get_video', kwargs={'video_id': '6762da6b-fa11-42f8-accd-f95a5be15341'})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 404)

class GetCommentsTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        
        self.url = reverse('get_comments', kwargs={'video_id': str(self.video.video_id), 'page': 1})
    
    def test_get_comments(self):
        # Add some comments to the video
        for i in range(5):
            comment = Comment(user=self.account, text=f'test comment {i}')
            comment.save()
            self.video.comments.add(comment)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(len(data), 5)
    
    def test_get_comments_paginated(self):
        # Add some comments to the video
        for i in range(15):
            comment = Comment(user=self.account, text=f'test comment {i}')
            comment.save()
            self.video.comments.add(comment)

        # Make a GET request to the view with pagination parameters and verify the response
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 12)
        
        url = reverse('get_comments', kwargs={'video_id': str(self.video.video_id), 'page': 2})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 3)

class DeleteVideoTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')


        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        self.url = reverse('delete_video', kwargs={'video_id': self.video.video_id})

    def test_delete_video(self):
        response = self.client.delete(self.url)

        # assert that the video was deleted and a 200 status was returned
        self.assertEqual(response.status_code, 200)
        with self.assertRaises(Video.DoesNotExist):
            Video.objects.get(video_id=self.video.video_id)

    def test_delete_404_video(self):
        self.video.delete()
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, 404)

    def test_delete_video_unauthenticated(self):
        self.client.logout()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 403)

class AddCommentTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')


        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        self.url = reverse('add_comment', kwargs={'video_id': str(self.video.video_id)})

    def test_add_comment(self):
        response = self.client.post(self.url, data={'comment': 'test comment'})
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data['text'], 'test comment')

    def test_add_comment_unauthorized(self):
        self.client.logout()
        response = self.client.post(self.url, data={'comment': 'test comment'})
        self.assertEqual(response.status_code, 403)

class VideoInteractTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')


        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test video',
        )
        self.url = reverse('interact', kwargs={'video_id': str(self.video.video_id)})

    def test_like_video(self):
        response = self.client.post(self.url, data={
            'id': self.video.video_id,
            'action': 'like'
        })
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, {"num_likes": 1, "num_dislikes": 0})

    def test_dislike_video(self):
        response = self.client.post(self.url, data={
            'id': self.video.video_id,
            'action': 'dislike'
        })
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, {"num_likes": 0, "num_dislikes": 1})

    def test_view_video(self):
        response = self.client.post(self.url, data={
            'id': self.video.video_id,
            'action': 'view'
        })
        self.assertEqual(response.status_code, 200)
        
        self.video.refresh_from_db()
        self.assertEqual(self.video.views, 1)

    def test_like_video_unauthorized(self):
        self.client.logout()
        response = self.client.post(self.url, data={
            'id': self.video.video_id,
            'action': 'like'
        })
        self.assertEqual(response.status_code, 403)

class ChannelVideosTestCase(TestCase):
    def setUp(self):
        self.account = Account(email='testuser@gmail.com', username='testuser')
        self.account.set_password('testpassword')
        self.account.is_active = True
        self.account.save()

        self.client.login(email='testuser@gmail.com', password='testpassword')


        self.video = Video.objects.create(
            uploader=self.account,
            title='Test Video',
            description='This is a test description',
        )
        self.url = reverse('channel_videos', kwargs={'channel_id': str(self.account.id), 'page': 1})

    def test_channel_videos(self):
        response = self.client.get(self.url)

        # Test that the response is 200 OK
        self.assertEqual(response.status_code, 200)

        # Test that the response contains the expected data
        self.assertEqual(response.data[0]['title'], 'Test Video')
        self.assertEqual(response.data[0]['description'], 'This is a test description')

    def test_404_channel_videos(self):
        url = reverse('channel_videos', kwargs={'channel_id': "4332acd8-f3a0-4ad7-9fef-57a835cb9c56", 'page': 1})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
    
    def test_get_no_channel_videos(self):
        url = reverse('channel_videos', kwargs={'channel_id': str(self.account.id), 'page': 25})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 204)
