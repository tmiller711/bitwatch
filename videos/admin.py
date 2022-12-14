from django.contrib import admin

from .models import Video, Tag, Comment

class VideoAdmin(admin.ModelAdmin):
    readonly_fields = ('video_id', 'uploaded',)
    fields = ('video_id', 'uploader', 'title', 'video', 'thumbnail', 'description',
                'views', 'likes', 'dislikes', 'tags', 'uploaded', 'comments')

admin.site.register(Video, VideoAdmin)
admin.site.register(Tag)
admin.site.register(Comment)