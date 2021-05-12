from django.urls import path
from . import views

app_name = "Album"  # 为app设置命名空间，方便{% url "Album:..."}区分

urlpatterns = [
    path("", views.welcome, name="welcome"),
    path("welcome/", views.welcome, name="welcome"),
    path("index/", views.index, name="index"),
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    path("loginout/", views.loginout, name="loginout"),
    path("ajax_val/", views.ajax_val, name="ajax_val"),  # 验证码Ajax获取
    path("upload_upload_syn/", views.upload_upload_syn, name="upload_upload_syn"),#同步上传
    path("upload_upload_asyn/", views.upload_upload_asyn, name="upload_upload_asyn"),#异步上传
    path("mypics/",views.mypics_index,name="mypics"),
    path("mypics/<str:folder_fake_name>/",views.mypics_folder,name="mypics_folder"),
    path("ajax_pics/", views.ajax_pics, name="ajax_pics"),  # 文件夹图片信息Ajax获取
    path("ajax_folders/", views.ajax_folders, name="ajax_folders"),  # 主页文件夹信息Ajax获取
    path("download/",views.download,name="download"),
    path("download_select/",views.download_select,name="download_select"),
    path("delete_img/",views.delete_img,name="delete_img"),
    path("delete_select_img/",views.delete_select_img,name="delete_select_img"),
    path("delete_folder/",views.delete_folder,name="delete_folder"),
    path("delete_select_folder/",views.delete_select_folder,name="delete_select_folder"),
]

