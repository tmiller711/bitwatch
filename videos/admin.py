from django.contrib import admin

from .models import Video, Tag

class VideoAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'uploaded',)
    fields = ('id', 'uploader', 'title', 'video', 'thumbnail', 'description',
                'views', 'likes', 'dislikes', 'tag', 'uploaded')

admin.site.register(Video, VideoAdmin)
admin.site.register(Tag)