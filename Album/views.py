import ctypes
import datetime
import json
import os
import re
import platform
import tempfile
import threading
import zipfile
from concurrent.futures import ThreadPoolExecutor
from wsgiref.util import FileWrapper

import requests
from captcha.models import CaptchaStore
from django.db import connections
from django.db.models import Max
from django.http import Http404, HttpResponse, JsonResponse, FileResponse, StreamingHttpResponse
from django.shortcuts import render, redirect
from django.utils.encoding import escape_uri_path
from django.views.decorators.csrf import csrf_exempt

from AI.ImgClass_new.typeSever import typeSever
from AI.ImgClass.MyImgClass import ImageClassification
from AI.FaceDetect.FaceDetect import FaceRecogPrepared
from AICloudAlbum import settings
from AI.ImgVideo.ImgToVideo import GenVideo
from . import models
from .forms import LoginForm, SignupForm
import hashlib
from PIL import Image
from threading import Thread, Lock
import time

type_sever = typeSever()
page_num_folder = 5
page_num_img = 10
page_num_face = 15
zeroid = 1
threshold = 1080
eps = 1e-5

max_capacity = 5 * 1024  # MB

# Create your views here.

root_dir = os.path.dirname(os.path.dirname(__file__))
store_dir = os.path.join(root_dir, "upload_imgs")
video_dir = os.path.join(root_dir, "video")

if not os.path.exists(store_dir):
    os.mkdir(store_dir)

if not os.path.exists(video_dir):
    os.mkdir(video_dir)

store_compress_dir = os.path.join(store_dir, "compress_imgs")
if not os.path.exists(store_compress_dir):
    os.mkdir(store_compress_dir)

ExistingFace_dir = os.path.join(store_dir, "ExistingFace")
if not os.path.exists(ExistingFace_dir):
    os.mkdir(ExistingFace_dir)

ExistingCode_dir = os.path.join(store_dir, "ExistingFaceCode")
if not os.path.exists(ExistingCode_dir):
    os.mkdir(ExistingCode_dir)


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


def getAllTF(phone, status=True):
    getAllFaceDetect(phone)
    getAllTag(phone)


def getAllTag(phone, status=True):
    NoneTag = models.Tag.objects.get(tag="None")
    now_user = models.User.objects.get(phone=phone)
    now_pics = models.Picture.objects.filter(user_id=now_user.phone, tag_id=NoneTag.id)
    all_tag = models.Tag.objects.all()
    cnt = 0
    for index, p in enumerate(now_pics):
        try:
            now_path = os.path.join(store_dir, p.fake_name + "." + p.type)
            if not os.path.exists(now_path):
                raise Exception("Path not exist")
            if p.is_tag:
                continue
            else:
                global type_sever
                now_res = type_sever.pd(now_path)
                p.tag_id = all_tag.get(tag=now_res[0]).id
                p.is_tag = 1
                p.save()
                cnt += 1
        except:
            pass
    print("{}pics have been tagged".format(cnt - 1))


def getAllFaceDetect(phone="13022941500", status=True):
    now_user = models.User.objects.get(phone=phone)
    now_pics = models.Picture.objects.filter(user_id=now_user.phone)
    cnt = 0
    for img_index, pic in enumerate(now_pics):
        if pic.is_detect_face and pic.is_face:
            continue
        elif pic.is_detect_face and not pic.is_face:
            continue
        else:
            try:
                pic_path = os.path.join(store_dir, pic.fake_name + "." + pic.type)
                isFace, face_locations, recognized_faces, saved_face_img_name = FaceRecogPrepared(pic_path,
                                                                                                  now_user.phone)
                if isFace:
                    if recognized_faces:
                        index = 0
                        already_add = set()
                        for now_recognized_face in recognized_faces:
                            if now_recognized_face == "Not matched":
                                newFace = models.Face(face_cover=saved_face_img_name[index],
                                                      cnt=1, user_id=now_user.phone)
                                newFace.save()
                                newFacePic = models.FacePic(face_id=newFace.id, pic_id=pic.id)
                                newFacePic.save()
                            else:
                                if now_recognized_face in already_add:
                                    continue  # 同一张图片同一个人脸一次只加一次
                                else:
                                    already_add.add(now_recognized_face)
                                    nowFace = models.Face.objects.get(face_cover=now_recognized_face,
                                                                      user_id=now_user.phone)
                                    nowFace.cnt += 1
                                    nowFace.save()
                                    newFacePic = models.FacePic(face_id=nowFace.id, pic_id=pic.id)
                                    newFacePic.save()
                            index += 1
                    pic.is_face = 1
                    pic.save()
                    cnt += 1
                pic.is_detect_face = 1
                pic.save()
            except:
                pass

    print("{}pics have been searched face".format(cnt))


# ==================================== views
def index(request):
    return redirect("/welcome/")


def login(request):
    global test_count
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
                    request.session.set_expiry(0)
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

                fake_id = hash_code(str(phone), salt="user")

                new_user = models.User(name=name, phone=phone, pwd=hash_code(pwd) + "-" + pwd,
                                       max_capacity=max_capacity, fake_id=fake_id)
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
                request.session.set_expiry(0)

                res["signup"] = "true"
                res["message"] = "Signup Successfully 🌸 ~"
                return HttpResponse(json.dumps(res))

    signup_form = SignupForm()
    return render(request, "Album/signup.html", locals())


def loginout(request):
    phone = request.session["phone"]
    thread_getAllTF = threading.Thread(target=getAllTF, args=(phone, True), daemon=True)
    thread_getAllTF.start()
    print("Start get Tag/Face")
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


