$("#getTag").click(function () {
    $(this).attr("disabled", true)
    var folder_fake_name = $("#now_folder_fake_name").val()
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
    toastr.info("Getting All Tag ...");
    $.ajax({
        url: "/get_tag/" + folder_fake_name + "/",
        type: "POST",
        data: "",
        dataType: "json",
        success: function (data) {
            toastr.clear()
            if (data["getTag_status"] === "true") {
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
                toastr.success("Get Tag Success !")
                $(this).attr("disabled", false)
                setTimeout(function () {
                    window.location.reload();
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
                toastr.warning("Get Tag Failed !")
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