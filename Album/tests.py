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






# testing Face Detect module

# testing delete module

# testing delete module

# testing Face Detect module