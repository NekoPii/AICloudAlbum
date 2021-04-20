from django.urls import path
from . import views

app_name = "Album"  # 为app设置命名空间，方便{% url "Album:..."}区分

urlpatterns = [
    path("",views.index,name="index"),
    path("login/",views.login,name="login"),
    path("signup/",views.signup,name="signup")

]
