$("#getFewFaceRec").click(function () {
    if ($(".select_cnt").text() === "000") {
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
        $.ajax({
            url: "/select_faceRec/",
            type: "POST",
            data: $("#imageFewForm").serialize(),
            dataType: "json",
            success: function (data) {
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
            },
            error: function () {
                toastr.clear()
                toastr.error("Error , Please Try again !")
                $("#getFewFaceRec").attr("disabled", false)
            }
        });
    }
});


$(".getFaceRec").click(function () {
    $(this).attr("disabled", true)
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
    var downloadOneForm = $(this).closest('.downloadOneForm');
    $.ajax({
        url: "/one_faceRec/",
        type: "POST",
        data: downloadOneForm.serialize(),
        dataType: "json",
        success: function (data) {
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
                                    $(this).removeAttr("disabled");
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
        },
        error: function () {
            toastr.clear()
            toastr.error("Error , Please Try again !")
            $(".getFaceRec").removeAttr("disabled");
        }
    });
});