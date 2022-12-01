from django.contrib import admin

from .models import Video, Tag, Comment

class VideoAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'uploaded',)
    fields = ('id', 'uploader', 'title', 'video', 'thumbnail', 'description',
                'views', 'likes', 'dislikes', 'tags', 'uploaded', 'comments')

admin.site.register(Video, VideoAdmin)
admin.site.register(Tag)
admin.site.register(Comment)