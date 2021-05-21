var current_page = 1;
var pics;
var pics_count;
(function ($) {
    "use strict";

    $(".choose_model_img").each(function () {
        if ($(this).attr("name") == "ALL") {
            $(this).remove();
        }
    });

    $(".popup-with-move-anim").each(function () {
        if ($(this).attr("name") == "ALL") {
            $(this).addClass("ALL_folder");
            $(this).parent().addClass("ALL_folder");
        }
    });


    $("#change_model").val("select");
    $(".choose_model_img").css("display", "none");
    $("#delete_few").css("display", "none");
    $("#select_all").css("display", "none");
    $(".folder_select").prop("checked", false);


    $.getJSON("/ajax_folders/", function (data) {
        pics = data["folders"];
        pics_count = data["count"];
        if (pics_count <= 25) {
            $("#next").css("display", "none");
        }
    });

    $(window).bind('scroll', function () {
        if ($(window).scrollTop() <= 300) {
            $("#top").hide();
        } else {
            $("#top").show();
        }
    });

    $("#top").hide()
        .on("click", function () {
            $('html, body').animate({scrollTop: 0}, 300);
        })


    $("#back")
        .css("display", "none")
        .click(function () {
            if (current_page > 1) {
                current_page--;
                $("#next").css("display", "inline-block")
                $("#back").css("display", "inline-block")
                if (current_page === 1) {
                    $("#next").css("display", "inline-block")
                    $("#back").css("display", "none")
                }
                for (var i = 1; i <= 25; i++) {
                    var pic_number = (current_page - 1) * 25 + i;
                    var element1 = "#img_" + i + " .popup-with-move-anim";
                    var element2 = "#img_" + i + " .element_1";
                    var element3 = "#img_" + i + " .element_2";
                    var element4 = "#img_" + i + " .choose_model_img";
                    var element5 = "#img_" + i + " .element_3";
                    var element6 = "#img_" + i + " .element_4";
                    var element7 = "#img_" + i + " .element_5";

                    pic_number--;
                    $(element1).attr("title", pics[pic_number]["name"]);
                    $(element1).attr("href", pics[pic_number]["href"]);
                    $(element2).text(pics[pic_number]["name"]);
                    $(element3).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                    $(element4).attr("title", pics[pic_number]["name"]);
                    $(element5).text(pics[pic_number]["name"]);
                    $(element6).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                    $(element7).val(pics[pic_number]["fake_name"]);

                    pic_number++;
                    $("#img_" + i).css("display", "block")

                }


            }

        })

    $("#next")
        .click(function () {
            if ((pics_count - current_page * 25) > 0) {
                $("#next").css("display", "inline-block")
                $("#back").css("display", "inline-block")
                if (pics_count - (1 + current_page) * 25 <= 0) {
                    $("#next").css("display", "none")
                    $("#back").css("display", "inline-block")
                }
                for (var i = 1; i <= 25; i++) {
                    var pic_number = current_page * 25 + i;

                    if (pic_number <= pics_count) {
                        var element1 = "#img_" + i + " .popup-with-move-anim";
                        var element2 = "#img_" + i + " .element_1";
                        var element3 = "#img_" + i + " .element_2";
                        var element4 = "#img_" + i + " .choose_model_img";
                        var element5 = "#img_" + i + " .element_3";
                        var element6 = "#img_" + i + " .element_4";
                        var element7 = "#img_" + i + " .element_5";

                        pic_number--;
                        $(element1).attr("title", pics[pic_number].name);
                        $(element1).attr("href", pics[pic_number]["href"]);
                        $(element2).text(pics[pic_number]["name"]);
                        $(element3).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                        $(element4).attr("title", pics[pic_number]["name"]);
                        $(element5).text(pics[pic_number]["name"]);
                        $(element6).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                        $(element7).val(pics[pic_number]["fake_name"]);

                        pic_number++;
                        $("#img_" + i).css("display", "block")

                    } else {
                        $("#img_" + i).css("display", "none")
                    }

                }
                current_page++;
            }

        })


    /* Counter - CountTo */
    var a = 0;
    $(function () {
        if ($('#counter').length) { // checking if CountTo section exists in the page, if not it will not run the script and avoid errors
            var oTop = $('#counter').offset().top - window.innerHeight;
            if (a == 0 && $(window).scrollTop() > oTop) {
                $('.counter-value').each(function () {
                    var $this = $(this),
                        countTo = $this.attr('data-count');
                    $({
                        countNum: $this.text()
                    }).animate({
                            countNum: countTo
                        },
                        {
                            duration: 2000,
                            easing: 'swing',
                            step: function () {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function () {
                                $this.text(this.countNum);
                                //alert('finished');
                            }
                        });
                });
                a = 1;
            }
        }
    });


    if ($("#input_folder_name").val() != '') {
        $("#input_folder_name").addClass('notEmpty');
    } else {
        $("#input_folder_name").removeClass('notEmpty');
    }


    $("input, textarea").keyup(function () {
        if ($(this).val() != '') {
            $(this).addClass('notEmpty');
        } else {
            $(this).removeClass('notEmpty');
        }
    });

    $(".button, a, button").mouseup(function () {
        $(this).blur();
    });

})(jQuery);


$("#change_model").click(function () {
    if ($(this).val() == "select") {//进行选择
        $(".add_btn").css("display", "none");
        $("#next").css("display", "none");
        $("#back").css("display", "none");
        $(this).val("view");
        $(".select_text").css("display", "none");
        $(".view_text").css("display", "");
        $("#delete_few").css("display", "flex")
        $("#select_all").css("display", "flex")
        $(".popup-with-move-anim").css("display", "none");
        $(".ALL_folder").attr("disabled", true).css("pointer-events", "none").css("display", "");
        $(".choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $(".folder_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        cnt = 0;
        $("#select_cnt").text(cnt.toString());
    } else if ($(this).val() == "view") {// 退出选择
        $(".add_btn").css("display", "flex");
        if (current_page === 1) {
            $("#next").css("display", "inline-block");
        } else if ((pics_count - current_page * 25) < 0) {
            $("#back").css("display", "inline-block");
        } else {
            $("#next").css("display", "inline-block");
            $("#back").css("display", "inline-block");
        }

        $(this).val("select");
        $(".select_text").css("display", "");
        $(".view_text").css("display", "none");
        $("#delete_few").css("display", "none")
        $("#select_all").css("display", "none")
        $(".choose_model_img").css("display", "none");
        $(".popup-with-move-anim").css("display", "block");
        $(".ALL_folder").attr("disabled", false).css("pointer-events", "").css("opacity", 1);
        cnt = 0;
    }
});

$(".choose_model_img").click(function () {

    if ($(this).find(".folder_select").prop("checked") == true) {//已选中
        $(this).find(".folder_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        cnt -= 1;
        $("#select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (cnt == $(".choose_model_img").length) {
            $("#select_all").val("all");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".folder_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        cnt += 1;
        $("#select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (cnt == $(".choose_model_img").length) {
            $("#select_all").val("all");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    }
});

$("#select_all").click(function () {
    if ($(this).val() == "zero" && cnt < $(".choose_model_img").length) {
        $(".folder_select").prop("checked", true);
        $(".choose_zoomImage11").css("opacity", 1);
        $(".choose_model_img").css("border", "0.25rem solid #00C9FF");
        cnt = $(".choose_model_img").length;
        $("#select_cnt").text(cnt.toString());
        $(this).val("all");
        $(".select_all_text").css("display", "none");
        $(".cancel_text").css("display", "");
    } else if ($(this).val() == "all" && cnt == $(".choose_model_img").length) {
        $(".folder_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        $(".choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        cnt = 0;
        $("#select_cnt").text(cnt.toString());
        $(this).val("zero");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
    }
});

$("#input_folder_name").on("keypress", function (event) {
    if (event.keyCode == 13) {
        $(this).focus();
        var input_name = $(this).val();
        input_name = input_name.trim()
        if (input_name && input_name != "") {
            $.ajax({
                url: "/add_folder/",
                type: "POST",
                data: $("#addFolderForm").serialize(),
                dataType: "json",
                success: function (data) {
                    var add_status = data["add_status"],
                        is_same_name = data["is_same_name"];
                    if (add_status == "false" && is_same_name == "true"
                    ) {
                        toastr.warning("Folder with the same name exists !")
                        $("#input_folder_name").focus()
                    } else if (add_status == "false") {
                        toastr.warning("Failed to Add \"" + input_name + "\" Folder");
                    } else if (add_status == "true") {
                        toastr.success("\"" + input_name + "\" Folder Add Successfully ~");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    }
                },
                error: function () {
                    toastr.error("Error , Please Try again !")
                }
            });
        } else {
            toastr.error("Folder Name can't be empty !");
        }
    }
});

$("#modal_ok").click(function () {
    var input_name = $("#input_folder_name").val();
    input_name = input_name.trim()
    if (input_name && input_name != "") {
        $.ajax({
            url: "/add_folder/",
            type: "POST",
            data: $("#addFolderForm").serialize(),
            dataType: "json",
            success: function (data) {
                var add_status = data["add_status"],
                    is_same_name = data["is_same_name"];
                if (add_status == "false" && is_same_name == "true"
                ) {
                    toastr.warning("Folder with the same name exists !")
                    $("#input_folder_name").focus()
                } else if (add_status == "false") {
                    toastr.warning("Failed to Add \"" + input_name + "\" Folder");
                } else if (add_status == "true") {
                    toastr.success("\"" + input_name + "\" Folder Add Successfully ~");
                    setTimeout(function () {
                        window.location.reload();
                    }, 500);
                }
            },
            error: function () {
                toastr.error("Error , Please Try again !")
            }
        });
    } else {
        toastr.error("Folder Name can't be empty !")
    }
});

$("#modal_close").click(function () {
    $("#input_folder_name").val("")
});

