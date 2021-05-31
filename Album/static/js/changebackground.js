var len = 5;
var index = 1;
var imgs = []
var basic_url = '/static/image/welcome'
$(document).ready(function () {
    var now_img = new Image();
    now_img.src = basic_url + '0' + '.jpg';
    var now_img1 = new Image();
    now_img1.src = basic_url + '1' + '.jpg';
    imgs.push(now_img);
    imgs.push(now_img1);

    $("#alpha").css("backgroundImage", "url(" + imgs[0].src + ")");

    setInterval(function () {
        $("#alpha").css("backgroundImage", "url(" + imgs[(index++) % len].src + ")");
        if (index <= len) {
            var now_img = new Image();
            now_img.src = basic_url + index.toString() + '.jpg';
            imgs.push(now_img);
        }

    }, 6000);

    /* Rotating Text - Morphtext */
    $("#js-rotating").Morphext({
        // The [in] animation type. Refer to Animate.css for a list of available animations.
        animation: "fadeIn",
        // An array of phrases to rotate are created based on this separator. Change it if you wish to separate the phrases differently (e.g. So Simple | Very Doge | Much Wow | Such Cool).
        separator: ",",
        // The delay between the changing of each phrase in milliseconds.
        speed: 2000,
        complete: function () {
            // Called after the entrance animation is executed.
        }
    });

});

