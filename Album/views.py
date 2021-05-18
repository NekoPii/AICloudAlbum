import ctypes
import datetime
import json
import os
import re
import platform
import tempfile
import zipfile
from concurrent.futures import ThreadPoolExecutor
from wsgiref.util import FileWrapper

from captcha.models import CaptchaStore
from django.db import connections
from django.db.models import Max
from django.http import Http404, HttpResponse, JsonResponse, FileResponse, StreamingHttpResponse
from django.shortcuts import render, redirect
from django.utils.encoding import escape_uri_path
from django.views.decorators.csrf import csrf_exempt

from AI.ImgClass.MyImgClass import ImageClassification
from AICloudAlbum import settings
from AICloudAlbum.settings import MEDIA_ROOT
from . import models
from .forms import LoginForm, SignupForm
import hashlib
from PIL import Image
from threading import Thread, Lock
import time

zeroid = 1
threshold = 1080

# Create your views here.

root_dir = os.path.dirname(os.path.dirname(__file__))
store_dir = os.path.join(root_dir, "upload_imgs")
if not os.path.exists(store_dir):
    os.mkdir(store_dir)

store_compress_dir = os.path.join(store_dir, "compress_imgs")
if not os.path.exists(store_compress_dir):
    os.mkdir(store_compress_dir)


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

                zero_img = models.Picture.objects.get(pk=zeroid)

                new_ini_folder_cover = models.FolderCover(pic_id=zero_img.id, folder_id=new_ini_folder.id)
                new_ini_folder_cover.save()

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


def ajax_pics(request, folder_fake_name):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        now_folder = models.Folder.objects.get(fake_name=folder_fake_name)
        pics = models.Picture.objects.filter(folder_id=now_folder.id)
        json_data = {}
        json_data["pics"] = []
        cnt = 1
        for p in pics:
            p.size = round(p.size, 2)
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                   "height": p.height, "width": p.width, "upload_time": p.upload_time}
            json_data["pics"].append(pic)
            cnt += 1
        count = pics.count()
        json_data["count"] = count
        json_data["status"] = 1

        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def ajax_folders(request):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        folders = models.Folder.objects.filter(user_id=user.phone)
        json_data = {}
        json_data["folders"] = []
        cnt = 1
        for p in folders:
            foldercover = models.FolderCover.objects.get(folder_id=p.id)
            cover_img = models.Picture.objects.get(pk=foldercover.pic_id)
            p.href = "/mypics/" + p.fake_name + "/"
            p.size = round(p.total_size, 2)
            p.path = os.path.join('/upload_imgs/compress_imgs/', cover_img.fake_name + '.' + cover_img.type)
            p.id = cnt
            folder = {"size": p.total_size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                      "href": p.href}
            json_data["folders"].append(folder)
            cnt += 1
        count = folders.count()
        json_data["count"] = count
        json_data["status"] = 1

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
        folders = models.Folder.objects.filter(user_id=user.phone)
        cnt = 1
        for p in folders:
            foldercover = models.FolderCover.objects.get(folder_id=p.id)
            cover_img = models.Picture.objects.get(pk=foldercover.pic_id)
            p.href = "/mypics/" + p.fake_name + "/"
            p.size = round(p.total_size, 2)
            p.path = os.path.join('/upload_imgs/compress_imgs/', cover_img.fake_name + '.' + cover_img.type)
            p.id = cnt
            cnt += 1
            if cnt == 17:
                break
        count = folders.count()
        capacity_now = round(user.now_capacity, 2)

        return render(request, "Album/mypics.html", locals())
    else:
        return redirect("/login/")


def mypics_folder(request, folder_fake_name):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        now_folder = models.Folder.objects.filter(fake_name=folder_fake_name)
        all_tag = models.Tag.objects.all()
        if now_folder:
            pics = models.Picture.objects.filter(user_id=phone, folder_id=now_folder[0].id)
            cnt = 1
            for p in pics:
                p.size = round(p.size, 2)
                p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
                p.id = cnt
                p.nowtag = all_tag.get(id=p.tag_id).tag
                cnt += 1

            count = pics.count()
            capacity_now = round(now_folder[0].total_size, 2)

            now_folder_name = now_folder[0].name
            now_folder_fake_name = now_folder[0].fake_name

            return render(request, "Album/mypics_folder.html", locals())
        else:
            return render(request, "Album/mypics.html", locals())
    else:
        return redirect("/login/")