def ajax_search(request, search_content):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        all_tag = models.Tag.objects.all()
        json_data = {}
        json_data["pics"] = []

        if search_content:
            search_pics_byname = models.Picture.objects.filter(user_id=user.phone, name__contains=search_content)
            all_search_imgs = search_pics_byname
            search_bytag = all_tag.filter(tag__contains=search_content)
            if search_bytag:
                for now_tag in search_bytag:
                    search_pics_bytag = models.Picture.objects.filter(user_id=user.phone, tag_id=now_tag.id)
                    all_search_imgs = all_search_imgs.union(search_pics_bytag)
            if all_search_imgs:
                cnt = 1
                for p in all_search_imgs:
                    p.size = format(p.size, '.2f')
                    p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
                    p.id = cnt
                    pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                           "height": p.height, "width": p.width, "upload_time": p.upload_time.strftime('%Y-%m-%d'),
                           "tag": all_tag.get(id=p.tag_id).tag}
                    json_data["pics"].append(pic)
                    cnt += 1
                count = all_search_imgs.count()
                json_data["count"] = count
                json_data["status"] = 1
            else:
                json_data["count"] = 0
                json_data["status"] = 1

        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def ajax_faces(request):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        faces = models.Face.objects.filter(user_id=user.phone)
        json_data = {}
        json_data["faces"] = []
        cnt = 0
        for f in faces:
            if f.cnt > 0:
                cnt += 1
                now_cover_fakename = f.face_cover.split(".")[0]
                now_cover_type = f.face_cover.split(".")[1]
                f.href = "/face/" + now_cover_fakename + "-" + now_cover_type + "/"
                f.cover_path = "/upload_imgs/ExistingFace/" + user.phone + "/" + f.face_cover
                f.id = cnt
                f.fake_name = now_cover_fakename
                F = {"id": f.id, "href": f.href, "path": f.cover_path, "fake_name": f.fake_name}
                json_data["faces"].append(F)

        json_data["count"] = cnt
        json_data["status"] = 1

        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def ajax_faces_detail(request, face_cover_fake_name):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        all_tag = models.Tag.objects.all()
        now_Face = models.Face.objects.filter(user_id=user.phone, face_cover=face_cover_fake_name + ".jpg")
        now_FacePic = models.FacePic.objects.filter(face_id=now_Face[0].id)
        json_data = {}
        json_data["faces_pics"] = []
        cnt = 1
        for facepic in now_FacePic:
            p = models.Picture.objects.get(user_id=user.phone, id=facepic.pic_id)
            p.size = format(p.size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                   "height": p.height, "width": p.width, "upload_time": p.upload_time.strftime('%Y-%m-%d'),
                   "tag": all_tag.get(id=p.tag_id).tag}
            json_data["faces_pics"].append(pic)
            cnt += 1

        json_data["count"] = cnt - 1
        json_data["status"] = 1
        return JsonResponse(json_data)

    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def ajax_pics_tag(request, tag):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        tag_id = models.Tag.objects.get(tag=tag).id
        pics = models.Picture.objects.filter(user_id=user.phone, tag=tag_id)
        all_tag = models.Tag.objects.all()
        json_data = {}
        json_data["pics"] = []
        cnt = 1
        for p in pics:
            p.size = format(p.size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                   "height": p.height, "width": p.width, "upload_time": p.upload_time.strftime('%Y-%m-%d'),
                   "tag": all_tag.get(id=p.tag_id).tag}
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


