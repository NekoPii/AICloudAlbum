(function ($) {

    document.onreadystatechange = show;

    function show() {
        if (document.readyState == "complete" || document.readyState == "interactive") {
            $('body').addClass('loaded');
            setTimeout(function () {
                $("#loader-wrapper")[0].style.display = "none";
            }, 400);
            /*这里400ms是由main.css里的.loaded #loader以及#loader-wrapper的动画时间为0.3s决定 */
        }
    }

})(jQuery);