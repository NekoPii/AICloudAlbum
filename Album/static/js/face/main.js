var current_page = 1;
var faces;
var count;
var page_num_face = 5;
(function ($) {

    $.getJSON("/ajax_faces/", function (data) {
        faces = data["faces"];
        count = data["count"];
        if (count > page_num_face) {
            $("#next").css("display", "inline-block");
        }
    });

    $("#top").hide()
        .on("click", function () {
            $('html, body').animate({scrollTop: 0}, 300);
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
                for (var i = 1; i <= page_num_face; i++) {
                    var pic_number = (current_page - 1) * page_num_face + i;
                    var element1 = "#faces_" + i + " .element_1";
                    var element2 = "#faces_" + i + " .element_2";

                    pic_number--;
                    $(element1).attr("href", faces[pic_number]["href"]);
                    $(element2).css("backgroundImage", "url(" + faces[pic_number]["path"] + ")");

                    pic_number++;
                    $("#faces_" + i).css("display", "block")

                }
            }
        })

    $("#next")
        .click(function () {
            if ((count - current_page * page_num_face) > 0) {
                $("#next").css("display", "inline-block")
                $("#back").css("display", "inline-block")
                console.log("success");
                if (count - (1 + current_page) * page_num_face <= 0) {
                    $("#next").css("display", "none")
                }
                for (var i = 1; i <= page_num_face; i++) {
                    var pic_number = current_page * page_num_face + i;

                    if (pic_number <= count) {
                        var element1 = "#faces_" + i + " .element_1";
                        var element2 = "#faces_" + i + " .element_2";

                        pic_number--;
                        $(element1).attr("href", faces[pic_number]["href"]);
                        $(element2).css("backgroundImage", "url(" + faces[pic_number]["path"] + ")");

                        pic_number++;
                        $("#faces_" + i).css("display", "block");
                    } else {
                        $("#faces_" + i).css("display", "none");
                    }

                }
                current_page++;
            }

        })

})(jQuery);