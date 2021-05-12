import re

from captcha.fields import CaptchaField, CaptchaTextInput
from django.core import validators
from django import forms
from . import models


class LoginForm(forms.Form):
    phone = forms.CharField(max_length=11,
                            widget=forms.TextInput(
                                attrs={"class": "form-control-input", "id": "login_phone", "tabindex": "1",
                                       "autocomplete": "off"}))
    pwd = forms.CharField(widget=forms.PasswordInput(
        attrs={"class": "form-control-input", "id": "login_pwd", "tabindex": "2", "autocomplete": "off"}))
    captcha = CaptchaField(widget=CaptchaTextInput(attrs={"class": "form-control-input", "id": "login_captcha",
                                                          "style": "float:left;width:70%;display:block;margin-right:0.5rem;",
                                                          "tabindex": "3", "autocomplete": "off"}))

    def clean_phone(self):
        phone = self.cleaned_data["phone"]
        pattern = re.compile("1[3-9][0-9]{9}|root")
        if pattern.match(phone):
            pass
        else:
            msg = "请输入正确的电话号码!"
            self._errors["phone"] = self.error_class([msg])
        self.phone = phone
        return phone


class SignupForm(forms.Form):
    phone = forms.CharField(max_length=11,
                            widget=forms.TextInput(
                                attrs={"class": "form-control-input", "id": "signup_phone", "tabindex": "1",
                                       "autocomplete": "off"}))
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={"class": "form-control-input", "id": "signup_name", "tabindex": "2", "autocomplete": "off"}))
    pwd = forms.CharField(
        widget=forms.PasswordInput(
            attrs={"class": "form-control-input", "id": "signup_pwd", "tabindex": "3", "autocomplete": "off"}))
    re_pwd = forms.CharField(
        widget=forms.PasswordInput(
            attrs={"class": "form-control-input", "id": "re_signup_pwd", "tabindex": "4", "autocomplete": "off"}))

    def clean_phone(self):
        phone = self.cleaned_data["phone"]
        pattern = re.compile("1[3-9][0-9]{9}|root")
        if pattern.match(phone):
            pass
        else:
            msg = "请输入正确的电话号码!"
            self._errors["phone"] = msg
        self.phone = phone
        return phone
