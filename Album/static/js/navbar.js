/* Template: Aria - Business HTML Landing Page Template
   Author: Inovatik
   Created: Jul 2019
   Description: Custom JS file
*/

var max_search_len = 25;

(function ($) {
    "use strict";

    /* Sidebar */

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

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function (event) {
        if (!$(this).parent().hasClass('dropdown'))
            $(".navbar-collapse").collapse('hide');
    });


    //Search Tag Input
    $(document).on('scroll', function () {
        $("#input_search_tag").blur();
    })

    $("#input_search_tag").bind("keypress", function (event) {
        if (event.keyCode === 13) {
            var search_tag = $(this).val();
            search_tag = search_tag.trim();
            if (search_tag && search_tag != "") {
                var search_form = $("#search_tag");
                search_form.attr("method", "get");
                search_form.attr("action", "/search/");
                if (search_tag.length > max_search_len) {
                    $(this).val(search_tag.substr(0, max_search_len));
                }
                search_form.submit();
            } else if (search_tag.length < 50) {
                toastr.error("Search content can't be empty !")
            }
        }
    });

    $("#search_btn").click(function () {
        $("#input_search_tag").focus();
    });


})(jQuery);

