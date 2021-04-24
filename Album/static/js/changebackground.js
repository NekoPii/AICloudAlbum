var arrImg = ['/static/image/welcome0.jpg', '/static/image/welcome1.jpg', '/static/image/welcome2.jpg', '/static/image/welcome3.jpg', '/static/image/welcome4.jpg'];
var len = arrImg.length;
var index = 1;

var imgs=[]
for(i=0;i<len;++i)
{
    var now_img=new Image();
    now_img.src=arrImg[i];
    imgs.push(now_img);
}



$(document).ready(function () {
    $("#alpha").css("backgroundImage","url("+imgs[0].src+")");

    setInterval(function () {
        $("#alpha").css("backgroundImage",  "url("+imgs[(index++)%len].src+")");
    }, 1000);

});