def ajax_pics(request, folder_fake_name):
    if request.is_ajax():
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        now_folder = models.Folder.objects.get(user_id=user.phone, fake_name=folder_fake_name)
        pics = models.Picture.objects.filter(folder_id=now_folder.id)
        all_tag = models.Tag.objects.all()
        json_data = {}
        json_data["pics"] = []
        cnt = 1
        for p in pics:
            p.size = format(p.size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                   "height": p.height, "width": p.width, "upload_time": p.upload_time.strftime('%Y-%m-%d'),
                   "tag": all_tag.get(id=p.tag_id).tag}
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
        all_tag = models.Tag.objects.all()
        folders = models.Folder.objects.filter(user_id=user.phone).exclude(name="ALL")
        pictures = models.Picture.objects.filter(user_id=user.phone)
        json_data = {}
        json_data["folders"] = []
        json_data["pictures"] = []
        cnt = 1
        for p in folders:
            foldercover = models.FolderCover.objects.get(folder_id=p.id)
            cover_img = models.Picture.objects.get(pk=foldercover.pic_id)
            p.href = "/mypics/" + p.fake_name + "/"
            p.size = format(p.total_size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', cover_img.fake_name + '.' + cover_img.type)
            p.id = cnt
            folder = {"size": p.total_size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                      "href": p.href}
            json_data["folders"].append(folder)
            cnt += 1

        cnt = 1
        for p in pictures:
            p.size = format(p.size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            pic = {"size": p.size, "path": p.path, "id": p.id, "name": p.name, "fake_name": p.fake_name,
                   "height": p.height, "width": p.width, "upload_time": p.upload_time.strftime('%Y-%m-%d'),
                   "tag": all_tag.get(id=p.tag_id).tag}
            json_data["pictures"].append(pic)
            cnt += 1

        folder_count = folders.count()
        img_count = pictures.count()
        json_data["folder_count"] = folder_count
        json_data["img_count"] = img_count
        json_data["status"] = 1

        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status': 0}
        return JsonResponse(json_data)


def welcome(request):
    pass
    return render(request, "Album/welcome.html")


def mypics_folder(request):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        all_tag = models.Tag.objects.all()
        user = models.User.objects.get(phone=phone)
        folders = models.Folder.objects.filter(user_id=user.phone).exclude(name="ALL")
        ALL_folder = models.Folder.objects.get(user_id=user.phone, name="ALL")
        ALL_folderimgs = models.Picture.objects.filter(user_id=user.phone)
        Folders = []
        ALL_imgs = []
        cnt = 1
        for p in folders:
            foldercover = models.FolderCover.objects.get(folder_id=p.id)
            cover_img = models.Picture.objects.get(pk=foldercover.pic_id)

            p.href = "/mypics/" + p.fake_name + "/"
            p.size = format(p.total_size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', cover_img.fake_name + '.' + cover_img.type)
            p.id = cnt
            Folders.append(p)
            cnt += 1
            if cnt > page_num_folder:
                break

        cnt = 1
        for img in ALL_folderimgs:
            img.size = format(img.size, '.2f')
            img.path = os.path.join('/upload_imgs/compress_imgs/', img.fake_name + '.' + img.type)
            img.id = cnt
            img.upload_time = img.upload_time.strftime('%Y-%m-%d')
            img.nowtag = all_tag.get(id=img.tag_id).tag
            ALL_imgs.append(img)
            cnt += 1
            if cnt > page_num_img:
                break

        count = folders.count()
        capacity_now = format(user.now_capacity, '.2f')
        ALL_folderfakename = ALL_folder.fake_name
        if not ALL_imgs:
            ALL_imgs = None
        if not Folders:
            Folders = None

        return render(request, "Album/mypics.html", locals())
    else:
        return redirect("/login/")


def mypics_pics(request, folder_fake_name):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        now_folder = models.Folder.objects.filter(user_id=user.phone, fake_name=folder_fake_name)
        all_tag = models.Tag.objects.all()
        if now_folder:
            if now_folder[0].name == "ALL":
                pics = models.Picture.objects.filter(user_id=phone)
            else:
                pics = models.Picture.objects.filter(user_id=phone, folder_id=now_folder[0].id)
            cnt = 1
            Pics = []
            for p in pics:
                p.size = format(p.size, '.2f')
                p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
                p.id = cnt
                p.upload_time = p.upload_time.strftime('%Y-%m-%d')
                p.nowtag = all_tag.get(id=p.tag_id).tag
                cnt += 1
                Pics.append(p)
                if cnt > page_num_img:
                    break
            count = pics.count()
            capacity_now = format(now_folder[0].total_size, '.2f')

            now_folder_name = now_folder[0].name
            now_folder_fake_name = now_folder[0].fake_name

            if not Pics:
                Pics = None

            return render(request, "Album/mypics_folder.html", locals())
        else:
            return error_404(request, "404")
    else:
        return redirect("/login/")


def video(request):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        fake_id = user.fake_id
        video_src = None
        video_name = None
        for now_video_name in os.listdir(video_dir):
            if fake_id in now_video_name and now_video_name.endswith(".mp4"):
                video_src = now_video_name
                video_name = now_video_name.rsplit("-", 1)[0] + " Eye-catching Video"
                break
        return render(request, "Album/video.html", locals())
    return redirect("/login/")


def search(request):
    if request.session.get("is_login"):
        phone = request.session["phone"]
        try:
            user = models.User.objects.get(phone=phone)
        except:
            request.session.flush()
            return redirect("/login/")

        all_tag = models.Tag.objects.all()
        ALL_search = []
        try:
            search_content = request.GET["content"]
            if search_content:
                search_pics_byname = models.Picture.objects.filter(user_id=user.phone, name__contains=search_content)
                all_search_imgs = search_pics_byname
                search_bytag = all_tag.filter(tag__contains=search_content)
                if search_bytag:
                    for now_tag in search_bytag:
                        search_pics_bytag = models.Picture.objects.filter(user_id=user.phone, tag_id=now_tag.id)
                        all_search_imgs = all_search_imgs.union(search_pics_bytag)
                if all_search_imgs:
                    for index, now_img in enumerate(all_search_imgs):
                        if index >= page_num_img:
                            break
                        now_img.size = format(now_img.size, '.2f')
                        now_img.path = os.path.join('/upload_imgs/compress_imgs/',
                                                    now_img.fake_name + '.' + now_img.type)
                        now_img.id = index + 1
                        now_img.upload_time = now_img.upload_time.strftime('%Y-%m-%d')
                        now_img.nowtag = all_tag.get(id=now_img.tag_id).tag
                        ALL_search.append(now_img)
        except:
            pass
        if not all_search_imgs:
            count = 0
        else:
            count = len(all_search_imgs)
        capacity_now = format(user.now_capacity, '.2f')
        if not ALL_search:
            ALL_search = None

        return render(request, "Album/search.html", locals())
    return redirect("/login/")


def tags(request):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        all_tag = models.Tag.objects.all()
        pic = models.Picture.objects.filter(user_id=phone)
        ALL_tag_message = []
        Tags = []
        path = os.path.join(os.path.dirname(__file__), "static/txt/tags.txt")
        f0 = open(path, 'r')
        while True:
            str1 = f0.readline()
            if not str1:
                break
            Tags.append(str1[:-1])
        for tag in Tags:
            pic_tag_id = all_tag.get(tag=tag).id
            tag_message = {}
            tag_message["img_path"] = os.path.join('/static/image/tags/', tag + ".jpg")
            tag_message["href"] = "/tags/" + tag + "/"
            tag_message["tag_name_h"] = tag.upper()
            tag_message["tag_name_t"] = tag.title()
            ALL_tag_message.append(tag_message)

        return render(request, "Album/tags.html", locals())
    else:
        return redirect("/login/")


def tags_pics(request, tag):
    if request.session.get("is_login"):
        tag_t = tag.title()
        name = request.session['name']
        phone = request.session['phone']
        all_tag = models.Tag.objects.all()
        user = models.User.objects.get(phone=phone)
        tag_id = models.Tag.objects.get(tag=tag).id
        pics = models.Picture.objects.filter(user_id=phone, tag=tag_id)

        cnt = 1
        Pics = []
        for p in pics:
            p.size = format(p.size, '.2f')
            p.path = os.path.join('/upload_imgs/compress_imgs/', p.fake_name + '.' + p.type)
            p.id = cnt
            p.upload_time = p.upload_time.strftime('%Y-%m-%d')
            p.nowtag = all_tag.get(id=p.tag_id).tag
            cnt += 1
            Pics.append(p)
            if cnt > page_num_img:
                break
        count = pics.count()
        is_null = False
        if count == 0:
            is_null = True
        capacity_now = format(user.now_capacity, '.2f')
        return render(request, "Album/mypic_tag.html", locals())

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
            now_user = models.User.objects.get(phone=user_phone)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_folder_cover = models.FolderCover.objects.get(folder_id=ALL_folder.pk)

            for now_img in all_imgs:
                img_path = os.path.join(store_dir, now_img.name)

                f = open(img_path, "wb")
                for chunk in now_img.chunks():  # 分块写入
                    f.write(chunk)
                f.close()

                if now_user.now_capacity + os.path.getsize(img_path) / 1024 / 1024 > now_user.max_capacity:
                    os.remove(img_path)
                    return HttpResponse(json.dumps({"status": False}))

                with Image.open(img_path) as img:
                    h, w = img.size[0], img.size[1]

                img_name = now_img.name.rsplit('.', 1)[0]
                img_type = now_img.name.rsplit('.', 1)[1]

                img_type_list = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'pns', 'bmp', 'png', 'tif']

                now_size = os.path.getsize(img_path) / 1024 / 1024

                try:

                    nowFolder = models.Folder.objects.get(user_id=now_user.phone, fake_name=folder_fake_name)

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

                    nowFolder.cnt += 1
                    nowFolder.total_size += new_img.size
                    nowFolder.modify_time = datetime.datetime.now()
                    nowFolder.save()

                    now_user.now_capacity = nowFolder.total_size
                    now_user.save()

                    if nowFolder.id != ALL_folder.id:
                        ALL_folder_cover.pic_id = new_img.pk
                        ALL_folder_cover.save()

                        ALL_folder.cnt += 1
                        ALL_folder.total_size += new_img.size
                        ALL_folder.modify_time = datetime.datetime.now()
                        ALL_folder.save()

                        now_user.now_capacity = ALL_folder.total_size
                        now_user.save()

                    # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

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
                    if os.path.exists(img_path):
                        os.remove(img_path)
                    if os.path.exists(now_img_path):
                        os.remove(now_img_path)
                    if os.path.exists(compress_img_path):
                        os.remove(compress_img_path)

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
            now_user = models.User.objects.get(phone=user_phone)
            img_path = os.path.join(store_dir, all_imgs.name)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_folder_cover = models.FolderCover.objects.get(folder_id=ALL_folder.pk)

            f = open(img_path, "wb")
            for chunk in all_imgs.chunks():  # 分块写入
                f.write(chunk)
            f.close()

            if now_user.now_capacity + os.path.getsize(img_path) / 1024 / 1024 > now_user.max_capacity:
                os.remove(img_path)
                mutex_x.release()
                return HttpResponse(json.dumps({"status": False}))

            with Image.open(img_path) as img:
                h, w = img.size[0], img.size[1]

            img_name = all_imgs.name.rsplit('.', 1)[0]
            img_type = all_imgs.name.rsplit('.', 1)[1]

            img_type_list = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'pns', 'bmp', 'png', 'tif']

            now_size = os.path.getsize(img_path) / 1024 / 1024

            try:

                nowFolder = models.Folder.objects.get(user_id=now_user.phone, fake_name=folder_fake_name)

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

                nowFolder.cnt += 1
                nowFolder.total_size += new_img.size
                nowFolder.modify_time = datetime.datetime.now()
                nowFolder.save()

                now_user.now_capacity = nowFolder.total_size
                now_user.save()

                if nowFolder.id != ALL_folder.id:
                    ALL_folder_cover.pic_id = new_img.pk
                    ALL_folder_cover.save()

                    ALL_folder.cnt += 1
                    ALL_folder.total_size += new_img.size
                    ALL_folder.modify_time = datetime.datetime.now()
                    ALL_folder.save()

                    now_user.now_capacity = ALL_folder.total_size
                    now_user.save()

                # print("1:" + str(ALLFolder.cnt) + str(datetime.datetime.now()))

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
                if os.path.exists(img_path):
                    os.remove(img_path)
                if os.path.exists(now_img_path):
                    os.remove(now_img_path)
                if os.path.exists(compress_img_path):
                    os.remove(compress_img_path)
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
                for index, now in enumerate(check_list):
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


def delete_img(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]

            fake_name = request.POST["img_name"]

            res = {"delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            now_pic = models.Picture.objects.get(fake_name=fake_name)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_foldercover = models.FolderCover.objects.get(folder_id=ALL_folder.id)
            pic_folder = models.Folder.objects.get(user_id=now_user.phone, pk=now_pic.folder_id)
            pic_foldercover = models.FolderCover.objects.get(folder_id=pic_folder.pk)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            try:
                if pic_folder.pk == ALL_folder.pk:  # 只属于ALL_Folder里面的图片
                    flag = False
                    if now_pic.id == pic_foldercover.pic_id:
                        pic_foldercover.pic_id = zero_pic.id
                        pic_foldercover.save()
                        flag = True

                    pic_folder.cnt -= 1
                    pic_folder.total_size -= now_pic.size
                    pic_folder.save()

                    now_user.now_capacity = pic_folder.total_size
                    now_user.save()

                    path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                    compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)

                    facepic = models.FacePic.objects.filter(pic_id=now_pic.id)
                    if facepic:
                        for now_facepic in facepic:
                            now_face = models.Face.objects.filter(id=now_facepic.face_id)
                            if now_face:
                                now_face[0].cnt -= 1
                                now_face[0].save()
                            now_facepic.delete()

                    now_pic.delete()
                    os.remove(path)
                    os.remove(compress_path)
                    if (flag):
                        try:
                            now_user_max_allimg_id = models.Picture.objects.filter(user_id=now_user.phone).values(
                                "id").aggregate(Max("id"))
                            if (now_user_max_allimg_id):
                                pic_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                                pic_foldercover.save()
                        except:
                            pass
                else:  # 其他文件夹里的图片
                    flag_all = False
                    flag_other = False

                    if now_pic.id == pic_foldercover.pic_id:
                        pic_foldercover.pic_id = zero_pic.id
                        pic_foldercover.save()
                        flag_other = True
                    if now_pic.id == ALL_foldercover.pic_id:
                        ALL_foldercover.pic_id = zero_pic.id
                        ALL_foldercover.save()
                        flag_all = True

                    pic_folder.cnt -= 1
                    pic_folder.total_size -= now_pic.size
                    pic_folder.save()

                    ALL_folder.cnt -= 1
                    ALL_folder.total_size -= now_pic.size
                    ALL_folder.save()

                    now_user.now_capacity = ALL_folder.total_size
                    now_user.save()

                    path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                    compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)

                    facepic = models.FacePic.objects.filter(pic_id=now_pic.id)
                    if facepic:
                        for now_facepic in facepic:
                            now_face = models.Face.objects.filter(id=now_facepic.face_id)
                            if now_face:
                                now_face[0].cnt -= 1
                                now_face[0].save()
                            now_facepic.delete()

                    now_pic.delete()
                    os.remove(path)
                    os.remove(compress_path)

                    if (flag_all):
                        try:
                            now_user_max_allimg_id = models.Picture.objects.filter(user_id=now_user.phone).values(
                                "id").aggregate(Max("id"))
                            if (now_user_max_allimg_id):
                                ALL_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                                ALL_foldercover.save()
                        except:
                            pass

                    if (flag_other):
                        try:
                            now_user_max_img_id = models.Picture.objects.filter(user_id=now_user.phone,
                                                                                folder_id=pic_folder.id).values(
                                "id").aggregate(Max("id"))
                            if (now_user_max_img_id):
                                pic_foldercover.pic_id = now_user_max_img_id["id__max"]
                                pic_foldercover.save()
                        except:
                            pass

                res["delete_status"] = "true"
            except:
                res["delete_status"] = "false"
            response = HttpResponse(json.dumps(res))
            return response
        return mypics_pics(request, folder_fake_name)
    return redirect("/login/")


