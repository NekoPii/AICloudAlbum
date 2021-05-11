(function ($) {
    "use strict";

    var cnt = 0;
    $("#change_model").val("select");
    $(".choose_model_img").css("display", "none");
    $("#download_few").css("display", "none")
    $("#select_all").css("display", "none")
    $(".download_select").prop("checked", false);
    /* Counter - CountTo */
    var a = 0;
    $(window).scroll(function () {
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
    /* Card Slider - Swiper */
    var cardSlider = new Swiper('.card-slider', {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 3,
        spaceBetween: 20,
        breakpoints: {
            // when window is <= 992px
            992: {
                slidesPerView: 2
            },
            // when window is <= 768px
            768: {
                slidesPerView: 1
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

    /* Filter - Isotope */
    var $grid = $('.grid').isotope({
        // options
        itemSelector: '.element-item',
        layoutMode: 'fitRows'
    });

    // filter items on button click
    $('.filters-button-group').on('click', 'a', function () {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({filter: filterValue});
    });

    // change is-checked class on buttons
    $('.button-group').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'a', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

})(jQuery);

$("#change_model").click(function () {
    if ($(this).val() == "select") {//进行选择
        $(this).val("view");
        $(this).text("VIEW");
        $("#download_few").css("display", "inline-block")
        $("#select_all").css("display", "inline-block")
        $(".popup-with-move-anim").css("display", "none");
        $(".choose_model_img").css("display", "block").css("border", "0.25rem solid red");
        $(".download_select").prop("checked", false);
        cnt = 0;
    } else if ($(this).val() == "view") {// 退出选择
        $(this).val("select");
        $(this).text("SELECT");
        $("#download_few").css("display", "none")
        $("#select_all").css("display", "none")
        $(".choose_model_img").css("display", "none");
        $(".popup-with-move-anim").css("display", "block");
        cnt = 0;
    }
});

$(".choose_model_img").click(function () {

    if ($(this).find(".download_select").prop("checked") == true) {//已选中
        $(this).find(".download_select").prop("checked", false);
        $(this).css("border", "0.25rem solid red")
        cnt -= 1;
        $("#select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $("#select_all").text("SELECT ALL");
        } else if (cnt == $(".choose_model_img").length) {
            $("#select_all").val("all");
            $("#select_all").text("CANCEL");
        }
    } else {//未选中
        $(this).find(".download_select").prop("checked", true);
        $(this).css("border", "0.25rem solid #8DC26F");
        cnt += 1;
        $("#select_cnt").text(cnt.toString());
        if (cnt < $(".choose_model_img").length) {
            $("#select_all").val("zero");
            $("#select_all").text("SELECT ALL");
        } else if (cnt == $(".choose_model_img").length) {
            $("#select_all").val("all");
            $("#select_all").text("CANCEL");
        }
    }
});

$("#select_all").click(function () {
    if ($(this).val() == "zero" && cnt < $(".choose_model_img").length) {
        $(".download_select").prop("checked", true);
        $(".choose_model_img").css("border", "0.25rem solid #8DC26F");
        cnt = $(".choose_model_img").length;
        $("#select_cnt").text(cnt.toString());
        $(this).val("all");
        $(this).text("CANCEL");
    } else if ($(this).val() == "all" && cnt == $(".choose_model_img").length) {
        $(".download_select").prop("checked", false);
        $(".choose_model_img").css("border", "0.25rem solid red");
        cnt = 0;
        $("#select_cnt").text(cnt.toString());
        $(this).val("zero");
        $(this).text("SELECT ALL");
    }
});