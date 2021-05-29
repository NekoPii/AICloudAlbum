(function ($) {

    document.onreadystatechange = show;

    function show() {
        if (document.readyState == "complete" || document.readyState == "interactive") {
            $('body').addClass('loaded');
            var t = getQueryString("t");
            if (t) {
                if (t === "f") {
                    $("#folder-tab-tabs-above").click();
                }
                if (t === "i") {
                    $("#all-tab-tabs-above").click();
                }
            }
            setTimeout(function () {
                $("#loader-wrapper")[0].style.display = "none";
            }, 400);
            /*这里400ms是由main.css里的.loaded #loader以及#loader-wrapper的动画时间为0.3s决定 */
        }
    }

})(jQuery);

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}