def delete_select_img(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]

            check_list = request.POST.getlist("img_name")
            total_cnt = len(check_list)

            res = {"select_cnt": total_cnt, "delete_cnt": None, "delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_foldercover = models.FolderCover.objects.get(folder_id=ALL_folder.id)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            if check_list:
                cnt = 0
                for index, now in enumerate(check_list):
                    try:
                        now_pic = models.Picture.objects.get(fake_name=now)
                        pic_folder = models.Folder.objects.get(pk=now_pic.folder_id)
                        pic_foldercover = models.FolderCover.objects.get(folder_id=pic_folder.pk)

                        if pic_folder.pk == ALL_folder.pk:  # 只属于ALL_Folder里面的图片
                            flag = False
                            if now_pic.id == pic_foldercover.pic_id:
                                pic_foldercover.pic_id = zero_pic.id
                                pic_foldercover.save()
                                flag = True

                            pic_folder.cnt -= 1
                            pic_folder.total_size -= now_pic.size
                            pic_folder.save()

                            now_user.now_capacity = pic_folder.total_size
                            now_user.save()

                            path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                            compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)

                            facepic = models.FacePic.objects.filter(pic_id=now_pic.id)
                            if facepic:
                                for now_facepic in facepic:
                                    now_face = models.Face.objects.filter(id=now_facepic.face_id)
                                    if now_face:
                                        now_face[0].cnt -= 1
                                        now_face[0].save()
                                    now_facepic.delete()

                            now_pic.delete()
                            os.remove(path)
                            os.remove(compress_path)
                            if (flag):
                                try:
                                    now_user_max_allimg_id = models.Picture.objects.filter(
                                        user_id=now_user.phone).values(
                                        "id").aggregate(Max("id"))
                                    if (now_user_max_allimg_id):
                                        pic_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                                        pic_foldercover.save()
                                except:
                                    pass
                        else:  # 其他文件夹里的图片
                            flag_all = False
                            flag_other = False

                            if now_pic.id == pic_foldercover.pic_id:  # now_choose_foldercover!=ALL_foldercover
                                pic_foldercover.pic_id = zero_pic.id
                                pic_foldercover.save()
                                flag_other = True
                            if now_pic.id == ALL_foldercover.pic_id:
                                ALL_foldercover.pic_id = zero_pic.id
                                ALL_foldercover.save()
                                flag_all = True

                            pic_folder.cnt -= 1
                            pic_folder.total_size -= now_pic.size
                            pic_folder.save()

                            ALL_folder.cnt -= 1
                            ALL_folder.total_size -= now_pic.size
                            ALL_folder.save()

                            now_user.now_capacity = ALL_folder.total_size
                            now_user.save()

                            path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                            compress_path = os.path.join(store_compress_dir, now_pic.fake_name + "." + now_pic.type)

                            facepic = models.FacePic.objects.filter(pic_id=now_pic.id)
                            if facepic:
                                for now_facepic in facepic:
                                    now_face = models.Face.objects.filter(id=now_facepic.face_id)
                                    if now_face:
                                        now_face[0].cnt -= 1
                                        now_face[0].save()
                                    now_facepic.delete()

                            now_pic.delete()
                            os.remove(path)
                            os.remove(compress_path)

                            if (flag_all):
                                try:
                                    now_user_max_allimg_id = models.Picture.objects.filter(
                                        user_id=now_user.phone).values(
                                        "id").aggregate(Max("id"))
                                    if (now_user_max_allimg_id):
                                        ALL_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                                        ALL_foldercover.save()
                                except:
                                    pass

                            if (flag_other):
                                try:
                                    now_user_max_img_id = models.Picture.objects.filter(user_id=now_user.phone,
                                                                                        folder_id=pic_folder.id).values(
                                        "id").aggregate(Max("id"))
                                    if (now_user_max_img_id):
                                        pic_foldercover.pic_id = now_user_max_img_id["id__max"]
                                        pic_foldercover.save()
                                except:
                                    pass

                        cnt += 1
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
        return mypics_pics(request, folder_fake_name)
    return redirect("/login/")


