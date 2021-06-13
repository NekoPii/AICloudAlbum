from django.test import TestCase

# Create your tests here.
from django.test import TestCase,Client
from . import models
from Album.views import *
# Create your tests here.

# testing delete_select_image module

class TestDeleteSelectImage(TestCase):
    def setUp(self):
        print('setUp')

    def tearDown(self):
        print('tearDown')

    def test_demo(self):
        print("init.....")
        client = Client()
        models.Tag(tag="None").save()
        file=open("/Users/tanzhongyu/AICloudAlbum/AI/ImgClass_new/config/tags.txt")
        line=file.readline()
        while line:
            models.Tag(tag=line).save()
            line = file.readline()


        fake_id = hash_code("root", salt="user")

        new_user = models.User(name="admin", phone="root", pwd=hash_code("root") + "-" + "root",
                               max_capacity=0, fake_id=fake_id)
        new_user.save()

        new_ini_folder = models.Folder(name="ALL", user_id=new_user.phone,
                                       cnt=0, total_size=0.0,
                                       create_time=datetime.datetime.now(),
                                       modify_time=datetime.datetime.now(),
                                       )
        new_ini_folder.save()
        new_ini_folder.fake_name = hash_code(str(new_ini_folder.pk), salt="neko_folder")
        new_ini_folder.save()

        NoneTag = models.Tag.objects.get(tag="None")

        new_img = models.Picture(name="empty", type="png", upload_time=datetime.datetime.now(),
                                 size=0, height=0, width=0, is_tag=False, is_face=False,
                                 folder_id=new_ini_folder.pk, tag_id=NoneTag.pk, user_id=new_user.phone)

        new_img.save()
        new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
        new_img.save()

        print(new_img.fake_name)

        data = {
                "phone": '13600000000',
                "name": "test1",
                "pwd": "test1",
                "re_pwd": "test1",
            }
        response = client.post("/signup/", data)

        print(response)
        print(models.User.objects.get(name="test1").phone)
        print(models.User.objects.get(name="admin").phone)
        print("upload images")
        phone = '13600000000'
        now_user = models.User.objects.get(name="test1")

        nowFolder = models.Folder.objects.get(user_id=phone, name="ALL")

        NoneTag = models.Tag.objects.get(tag="None")

        for i in range(62):
            img_path = os.path.join(store_dir, "face_" + str(i + 1)+".jpg")
            now_size = os.path.getsize(img_path) / 1024 / 1024
            with Image.open(img_path) as img:
                h, w = img.size[0], img.size[1]
            new_img = models.Picture(name="face" + str(i + 1), type="jpg", upload_time=datetime.datetime.now(),
                                     size=now_size, height=h, width=w, is_tag=False, is_face=False,
                                     folder_id=nowFolder.pk, tag_id=NoneTag.pk, user_id=phone)

            new_img.save()
            new_img.fake_name = hash_code(str(new_img.pk), salt="test_img")
            new_img.save()

            now_img_name = str(new_img.fake_name) + ".jpg"
            compress_img_path_old = os.path.join(store_compress_dir, "face_" + str(i + 1)+".jpg")
            compress_img_path_new = os.path.join(store_compress_dir, now_img_name)
            img_path_new = os.path.join(store_dir, now_img_name)
            os.rename(img_path, img_path_new)
            os.rename(compress_img_path_old, compress_img_path_new)



    def test_upload_images(self):
        print("demo2")







# testing face module
from AI.FaceDetect.FaceDetect import FaceRecogPrepared
from AI.FaceDetect.VisualizeDetect import VisualizeBlocks
import Album.models as models
import os

upload_imgs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "AICloudAlbum/upload_imgs")

class FaceDetectTest(TestCase):
    # 测试人脸识别FaceDetect模块
    def setUp(self):
        # 测试函数执行前执行
        pass

    def test_post_user(self):
        # 创建用户
        pass

    def test_demo(self):
        client = Client()
        models.Tag(tag="None").save()
        file=open("/Users/tanzhongyu/AICloudAlbum/AI/ImgClass_new/config/tags.txt")
        line=file.readline()
        while line:
            models.Tag(tag=line).save()
            line = file.readline()


        fake_id = hash_code("root", salt="user")

        new_user = models.User(name="admin", phone="root", pwd=hash_code("root") + "-" + "root",
                               max_capacity=0, fake_id=fake_id)
        new_user.save()

        new_ini_folder = models.Folder(name="ALL", user_id=new_user.phone,
                                       cnt=0, total_size=0.0,
                                       create_time=datetime.datetime.now(),
                                       modify_time=datetime.datetime.now(),
                                       )
        new_ini_folder.save()
        new_ini_folder.fake_name = hash_code(str(new_ini_folder.pk), salt="neko_folder")
        new_ini_folder.save()

        NoneTag = models.Tag.objects.get(tag="None")

        new_img = models.Picture(name="empty", type="png", upload_time=datetime.datetime.now(),
                                 size=0, height=0, width=0, is_tag=False, is_face=False,
                                 folder_id=new_ini_folder.pk, tag_id=NoneTag.pk, user_id=new_user.phone)

        new_img.save()
        new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
        new_img.save()

        print(new_img.fake_name)

    def test_user(self):
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
        self.assertEqual(response, True)

    def test_face1(self):
        user = {
            'phone': '15989061915',
            'name': 'hhhhh',
            'pwd': '123456'
        }
        filepath = upload_imgs_dir + "/person4.jpg"
        isFace, face_locations, recognized_faces,saved_face_img_name = FaceRecogPrepared(filepath, user['phone'], True)
        #         # 展示结果
        print("isFace=" + str(isFace))
        print(face_locations)
        print(recognized_faces)
        VisualizeBlocks(filepath, face_locations)

        self.assertEqual(isFace, True)
        self.assertEqual(len(face_locations) == 0, False)
        for recog in recognized_faces:
            self.assertEqual(recog == 'Not matched', False)


    def tearDown(self):
        # 每个测试函数执行后都删除所有数据
        models.User.objects.all().delete()