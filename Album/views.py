from django.shortcuts import render,redirect

# Create your views here.

def index(request):
    pass
    return render(request,"index.html")

def login(request):
    pass
    return render(request,"Album/login.html")

def signup(request):
    pass
    return render(request,"Album/signup.html")