(function ($) {

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
        }
    });
    //"use strict";
    $("#signup").focus();
    $(function () {
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
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {//Enter
            var phone_reg = /^[1][3,4,5,7,8,9][0-9]{9}|root$/;
            var phone = $("#signup_phone").val();
            var name = $("#signup_name").val();
            var pwd = $("#signup_pwd").val();
            var re_pwd = $("#re_signup_pwd").val();

            phone = phone.trim();
            name = name.trim();
            pwd = pwd.trim();
            re_pwd = re_pwd.trim();

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
                                    toastr.error("Error occurred,please try again later")
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
                toastr.error("Phone number format is incorrect")
                $("#signup_phone").focus();
            } else {
                toastr.error("Phone number can't be empty !")
                $("#signup_phone").focus();
            }
        }
    });

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