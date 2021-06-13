from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from . import models
# Create your tests here.

# testing delete_select_image module

class TestDeleteSelectImageOrigin(TestCase):
    def setUp(self):
        print('setUp')

    def tearDown(self):
        print('tearDown')

    def test_demo(self):
        models.Tag(tag="None").save()
        file=open("/Users/tanzhongyu/AICloudAlbum/AI/ImgClass_new/config/tags.txt")
        line=file.readline()
        while line:
            models.Tag(tag=line).save()
            line = file.readline()

        print('test_demo')

    def test_welcome(self):
        response=self.client.get("/welcome/")

        print('test_demo2')


# testing face module
from AI.FaceDetect.FaceDetect import FaceRecogPrepared
from AI.FaceDetect.VisualizeDetect import VisualizeBlocks
import Album.models as models
import os

imgs_dir = os.getcwd()

class FaceDetectTest(TestCase):
    # 测试人脸识别FaceDetect模块
    def setUp(self):
        # 测试函数执行前执行
        pass

    def test_post_user(self):
        # 创建用户
        pass

    def test_face1(self):
        self.maxDiff=None
        post_signup_data={
            'phone': '15989061915',
            'name': 'hhhhh',
            'pwd': '123456',
            're_pwd': '123456'
        }
        post_login_data = {
            'phone': '15989061915',
            'pwd': '123456'
        }
        response = self.client.post('/signup', data=post_signup_data,
                                    content_type='application/json')
        self.assertEqual(self.client.session['signup'], True)

        def tearDown(self):
            # 每个测试函数执行后都删除所有数据
            models.User.objects.all().delete()