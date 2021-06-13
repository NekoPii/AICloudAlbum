from django.test import TestCase

# Create your tests here.
from django.test import TestCase,Client
from . import models
from Album.views import *
# Create your tests here.

# testing delete_select_image module

class TestDeleteSelectImageOrigin(TestCase):
    def setUp(self):
        print('setUp')

    def tearDown(self):
        print('tearDown')

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

    '''      data = {
            "phone": 'root',
            "name": "admin",
            "pwd": "root",
            "re_pwd": "root",
        }
        response = client.post("/signup/", data)'''
    '''
        print(response)

        print('test_demo')'''

    def test_welcome(self):


        print('test_demo2')






# testing Face Detect module

# testing delete module

# testing delete module

# testing Face Detect module