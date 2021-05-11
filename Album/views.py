import ctypes
import datetime
import json
import os
import re
import platform
import tempfile
import zipfile
from wsgiref.util import FileWrapper

from captcha.models import CaptchaStore
from django.http import Http404, HttpResponse, JsonResponse, FileResponse, StreamingHttpResponse
from django.shortcuts import render, redirect
from django.utils.encoding import escape_uri_path
from django.views.decorators.csrf import csrf_exempt

from AICloudAlbum import settings
from AICloudAlbum.settings import MEDIA_ROOT
from . import models
from .forms import LoginForm, SignupForm
import hashlib
from PIL import Image
from threading import Thread, Lock
import time

# Create your views here.

root_dir = os.path.dirname(os.path.dirname(__file__))
store_dir = os.path.join(root_dir, "upload_imgs")
if not os.path.exists(store_dir):
    os.mkdir(store_dir)


# ==================================== 工具函数

def hash_code(s, salt="neko"):
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()


def getFreeDiskSize():  # MB
    if platform.system() == "Windows":
        free_bytes = ctypes.c_ulonglong(0)
        ctypes.windll.kernel32.GetDiskFreeSpaceExW(ctypes.c_wchar_p(store_dir), None, None, ctypes.pointer(free_bytes))
        return free_bytes.value / 1024 / 1024
    else:
        st = os.statvfs(store_dir)
        return st.f_bavail * st.f_frsize / 1024


# ==================================== views

def index(request):
    pass
    return render(request, "index.html")


def login(request):
    if request.session.get("is_login", None):
        return redirect("/")

    if request.method == "POST":
        res = {"loginIn": None, "message": None, "error_type": None}
        login_form = LoginForm(request.POST)

        if login_form.is_valid():
            phone = login_form.cleaned_data["phone"]
            pwd = login_form.cleaned_data["pwd"]

            try:
                user = models.User.objects.get(phone=phone)
                if user.pwd == hash_code(pwd) + "-" + pwd:
                    request.session["is_login"] = True
                    request.session["phone"] = user.phone
                    request.session["name"] = user.name
                    res["loginIn"] = "true"
                    res["message"] = "Login Successfully 🌸 ~"
                    return HttpResponse(json.dumps(res))
                else:
                    res["loginIn"] = "false"
                    res["message"] = "Incorrect Password!"
                    res["error_type"] = "pwd"
            except:
                res["loginIn"] = "false"
                res["message"] = "User does not exist!"
                res["error_type"] = "phone"
        return HttpResponse(json.dumps(res))
    login_form = LoginForm()
    return render(request, "Album/login.html", locals())


def signup(request):
    if request.session.get("is_login", None):
        return redirect("/")

    if request.method == "POST":
        res = {"signup": None, "message": None, "error_type": None}
        signup_form = SignupForm(request.POST)
        if signup_form.is_valid():
            phone = signup_form.cleaned_data["phone"]
            name = signup_form.cleaned_data["name"]
            pwd = signup_form.cleaned_data["pwd"]
            re_pwd = signup_form.cleaned_data["re_pwd"]

            is_same_phone = models.User.objects.filter(phone=phone)
            if is_same_phone:
                res["signup"] = "false"
                res["error_type"] = "phone"
                res["message"] = "Phone number has been registered !"
                return HttpResponse(json.dumps(res))
            else:
                if pwd != re_pwd:
                    res["signup"] = "false"
                    res["error_type"] = "re_pwd"
                    res["message"] = "Two passwords are Inconsistent !"
                    return HttpResponse(json.dumps(res))

                new_user = models.User(name=name, phone=phone, pwd=hash_code(pwd) + "-" + pwd,
                                       max_capacity=getFreeDiskSize())
                new_user.save()

                new_ini_folder = models.Folder(name="ALL", user_id=new_user.phone,
                                               cnt=0, total_size=0.0,
                                               create_time=datetime.datetime.now(),
                                               modify_time=datetime.datetime.now(),
                                               )
                new_ini_folder.save()
                new_ini_folder.fake_name = hash_code(str(new_ini_folder.pk), salt="neko_folder")
                new_ini_folder.save()

                request.session["is_login"] = True
                request.session["phone"] = new_user.phone
                request.session["name"] = new_user.name

                res["signup"] = "true"
                res["message"] = "Signup Successfully 🌸 ~"
                return HttpResponse(json.dumps(res))

    signup_form = SignupForm()
    return render(request, "Album/signup.html", locals())


def loginout(request):
    request.session.flush()
    return redirect("/")


def ajax_val(request):
    if request.is_ajax():

        cs = CaptchaStore.objects.filter(response=request.GET['response'], hashkey=request.GET['hashkey'])
        if cs:
            json_data = {'status': 1}
        else:
            json_data = {'status': 0}
        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def welcome(request):
    pass
    return render(request, "Album/welcome.html")


