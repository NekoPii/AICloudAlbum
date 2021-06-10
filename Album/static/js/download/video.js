$(document).ready(function () {
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

var max_proc = Math.random() * 9 + 90
var base_time = 50
var gap_time = 100

$("#video_download").click(function () {
    $(this).attr("disabled", true);
    $("#download-process").modal("show");

    var is_complete = false
    var now_time = Math.random() * gap_time + base_time
    var index = Math.round(Math.random() * 20 + 36)
    var download_process = setInterval(function () {
        now_time = Math.random() * gap_time + base_time
        if (is_complete || index > max_proc) {
            clearInterval(download_process)
        } else {
            let now = index.toString() + "%"
            $("#download_process_bar").css("width", now).text(now)
            index++
        }
    }, now_time);


    toastr.info("Downloading ...");
    var downloadVideoForm = $('#downloadVideoForm');
    $.ajax({
        url: "/download_video/",
        type: "POST",
        data: downloadVideoForm.serialize(),
        success: function (response, status, request) {
            var download_status = request.getResponseHeader("download_status");
            is_complete = true
            $("#download_process_bar").css("width", "100%").text("100%");
            setTimeout(function () {
                $("#download-process").modal("hide");
            }, 500);
            setTimeout(function () {
                $("#download_process_bar").css("width", "0.1%").text("0.1%");
            }, 600);
            if (download_status == "false") {
                toastr.warning("Video Download Failed !");
            } else if (download_status == "true") {
                var disp = request.getResponseHeader("Content-Disposition");
                if (disp && disp.search("attachment") != -1) {
                    toastr.success("Download will start right now ~");
                    var form = downloadVideoForm;
                    form.attr("method", "post");
                    form.attr("action", "/download_video/");
                    form.submit();
                }
            }
            $("#video_download").removeAttr("disabled");
        },
        error: function () {
            is_complete = true
            toastr.clear()
            toastr.error("Error , Please Try again !");
            $("#download-process").modal("hide");
            $("#download_process_bar").css("width", "0.1%").text("0.1%");
            $("#video_download").removeAttr("disabled");
        }
    });
});