$("#getFewFaceRec").click(function () {
    if ($(".select_cnt").text() === "000") {
        toastr.info("No Images Selected !")
    } else {
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
                    toastr.success("Get Face Recognition Success !")
                    $(this).attr("disabled", false)
                    setTimeout(function () {
                        window.location.href = "?t=i";
                    }, 500)
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
                    toastr.warning("Get Face Failed !")
                    $(this).attr("disabled", false)
                }
            },
            error: function () {
                toastr.clear()
                toastr.error("Error , Please Try again !")
                $(this).attr("disabled", false)
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
        success: function (data) {
            console.log(data);
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
                toastr.success("Get Face Recognition Success !")
                $(this).attr("disabled", false)
                setTimeout(function () {
                    window.location.href = "?t=i";
                }, 500)
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
                toastr.warning("Get Face Recognition Failed !")
                $(this).attr("disabled", false)
            }
        },
        error: function () {
            toastr.clear()
            toastr.error("Error , Please Try again !")
            $(this).attr("disabled", false)
        }
    });
});