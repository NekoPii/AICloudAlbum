(function ($) {
    //"use strict";
    $("#login").focus();
    $(function () {

        if ($("#login_phone").val() != '') {
            $("#login_phone").addClass('notEmpty');
        } else {
            $("#login_phone").removeClass('notEmpty');
        }
        if ($("#login_pwd").val() != '') {
            $("#login_pwd").addClass('notEmpty');
        } else {
            $("#login_pwd").removeClass('notEmpty');
        }

        if ($("#signup_phone").val() != '') {
            $("#signup_phone").addClass('notEmpty');
        } else {
            $("#signup_phone").removeClass('notEmpty');
        }
        if ($("#signup_name").val() != '') {
            $("#signup_name").addClass('notEmpty');
        } else {
            $("#signup_name").removeClass('notEmpty');
        }
        if ($("#signup_pwd").val() != '') {
            $("#signup_pwd").addClass('notEmpty');
        } else {
            $("#signup_pwd").removeClass('notEmpty');
        }
        if ($("#re_signup_pwd").val() != '') {
            $("#re_signup_pwd").addClass('notEmpty');
        } else {
            $("#re_signup_pwd").removeClass('notEmpty');
        }

        $('#login_phone').focus(function () {
            $("#login_msg").text("");
        });

        $('#login_pwd').focus(function () {
            $("#login_msg").text("");
        });

        $("#signup_phone").focus(function () {
            $("#signup_msg").text("");
        });

        $("#signup_name").focus(function () {
            $("#signup_msg").text("");
        });

        $("#signup_pwd").focus(function () {
            $("#signup_msg").text("");
        });

        $("#re_signup_pwd").focus(function () {
            $("#signup_msg").text("");
        });


        //验证码
        $('.captcha').css({
            'cursor': 'pointer'
        });
        // ajax刷新
        $('.captcha').click(function () {
            $("#login_captcha_1").val("");
            $("#login_captcha_1").addClass("false_captcha").removeClass("true_captcha");
            $.getJSON("/captcha/refresh/",
                function (result) {
                    $('.captcha').attr('src', result['image_url']);
                    $('#login_captcha_0').val(result['key'])
                });
        });

        //captcha动态验证

        $('#login_captcha_1').blur(function () {
            // #login_captcha_1为输入框的id，当该输入框失去焦点是触发函数
            json_data = {
                'response': $('#login_captcha_1').val(), // 获取输入框和隐藏字段login_captcha_0的数值
                'hashkey': $('#login_captcha_0').val()
            }
            $.getJSON('/ajax_val', json_data, function (data) {
                //ajax发送
                if (data['status'] == 1) { //status返回1为验证码正确， status返回0为验证码错误， 在输入框的后面写入提示信息
                    $("#login_captcha_1").removeClass("false_captcha").addClass("true_captcha");
                } else {
                    $("#login_captcha_1").removeClass("true_captcha").addClass("false_captcha");
                }
            });

        });
    });


    $("#login_btn").click(function () {
            var phone_reg = /^[1][3,4,5,7,8,9][0-9]{9}|root$/;
            var phone = $("#login_phone").val();
            var pwd = $("#login_pwd").val();
            var captcha = $("#login_captcha_1").val();
            pwd = pwd.trim();
            captcha = captcha.trim();
            phone = phone.trim();

            toastr.options = {
                "closeButton": false,
                "newestOnTop": true,
                "progressBar": false,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "showDuration": "100",
                "hideDuration": "1000",
                "timeOut": "2500",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            if (phone && phone_reg.test(phone)) {
                if (pwd != null && pwd != "") {
                    if (captcha != null && captcha != "" && captcha.length == 4) {
                        var captchaVal = "";
                        json_data = {
                            'response': $('#login_captcha_1').val(),
                            'hashkey': $('#login_captcha_0').val()
                        }
                        $.getJSON('/ajax_val', json_data, function (data) {
                            if (data['status'] == 1) {
                                $.ajax({
                                    url: "/login/",
                                    type: "POST",
                                    data: $("#loginForm").serialize(),
                                    dataType: "JSON",
                                    success: function (data) {
                                        if (data.loginIn == "true") {
                                            toastr.success(data.message)
                                            setTimeout(function () {
                                                alert(data.code)
                                                location.href = "/";
                                            }, 500);
                                        }
                                        if (data.loginIn == "false") {
                                            toastr.warning(data.message)
                                            if (data.error_type == "pwd") {
                                                $("#login_pwd").focus();
                                                $("#login_captcha_1").val("");
                                                $.getJSON("/captcha/refresh/",
                                                    function (result) {
                                                        $('.captcha').attr('src', result['image_url']);
                                                        $('#login_captcha_0').val(result['key'])
                                                    });
                                            }
                                            if (data.error_type == "phone") {
                                                $("#login_phone").focus();
                                                $("#login_captcha_1").val("");
                                                $.getJSON("/captcha/refresh/",
                                                    function (result) {
                                                        $('.captcha').attr('src', result['image_url']);
                                                        $('#login_captcha_0').val(result['key'])
                                                    });
                                            }
                                        }
                                    },
                                    error: function (data) {
                                        toastr.error("Error occurred,please try again later ~")
                                        $("#login_phone").val("");
                                        $("#login_pwd").val("");
                                        $("#login_captcha_1").val("");
                                        $("#login_captcha_1").removeClass("false_captcha").removeClass("true_captcha");
                                        $.getJSON("/captcha/refresh/",
                                            function (result) {
                                                $('.captcha').attr('src', result['image_url']);
                                                $('#login_captcha_0').val(result['key'])
                                            });
                                    }
                                })
                            } else {
                                toastr.error("Captcha is incorrect !")
                                $("#login_captcha_1").focus();
                            }
                        });
                    } else if (captcha != null && captcha != "") {//验证码为空
                        toastr.error("Captcha format is incorrect !")
                        $("#login_captcha_1").focus();
                    } else {
                        toastr.error("Captcha can't be empty !")
                        $("#login_captcha_1").focus();
                    }
                } else {//密码为空
                    toastr.error("Password can't be empty !")
                    $("#login_pwd").focus();
                }
            } else if (phone) {
                toastr.error("Phone number format is incorrect !")
                $("#login_phone").focus();
            } else {//手机号格式不正确
                toastr.error("Phone number can't be empty !")
                $("#login_phone").focus();
            }
        }
    );

    $("#signup_btn").click(function () {
        var phone_reg = /^[1][3,4,5,7,8,9][0-9]{9}|root$/;
        var phone = $("#signup_phone").val();
        var name = $("#signup_name").val();
        var pwd = $("#signup_pwd").val();
        var re_pwd = $("#re_signup_pwd").val();

        phone = phone.trim();
        name = name.trim();
        pwd = pwd.trim();
        re_pwd = re_pwd.trim();

        toastr.options = {
            "closeButton": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "showDuration": "100",
            "hideDuration": "1000",
            "timeOut": "2500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        if (phone && phone_reg.test(phone)) {
            if (name != null && name != "") {
                if (pwd != null && pwd != "") {
                    if (re_pwd != null && re_pwd != "") {
                        $.ajax({
                            url: "/signup/",
                            type: "POST",
                            data: $("#signupForm").serialize(),
                            dataType: "JSON",
                            success: function (data) {
                                if (data.signup == "true") {
                                    toastr.success(data.message)
                                    setTimeout(function () {
                                        location.href = "/";
                                    }, 500);
                                }
                                if (data.signup == "false") {
                                    toastr.warning(data.message)
                                    if (data.error_type == "phone") {
                                        $("#signup_phone").focus();
                                    }
                                    if (data.error_type == "re_pwd") {
                                        $("#re_signup_pwd").focus();
                                    }
                                }
                            },
                            error: function (data) {
                                toastr.error("Error occurred , please try again later ~")
                                $("#signup_phone").val("");
                                $("#signup_name").val("");
                                $("#signup_pwd").val("");
                                $("#re_signup_pwd").val("");
                            }
                        });
                    } else {
                        toastr.error("Re-Password can't be empty !")
                        $("#re_signup_pwd").focus();
                    }
                } else {
                    toastr.error("Password can't be empty !")
                    $("#signup_pwd").focus();
                }
            } else {
                toastr.error("Name can't be empty !")
                $("#signup_name").focus();
            }
        } else if (phone) {
            toastr.error("Phone number format is incorrect !")
            $("#signup_phone").focus();
        } else {
            toastr.error("Phone number can't be empty !")
            $("#signup_phone").focus();
        }
    });


    /* Move Form Fields Label When User Types */
// for input and textarea fields
    $("input, textarea").keyup(function () {
        if ($(this).val() != '') {
            $(this).addClass('notEmpty');
        } else {
            $(this).removeClass('notEmpty');
        }
    });


    /* Removes Long Focus On Buttons */
    $(".button, a, button").mouseup(function () {
        $(this).blur();
    });


})
(jQuery);