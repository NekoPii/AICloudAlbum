var current_page_folder = 1;
var current_page_imgs = 1;
var folders;
var folder_count;
var imgs;
var img_count;
var currentPage = 0;
var page_num_folder = 5;
var page_num_img = 10;
var img_cnt = 0,
    folder_cnt = 0;
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
    $(".folder_select").prop("checked", false);
    $(".img_select").prop("checked", false);
    $("#select_img_cnt").val("0");
    $("#select_folder_cnt").val("0");
    $("#folder-pop").css("display", "none");


    $.getJSON("/ajax_folders/", function (data) {
        folders = data["folders"];
        folder_count = data["folder_count"];
        imgs = data["pictures"];
        img_count = data["img_count"];
        if (currentPage && folder_count > page_num_folder) {
            $("#folder_next").css("display", "inline-block");
        } else if (!currentPage && img_count > page_num_img) {
            $("#img_next").css("display", "inline-block");
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

    $("#all-tab-tabs-above").click(function () {
        currentPage = 0;
        $("#folder_next").css("display", "none");
        $("#folder_back").css("display", "none");
        $("#img_next").css("display", "none");
        $("#img_back").css("display", "none");
        if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs === 1) {
            $("#img_next").css("display", "inline-block");
        } else if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs > 1) {
            $("#img_next").css("display", "inline-block");
            $("#img_back").css("display", "inline-block");
        } else if ((img_count - current_page_imgs * page_num_img) <= 0 && current_page_imgs > 1) {
            $("#img_back").css("display", "inline-block");
        }
    })

    $("#folder-tab-tabs-above").click(function () {
        currentPage = 1;
        $("#img_next").css("display", "none");
        $("#img_back").css("display", "none");
        $("#folder_next").css("display", "none");
        $("#folder_back").css("display", "none");
        $("#image-pop").css("display", "none");
        $("#folder-pop").css("display", "");
        if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder === 1) {
            if ((folder_count - current_page_folder * 25) > 0 && current_page_folder === 1) {
                $("#folder_next").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder > 1) {
                $("#folder_next").css("display", "inline-block");
                $("#folder_back").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) <= 0 && current_page_folder > 1) {
                $("#folder_back").css("display", "inline-block");
            }
        }
    });

    $("#folder_back")
        .click(function () {
            if (current_page_folder > 1) {
                current_page_folder--;
                $("#folder_next").css("display", "inline-block")
                $("#folder_back").css("display", "inline-block")
                if (current_page_folder === 1) {
                    $("#folder_next").css("display", "inline-block")
                    $("#folder_back").css("display", "none")
                }
                for (var i = 1; i <= page_num_folder; i++) {
                    var pic_number = (current_page_folder - 1) * page_num_folder + i;
                    var element1 = "#folder_" + i + " .popup-with-move-anim";
                    var element2 = "#folder_" + i + " .element_1";
                    var element3 = "#folder_" + i + " .element_2";
                    var element4 = "#folder_" + i + " .choose_model_img";
                    var element5 = "#folder_" + i + " .element_3";
                    var element6 = "#folder_" + i + " .element_4";
                    var element7 = "#folder_" + i + " .element_5";

                    pic_number--;
                    $(element1).attr("title", folders[pic_number]["name"]);
                    $(element1).attr("href", folders[pic_number]["href"]);
                    $(element2).text(folders[pic_number]["name"]);
                    $(element3).css("backgroundImage", "url(" + folders[pic_number]["path"] + ")");
                    $(element4).attr("title", folders[pic_number]["name"]);
                    $(element5).text(folders[pic_number]["name"]);
                    $(element6).css("backgroundImage", "url(" + folders[pic_number]["path"] + ")");
                    $(element7).val(folders[pic_number]["fake_name"]);

                    pic_number++;
                    $("#folder_" + i).css("display", "block")
                    $("#folder_model_"+i).addClass("choose_model_img");

                }


            }

        })

    $("#folder_next")
        .click(function () {
            console.log("success");
            if ((folder_count - current_page_folder * page_num_folder) > 0) {
                $("#folder_next").css("display", "inline-block")
                $("#folder_back").css("display", "inline-block")
                console.log("success");
                if (folder_count - (1 + current_page_folder) * page_num_folder <= 0) {
                    $("#folder_next").css("display", "none")
                }
                for (var i = 1; i <= page_num_folder; i++) {
                    var pic_number = current_page_folder * page_num_folder + i;

                    if (pic_number <= folder_count) {
                        var element1 = "#folder_" + i + " .popup-with-move-anim";
                        var element2 = "#folder_" + i + " .element_1";
                        var element3 = "#folder_" + i + " .element_2";
                        var element4 = "#folder_" + i + " .choose_model_img";
                        var element5 = "#folder_" + i + " .element_3";
                        var element6 = "#folder_" + i + " .element_4";
                        var element7 = "#folder_" + i + " .element_5";

                        pic_number--;
                        $(element1).attr("title", folders[pic_number].name);
                        $(element1).attr("href", folders[pic_number]["href"]);
                        $(element2).text(folders[pic_number]["name"]);
                        $(element3).css("backgroundImage", "url(" + folders[pic_number]["path"] + ")");
                        $(element4).attr("title", folders[pic_number]["name"]);
                        $(element5).text(folders[pic_number]["name"]);
                        $(element6).css("backgroundImage", "url(" + folders[pic_number]["path"] + ")");
                        $(element7).val(folders[pic_number]["fake_name"]);

                        pic_number++;
                        $("#folder_" + i).css("display", "block");
                        $("#folder_model_"+i).addClass("choose_model_img");
                    } else {
                        $("#folder_model_"+i).removeClass("choose_model_img");
                        $("#folder_" + i).css("display", "none");
                    }

                }
                current_page_folder++;
            }

        })

    $("#img_back")
        .click(function () {
            if (current_page_imgs > 1) {
                current_page_imgs--;
                $("#img_next").css("display", "inline-block")
                $("#img_back").css("display", "inline-block")
                if (current_page_imgs === 1) {
                    $("#img_next").css("display", "inline-block")
                    $("#img_back").css("display", "none")
                }
                for (var i = 1; i <= page_num_img; i++) {
                    var img_number = (current_page_imgs - 1) * page_num_img + i;
                    var element1 = "#img_" + i + " .popup-with-move-anim";
                    var element2 = "#img_" + i + " .element_1";
                    var element3 = "#img_" + i + " .element_2";
                    var element4 = "#img_" + i + " .choose_model_img";
                    var element5 = "#img_" + i + " .element_3";
                    var element6 = "#img_" + i + " .element_4";
                    var element7 = "#img_" + i + " .element_5";
                    var element8 = "#box_" + i + " .element_6";
                    var element9 = "#box_" + i + " .element_7";
                    var element10 = "#box_" + i + " .element_8";
                    var element11 = "#box_" + i + " .element_9";
                    var element12 = "#box_" + i + " .element_10";
                    var element13 = "#box_" + i + " .element_11";
                    var element14 = "#box_" + i + " .element_12";
                    var element15 = "#box_" + i + " .element_13";

                    img_number--;
                    $(element1).attr("title", imgs[img_number]["name"]);
                    $(element2).text(imgs[img_number]["name"]);
                    $(element3).css("backgroundImage", "url(" + imgs[img_number]["path"] + ")");
                    $(element4).attr("title", imgs[img_number]["name"]);
                    $(element5).text(imgs[img_number]["name"]);
                    $(element6).css("backgroundImage", "url(" + imgs[img_number]["path"] + ")");
                    $(element7).val(imgs[img_number]["fake_name"]);
                    $(element8).attr("src", imgs[img_number]["path"]);
                    $(element8).attr("alt", imgs[img_number]["name"]);
                    $(element9).text(imgs[img_number]["name"]);
                    $(element10).text(imgs[img_number]["upload_time"]);
                    $(element11).text(imgs[img_number]["size"]);
                    $(element12).text(imgs[img_number]["height"]);
                    $(element13).text(imgs[img_number]["width"]);
                    $(element14).val(imgs[img_number]["tag"]);
                    $(element15).val(imgs[img_number]["fake_name"]);
                    img_number++;
                    $("#img_" + i).css("display", "block")
                    $("#box_" + i).css("display", "block")
                    $("#img_model_"+i).addClass("choose_model_img");

                }
            }
        })

    $("#img_next")
        .click(function () {
            if ((img_count - current_page_imgs * page_num_img) > 0) {
                $("#img_next").css("display", "inline-block")
                $("#img_back").css("display", "inline-block")
                if (img_count - (1 + current_page_imgs) * page_num_img <= 0) {
                    $("#img_next").css("display", "none")
                    $("#img_back").css("display", "inline-block")
                }
                for (var i = 1; i <= page_num_img; i++) {
                    var img_number = current_page_imgs * page_num_img + i;

                    if (img_number <= img_count) {
                        var element1 = "#img_" + i + " .popup-with-move-anim";
                        var element2 = "#img_" + i + " .element_1";
                        var element3 = "#img_" + i + " .element_2";
                        var element4 = "#img_" + i + " .choose_model_img";
                        var element5 = "#img_" + i + " .element_3";
                        var element6 = "#img_" + i + " .element_4";
                        var element7 = "#img_" + i + " .element_5";
                        var element8 = "#box_" + i + " .element_6";
                        var element9 = "#box_" + i + " .element_7";
                        var element10 = "#box_" + i + " .element_8";
                        var element11 = "#box_" + i + " .element_9";
                        var element12 = "#box_" + i + " .element_10";
                        var element13 = "#box_" + i + " .element_11";
                        var element14 = "#box_" + i + " .element_12";
                        var element15 = "#box_" + i + " .element_13";
                        img_number--;
                        $(element1).attr("title", imgs[img_number].name);
                        $(element2).text(imgs[img_number]["name"]);
                        $(element3).css("backgroundImage", "url(" + imgs[img_number]["path"] + ")");
                        $(element4).attr("title", imgs[img_number]["name"]);
                        $(element5).text(imgs[img_number]["name"]);
                        $(element6).css("backgroundImage", "url(" + imgs[img_number]["path"] + ")");
                        $(element7).val(imgs[img_number]["fake_name"]);
                        $(element8).attr("src", imgs[img_number]["path"]);
                        $(element8).attr("alt", imgs[img_number]["name"]);
                        $(element9).text(imgs[img_number]["name"]);
                        $(element10).text(imgs[img_number]["upload_time"]);
                        $(element11).text(imgs[img_number]["size"] + " MB");
                        $(element12).text(imgs[img_number]["height"] + " px");
                        $(element13).text(imgs[img_number]["width"] + " px");
                        $(element14).val(imgs[img_number]["tag"]);
                        $(element15).val(imgs[img_number]["fake_name"]);
                        img_number++;
                        $("#img_" + i).css("display", "block")
                        $("#box_" + i).css("display", "block")
                        $("#img_model_"+i).addClass("choose_model_img");

                    } else {
                        $("#img_model_"+i).removeClass("choose_model_img");
                        $("#img_" + i).css("display", "none")
                        $("#box_" + i).css("display", "none")
                    }

                }
                current_page_imgs++;

                resizeBy(100, 0)
                // resizeBy(-100,0)
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
                            duration: 1000,
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
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $(".upload_btn").fadeOut(500);
        $(this).val("view").attr("title", "return View");
        $("#imgs_change_model .select_text").css("display", "none");
        $("#imgs_change_model .view_text").css("display", "");
        $("#imgs_select_all").val("zero").attr("title", "Select All");
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
        $("#imageFewForm .popup-with-move-anim").css("display", "none");
        $("#imageFewForm .choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $("#imageFewForm .img_select").prop("checked", false);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $("#img_next").css("display", "none");
        $("#img_back").css("display", "none");
        $("#folder_next").css("display", "none");
        $("#folder_back").css("display", "none");

    } else if ($(this).val() === "view") {// 退出选择
        $(".upload_btn").fadeIn(500);
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $(this).val("select").attr("title", "Select");
        $("#imgs_change_model .select_text").css("display", "");
        $("#imgs_change_model .view_text").css("display", "none");
        $("#imgs_select_all").val("zero").attr("title", "Select All");
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
        $("#imageFewForm .img_select").prop("checked", false);
        $("#imageFewForm .choose_model_img").css("display", "none");
        $("#imageFewForm .popup-with-move-anim").css("display", "block");

        if (currentPage) {
            if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder === 1) {
                $("#folder_next").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder > 1) {
                $("#folder_next").css("display", "inline-block");
                $("#folder_back").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) <= 0 && current_page_folder > 1) {
                $("#folder_back").css("display", "inline-block");
            }
        } else {
            if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs === 1) {
                $("#img_next").css("display", "inline-block");
            } else if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs > 1) {
                $("#img_next").css("display", "inline-block");
                $("#img_back").css("display", "inline-block");
            } else if ((img_count - current_page_imgs * page_num_img) <= 0 && current_page_imgs > 1) {
                $("#img_back").css("display", "inline-block");
            }
        }
    }
});

