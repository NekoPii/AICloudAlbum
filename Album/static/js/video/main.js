$(function () {
    $("#progress").css("background", "none");
    $("#progress-container").css("background", "none");
    toastr.options = {
        "closeButton": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "showDuration": "100",
        "hideDuration": "1000",
        "timeOut": "2500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "onclick": null,
    };
});


var video_name = $("#video_name").val(),
    video_src = $("#video_src").val();

var mp = new MuiPlayer({
    container: '#mui-player',
    title: video_name,
    src: video_src,
    preload: true,
    width: "1024",
    height: "576",
    themeColor: '#40c4ff',
});

mp.on("ready", function () {
    toastr.success("Video Loading Complete")
})
