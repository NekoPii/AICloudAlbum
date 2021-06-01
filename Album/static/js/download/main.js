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
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
        }
    });
});

$(".download_one").click(function () {
    $(this).attr("disabled", true);
    $("#download-process").modal("show");
    var download_process = setInterval(function () {
        $.getJSON("/show_downloadprocess/", function (res) {
            $("#download_process_bar").css("width", res["now_download_process"]).text(res["now_download_process"]);
            if (res["download_process_val"] >= 1) {
                $("#download_process_bar").css("width", "99.99%").text("99.99%");
            }
        })
    }, 100);
    toastr.info("Downloading ...");
    var downloadOneForm = $(this).closest('.downloadOneForm');
    $.ajax({
        url: "/download/",
        type: "POST",
        data: downloadOneForm.serialize(),
        success: function (response, status, request) {
            var download_status = request.getResponseHeader("download_status");
            clearInterval(download_process);
            setTimeout(function () {
                $("#download-process").modal("hide");
            }, 500);
            setTimeout(function () {
                $("#download_process_bar").css("width", "0.1%").text("0.1%");
            }, 600);
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
            $(".download_one").removeAttr("disabled");
        },
        error: function () {
            toastr.clear()
            toastr.error("Error , Please Try again !");
            clearInterval(download_process);
            $("#download-process").modal("hide");
            $("#download_process_bar").css("width", "0.1%").text("0.1%");
            $(".download_one").removeAttr("disabled");
        }
    });
});

$("#imgs_download_few").click(function () {
    if ($("#select_img_cnt").val() === "0") {
        toastr.info("No Images Selected !")
    } else {
        $(this).attr("disabled", true);
        $("#download-process").modal("show");
        var download_process = setInterval(function () {
            $.getJSON("/show_downloadprocess/", function (res) {
                $("#download_process_bar").css("width", res["now_download_process"]).text(res["now_download_process"]);
                if (res["download_process_val"] >= 1) {
                    $("#download_process_bar").css("width", "99.99%").text("99.99%");
                }
            })
        }, 100);
        toastr.info("Downloading ...");
        $.ajax({
            url: "/download_select/",
            type: "POST",
            data: $("#imageFewForm").serialize(),
            success: function (response, status, request) {
                var download_cnt = request.getResponseHeader("download_cnt"),
                    download_status = request.getResponseHeader("download_status"),
                    select_cnt = request.getResponseHeader("select_cnt");
                clearInterval(download_process);
                setTimeout(function () {
                    $("#download-process").modal("hide");
                }, 500);
                setTimeout(function () {
                    $("#download_process_bar").css("width", "0.1%").text("0.1%");
                }, 600);
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
                        var form = $("#imageFewForm");
                        form.attr("method", "post");
                        form.attr("action", "/download_select/");
                        form.submit();
                    }
                }
                $("#imgs_download_few").removeAttr("disabled");
            },
            error: function () {
                toastr.clear()
                toastr.error("Error , Please Try again !");
                clearInterval(download_process);
                $("#download-process").modal("hide");
                $("#download_process_bar").css("width", "0.1%").text("0.1%");
                $(".download_one").removeAttr("disabled");
            }
        });
    }
})