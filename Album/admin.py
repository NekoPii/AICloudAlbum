from django.contrib import admin
from . import models

admin.site.register(models.User)
admin.site.register(models.Picture)
admin.site.register(models.Folder)
admin.site.register(models.FolderCover)
admin.site.register(models.Tag)
# Register your models here.
