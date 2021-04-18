from django.db import models
from django.utils import timezone
from django.contrib import admin
import datetime


class User(models.Model):
    name=models.CharField(max_length=200,default='')
    pwd=models.CharField(max_length=200,default='')
    now_capacity=models.FloatField(default=0)
    max_capacity = models.FloatField(default=0)

    def __str__(self):
        return self.name


class Face(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    face_cover = models.CharField(max_length=200,default='')
    cnt = models.IntegerField(default=0)

    def __str__(self):
        return self.id


class Video(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    name=models.CharField(max_length=200,default='')
    create_time=models.DateTimeField()
    time=models.TimeField()
    description = models.CharField(max_length=1000, default='')
    size=models.FloatField(default=0)

    def __str__(self):
        return self.name


class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')
    cnt = models.IntegerField(default=0)
    total_size = models.FloatField(default=0)
    create_time = models.DateTimeField()
    modify_time = models.DateTimeField()

    def __str__(self):
        return self.name


class Tag(models.Model):
    tag=models.CharField(max_length=200, default='')

    def __str__(self):
        return self.tag


class Picture(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')
    type = models.CharField(max_length=200, default='')
    upload_time = models.DateTimeField()
    modify_time = models.DateTimeField()
    description = models.CharField(max_length=1000, default='')
    size = models.FloatField(default=0)
    height = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    is_tag=models.BooleanField(default=False)
    is_face = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class UserTag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    cnt = models.IntegerField(default=0)

    class Meta:
        unique_together=['user','tag']


class TagCover(models.Model):
    pic = models.ForeignKey(Picture, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        unique_together=['pic','tag']


class FolderCover(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
    pic = models.ForeignKey(Picture, on_delete=models.CASCADE)

    class Meta:
        unique_together=['folder','pic']


class FacePic(models.Model):
    pic = models.ForeignKey(Picture, on_delete=models.CASCADE)
    face = models.ForeignKey(Face, on_delete=models.CASCADE)

    class Meta:
        unique_together=['pic','face']