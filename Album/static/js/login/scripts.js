(function ($) {
    //"use strict";

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
            console.log('click');
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

    /* Preloader */


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

})(jQuery);