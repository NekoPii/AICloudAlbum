$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
    }
});

var max_proc = Math.random() * 19 + 80
var base_time = 50
var gap_time = 500

$("#getVideo").click(function () {
    var is_complete = false
    if ($("#select_img_cnt").val() === "0") {
        toastr.info("No Images Selected !")
    } else {
        $("#getVideo").attr("disabled", true)
        toastr.options = {
            "closeButton": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": true,
            "showDuration": "100",
            "hideDuration": "1000",
            "timeOut": "0",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "onclick": null,
        };
        toastr.info("Get Highlights Editing ...");

        $("#video-process").modal("show");
        //$("#face-process-btn").click();

        var now_time = Math.random() * gap_time + base_time
        var index = 1
        var video_process = setInterval(function () {
            now_time = Math.random() * gap_time + base_time
            if (is_complete || index > max_proc) {
                clearInterval(video_process)
            } else {
                let now = index.toString() + "%"
                $("#video_process_bar").css("width", now).text(now)
                index++
            }
        }, now_time);

        $.ajax({
            url: "/getVideo/",
            type: "POST",
            data: $("#imageFewForm").serialize(),
            dataType: "json",
            success: function (data) {
                is_complete = true
                $("#video_process_bar").css("width", "100%").text("100%");
                setTimeout(function () {
                    $("#video-process").modal("hide");
                }, 500);
                setTimeout(function () {
                    $("#video_process_bar").css("width", "0.1%").text("0.1%");
                }, 600);
                setTimeout(function () {
                    toastr.clear();
                    if (data["video_status"] === "true") {
                        toastr.options = {
                            "closeButton": false,
                            "newestOnTop": true,
                            "progressBar": false,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": true,
                            "showDuration": "100",
                            "hideDuration": "2000",
                            "timeOut": "2000",
                            "extendedTimeOut": "2000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "onclick": null,
                        };
                        $("#getVideo").attr("disabled", false);
                        toastr.success("Get " + data["video_cnt"].toString() + " Pictures Video Generation Success !");
                        return new Promise(function (resolve, reject) {
                            $.confirm({
                                title: 'Click to Video Right Now',
                                content: "The video has been generated and view immediately",
                                type: 'green',
                                buttons: {
                                    "Go To Video": {
                                        btnClass: 'btn-success text-white',
                                        keys: ['enter'],
                                        action: function () {
                                            resolve();
                                            window.location.href = "/video/";
                                        }
                                    },
                                }
                            });
                        });
                    } else {
                        toastr.options = {
                            "closeButton": false,
                            "newestOnTop": true,
                            "progressBar": false,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": true,
                            "showDuration": "100",
                            "hideDuration": "2000",
                            "timeOut": "2000",
                            "extendedTimeOut": "2000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "onclick": null,
                        };
                        toastr.warning("None of the selected pictures can generate video !")
                        $("#getVideo").attr("disabled", false)
                    }
                }, 500);
            },
            error: function () {
                is_complete = true
                toastr.clear()
                toastr.options = {
                    "closeButton": false,
                    "newestOnTop": true,
                    "progressBar": false,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": true,
                    "showDuration": "100",
                    "hideDuration": "1000",
                    "timeOut": "1500",
                    "extendedTimeOut": "1500",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut",
                    "onclick": null,
                };
                toastr.error("Error , Please Try again !")
                $("#video-process").modal("hide");
                $("#video_process_bar").css("width", "0.1%").text("0.1%");
                $("#getVideo").attr("disabled", false)
            }
        });
    }
});