var current_page = 1;
var pics;
var pics_count;
(function ($) {
    "use strict";

    /*
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
     */


    $("#folders_change_model").val("select");
    $("#imgs_change_model").val("select");
    $(".choose_model_img").css("display", "none");
    $("#folders_delete_few").css("display", "none");
    $("#folders_select_all").css("display", "none");
    $("#imgs_delete_few").css("display", "none");
    $("#imgs_select_all").css("display", "none");
    $(".folder_select").prop("checked", false);
    $(".img_select").prop("checked", false);


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

    $('#imageFewForm .popup-with-move-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: true,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });

})(jQuery);

$('.nav-item [data-toggle="tab"]').on('click', function (event) {

    console.log($(this).data("value"));
});

$("#imgs_change_model").click(function () {
    if ($(this).val() === "select") {//进行选择
        cnt = 0;
        $(".upload_btn").css("display", "none");
        $("#next").css("display", "none");
        $("#back").css("display", "none");
        $(this).val("view");
        $("#imgs_change_model .select_text").css("display", "none");
        $("#imgs_change_model .view_text").css("display", "");
        $("#imgs_download_few").css("display", "flex")
        $("#imgs_delete_few").css("display", "flex")
        $("#imgs_select_all").css("display", "flex").val("zero")
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
        $("#imageFewForm .popup-with-move-anim").css("display", "none");
        $("#imageFewForm .choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $("#imageFewForm .img_select").prop("checked", false);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 0.5);
        $(".imgs_select_cnt").text(cnt.toString());
    } else if ($(this).val() === "view") {// 退出选择
        $(".upload_btn").css("display", "flex");
        if (current_page === 1) {
            $("#next").css("display", "inline-block");
        } else if ((pics_count - current_page * 25) < 0) {
            $("#back").css("display", "inline-block");
        } else {
            $("#next").css("display", "inline-block");
            $("#back").css("display", "inline-block");
        }

        cnt = 0;
        $(this).val("select");
        $("#imgs_change_model .select_text").css("display", "");
        $("#imgs_change_model .view_text").css("display", "none");
        $("#imgs_download_few").css("display", "none")
        $("#imgs_delete_few").css("display", "none")
        $("#imgs_select_all").css("display", "none").val("zero")
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
        $("#imageFewForm .img_select").prop("checked", false);
        $("#imageFewForm .choose_model_img").css("display", "none");
        $("#imageFewForm .popup-with-move-anim").css("display", "block");
    }
});

$("#imageFewForm .choose_model_img").click(function () {

    if ($(this).find(".img_select").prop("checked") === true) {//已选中
        $(this).find(".img_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        cnt -= 1;
        $(".imgs_select_cnt").text(cnt.toString());
        console.log("cnt:" + cnt)
        console.log("len:" + $("#imageFewForm .choose_model_img").length)
        if (cnt < $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("zero");
            $("#imgs_select_all .select_all_text").css("display", "");
            $("#imgs_select_all .cancel_text").css("display", "none");
        } else if (cnt === $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("all");
            $("#imgs_select_all .select_all_text").css("display", "none");
            $("#imgs_select_all .cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".img_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        cnt += 1;
        $(".imgs_select_cnt").text(cnt.toString());
        console.log("cnt:" + cnt)
        console.log("len:" + $("#imageFewForm .choose_model_img").length)
        if (cnt < $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("zero");
            $("#imgs_select_all .select_all_text").css("display", "");
            $("#imgs_select_all .cancel_text").css("display", "none");
        } else if (cnt === $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("all");
            $("#imgs_select_all .select_all_text").css("display", "none");
            $("#imgs_select_all .cancel_text").css("display", "");
        }
    }
});

$("#imgs_select_all").click(function () {
    console.log("select_all:cnt" + cnt);
    console.log("select_all:len" + $("#imageFewForm .choose_model_img").length);
    if ($(this).val() === "zero" && cnt < $("#imageFewForm .choose_model_img").length) {
        $("#imageFewForm .img_select").prop("checked", true);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 1);
        $("#imageFewForm .choose_model_img").css("border", "0.25rem solid #00C9FF");
        cnt = $("#imageFewForm .choose_model_img").length;
        $(".imgs_select_cnt").text(cnt.toString());
        $(this).val("all");
        $("#imgs_select_all .select_all_text").css("display", "none");
        $("#imgs_select_all .cancel_text").css("display", "");
    } else if ($(this).val() === "all" && cnt === $("#imageFewForm .choose_model_img").length) {
        $("#imageFewForm .img_select").prop("checked", false);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#imageFewForm .choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        cnt = 0;
        $(".imgs_select_cnt").text(cnt.toString());
        $(this).val("zero");
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
    }
});


$("#folders_change_model").click(function () {
    if ($(this).val() == "select") {//进行选择
        cnt = 0;
        $(".folder_add").css("display", "none");
        $("#next").css("display", "none");
        $("#back").css("display", "none");
        $(this).val("view");
        $("#folders_change_model .select_text").css("display", "none");
        $("#folders_change_model .view_text").css("display", "");
        $("#folders_delete_few").css("display", "flex")
        $("#folders_select_all").css("display", "flex").val("zero")
        $("#folders_select_all .select_all_text").css("display", "");
        $("#folders_select_all .cancel_text").css("display", "none");
        $("#folderFewForm .popup-with-move-anim").css("display", "none");
        $("#folderFewForm .choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $("#folderFewForm .folder_select").prop("checked", false);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#folders_select_cnt").text(cnt.toString());
    } else if ($(this).val() == "view") {// 退出选择
        $(".folder_add").css("display", "flex");
        if (current_page === 1) {
            $("#next").css("display", "inline-block");
        } else if ((pics_count - current_page * 25) < 0) {
            $("#back").css("display", "inline-block");
        } else {
            $("#next").css("display", "inline-block");
            $("#back").css("display", "inline-block");
        }

        cnt = 0;
        $(this).val("select");
        $("#folders_change_model .select_text").css("display", "");
        $("#folders_change_model .view_text").css("display", "none");
        $("#folders_delete_few").css("display", "none")
        $("#folders_select_all").css("display", "none").val("zero")
        $("#folders_select_all .select_all_text").css("display", "");
        $("#folders_select_all .cancel_text").css("display", "none");
        $("#folderFewForm .choose_model_img").css("display", "none");
        $("#folderFewForm .folder_select").prop("checked", false);
        $("#folderFewForm .popup-with-move-anim").css("display", "block");

    }
});

$("#folderFewForm .choose_model_img").click(function () {

    if ($(this).find(".folder_select").prop("checked") === true) {//已选中
        $(this).find(".folder_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        cnt -= 1;
        $("#folders_select_cnt").text(cnt.toString());
        if (cnt < $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("zero");
            $("#folders_select_all .select_all_text").css("display", "");
            $("#folders_select_all .cancel_text").css("display", "none");
        } else if (cnt === $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("all");
            $("#folders_select_all .select_all_text").css("display", "none");
            $("#folders_select_all .cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".folder_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        cnt += 1;
        $("#folders_select_cnt").text(cnt.toString());
        if (cnt < $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("zero");
            $("#folders_select_all .select_all_text").css("display", "");
            $("#folders_select_all .cancel_text").css("display", "none");
        } else if (cnt === $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("all");
            $("#folders_select_all .select_all_text").css("display", "none");
            $("#folders_select_all .cancel_text").css("display", "");
        }
    }
});

$("#folders_select_all").click(function () {
    if ($(this).val() === "zero" && cnt < $("#folderFewForm .choose_model_img").length) {
        $("#folderFewForm .folder_select").prop("checked", true);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 1);
        $("#folderFewForm .choose_model_img").css("border", "0.25rem solid #00C9FF");
        cnt = $("#folderFewForm .choose_model_img").length;
        $("#folders_select_cnt").text(cnt.toString());
        $(this).val("all");
        $("#folders_select_all .select_all_text").css("display", "none");
        $("#folders_select_all .cancel_text").css("display", "");
    } else if ($(this).val() === "all" && cnt === $("#folderFewForm .choose_model_img").length) {
        $("#folderFewForm .folder_select").prop("checked", false);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#folderFewForm .choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        cnt = 0;
        $("#folders_select_cnt").text(cnt.toString());
        $(this).val("zero");
        $("#folders_select_all .select_all_text").css("display", "");
        $("#folders_select_all .cancel_text").css("display", "none");
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
                            window.location.href = "?t=f";
                            //$("#folder-tab-tabs-above").click();
                        }, 400);
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

$("#add_modal_ok").click(function () {
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
                        window.location.href = "?t=f";
                        //$("#folder-tab-tabs-above").click();
                    }, 400);
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

$("#add_modal_close").click(function () {
    $("#input_folder_name").val("")
});

