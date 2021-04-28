import json


from captcha.models import CaptchaStore
from django.http import Http404, HttpResponse,JsonResponse
from django.shortcuts import render, redirect
from . import models
from .forms import LoginForm,SignupForm
import hashlib


# Create your views here.

def hash_code(s, salt="neko"):
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()


def index(request):
    pass
    return render(request, "index.html")


def login(request):
    if request.session.get("is_login", None):
        return redirect("/")

    if request.method == "POST":
        login_form=LoginForm(request.POST)

        if login_form.is_valid():
            phone=login_form.cleaned_data["phone"]
            pwd=login_form.cleaned_data["pwd"]

            try:
                user=models.User.objects.get(phone=phone)
                if user.pwd==hash_code(pwd)+"-"+pwd:
                    request.session["is_login"]=True
                    request.session["phone"]=user.phone
                    request.session["name"]=user.name
                    return redirect("/")
                else:
                    message="密码不正确!"
            except:
                message="该用户不存在!"
        else:
            if login_form.has_error("phone"):
                message = "请输入正确的手机号!";
            else:
                message = "请输入正确的验证码!"

        return render(request,"Album/login.html",locals())
    login_form=LoginForm()
    return render(request,"Album/login.html",locals())


def signup(request):
    if request.session.get("is_login", None):
        return redirect("/")

    if request.method == "POST":
        signup_form = SignupForm(request.POST)
        message = "请输入正确的手机号!"
        if signup_form.is_valid():
            phone = signup_form.cleaned_data["phone"]
            name=signup_form.cleaned_data["name"]
            pwd = signup_form.cleaned_data["pwd"]
            re_pwd=signup_form.cleaned_data["re_pwd"]

            is_same_phone=models.User.objects.filter(phone=phone)
            if is_same_phone:
                message="手机号已注册!"
                return render(request,"Album/signup.html",locals())

            else:
                if pwd != re_pwd:
                    message = "两次输入的密码不同!"
                    return render(request, "Album/signup.html", locals())

                new_user=models.User(name=name,phone=phone,pwd=hash_code(pwd)+"-"+pwd)
                new_user.save()

                request.session["is_login"] = True
                request.session["phone"] = new_user.phone
                request.session["name"] = new_user.name

                return redirect("/")

    signup_form=SignupForm()
    return render(request,"Album/signup.html",locals())

def loginout(request):
    request.session.flush()
    return redirect("/")


def ajax_val(request):
    if  request.is_ajax():
        cs = CaptchaStore.objects.filter(response=request.GET['response'], hashkey=request.GET['hashkey'])
        if cs:
            json_data={'status':1}
        else:
            json_data = {'status':0}
        return JsonResponse(json_data)
    else:
        # raise Http404
        json_data = {'status':0}
        return JsonResponse(json_data)


def welcome(request):
    pass
    return render(request,"Album/welcome.html")

def upload(request):
    pass
    return render(request,"Album/upload.html")