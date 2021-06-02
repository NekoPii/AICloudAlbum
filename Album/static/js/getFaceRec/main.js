$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
    }
});

var max_proc = Math.random() * 9 + 90
var base_time = 50
var gap_time = 500

$("#getFewFaceRec").click(function () {
    var is_complete = false
    if ($("#select_img_cnt").val() === "0") {
        toastr.info("No Images Selected !")
    } else {
        $("#getFewFaceRec").attr("disabled", true)
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
        toastr.info("Get Select Images' Face Recognition ...");

        $("#face-process").modal("show");
        //$("#face-process-btn").click();

        var now_time = Math.random() * gap_time + base_time
        var index = 1
        var face_process = setInterval(function () {
            now_time = Math.random() * gap_time + base_time
            if (is_complete || index > max_proc) {
                clearInterval(face_process)
            } else {
                let now = index.toString() + "%"
                $("#face_process_bar").css("width", now).text(now)
                index++
            }
        }, now_time);

        $.ajax({
            url: "/select_faceRec/",
            type: "POST",
            data: $("#imageFewForm").serialize(),
            dataType: "json",
            success: function (data) {
                is_complete = true
                $("#face_process_bar").css("width", "100%").text("100%");
                setTimeout(function () {
                    $("#face-process").modal("hide");
                }, 500);
                setTimeout(function () {
                    $("#face_process_bar").css("width", "0.1%").text("0.1%");
                }, 600);
                setTimeout(function () {
                    toastr.clear();
                    if (data["faceRec_status"] === "true") {
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
                        $("#getFewFaceRec").attr("disabled", false);
                        toastr.success("Get " + data["faceRec_cnt"].toString() + " Pictures Face Recognition Success !");
                        return new Promise(function (resolve, reject) {
                            $.confirm({
                                title: 'Click to Face Right Now',
                                content: "Are you want to go to face page right now ?",
                                type: 'green',
                                buttons: {
                                    Yes: {
                                        btnClass: 'btn-success text-white',
                                        keys: ['enter'],
                                        action: function () {
                                            resolve();
                                            window.location.href = "/face/";
                                        }
                                    },
                                    No: {
                                        btnClass: 'btn-default text-black',
                                        keys: ['enter'],
                                        action: function () {
                                            resolve();
                                        }
                                    }
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
                        if (data["faceRec_cnt"] === 0) {
                            toastr.warning("No face can be recognized in the selected pictures !")
                        } else {
                            toastr.success("Successfully recognize the faces of " + data["faceRec_cnt"].toString() + "picture(s)");
                            return new Promise(function (resolve, reject) {
                                $.confirm({
                                    title: 'Click to Face Right Now',
                                    content: "Are you want to go to face page right now ?",
                                    type: 'green',
                                    buttons: {
                                        Yes: {
                                            btnClass: 'btn-success text-white',
                                            keys: ['enter'],
                                            action: function () {
                                                resolve();
                                                window.location.href = "/face/";
                                            }
                                        },
                                        No: {
                                            btnClass: 'btn-default text-black',
                                            keys: ['enter'],
                                            action: function () {
                                                resolve();
                                            }
                                        }
                                    }
                                });
                            });
                        }
                        $("#getFewFaceRec").attr("disabled", false)
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
                $("#face-process").modal("hide");
                $("#face_process_bar").css("width", "0.1%").text("0.1%");
                $("#getFewFaceRec").attr("disabled", false)
            }
        });
    }
});


$(".getFaceRec").click(function () {
    $(this).attr("disabled", true);
    $("#face-process").modal("show");

    var is_complete = false
    var now_time = Math.random() * gap_time + base_time
    var index = Math.round(Math.random() * 10 + 29)
    var face_process = setInterval(function () {
        now_time = Math.random() * gap_time + base_time
        if (is_complete || index > max_proc) {
            clearInterval(face_process)
        } else {
            let now = index.toString() + "%"
            $("#face_process_bar").css("width", now).text(now)
            index++
        }
    }, now_time);

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
    toastr.info("Get Image Face Recognition ...");
    var downloadOneForm = $(this).closest('.downloadOneForm');
    $.ajax({
        url: "/one_faceRec/",
        type: "POST",
        data: downloadOneForm.serialize(),
        dataType: "json",
        success: function (data) {
            is_complete = true
            $("#face_process_bar").css("width", "100%").text("100%");
            setTimeout(function () {
                $("#face-process").modal("hide");
            }, 500);
            setTimeout(function () {
                $("#face_process_bar").css("width", "0.1%").text("0.1%");
            }, 600);
            setTimeout(function () {
                toastr.clear()
                if (data["faceRec_status"] === "true") {
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
                    $(".getFaceRec").removeAttr("disabled");
                    toastr.success("Get Face Recognition Success !")
                    return new Promise(function (resolve, reject) {
                        $.confirm({
                            title: 'Click to Face Right Now',
                            content: "Are you want to go to face page right now ?",
                            type: 'green',
                            buttons: {
                                Yes: {
                                    btnClass: 'btn-success text-white',
                                    keys: ['enter'],
                                    action: function () {
                                        resolve();
                                        window.location.href = "/face/";
                                    }
                                },
                                No: {
                                    btnClass: 'btn-default text-black',
                                    keys: ['enter'],
                                    action: function () {
                                        $(".getFaceRec").removeAttr("disabled");
                                        resolve();
                                    }
                                }
                            }
                        });
                    });
                } else {
                    $(".getFaceRec").removeAttr("disabled");
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
                    if (data["isnotFace"] === "true") {
                        toastr.info("Unable to recognize that the current picture contains a face !")
                    } else {
                        toastr.warning("Get Face Recognition Failed !")
                    }
                }
            }, 500)
        },
        error: function () {
            is_complete = true
            toastr.clear();
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
            toastr.error("Error , Please Try again !");
            $("#face-process").modal("hide");
            $("#face_process_bar").css("width", "0.1%").text("0.1%");
            $(".getFaceRec").removeAttr("disabled");
        }
    });
});