def delete_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            fake_name = request.POST["folder_name"]

            res = {"delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            now_choose_folder = models.Folder.objects.get(user_id=now_user.phone, fake_name=fake_name)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_foldercover = models.FolderCover.objects.get(folder_id=ALL_folder.id)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            if now_choose_folder.id == ALL_folder.id:  # “ALL文件夹”无法删除
                return HttpResponse()

            models.FolderCover.objects.get(folder_id=now_choose_folder.id).delete()
            now_imgs = models.Picture.objects.filter(folder_id=now_choose_folder.id)

            ALL_folder.total_size -= now_choose_folder.total_size
            ALL_folder.cnt -= now_choose_folder.cnt
            ALL_folder.modify_time = datetime.datetime.now()
            ALL_folder.save()

            now_user.now_capacity = ALL_folder.total_size
            now_user.save()

            for img in now_imgs:
                path = os.path.join(store_dir, img.fake_name + "." + img.type)
                compress_path = os.path.join(store_compress_dir, img.fake_name + "." + img.type)

                facepic = models.FacePic.objects.filter(pic_id=img.id)
                if facepic:
                    for now_facepic in facepic:
                        now_face = models.Face.objects.filter(id=now_facepic.face_id)
                        if now_face:
                            now_face[0].cnt -= 1
                            now_face[0].save()
                        now_facepic.delete()

                img.delete()
                try:
                    os.remove(path)
                    os.remove(compress_path)

                except:
                    pass

            now_user_max_allimg_id = models.Picture.objects.filter(
                user_id=now_user.phone).values(
                "id").aggregate(Max("id"))
            if (now_user_max_allimg_id["id__max"]):
                ALL_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                ALL_foldercover.save()
            else:
                ALL_foldercover.pic_id = zero_pic.id
                ALL_foldercover.save()

            res["delete_status"] = "true"
            response = HttpResponse(json.dumps(res))
            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def delete_select_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]

            check_list = request.POST.getlist("folder_name")
            total_cnt = len(check_list)

            res = {"select_cnt": total_cnt, "delete_cnt": None, "delete_status": None}

            now_user = models.User.objects.get(phone=phone)
            ALL_folder = models.Folder.objects.get(user_id=now_user.phone, name="ALL")
            ALL_foldercover = models.FolderCover.objects.get(folder_id=ALL_folder.id)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            if check_list:
                cnt = 0
                for index, now in enumerate(check_list):
                    now_folder = models.Folder.objects.get(user_id=now_user.phone, fake_name=now)
                    if now_folder.name == "ALL":
                        continue
                    models.FolderCover.objects.get(folder_id=now_folder.id).delete()

                    ALL_folder.total_size -= now_folder.total_size
                    ALL_folder.cnt -= now_folder.cnt
                    ALL_folder.modify_time = datetime.datetime.now()
                    ALL_folder.save()

                    now_user.now_capacity = ALL_folder.total_size
                    now_user.save()

                    now_imgs = models.Picture.objects.filter(folder_id=now_folder.id)
                    now_imgs_cnt = len(now_imgs)
                    for img_index, img in enumerate(now_imgs):
                        path = os.path.join(store_dir, img.fake_name + "." + img.type)
                        compress_path = os.path.join(store_compress_dir, img.fake_name + "." + img.type)

                        facepic = models.FacePic.objects.filter(pic_id=img.id)
                        if facepic:
                            for now_facepic in facepic:
                                now_face = models.Face.objects.filter(id=now_facepic.face_id)
                                if now_face:
                                    now_face[0].cnt -= 1
                                    now_face[0].save()
                                now_facepic.delete()

                        img.delete()
                        try:
                            os.remove(path)
                            os.remove(compress_path)

                        except:
                            pass
                    now_folder.delete()
                    cnt += 1

                now_user_max_allimg_id = models.Picture.objects.filter(
                    user_id=now_user.phone).values(
                    "id").aggregate(Max("id"))
                if (now_user_max_allimg_id["id__max"]):
                    ALL_foldercover.pic_id = now_user_max_allimg_id["id__max"]
                    ALL_foldercover.save()
                else:
                    ALL_foldercover.pic_id = zero_pic.id
                    ALL_foldercover.save()

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


