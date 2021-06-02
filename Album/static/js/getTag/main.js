$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
    }
});

var max_proc = Math.random() * 9 + 90
var base_time = 50
var gap_time = 50


$("#getTag").click(function () {
    if ($(".just-image").length === 0) {
        toastr.info("No Images !")
    } else {
        $(this).attr("disabled", true);

        $("#tag-process").modal("show");

        var is_complete = false
        var now_time = Math.random() * gap_time + base_time
        var index = 1
        var tag_process = setInterval(function () {
            now_time = Math.random() * gap_time + base_time
            if (is_complete || index > max_proc) {
                clearInterval(tag_process)
            } else {
                let now = index.toString() + "%"
                $("#tag_process_bar").css("width", now).text(now)
                index++
            }
        }, now_time);

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
                is_complete = true
                $("#tag_process_bar").css("width", "100%").text("100%");
                setTimeout(function () {
                    $("#tag-process").modal("hide");
                }, 500);
                setTimeout(function () {
                    $("#tag_process_bar").css("width", "0.1%").text("0.1%");
                }, 600);
                setTimeout(function () {
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
                }, 500);
            },
            error: function () {
                is_complete = true
                $("#tag-process").modal("hide");
                $("#tag_process_bar").css("width", "0.1%").text("0.1%");
                toastr.clear()
                toastr.error("Error , Please Try again !")
                $(this).attr("disabled", false)
            }
        });
    }
});


$(".getOneTag").click(function () {
    $(this).attr("disabled", true);

    $("#tag-process").modal("show");

    var is_complete = false
    var now_time = Math.random() * gap_time + base_time
    var index = Math.round(Math.random() * 30 + 34)
    var tag_process = setInterval(function () {
        now_time = Math.random() * gap_time + base_time
        if (is_complete || index > max_proc) {
            clearInterval(tag_process)
        } else {
            let now = index.toString() + "%"
            $("#tag_process_bar").css("width", now).text(now)
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
    toastr.info("Get Tag ...");
    var downloadOneForm = $(this).closest('.downloadOneForm');
    $.ajax({
        url: "/get_ongtag/",
        type: "POST",
        data: downloadOneForm.serialize(),
        dataType: "json",
        success: function (data) {
            is_complete = true
            $("#tag_process_bar").css("width", "100%").text("100%");
            setTimeout(function () {
                $("#tag-process").modal("hide");
            }, 500);
            setTimeout(function () {
                $("#tag_process_bar").css("width", "0.1%").text("0.1%");
            }, 600);
            setTimeout(function () {
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
                    $(".getOneTag").removeAttr("disabled");
                    toastr.success("Get Tag Success !")
                    return new Promise(function (resolve, reject) {
                        $.confirm({
                            title: 'Click to Tag Now',
                            content: "Are you want to go to tag page right now ?",
                            type: 'green',
                            buttons: {
                                Yes: {
                                    btnClass: 'btn-success text-white',
                                    keys: ['enter'],
                                    action: function () {
                                        resolve();
                                        window.location.href = "/tags/" + data["now_tag"] + "/";
                                    }
                                },
                                No: {
                                    btnClass: 'btn-default text-black',
                                    keys: ['enter'],
                                    action: function () {
                                        $(".getOneTag").removeAttr("disabled");
                                        resolve();
                                        window.location.reload();
                                    }
                                }
                            }
                        });
                    });
                } else {
                    $(".getOneTag").removeAttr("disabled");
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
                    toastr.info("Tag has been obtained !")
                }
            }, 500)
        },
        error: function () {
            is_complete = true
            toastr.clear()
            toastr.error("Error , Please Try again !")
            $("#tag-process").modal("hide");
            $("#tag_process_bar").css("width", "0.1%").text("0.1%");
            $(".getOneTag").removeAttr("disabled");
        }
    });
});