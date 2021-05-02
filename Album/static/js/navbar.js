/* Template: Aria - Business HTML Landing Page Template
   Author: Inovatik
   Created: Jul 2019
   Description: Custom JS file
*/


(function ($) {
    "use strict";

    /* Navbar Scripts */
    // jQuery to collapse the navbar on scroll
    $(window).on('scroll load', function () {
        if ($(".navbar").offset().top > 20) {
            $(".fixed-top").addClass("top-nav-collapse");
        } else {
            $(".fixed-top").removeClass("top-nav-collapse");
        }
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(function () {
        $(document).on('click', 'a.page-scroll', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 600, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    $('#search_1').bind('keyup', function (event) {

        if (event.keyCode == "13") {

            //回车执行查询

            console.log('click');
            ;

        }

    });

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function (event) {
        if (!$(this).parent().hasClass('dropdown'))
            $(".navbar-collapse").collapse('hide');
    });

    $('.item.sidebar-button-nav').on("click", function (event) {

        $('.ui.sidebar').sidebar({
                context: 'body',
                dimPage: false,
                scrollLock: true,
                transition: 'overlay',
                onVisible: function () {
                    $('#alpha').addClass('pushable');
                },
                onShow: function () {
                    var mo = function (e) {
                        passive: false;
                    };
                    document.body.style.overflow = 'hidden';
                    document.addEventListener("touchmove", mo, false);
                    //$('#alpha').removeClass('pushable');
                },
                onHide: function () {
                    $('#alpha').addClass('pushable');
                },
                onHidden: function () {
                    var mo = function (e) {
                        passive: false
                    };
                    document.body.style.overflow = '';//出现滚动条
                    document.removeEventListener("touchmove", mo, false);
                    $('#alpha').removeClass('pushable');
                }
            }
        )
            .sidebar('toggle');

        // $('#alpha').removeClass('pushable');
    });
    $('.sidebar-button-side').on("click", function (event) {
        $('.ui.sidebar').sidebar('hide');

    })

    $(".item.i1").hover(function (){
        $(".item.i1").css('background-color','rgb(245,245,245)');
    },
        function (){
        $(".item.i1").css('background-color','white');
    })
    $(".item.i2").hover(function (){
        $(".item.i2").css('background-color','rgb(245,245,245)');
    },
        function (){
        $(".item.i2").css('background-color','white');
    })
    $(".item.i3").hover(function (){
        $(".item.i3").css('background-color','rgb(245,245,245)');
    },
        function (){
        $(".item.i3").css('background-color','white');
    })
    $(".item.i4").hover(function (){
        $(".item.i4").css('background-color','rgb(245,245,245)');
    },
        function (){
        $(".item.i4").css('background-color','white');
    })



})(jQuery);