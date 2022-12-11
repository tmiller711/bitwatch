from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
import base64

from accounts.models import Account
from .models import Tag, Video

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
        self.url = reverse('get_videos')
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
        response = self.client.get(f"{self.url}?page=10")
        self.assertEqual(response.status_code, 204)

    def test_get_video_search(self):
        response = self.client.post(f"{self.url}", data={
            'search': 'Test Video'
        })
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data[0]['title'], 'Test Video')

    def test_get_bad_search(self):
        response = self.client.post(self.url, data={
            'search': 'aljdlasjkfasdjfasjlf'
        })
        self.assertEqual(response.status_code, 404)