def add_folder(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]
            folder_name = request.POST["folder_name"]

            res = {"add_status": None, "is_same_name": None}

            now_user = models.User.objects.get(phone=phone)
            zero_pic = models.Picture.objects.get(id=zeroid)  # 管理员账号上传第一张图片，作为封面为空的时候的封面图片

            is_same_foldername = models.Folder.objects.filter(user_id=now_user.phone, name=folder_name)

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


def modify_folder(request, now_folder_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]
            modify_folder_name = request.POST["input_folder_name"]

            res = {"mod_status": None, "is_same_name": None}

            now_user = models.User.objects.get(phone=phone)
            now_folder = models.Folder.objects.get(user_id=phone, name=now_folder_name)
            is_same_foldername = models.Folder.objects.filter(user_id=now_user.phone, name=modify_folder_name)

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


'''
def runImgClass(p, all_tag, now_path):
    res = ImageClassification(now_path)
    print(res)
    p.tag_id = all_tag.get(tag=res[0]).id
    p.is_tag = 1
    p.save()
    return
'''


def getTag(request, folder_fake_name):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            NoneTag = models.Tag.objects.get(tag="None")

            now_user = models.User.objects.get(phone=phone)

            now_folder = models.Folder.objects.get(user_id=now_user.phone, fake_name=folder_fake_name)

            if now_folder.name == "ALL":
                now_pics = models.Picture.objects.filter(user_id=now_user.phone, tag_id=NoneTag.id)
            else:
                now_pics = models.Picture.objects.filter(user_id=now_user.phone, folder_id=now_folder.id,
                                                         tag_id=NoneTag.id)

            all_tag = models.Tag.objects.all()

            res = {"select_cnt": len(now_pics), "getTag_cnt": None, "getTag_status": None}

            cnt = 0

            total_cnt = len(now_pics)

            for index, p in enumerate(now_pics):
                try:
                    now_path = os.path.join(store_dir, p.fake_name + "." + p.type)
                    if not os.path.exists(now_path):
                        raise Exception("Path not exist")
                    if p.is_tag:
                        continue
                    else:
                        global type_sever
                        now_res = type_sever.pd(now_path)
                        p.tag_id = all_tag.get(tag=now_res[0]).id
                        p.is_tag = 1
                        p.save()
                        cnt += 1
                except:
                    pass

            res["getTag_status"] = "true"
            res["getTag_cnt"] = cnt

            for conn in connections.all():
                conn.close_if_unusable_or_obsolete()

            response = HttpResponse(json.dumps(res))

            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def get_oneTag(request):
    if request.session.get("is_login"):
        if request.method == "POST":

            phone = request.session["phone"]

            NoneTag = models.Tag.objects.get(tag="None")

            now_imgs_fakename = request.POST["img_name"]

            now_user = models.User.objects.get(phone=phone)

            now_pics = models.Picture.objects.filter(user_id=now_user.phone, fake_name=now_imgs_fakename,
                                                     tag_id=NoneTag.id)

            all_tag = models.Tag.objects.all()

            res = {"getTag_status": None, "now_tag": None}

            if now_pics:
                try:
                    now_pic = now_pics[0]
                    now_path = os.path.join(store_dir, now_pic.fake_name + "." + now_pic.type)
                    if not os.path.exists(now_path):
                        res["getTag_status"] = "false"
                        raise Exception("Path not exist")

                    else:
                        global type_sever
                        now_res = type_sever.pd(now_path)
                        now_tag = now_res[0]
                        now_pic.tag_id = all_tag.get(tag=now_tag).id
                        now_pic.is_tag = 1
                        now_pic.save()
                        res["getTag_status"] = "true"
                        res["now_tag"] = now_tag
                except:
                    pass
                    res["getTag_status"] = "false"
            else:
                res["getTag_status"] = "false"

            response = HttpResponse(json.dumps(res))

            return response
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def faceMainPage(request):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)
        faces = models.Face.objects.filter(user_id=user.phone)

        Faces = []
        cnt = 1
        valid_cnt = 0
        for f in faces:
            if f.cnt > 0:
                valid_cnt += 1
                if cnt <= page_num_face:
                    now_cover_fakename = f.face_cover.split(".")[0]
                    now_cover_type = f.face_cover.split(".")[1]
                    f.href = "/face/" + now_cover_fakename + "-" + now_cover_type + "/"
                    f.cover_path = "/upload_imgs/ExistingFace/" + user.phone + "/" + f.face_cover
                    f.id = cnt
                    f.fake_name = now_cover_fakename
                    Faces.append(f)
                    cnt += 1

        count = valid_cnt
        capacity_now = format(user.now_capacity, '.2f')
        if not Faces:
            Faces = None

        return render(request, "Album/face.html", locals())
    else:
        return redirect("/login/")


