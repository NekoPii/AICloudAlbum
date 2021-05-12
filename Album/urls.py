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
    path("mypics/",views.mypics_index,name="mypics"), #图片主页初始化
    path("ajax_pics/", views.ajax_pics, name="ajax_pics"),  # 主页图片信息Ajax获取
    path("download/",views.download,name="download"),
    path("download_select/",views.download_select,name="download_select"),
]