def mypics_index(request):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        pics = user.picture_set.all()
        cnt=1
        for p in pics:
            p.size = round(p.size, 2)
            p.path = os.path.join('/upload_imgs/',p.fake_name + '.' + p.type)
            p.id=cnt
            cnt+=1

        count = pics.count()
        capacity_now = round(user.now_capacity,2)

        return render(request, "Album/mypics.html", locals())
    else:
        return redirect("/login/")


def upload_index(request):
    if request.session.get("is_login", None):
        testi = range(20)
        return render(request, "Album/upload.html", locals())
    else:
        return redirect("/login/")


@csrf_exempt
def upload_upload_syn(request):
    if request.session.get("is_login"):
        user_phone = request.session.get("phone")
        all_imgs = request.FILES.getlist("upload_img", None)

        initialPreview = []
        initialPreviewConfig = []

        if all_imgs:
            for now_img in all_imgs:
                img_path = os.path.join(store_dir, now_img.name)

                f = open(img_path, "wb")
                for chunk in now_img.chunks():  # 分块写入
                    f.write(chunk)
                f.close()

                with Image.open(img_path) as img:
                    h, w = img.size[0], img.size[1]

                img_name = now_img.name.rsplit('.', 1)[0]
                img_type = now_img.name.rsplit('.', 1)[1]

                img_type_list = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'pns', 'bmp', 'png', 'tif']

                now_size = os.path.getsize(img_path) / 1024 / 1024

                try:

                    ALLFolder = models.Folder.objects.get(user_id=user_phone, name="ALL")

                    NoneTag = models.Tag.objects.get(tag="None")

                    new_img = models.Picture(name=img_name, type=img_type, upload_time=datetime.datetime.now(),
                                             modify_time=datetime.datetime.now(), size=now_size,
                                             height=h, width=w, is_tag=False, is_face=False, folder_id=ALLFolder.pk,
                                             tag_id=NoneTag.pk, user_id=user_phone)

                    new_img.save()
                    new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
                    new_img.save()

                    try:
                        now_folder_cover = models.FolderCover.objects.get(folder_id=ALLFolder.pk)
                    except:
                        now_folder_cover = models.FolderCover(folder_id=ALLFolder.pk, pic_id=new_img.pk)
                    finally:
                        now_folder_cover.pic_id = new_img.pk
                        now_folder_cover.save()

                    now_user = models.User.objects.get(phone=user_phone)
                    now_user.now_capacity += new_img.size
                    now_user.save()

                    # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                    ALLFolder.cnt += 1
                    ALLFolder.total_size += new_img.size
                    ALLFolder.modify_time = datetime.datetime.now()
                    ALLFolder.save(force_update=True)

                    # print("2:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                    now_img_name = str(new_img.fake_name) + "." + img_type
                    now_img_path = os.path.join(store_dir, now_img_name)

                    url = settings.MEDIA_URL + now_img_name

                    os.rename(img_path, now_img_path)

                except:  # 数据库加入失败，则不保留上传图片
                    os.remove(img_path)
                    return HttpResponse(json.dumps({"status": False}))  # data.response.status=false 表示当前发生传输错误

                '''
                if img_type in img_type_list:
                    initialPreview.append(
                        "<img src='" + url + "' class='file-preview-image' style='max_width:100%;max_height:100%;'>")
                else:
                    initialPreview.append(
                        "<div class='file-preview-other'><span class='file-other-icon'><i class='glyphicon glyphicon-file'></i></span></div>")

                initialPreviewConfig.append([{
                    "caption": now_img.name,
                    "type": img_type,
                    "downloadUrl": url,
                    "url": '/del_img/',  # 预览中的删除按钮的url
                    "size": os.path.getsize(now_img_path),
                    "key": now_img.name,
                }])
                '''

            return HttpResponse(json.dumps(
                {"status": True}
                # 取消回显，异步暂未取消
                # {"initialPreview": initialPreview, "initialPreviewConfig": initialPreviewConfig, "append": True}
            ))
        else:
            return HttpResponse(json.dumps({"status": False}))
    else:
        return redirect("/login/")


mutex_x = Lock()