def faceDetailPage(request, face_cover_fake_name):
    if request.session.get("is_login"):
        name = request.session['name']
        phone = request.session['phone']
        user = models.User.objects.get(phone=phone)

        FaceDetails = []
        cnt = 1
        total_cnt = 0
        all_tag = models.Tag.objects.all()
        face_cover_fake_name_list = face_cover_fake_name.rsplit("-", 1)
        now_Face = models.Face.objects.filter(user_id=user.phone,
                                              face_cover=face_cover_fake_name_list[0] + "." + face_cover_fake_name_list[
                                                  1])
        if now_Face:
            now_FacePic = models.FacePic.objects.filter(face_id=now_Face[0].id)
            if now_FacePic:
                for facepic in now_FacePic:
                    if cnt <= page_num_img:
                        now_img = models.Picture.objects.get(user_id=user.phone, id=facepic.pic_id)
                        now_img.size = format(now_img.size, '.2f')
                        now_img.path = os.path.join('/upload_imgs/compress_imgs/',
                                                    now_img.fake_name + '.' + now_img.type)
                        now_img.id = cnt
                        now_img.nowtag = all_tag.get(id=now_img.tag_id).tag
                        FaceDetails.append(now_img)
                        total_cnt += 1
                    else:
                        total_cnt += 1

                    cnt += 1

                count = total_cnt
                capacity_now = format(user.now_capacity, '.2f')
                face_cover_fake_name = face_cover_fake_name
            else:
                return redirect("/face/")

            return render(request, "Album/face_detail.html", locals())

        else:
            return error_404(request, "404")
    else:
        return redirect("/login/")


