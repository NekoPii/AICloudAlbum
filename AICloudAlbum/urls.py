"""AICloudAlbum URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.staticfiles.views import serve
from Album import views

from AICloudAlbum import settings


def return_static(request, path, insecure=True, **kwargs):
    return serve(request, path, insecure, **kwargs)


handler400 = views.error_400
handler403 = views.error_403
handler404 = views.error_404
handler500 = views.error_500

urlpatterns = [
    path('admin/', admin.site.urls, name="admin"),
    path("", include("Album.urls")),
    path("captcha/", include("captcha.urls")),
    re_path(r"^static/(?P<path>.*)$", return_static, name="static"),
    re_path(r"^upload_imgs/(?P<path>.*)$", return_static, name="upload_imgs"),
    re_path(r"^video/(?P<path>.*)$", return_static, name="video"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