@csrf_exempt
def upload_upload_asyn(request):
    if request.session.get("is_login"):
        mutex_x.acquire()
        user_phone = request.session.get("phone")
        all_imgs = request.FILES.get("upload_img", None)

        if all_imgs:
            img_path = os.path.join(store_dir, all_imgs.name)

            f = open(img_path, "wb")
            for chunk in all_imgs.chunks():  # 分块写入
                f.write(chunk)
            f.close()

            with Image.open(img_path) as img:
                h, w = img.size[0], img.size[1]

            img_name = all_imgs.name.rsplit('.', 1)[0]
            img_type = all_imgs.name.rsplit('.', 1)[1]

            img_type_list = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'pns', 'bmp', 'png', 'tif']

            now_size = os.path.getsize(img_path) / 1024 / 1024

            try:

                ALLFolder = models.Folder.objects.get(user_id=user_phone, name="ALL")

                NoneTag = models.Tag.objects.get(tag="None")

                new_img = models.Picture(name=img_name, type=img_type, upload_time=datetime.datetime.now(),
                                         modify_time=datetime.datetime.now(), size=now_size,
                                         height=h, width=w, is_tag=False, is_face=False, folder_id=ALLFolder.pk,
                                         tag_id=NoneTag.pk, user_id=user_phone)

                new_img.save()
                new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
                new_img.save()

                try:
                    now_folder_cover = models.FolderCover.objects.get(folder_id=ALLFolder.pk)
                except:
                    now_folder_cover = models.FolderCover(folder_id=ALLFolder.pk, pic_id=new_img.pk)
                finally:
                    now_folder_cover.pic_id = new_img.pk
                    now_folder_cover.save()

                now_user = models.User.objects.get(phone=user_phone)
                now_user.now_capacity += new_img.size
                now_user.save()

                # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                ALLFolder.cnt += 1
                ALLFolder.total_size += new_img.size
                ALLFolder.modify_time = datetime.datetime.now()
                ALLFolder.save(force_update=True)

                # print("2:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                now_img_name = str(new_img.fake_name) + "." + img_type
                now_img_path = os.path.join(store_dir, now_img_name)

                url = settings.MEDIA_URL + now_img_name

                os.rename(img_path, now_img_path)

            except:  # 数据库加入失败，则不保留上传图片
                os.remove(img_path)
                mutex_x.release()
                return HttpResponse(json.dumps({"status": False}))  # data.response.status=false 表示当前发生传输错误

            mutex_x.release()

            '''

            initialPreview = []

            if img_type in img_type_list:
                initialPreview.append(
                    "<img src='" + url + "' class='file-preview-image' style='max_width:100%;max_height:100%;'>")
            else:
                initialPreview.append(
                    "<div class='file-preview-other'><span class='file-other-icon'><i class='glyphicon glyphicon-file'></i></span></div>")

            initialPreviewConfig = [{
                "caption": all_imgs.name,
                "type": img_type,
                "downloadUrl": url,
                "url": '/del_img/',  # 预览中的删除按钮的url
                "size": os.path.getsize(now_img_path),
                "extra": {"doc_uuid": all_imgs_parm},
                "key": all_imgs.name,
            }]
            '''

            return HttpResponse(json.dumps
                (
                # {"initialPreview": initialPreview, "initialPreviewConfig": initialPreviewConfig, "append": True}
                {"status": True})
            )
        else:
            return HttpResponse(json.dumps({"status": False}))
    else:
        return redirect("/login/")


@csrf_exempt
def download(request):
    if request.method == "POST":
        fake_name = request.POST["img_name"]
        try:
            now_pic = models.Picture.objects.get(fake_name=fake_name)
            path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
            with open(path, "rb") as f:
                img = f.read()
            img_name = now_pic.name + "." + now_pic.type
            response = HttpResponse(img)
            response["Content-Type"] = "application/octet-stream"
            response["Content-Disposition"] = "attachment;filename={}".format(escape_uri_path(img_name))
            response["download_status"] = "true"
            return response
        except:
            response = HttpResponse()
            response["download_status"] = "false"
            return response
    return render(request, "Album/upload.html", locals())


@csrf_exempt
def download_select(request):
    if request.method == "POST":
        chunk_size = 8192
        check_list = request.POST.getlist("img_name")
        total_cnt = len(check_list)
        if check_list:
            cnt = 0
            temp = tempfile.TemporaryFile()
            img_zip = zipfile.ZipFile(temp, "w", zipfile.ZIP_DEFLATED)
            for now in check_list:
                try:
                    now_pic = models.Picture.objects.get(fake_name=now)
                    path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                    img_name = now_pic.name + "." + now_pic.type
                    img_zip.write(path, img_name)
                    cnt += 1
                except:
                    continue
            img_zip.close()
            wrapper = FileWrapper(temp, chunk_size)
            size = temp.tell()
            temp.seek(0)
            if cnt > 0:
                response = HttpResponse(wrapper, content_type="application/zip")
                response["Content-Disposition"] = "attachment;filename={}".format(
                    escape_uri_path(time.strftime("%Y%m%d-%H%M%S-") + "AlbumImages.zip"))
                response['Content-Length'] = size
                response["download_status"] = "true"
                response["download_cnt"] = cnt
                response["select_cnt"] = total_cnt
                return response
            else:
                response = HttpResponse()
                response["download_status"] = "false"
                response["download_cnt"] = 0
                response["select_cnt"] = total_cnt
                return response
        else:
            response = HttpResponse()
            response["download_status"] = "false"
            response["download_cnt"] = 0
            response["select_cnt"] = total_cnt
            return response
    return render(request, "Album/upload.html", locals())