def get_one_faceDetect(request):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]
            now_imgs_fakename = request.POST["img_name"]
            nowUser = models.User.objects.get(phone=phone)
            res = {"faceRec_status": None, "isnotFace": None}
            if now_imgs_fakename:
                pic = models.Picture.objects.get(user_id=nowUser.phone, fake_name=now_imgs_fakename)
                if pic.is_detect_face and pic.is_face:
                    res["faceRec_status"] = "true"
                    res["isnotFace"] = "false"
                    return HttpResponse(json.dumps(res))
                elif pic.is_detect_face and not pic.is_face:
                    res["faceRec_status"] = "false"
                    res["isnotFace"] = "true"
                    return HttpResponse(json.dumps(res))
                else:
                    try:
                        pic_path = os.path.join(store_dir, now_imgs_fakename) + "." + pic.type
                        isFace, face_locations, recognized_faces, saved_face_img_name = FaceRecogPrepared(pic_path,
                                                                                                          nowUser.phone)

                        if isFace:
                            res["isnotFace"] = "false"
                            if recognized_faces:
                                index = 0
                                already_add = set()
                                for now_recognized_face in recognized_faces:
                                    if now_recognized_face == "Not matched":
                                        newFace = models.Face(face_cover=saved_face_img_name[index],
                                                              cnt=1, user_id=nowUser.phone)
                                        newFace.save()
                                        newFacePic = models.FacePic(face_id=newFace.id, pic_id=pic.id)
                                        newFacePic.save()
                                    else:
                                        if now_recognized_face in already_add:
                                            continue  # 同一张图片同一个人脸一次只加一次
                                        else:
                                            already_add.add(now_recognized_face)
                                            nowFace = models.Face.objects.get(face_cover=now_recognized_face,
                                                                              user_id=nowUser.phone)
                                            nowFace.cnt += 1
                                            nowFace.save()
                                            newFacePic = models.FacePic(face_id=nowFace.id, pic_id=pic.id)
                                            newFacePic.save()

                                    index += 1
                            pic.is_face = 1
                            pic.save()
                            res["faceRec_status"] = "true"
                        else:
                            res["isnotFace"] = "true"
                            res["faceRec_status"] = "false"
                        pic.is_detect_face = 1
                        pic.save()
                    except:
                        res["faceRec_status"] = "false"

                return HttpResponse(json.dumps(res))

        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def get_select_faceDetect(request):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]
            select_imgs_fakename = request.POST.getlist("img_name")
            select_cnt = len(select_imgs_fakename)
            nowUser = models.User.objects.get(phone=phone)
            res = {"faceRec_status": None, "faceRec_cnt": None, "select_cnt": select_cnt}
            cnt = 0
            if select_imgs_fakename:
                for img_index, img_fakename in enumerate(select_imgs_fakename):
                    pic = models.Picture.objects.get(user_id=nowUser.phone, fake_name=img_fakename)
                    if pic.is_detect_face and pic.is_face:
                        cnt += 1
                        continue
                    elif pic.is_detect_face and not pic.is_face:
                        continue
                    else:
                        try:
                            pic_path = os.path.join(store_dir, img_fakename) + "." + pic.type
                            isFace, face_locations, recognized_faces, saved_face_img_name = FaceRecogPrepared(pic_path,
                                                                                                              nowUser.phone)
                            if isFace:
                                if recognized_faces:
                                    index = 0
                                    already_add = set()
                                    for now_recognized_face in recognized_faces:
                                        if now_recognized_face == "Not matched":
                                            newFace = models.Face(face_cover=saved_face_img_name[index],
                                                                  cnt=1, user_id=nowUser.phone)
                                            newFace.save()
                                            newFacePic = models.FacePic(face_id=newFace.id, pic_id=pic.id)
                                            newFacePic.save()
                                        else:
                                            if now_recognized_face in already_add:
                                                continue  # 同一张图片同一个人脸一次只加一次
                                            else:
                                                already_add.add(now_recognized_face)
                                                nowFace = models.Face.objects.get(face_cover=now_recognized_face,
                                                                                  user_id=nowUser.phone)
                                                nowFace.cnt += 1
                                                nowFace.save()
                                                newFacePic = models.FacePic(face_id=nowFace.id, pic_id=pic.id)
                                                newFacePic.save()
                                        index += 1
                                pic.is_face = 1
                                pic.save()
                                cnt += 1
                            pic.is_detect_face = 1
                            pic.save()
                        except:
                            pass
                if cnt == 0:
                    res["faceRec_status"] = "false"
                else:
                    res["faceRec_status"] = "true"
                res["faceRec_cnt"] = cnt
                return HttpResponse(json.dumps(res))

        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def getVideo(request):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]
            select_imgs_fakename = request.POST.getlist("img_name")
            select_cnt = len(select_imgs_fakename)
            nowUser = models.User.objects.get(phone=phone)
            res = {"video_status": None, "video_cnt": None, "select_cnt": select_cnt}
            cnt = 0
            img_path_list = []
            if select_imgs_fakename:
                for img_index, img_fakename in enumerate(select_imgs_fakename):
                    pic = models.Picture.objects.get(user_id=nowUser.phone, fake_name=img_fakename)
                    cnt += 1
                    img_path_list.append(os.path.join(store_dir, pic.fake_name + "." + pic.type))

                video_name = datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S") + "-" + nowUser.fake_id
                for now_video in os.listdir(video_dir):
                    if nowUser.fake_id in now_video:
                        os.remove(os.path.join(video_dir, now_video))
                GenVideo(img_path_list, video_name=video_name, windows_size=(1280, 720), fps=24)
            if cnt == 0:
                res["video_status"] = "false"
            else:
                res["video_status"] = "true"
            res["video_cnt"] = cnt
            return HttpResponse(json.dumps(res))
        return render(request, "Album/mypics.html", locals())
    return redirect("/login/")


def downloadVideo(request):
    if request.session.get("is_login"):
        if request.method == "POST":
            phone = request.session["phone"]
            nowUser = models.User.objects.get(phone=phone)
            video_name = request.POST["video_name"]
            video_name = video_name.split(" ")[0] + "-" + nowUser.fake_id
            try:
                video_path = os.path.join(video_dir, video_name + ".mp4")
                with open(video_path, "rb") as f:
                    video = f.read()
                response = HttpResponse(video)
                response["Content-Type"] = "application/octet-stream"
                response["Content-Disposition"] = "attachment;filename={}".format(escape_uri_path(video_name + ".mp4"))
                response["download_status"] = "true"
                return response
            except:
                response = HttpResponse()
                response["download_status"] = "false"
                return response
        return render(request, "Album/video.html", locals())
    return redirect("/login/")


def error_400(request, exception):
    error_info = 400
    return render(request, "Album/error.html", locals())


def error_403(request, exception):
    error_info = 403
    return render(request, "Album/error.html", locals())


def error_404(request, exception):
    error_info = 404
    return render(request, "Album/error.html", locals())


def error_500(request):
    error_info = 500
    return render(request, "Album/error.html", locals())
