$(document).ready(function () {

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            $('body').addClass('loaded');
            setTimeout(function () {
                $("#loader-wrapper")[0].style.display = "none";
            }, 400);
            /*这里400ms是由main.css里的.loaded #loader以及#loader-wrapper的动画时间为0.3s决定 */
        }
    }
});