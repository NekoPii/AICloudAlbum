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
        "onclick":null,
    };
});

$(".download_one").click(function () {
    toastr.info("Downloading ...");
    var downloadOneForm = $(this).closest('.downloadOneForm');
    $.ajax({
        url: "/download/",
        type: "POST",
        data: downloadOneForm.serialize(),
        success: function (response, status, request) {
            var download_status = request.getResponseHeader("download_status");
            if (download_status == "false") {
                toastr.warning("Image Download Failed !");
            } else if (download_status == "true") {
                var disp = request.getResponseHeader("Content-Disposition");
                if (disp && disp.search("attachment") != -1) {
                    toastr.success("Download will start right now ~");
                    var form = downloadOneForm;
                    form.attr("method", "post");
                    form.attr("action", "/download/");
                    form.submit();
                }
            }
        },
        error: function () {
            toastr.error("Error , Please Try again !")
        }
    });
});

$("#download_few").click(function () {
    if ($(".select_cnt").text() == "00") {
        toastr.info("No Images Selected !")
    } else {
        toastr.info("Downloading ...");
        $.ajax({
            url: "/download_select/",
            type: "POST",
            data: $("#downloadFewForm").serialize(),
            success: function (response, status, request) {
                var download_cnt = request.getResponseHeader("download_cnt"),
                    download_status = request.getResponseHeader("download_status"),
                    select_cnt = request.getResponseHeader("select_cnt");
                if (download_status == "false") {
                    if (select_cnt == 0) {
                        toastr.info("No Images Selected !")
                    } else {
                        toastr.warning("Failed to Download " + select_cnt.toString() + " Image(s) !");
                    }
                } else if (download_status == "true") {
                    var disp = request.getResponseHeader("Content-Disposition");
                    if (disp && disp.search("attachment") != -1) {
                        if (download_cnt == select_cnt) {
                            toastr.success(download_cnt.toString() + " Image(s) will download right now ~");
                        } else {
                            toastr.info(download_cnt.toString() + " Image(s) will download right now<br>"
                                + (select_cnt - download_cnt).toString() + " Image(s) download failed ~")
                        }
                        var form = $("#downloadFewForm");
                        form.attr("method", "post");
                        form.attr("action", "/download_select/");
                        form.submit();
                    }
                }
            },
            error: function () {
                toastr.error("Error , Please Try again !")
            }
        });
    }
})