@csrf_exempt
def upload_upload_syn(request, folder_fake_name):
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

                    nowFolder = models.Folder.objects.get(user_id=user_phone, fake_name=folder_fake_name)

                    NoneTag = models.Tag.objects.get(tag="None")

                    new_img = models.Picture(name=img_name, type=img_type, upload_time=datetime.datetime.now(),
                                             size=now_size, height=h, width=w, is_tag=False, is_face=False,
                                             folder_id=nowFolder.pk, tag_id=NoneTag.pk, user_id=user_phone)

                    new_img.save()
                    new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
                    new_img.save()

                    try:
                        now_folder_cover = models.FolderCover.objects.get(folder_id=nowFolder.pk)
                    except:
                        now_folder_cover = models.FolderCover(folder_id=nowFolder.pk, pic_id=new_img.pk)
                    finally:
                        now_folder_cover.pic_id = new_img.pk
                        now_folder_cover.save()

                    now_user = models.User.objects.get(phone=user_phone)
                    now_user.now_capacity += new_img.size
                    now_user.save()

                    # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                    nowFolder.cnt += 1
                    nowFolder.total_size += new_img.size
                    nowFolder.modify_time = datetime.datetime.now()
                    nowFolder.save(force_update=True)

                    # print("2:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                    now_img_name = str(new_img.fake_name) + "." + img_type
                    now_img_path = os.path.join(store_dir, now_img_name)

                    url = settings.MEDIA_URL + now_img_name

                    os.rename(img_path, now_img_path)

                    with Image.open(now_img_path) as img:
                        h, w = img.size[0], img.size[1]
                        if w >= h:
                            if w <= threshold:
                                img.thumbnail((w, h))
                            else:
                                img.thumbnail((threshold, h / w * threshold))
                        else:
                            if h <= threshold:
                                img.thumbnail((w, h))
                            else:
                                img.thumbnail((w / h * threshold, threshold))
                        compress_img_path = os.path.join(store_compress_dir, now_img_name)
                        img.save(compress_img_path)

                except:  # 数据库加入失败，则不保留上传图片
                    os.remove(img_path)
                    os.remove(now_img_path)
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
def upload_upload_asyn(request, folder_fake_name):
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

                nowFolder = models.Folder.objects.get(user_id=user_phone, fake_name=folder_fake_name)

                NoneTag = models.Tag.objects.get(tag="None")

                new_img = models.Picture(name=img_name, type=img_type, upload_time=datetime.datetime.now(),
                                         size=now_size, height=h, width=w, is_tag=False, is_face=False,
                                         folder_id=nowFolder.pk, tag_id=NoneTag.pk, user_id=user_phone)

                new_img.save()
                new_img.fake_name = hash_code(str(new_img.pk), salt="neko_img")
                new_img.save()

                try:
                    now_folder_cover = models.FolderCover.objects.get(folder_id=nowFolder.pk)
                except:
                    now_folder_cover = models.FolderCover(folder_id=nowFolder.pk, pic_id=new_img.pk)
                finally:
                    now_folder_cover.pic_id = new_img.pk
                    now_folder_cover.save()

                now_user = models.User.objects.get(phone=user_phone)
                now_user.now_capacity += new_img.size
                now_user.save()

                # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                nowFolder.cnt += 1
                nowFolder.total_size += new_img.size
                nowFolder.modify_time = datetime.datetime.now()
                nowFolder.save(force_update=True)

                # print("2:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

                now_img_name = str(new_img.fake_name) + "." + img_type
                now_img_path = os.path.join(store_dir, now_img_name)

                url = settings.MEDIA_URL + now_img_name

                os.rename(img_path, now_img_path)

                with Image.open(now_img_path) as img:
                    h, w = img.size[0], img.size[1]
                    if w >= h:
                        if w <= threshold:
                            img.thumbnail((w, h))
                        else:
                            img.thumbnail((threshold, h / w * threshold))
                    else:
                        if h <= threshold:
                            img.thumbnail((w, h))
                        else:
                            img.thumbnail((w / h * threshold, threshold))
                    compress_img_path = os.path.join(store_compress_dir, now_img_name)
                    img.save(compress_img_path)

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
    if request.session.get("is_login"):
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
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def download_select(request):
    if request.session.get("is_login"):
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
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def delete_img(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            fake_name = request.POST["img_name"]

            res = {"delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            now_choose_folder = models.Folder.objects.get(fake_name=folder_fake_name)
            now_choose_foldercover = models.FolderCover.objects.get(folder_id=now_choose_folder.id)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            flag = False
            try:
                now_pic = models.Picture.objects.get(fake_name=fake_name)
                if now_pic.id == now_choose_foldercover.pic_id:
                    now_choose_foldercover.pic_id = zero_pic.id
                    now_choose_foldercover.save()
                    flag = True
                now_choose_folder.cnt -= 1
                now_choose_folder.total_size -= now_pic.size
                now_choose_folder.save()
                now_user.now_capacity -= now_pic.size
                now_user.save()
                path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)
                now_pic.delete()
                os.remove(path)
                os.remove(compress_path)
                if (flag):
                    try:
                        now_user_max_img_id = models.Picture.objects.filter(user_id=now_user.phone,
                                                                            folder_id=now_choose_folder.id).values(
                            "id").aggregate(Max("id"))
                        if (now_user_max_img_id):
                            now_choose_foldercover.pic_id = now_user_max_img_id["id__max"]
                            now_choose_foldercover.save()
                    except:
                        pass

                res["delete_status"] = "true"
            except:
                res["delete_status"] = "false"

            response = HttpResponse(json.dumps(res))
            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def delete_select_img(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            check_list = request.POST.getlist("img_name")
            total_cnt = len(check_list)

            res = {"select_cnt": total_cnt, "delete_cnt": None, "delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            now_choose_folder = models.Folder.objects.get(fake_name=folder_fake_name)
            now_choose_foldercover = models.FolderCover.objects.get(folder_id=now_choose_folder.id)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            if check_list:
                cnt = 0
                flag = False
                for now in check_list:
                    try:
                        now_pic = models.Picture.objects.get(fake_name=now)
                        if now_pic.id == now_choose_foldercover.pic_id:
                            now_choose_foldercover.pic_id = zero_pic.id
                            now_choose_foldercover.save()
                            flag = True
                        now_choose_folder.cnt -= 1
                        now_choose_folder.total_size -= now_pic.size
                        now_choose_folder.save()
                        now_user.now_capacity -= now_pic.size
                        now_user.save()
                        path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                        compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)
                        now_pic.delete()
                        os.remove(path)
                        os.remove(compress_path)
                        cnt += 1
                    except:
                        continue
                if (flag):
                    try:
                        now_user_max_img_id = models.Picture.objects.filter(user_id=now_user.phone,
                                                                            folder_id=now_choose_folder.id).values(
                            "id").aggregate(Max("id"))
                        if (now_user_max_img_id):
                            now_choose_foldercover.pic_id = now_user_max_img_id["id__max"]
                            now_choose_foldercover.save()
                    except:
                        pass
                res["delete_cnt"] = cnt
                if cnt > 0:
                    res["delete_status"] = "true"
                    response = HttpResponse(json.dumps(res))
                    return response
                else:
                    res["delete_status"] = "false"
                    response = HttpResponse(json.dumps(res))
                    return response
            else:
                response = HttpResponse(json.dumps(res))
                return response
        return mypics_folder(request, folder_fake_name)
    return redirect("/login/")


@csrf_exempt
def delete_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            fake_name = request.POST["folder_name"]

            res = {"delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            now_choose_folder = models.Folder.objects.get(fake_name=fake_name)

            if now_choose_folder.name == "ALL":  # “ALL文件夹”无法删除
                return HttpResponse()

            try:
                models.FolderCover.objects.get(folder_id=now_choose_folder.id).delete()
                now_imgs = models.Picture.objects.filter(folder_id=now_choose_folder.id)
                now_user.now_capacity -= now_choose_folder.total_size
                now_user.save()
                for img in now_imgs:
                    path = os.path.join(store_dir, img.fake_name + "." + img.type)
                    compress_path = os.path.join(store_compress_dir, img.fake_name + "." + img.type)
                    img.delete()
                    os.remove(path)
                    os.remove(compress_path)

                res["delete_status"] = "true"
            except:
                res["delete_status"] = "false"

            response = HttpResponse(json.dumps(res))
            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def delete_select_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            check_list = request.POST.getlist("folder_name")
            total_cnt = len(check_list)

            res = {"select_cnt": total_cnt, "delete_cnt": None, "delete_status": None}

            now_user = models.User.objects.get(phone=phone)

            if check_list:
                cnt = 0
                for now in check_list:
                    try:
                        now_folder = models.Folder.objects.get(fake_name=now)
                        if now_folder.name == "ALL":
                            continue
                        models.FolderCover.objects.get(folder_id=now_folder.id).delete()
                        now_user.now_capacity -= now_folder.total_size
                        now_user.save()
                        now_imgs = models.Picture.objects.filter(folder_id=now_folder.id)
                        for img in now_imgs:
                            path = os.path.join(store_dir, img.fake_name + "." + img.type)
                            compress_path = os.path.join(store_compress_dir, img.fake_name + "." + img.type)
                            img.delete()
                            os.remove(path)
                            os.remove(compress_path)

                        now_folder.delete()
                        cnt += 1
                    except:
                        continue
                res["delete_cnt"] = cnt
                if cnt > 0:
                    res["delete_status"] = "true"
                    response = HttpResponse(json.dumps(res))
                    return response
                else:
                    res["delete_status"] = "false"
                    response = HttpResponse(json.dumps(res))
                    return response
            else:
                response = HttpResponse(json.dumps(res))
                return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def add_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]
            folder_name = request.POST["folder_name"]

            res = {"add_status": None, "is_same_name": None}

            now_user = models.User.objects.get(phone=phone)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            is_same_foldername = models.Folder.objects.filter(name=folder_name)

            if is_same_foldername:
                res["add_status"] = "false"
                res["is_same_name"] = "true"

            else:
                try:

                    new_folder = models.Folder(name=folder_name, user_id=now_user.phone,
                                               cnt=0, total_size=0.0,
                                               create_time=datetime.datetime.now(),
                                               modify_time=datetime.datetime.now(),
                                               )
                    new_folder.save()
                    new_folder.fake_name = hash_code(str(new_folder.pk), salt="neko_folder")
                    new_folder.save()

                    new_foldercover = models.FolderCover(folder_id=new_folder.id, pic_id=zero_pic.id)
                    new_foldercover.save()

                    res["add_status"] = "true"
                    res["is_same_name"] = "false"
                except:
                    res["add_status"] = "false"
                    res["is_same_name"] = "false"

            response = HttpResponse(json.dumps(res))
            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


@csrf_exempt
def modify_folder(request, now_folder_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]
            modify_folder_name = request.POST["input_folder_name"]

            res = {"mod_status": None, "is_same_name": None}

            now_user = models.User.objects.get(phone=phone)
            now_folder = models.Folder.objects.get(user_id=phone, name=now_folder_name)
            is_same_foldername = models.Folder.objects.filter(name=modify_folder_name)

            if is_same_foldername:
                res["mod_status"] = "false"
                res["is_same_name"] = "true"

            else:
                try:

                    now_folder.name = modify_folder_name
                    now_folder.modify_time = datetime.datetime.now()
                    now_folder.save()

                    res["mod_status"] = "true"
                    res["is_same_name"] = "false"
                except:
                    res["mod_status"] = "false"
                    res["is_same_name"] = "false"

            response = HttpResponse(json.dumps(res))
            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def runImgClass(p, all_tag, now_path):
    res = ImageClassification(now_path)
    print(res)
    p.tag_id = all_tag.get(tag=res[0]).id
    p.is_tag = 1
    p.save()
    return


@csrf_exempt
def getTag(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            NoneTag = models.Tag.objects.get(tag="None")

            now_user = models.User.objects.get(phone=phone)

            now_folder = models.Folder.objects.get(fake_name=folder_fake_name)

            now_pics = models.Picture.objects.filter(user_id=now_user.phone, folder_id=now_folder.id, tag_id=NoneTag.id)

            all_tag = models.Tag.objects.all()

            res = {"select_cnt": len(now_pics), "getTag_cnt": None, "getTag_status": None}

            cnt = 0

            try:

                pool = ThreadPoolExecutor(5)

                for p in now_pics:
                    now_path = os.path.join(store_dir, p.fake_name + "." + p.type)
                    if not os.path.exists(now_path):
                        raise Exception("Path not exist")
                    pool.submit(runImgClass, p, all_tag, now_path)
                    cnt += 1

                pool.shutdown(wait=True)

                res["getTag_status"] = "true"

            except:
                res["getTag_status"] = "false"

            res["getTag_cnt"] = cnt

            for conn in connections.all():
                conn.close_if_unusable_or_obsolete()

            response = HttpResponse(json.dumps(res))

            return response

        return render(request, "Album/mypics_folder.html", locals())
    return redirect("/login/")
