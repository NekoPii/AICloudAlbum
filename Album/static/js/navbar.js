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
            if (search_tag !== "" && search_tag) {
                $.ajax({
                    url: "/search_tag/",
                    type: "POST",
                    data: $("#search_tag").serialize(),
                    dataType: "json",
                    success: function (data) {
                        var search_status = data["search_status"];
                        if (search_status === "false")
                         {
                            toastr.warning("Tag doesn't exist !")
                            $("#input_search_tag").focus()
                        } else if (search_status === "true") {
                            toastr.success("\"" + search_tag + "\" Images Find Successfully ~");
                        }
                    },
                    error: function () {
                        toastr.error("Error , Please Try again !")
                    }
                });
            } else {
                $(this).blur();
                toastr.error("Search Tag can't be empty !");
                return;
            }
            toastr.success("Success !");
        }
    });


})(jQuery);