var current_page = 1;
var pics;
var pics_count;
(function ($) {
    "use strict";
    var now_folder_fake_name = $("#now_folder_fake_name").val()


    $("#change_model").val("select");
    $(".choose_model_img").css("display", "none");
    $("#imgs_download_few").css("display", "none");
    $("#imgs_delete_few").css("display", "none");
    $("#getFewFaceRec").css("display", "none");
    $("#select_all").css("display", "none");
    $(".download_select").prop("checked", false);


    $.getJSON("/ajax_pics/" + now_folder_fake_name + "/", function (data) {
        pics = data["pics"];
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
                    $(element11).text(pics[pic_number]["size"]);
                    $(element12).text(pics[pic_number]["height"]);
                    $(element13).text(pics[pic_number]["width"]);
                    $(element14).val(pics[pic_number]["tag"]);
                    $(element15).val(pics[pic_number]["fake_name"]);
                    pic_number++;
                    $("#img_" + i).css("display", "block")
                    $("#box_" + i).css("display", "block")

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
                        $(element14).val(pics[pic_number]["tag"]);
                        $(element15).val(pics[pic_number]["fake_name"]);
                        pic_number++;
                        $("#img_" + i).css("display", "block")
                        $("#box_" + i).css("display", "block")

                    } else {

                        $("#img_" + i).css("display", "none")
                        $("#box_" + i).css("display", "none")
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
        cnt = 0;
        $(".upload_btn").css("display", "none");
        $("#next").css("display", "none");
        $("#back").css("display", "none");
        $(this).val("view");
        $(".select_text").css("display", "none");
        $(".view_text").css("display", "");
        $("#imgs_download_few").css("display", "flex")
        $("#imgs_delete_few").css("display", "flex");
        $("#getFewFaceRec").css("display", "flex");
        $("#select_all").css("display", "flex");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
        $(".popup-with-move-anim").css("display", "none");
        $(".choose_model_img").css("display", "block").css("border", "0.25rem dashed #d7d2cc");
        $(".download_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        $(".select_cnt").text(cnt.toString());
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
        $(".select_text").css("display", "");
        $(".view_text").css("display", "none");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
        $("#imgs_download_few").css("display", "none")
        $("#imgs_delete_few").css("display", "none");
        $("#getFewFaceRec").css("display", "none");
        $("#select_all").val("zero").css("display", "none");
        $(".choose_model_img").css("display", "none");
        $(".popup-with-move-anim").css("display", "block");
        $(".download_select").prop("checked", false);
    }
});

$(".choose_model_img").click(function () {

    if ($(this).find(".download_select").prop("checked") === true) {//已选中
        $(this).find(".download_select").prop("checked", false);
        $(this).find(".choose_zoomImage11").css("opacity", 0.5);
        $(this).css("border", "0.25rem dashed #d7d2cc")
        cnt -= 1;
        $(".select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (cnt === $(".choose_model_img").length) {
            $("#select_all").val("all");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    } else {//未选中
        $(this).find(".download_select").prop("checked", true);
        $(this).find(".choose_zoomImage11").css("opacity", 1);
        $(this).css("border", "0.25rem solid #00C9FF");
        cnt += 1;
        $(".select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $(".select_all_text").css("display", "");
            $(".cancel_text").css("display", "none");
        } else if (cnt === $(".choose_model_img").length) {
            $("#select_all").val("all");
            $(".select_all_text").css("display", "none");
            $(".cancel_text").css("display", "");
        }
    }
});

$("#select_all").click(function () {
    if ($(this).val() === "zero" && cnt < $(".choose_model_img").length) {
        $(".download_select").prop("checked", true);
        $(".choose_zoomImage11").css("opacity", 1);
        $(".choose_model_img").css("border", "0.25rem solid #00C9FF");
        cnt = $(".choose_model_img").length;
        $(".select_cnt").text(cnt.toString());
        $(this).val("all");
        $(".select_all_text").css("display", "none");
        $(".cancel_text").css("display", "");
    } else if ($(this).val() === "all" && cnt === $(".choose_model_img").length) {
        $(".download_select").prop("checked", false);
        $(".choose_zoomImage11").css("opacity", 0.5);
        $(".choose_model_img").css("border", "0.25rem dashed #d7d2cc");
        cnt = 0;
        $(".select_cnt").text(cnt.toString());
        $(this).val("zero");
        $(".select_all_text").css("display", "");
        $(".cancel_text").css("display", "none");
    }
});