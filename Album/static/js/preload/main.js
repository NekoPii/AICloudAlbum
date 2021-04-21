$(document).ready(function () {

    setTimeout(function () {
        $('body').addClass('loaded');
        /*$('h1').css('color', '#222222');*/
    }, 500);
    setTimeout(function () {
        $("#loader-wrapper")[0].style.display = "none";
    }, 800);
    /*这里差的300ms是由main.css里的.loaded #loader以及#loader-wrapper的动画时间为0.3s决定 */

});