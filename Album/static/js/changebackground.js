var arrImg = ['/static/image/welcome0.jpg', '/static/image/welcome1.jpg', '/static/image/welcome2.jpg', '/static/image/welcome3.jpg', '/static/image/welcome4.jpg'];
var len = arrImg.length;
var index = 1;

$(document).ready(function () {
    $("#alpha").css("backgroundImage", "url(" + arrImg[0] + ")");

    setInterval(function () {
        $("#alpha").css("backgroundImage", "url(" + arrImg[(index++) % len] + ")");
    }, 10000);

});

