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
    path("upload_upload_syn/<str:folder_fake_name>/", views.upload_upload_syn, name="upload_upload_syn"),  # 同步上传
    path("upload_upload_asyn/<str:folder_fake_name>/", views.upload_upload_asyn, name="upload_upload_asyn"),  # 异步上传
    path("mypics/", views.mypics_folder, name="mypics"),
    path("tags/", views.tags, name="tags"),
    path("mypics/<str:folder_fake_name>/", views.mypics_pics, name="mypics_folder"),
    path("ajax_pics/<str:folder_fake_name>/", views.ajax_pics, name="ajax_pics"),  # 文件夹图片信息Ajax获取
    path("ajax_folders/", views.ajax_folders, name="ajax_folders"),  # 主页文件夹信息Ajax获取
    path("download/", views.download, name="download"),
    path("download_select/", views.download_select, name="download_select"),
    path("delete_img/<str:folder_fake_name>/", views.delete_img, name="delete_img"),
    path("delete_select_img/<str:folder_fake_name>/", views.delete_select_img, name="delete_select_img"),
    path("delete_folder/", views.delete_folder, name="delete_folder"),
    path("delete_select_folder/", views.delete_select_folder, name="delete_select_folder"),
    path("add_folder/", views.add_folder, name="add_folder"),
    path("modify_folder/<str:now_folder_name>/", views.modify_folder, name="modify_folder"),
    path("get_tag/<str:folder_fake_name>/", views.getTag, name="getTag"),
    path("search_tag/", views.search_tag, name="searchTag"),  # 导航栏按照标签搜索图片
]