$("#imageFewForm .choose_model_img").click(function () {

    if ($(this).find(".img_select").prop("checked") === true) {//已选中
        $(this).find(".img_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        img_cnt -= 1;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        if (img_cnt < $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("zero").attr("title", "Select All");
            $("#imgs_select_all .select_all_text").css("display", "");
            $("#imgs_select_all .cancel_text").css("display", "none");
        } else if (img_cnt === $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("all").attr("title", "Cnacel");
            $("#imgs_select_all .select_all_text").css("display", "none");
            $("#imgs_select_all .cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".img_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        img_cnt += 1;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        if (img_cnt < $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("zero").attr("title", "Select All");
            $("#imgs_select_all .select_all_text").css("display", "");
            $("#imgs_select_all .cancel_text").css("display", "none");
        } else if (img_cnt === $("#imageFewForm .choose_model_img").length) {
            $("#imgs_select_all").val("all").attr("title", "Cancel");
            $("#imgs_select_all .select_all_text").css("display", "none");
            $("#imgs_select_all .cancel_text").css("display", "");
        }
    }
});

$("#imgs_select_all").click(function () {
    if ($(this).val() === "zero" && img_cnt < $("#imageFewForm .choose_model_img").length) {
        $("#imageFewForm .choose_model_img .img_select").prop("checked", true);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 1);
        $("#imageFewForm .choose_model_img").css("border", "0.25rem solid #00C9FF");
        img_cnt = $("#imageFewForm .choose_model_img").length;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $(this).val("all").attr("title", "Cancel");
        $("#imgs_select_all .select_all_text").css("display", "none");
        $("#imgs_select_all .cancel_text").css("display", "");
    } else if ($(this).val() === "all" && img_cnt === $("#imageFewForm .choose_model_img").length) {
        $("#imageFewForm .choose_model_img .img_select").prop("checked", false);
        $("#imageFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#imageFewForm .choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $(this).val("zero").attr("title", "Select All");
        $("#imgs_select_all .select_all_text").css("display", "");
        $("#imgs_select_all .cancel_text").css("display", "none");
    }
});


$("#folders_change_model").click(function () {
    if ($(this).val() == "select") {//进行选择
        folder_cnt = 0;
        $(".folder_func1").fadeOut(500);
        $("#select_folder_cnt").val(folder_cnt.toString());
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $(this).val("view").attr("title", "return View");
        $("#folders_change_model .select_text").css("display", "none");
        $("#folders_change_model .view_text").css("display", "");
        $("#folders_select_all").val("zero").attr("title", "Select All");
        $("#folders_select_all .select_all_text").css("display", "");
        $("#folders_select_all .cancel_text").css("display", "none");
        $("#folderFewForm .popup-with-move-anim").css("display", "none");
        $("#folderFewForm .choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $("#folderFewForm .folder_select").prop("checked", false);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#img_next").css("display", "none");
        $("#img_back").css("display", "none");
        $("#folder_next").css("display", "none");
        $("#folder_back").css("display", "none");
    } else if ($(this).val() == "view") {// 退出选择
        $(".folder_func1").fadeIn(500);
        folder_cnt = 0;
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $("#select_folder_cnt").val(folder_cnt.toString());
        $(this).val("select");
        $("#folders_change_model .select_text").css("display", "");
        $("#folders_change_model .view_text").css("display", "none");
        $("#folders_select_all").val("zero").attr("title", "Select All")
        $("#folders_select_all .select_all_text").css("display", "");
        $("#folders_select_all .cancel_text").css("display", "none");
        $("#folderFewForm .choose_model_img").css("display", "none");
        $("#folderFewForm .folder_select").prop("checked", false);
        $("#folderFewForm .popup-with-move-anim").css("display", "block");

        if (currentPage) {
            if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder === 1) {
                $("#folder_next").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) > 0 && current_page_folder > 1) {
                $("#folder_next").css("display", "inline-block");
                $("#folder_back").css("display", "inline-block");
            } else if ((folder_count - current_page_folder * page_num_folder) <= 0 && current_page_folder > 1) {
                $("#folder_back").css("display", "inline-block");
            }
        } else {
            if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs === 1) {
                $("#img_next").css("display", "inline-block");
            } else if ((img_count - current_page_imgs * page_num_img) > 0 && current_page_imgs > 1) {
                $("#img_next").css("display", "inline-block");
                $("#img_back").css("display", "inline-block");
            } else if ((img_count - current_page_imgs * page_num_img) <= 0 && current_page_imgs > 1) {
                $("#img_back").css("display", "inline-block");
            }
        }

    }
});

