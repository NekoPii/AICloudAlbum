
var arrImg = ['/static/image/welcome1.jpg', '/static/image/welcome2.jpg', '/static/image/welcome3.jpg'];
var len = arrImg.length;
var index=0;

$(document).ready(function () {

    console.log("99999");

        setInterval(function () {
            $("#alpha").css("backgroundImage","url("+arrImg[(index++)%len]+")");


        }, 10000);

});

