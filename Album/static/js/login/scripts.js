(function ($) {
    //"use strict";

    $(function(){
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

    /* login Form */
    $("#loginForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            loginformError();
            loginsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            event.preventDefault();
            csubmitForm();
        }
    });

    function csubmitForm() {
        // initiate variables with form content
        var phone = $("#loginphone").val();
        var pwd = $("#loginpwd").val();
        var terms = $("#cterms").val();
        $.ajax({
            type: "POST",
            /*
            url: "php/loginForm-process.php",
            data: "name=" + name + "&email=" + email + "&message=" + message + "&terms=" + terms,
            success: function(text) {
                if (text == "success") {
                    loginformSuccess();
                } else {
                    loginformError();
                    loginsubmitMSG(false, text);
                }
            }
            */
        });
    }

    function loginformSuccess() {
        $("#loginForm")[0].reset();
        loginsubmitMSG(true, "Message Submitted!");
        $("input").removeClass('notEmpty'); // resets the field label after submission
        $("textarea").removeClass('notEmpty'); // resets the field label after submission
    }

    function loginformError() {
        $("#loginForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
        });
    }

    function loginsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h3 text-center tada animated";
        } else {
            var msgClasses = "h3 text-center";
        }
        $("#cmsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }


    /* Removes Long Focus On Buttons */
    $(".button, a, button").mouseup(function () {
        $(this).blur();
    });

})(jQuery);