$("#folderFewForm .choose_model_img").click(function () {

    if ($(this).find(".folder_select").prop("checked") === true) {//已选中
        $(this).find(".folder_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        folder_cnt -= 1;
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $("#select_folder_cnt").val(folder_cnt.toString());
        if (folder_cnt < $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("zero").attr("title", "Select All");
            $("#folders_select_all .select_all_text").css("display", "");
            $("#folders_select_all .cancel_text").css("display", "none");
        } else if (folder_cnt === $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("all").attr("title", "Cancel");
            $("#folders_select_all .select_all_text").css("display", "none");
            $("#folders_select_all .cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".folder_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        folder_cnt += 1;
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $("#select_folder_cnt").val(folder_cnt.toString());
        if (folder_cnt < $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("zero").attr("title", "Select All");
            $("#folders_select_all .select_all_text").css("display", "");
            $("#folders_select_all .cancel_text").css("display", "none");
        } else if (folder_cnt === $("#folderFewForm .choose_model_img").length) {
            $("#folders_select_all").val("all").attr("title", "Cancel");
            $("#folders_select_all .select_all_text").css("display", "none");
            $("#folders_select_all .cancel_text").css("display", "");
        }
    }
});

$("#folders_select_all").click(function () {
    if ($(this).val() === "zero" && folder_cnt < $("#folderFewForm .choose_model_img").length) {
        $("#folderFewForm .choose_model_img .folder_select").prop("checked", true);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 1);
        $("#folderFewForm .choose_model_img").css("border", "0.25rem solid #00C9FF");
        folder_cnt = $("#folderFewForm .choose_model_img").length;
        $("#select_folder_cnt").val(folder_cnt.toString());
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $(this).val("all").attr("title", "Cancel");
        $("#folders_select_all .select_all_text").css("display", "none");
        $("#folders_select_all .cancel_text").css("display", "");
    } else if ($(this).val() === "all" && folder_cnt === $("#folderFewForm .choose_model_img").length) {
        $("#folderFewForm .choose_model_img .folder_select").prop("checked", false);
        $("#folderFewForm .choose_zoomImage11").css("opacity", 0.5);
        $("#folderFewForm .choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        folder_cnt = 0;
        $("#select_folder_cnt").val(folder_cnt.toString());
        $("#folders_delete_few").attr("title", "Delete " + folder_cnt.toString() + " Folder(s)")
        $(this).val("zero").attr("title", "Select All");
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

