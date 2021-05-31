var current_page = 1;
var pics;
var count;
var page_num_img = 10;
var img_cnt = 0;
(function ($) {
    "use strict";

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
        }
    });

    var now_tag = $("#now_tag").val()


    $("#change_model").val("select");
    $(".choose_model_img").css("display", "none");
    $(".download_select").prop("checked", false);
    $("#select_img_cnt").val("0");


    $.getJSON("/ajax_pics_tag/" + now_tag + "/", function (data) {
        pics = data["pics"];
        count = data["count"];
        if (count > page_num_img) {
            $("#next").css("display", "inline-block");
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
        .click(function () {
            if (current_page > 1) {
                current_page--;
                $("#next").css("display", "inline-block")
                $("#back").css("display", "inline-block")
                if (current_page === 1) {
                    $("#next").css("display", "inline-block")
                    $("#back").css("display", "none")
                }
                for (var i = 1; i <= page_num_img; i++) {
                    var pic_number = (current_page - 1) * page_num_img + i;
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

                    pic_number--;
                    $(element1).attr("title", pics[pic_number]["name"]);
                    $(element2).text(pics[pic_number]["name"]);
                    $(element3).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                    $(element4).attr("title", pics[pic_number]["name"]);
                    $(element5).text(pics[pic_number]["name"]);
                    $(element6).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                    $(element7).val(pics[pic_number]["fake_name"]);
                    $(element8).attr("src", pics[pic_number]["path"]);
                    $(element8).attr("alt", pics[pic_number]["name"]);
                    $(element9).text(pics[pic_number]["name"]);
                    $(element10).text(pics[pic_number]["upload_time"]);
                    $(element11).text(pics[pic_number]["size"] + " MB");
                    $(element12).text(pics[pic_number]["height"] + " px");
                    $(element13).text(pics[pic_number]["width"] + " px");
                    $(element14).text(pics[pic_number]["tag"]);
                    $(element15).val(pics[pic_number]["fake_name"]);
                    pic_number++;
                    $("#img_" + i).css("display", "block");
                    $("#box_" + i).css("display", "block");
                    $("#img_model_" + i).addClass("choose_model_img");

                }
            }
        })

    $("#next")
        .click(function () {
            if ((count - current_page * page_num_img) > 0) {
                $("#next").css("display", "inline-block")
                $("#back").css("display", "inline-block")
                if (count - (1 + current_page) * page_num_img <= 0) {
                    $("#next").css("display", "none")
                    $("#back").css("display", "inline-block")
                }
                for (var i = 1; i <= page_num_img; i++) {
                    var pic_number = current_page * page_num_img + i;

                    if (pic_number <= count) {
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
                        pic_number--;
                        $(element1).attr("title", pics[pic_number].name);
                        $(element2).text(pics[pic_number]["name"]);
                        $(element3).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                        $(element4).attr("title", pics[pic_number]["name"]);
                        $(element5).text(pics[pic_number]["name"]);
                        $(element6).css("backgroundImage", "url(" + pics[pic_number]["path"] + ")");
                        $(element7).val(pics[pic_number]["fake_name"]);
                        $(element8).attr("src", pics[pic_number]["path"]);
                        $(element8).attr("alt", pics[pic_number]["name"]);
                        $(element9).text(pics[pic_number]["name"]);
                        $(element10).text(pics[pic_number]["upload_time"]);
                        $(element11).text(pics[pic_number]["size"] + " MB");
                        $(element12).text(pics[pic_number]["height"] + " px");
                        $(element13).text(pics[pic_number]["width"] + " px");
                        $(element14).text(pics[pic_number]["tag"]);
                        $(element15).val(pics[pic_number]["fake_name"]);
                        pic_number++;
                        $("#img_" + i).css("display", "block")
                        $("#box_" + i).css("display", "block")
                        $("#img_model_" + i).addClass("choose_model_img");

                    } else {

                        $("#img_" + i).css("display", "none")
                        $("#box_" + i).css("display", "none")
                        $("#img_model_" + i).removeClass("choose_model_img");
                    }

                }
                current_page++;

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

    /* Lightbox - Magnific Popup */
    $('.popup-with-move-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });


})(jQuery);

$("#change_model").click(function () {
    if ($(this).val() === "select") {//进行选择
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $(".upload_btn").fadeOut(500);
        $(this).val("view").attr("title", "return View");
        $("#select_all").val("zero").attr("title", "Select All");
        $(".select_text").css("display", "none");
        $(".view_text").css("display", "");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
        $(".popup-with-move-anim").css("display", "none");
        $(".choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $(".download_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $("#next").css("display", "none");
        $("#back").css("display", "none");

    } else if ($(this).val() === "view") {// 退出选择
        $(".upload_btn").fadeIn(500);
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $(this).val("select").attr("title", "Select");
        $(".select_text").css("display", "");
        $(".view_text").css("display", "none");
        $("#select_all").val("zero").attr("title", "Select All");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
        $(".choose_model_img").css("display", "none");
        $(".popup-with-move-anim").css("display", "block");
        $(".download_select").prop("checked", false);

        if ((count - current_page * page_num_img) > 0 && current_page === 1) {
            $("#next").css("display", "inline-block");
        } else if ((count - current_page * page_num_img) > 0 && current_page > 1) {
            $("#next").css("display", "inline-block");
            $("#back").css("display", "inline-block");
        } else if ((count - current_page * page_num_img) <= 0 && current_page > 1) {
            $("#back").css("display", "inline-block");
        }
    }
});

$(".choose_model_img").click(function () {

    if ($(this).find(".download_select").prop("checked") === true) {//已选中
        $(this).find(".download_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        img_cnt -= 1;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        if (img_cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero").attr("title", "Select All");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (img_cnt === $(".choose_model_img").length) {
            $("#select_all").val("all").attr("title", "Cnacel");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".download_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        img_cnt += 1;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        if (img_cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero").attr("title", "Select All");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (img_cnt === $(".choose_model_img").length) {
            $("#select_all").val("all").attr("title", "Cancel");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    }
});

$("#select_all").click(function () {
    if ($(this).val() === "zero" && img_cnt < $(".choose_model_img").length) {
        $(".choose_model_img .download_select").prop("checked", true);
        $(".choose_zoomImage11").css("opacity", 1);
        $(".choose_model_img").css("border", "0.25rem solid #00C9FF");
        img_cnt = $(".choose_model_img").length;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $(this).val("all").attr("title", "Cancel");
        $(".select_all_text").css("display", "none");
        $(".cancel_text").css("display", "");
    } else if ($(this).val() === "all" && img_cnt === $(".choose_model_img").length) {
        $(".choose_model_img .download_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        $(".choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        img_cnt = 0;
        $("#select_img_cnt").val(img_cnt.toString());
        $("#imgs_download_few").attr("title", "Download " + img_cnt.toString() + " Image(s)")
        $("#imgs_delete_few").attr("title", "Delete " + img_cnt.toString() + " Image(s)")
        $(this).val("zero").attr("title", "Select All");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
    }
});