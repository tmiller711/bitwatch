from django.contrib import admin

from .models import Video, Tag

class VideoAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    fields = ('id', 'uploader', 'title', 'video', 'description',
                'views', 'likes', 'dislikes', 'tag')

admin.site.register(Video, VideoAdmin)
admin.site.register(Tag)