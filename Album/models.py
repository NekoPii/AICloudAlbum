from django.db import models
from django.core import validators
from django.utils import timezone
from django.contrib import admin
import datetime


class User(models.Model):
    phone = models.CharField(max_length=11, default="",
                             validators=[validators.RegexValidator("1[345678]\d{9}|root", message="请输入正确格式的手机号")],
                             verbose_name="手机号", primary_key=True)
    name = models.CharField(max_length=200, default='',
                            validators=[validators.MinLengthValidator(0, message="用户昵称不可为空")], verbose_name="昵称")

    pwd = models.CharField(max_length=200, default='',
                           validators=[validators.MinLengthValidator(0, message="用户密码不可为空")], verbose_name="密码")
    fake_id = models.CharField(max_length=200, default="")
    now_capacity = models.FloatField(default=0)
    max_capacity = models.FloatField(default=0)

    def __str__(self):
        return self.name


class Face(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    face_cover = models.CharField(max_length=200, default='')
    cnt = models.IntegerField(default=0)

    def __str__(self):
        return self.id


class Video(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')
    create_time = models.DateTimeField(auto_now_add=True)
    time = models.TimeField()
    description = models.CharField(max_length=1000, default='')
    size = models.FloatField(default=0)

    def __str__(self):
        return self.name


class Folder(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')
    cnt = models.IntegerField(default=0)
    total_size = models.FloatField(default=0)
    fake_name=models.CharField(max_length=200,default="")
    create_time = models.DateTimeField()
    modify_time = models.DateTimeField()

    def __str__(self):
        return self.name


class Tag(models.Model):
    tag = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.tag


class Picture(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tag", on_delete=models.CASCADE)
    folder = models.ForeignKey("Folder", on_delete=models.CASCADE)
    name = models.CharField(max_length=200, default='')
    fake_name=models.CharField(max_length=200,default="")
    type = models.CharField(max_length=200, default='')
    upload_time = models.DateTimeField(auto_now_add=True)
    size = models.FloatField(default=0)
    height = models.IntegerField(default=0)
    width = models.IntegerField(default=0)
    is_tag = models.BooleanField(default=False)
    is_face = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class UserTag(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tag", on_delete=models.CASCADE)
    cnt = models.IntegerField(default=0)

    class Meta:
        unique_together = ['user', 'tag']


class TagCover(models.Model):
    pic = models.ForeignKey("Picture", on_delete=models.CASCADE)
    tag = models.ForeignKey("Tag", on_delete=models.CASCADE)

    class Meta:
        unique_together = ['pic', 'tag']


class FolderCover(models.Model):
    folder = models.ForeignKey("Folder", on_delete=models.CASCADE)
    pic = models.ForeignKey("Picture", on_delete=models.CASCADE)

    class Meta:
        unique_together = ['folder', 'pic']


class FacePic(models.Model):
    pic = models.ForeignKey("Picture", on_delete=models.CASCADE)
    face = models.ForeignKey("Face", on_delete=models.CASCADE)

    class Meta:
        unique_together = ['pic', 'face']

