$("#getFewFaceRec").click(function () {
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

        var face_process = setInterval(function () {
            $.getJSON("/show_faceprocess/", function (res) {
                $("#face_process_bar").css("width", res["now_face_process"]).text(res["now_face_process"])
                if (res["face_process_val"] === 1) {
                    clearInterval(face_process);
                    setTimeout(function () {
                        $("#face-process").modal("hide");
                    }, 500);
                    setTimeout(function () {
                        $("#face_process_bar").css("width", "0.1%").text("0.1%");
                    }, 600);
                    //$("#faceprocess_modal_close").click();
                }
            })
        }, 100);


        $.ajax({
            url: "/select_faceRec/",
            type: "POST",
            data: $("#imageFewForm").serialize(),
            dataType: "json",
            success: function (data) {
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
                            "hideDuration": "1000",
                            "timeOut": "1000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "onclick": null,
                        };
                        $("#getFewFaceRec").attr("disabled", false);
                        toastr.success("Get Face Recognition Success !");
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
                            "hideDuration": "1000",
                            "timeOut": "1000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "onclick": null,
                        };
                        if (data["faceRec_cnt"] === 0) {
                            toastr.warning("Get Face Failed !")
                        } else {
                            toastr.info("Successfully recognize the faces of " + data["faceRec_cnt"].toString() + "picture(s)");
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
                toastr.clear()
                toastr.error("Error , Please Try again !")
                clearInterval(face_process);
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
    var face_process = setInterval(function () {
        $.getJSON("/show_faceprocess/", function (res) {
            $("#face_process_bar").css("width", res["now_face_process"]).text(res["now_face_process"]);
            if (res["face_process_val"] === 1) {
                clearInterval(face_process);
                setTimeout(function () {
                    $("#face-process").modal("hide");
                }, 500);
                setTimeout(function () {
                    $("#face_process_bar").css("width", "0.1%").text("0.1%");
                }, 600);
            }
        })
    }, 100);
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
                        "hideDuration": "1000",
                        "timeOut": "1000",
                        "extendedTimeOut": "1000",
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
                        "hideDuration": "1000",
                        "timeOut": "1000",
                        "extendedTimeOut": "1000",
                        "showEasing": "swing",
                        "hideEasing": "linear",
                        "showMethod": "fadeIn",
                        "hideMethod": "fadeOut",
                        "onclick": null,
                    };
                    if (data["isnotFace"] === "true") {
                        toastr.warning("Unable to recognize that the current picture contains a face !")
                    } else {
                        toastr.warning("Get Face Recognition Failed !")
                    }
                }
            }, 500)
        },
        error: function () {
            toastr.clear()
            toastr.error("Error , Please Try again !")
            clearInterval(face_process);
            $("#face-process").modal("hide");
            $("#face_process_bar").css("width", "0.1%").text("0.1%");
            $(".getFaceRec").removeAttr("disabled");
        }
    });
});