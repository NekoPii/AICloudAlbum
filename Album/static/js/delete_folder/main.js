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
        "hideMethod": "fadeOut"
    };
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
        }
    });
});

var max_proc = Math.random() * 9 + 90
var base_time = 50
var gap_time = 50

$("#folders_delete_few").click(function () {
    console.log($("#select_folder_cnt").val())
    if ($("#select_folder_cnt").val() === "0") {
        toastr.info("No Folder Selected !");
    } else {
        return new Promise(function (resolve, reject) {
            $.confirm({
                title: 'Confirm!',
                content: "Are you sure to delete ?",
                type: 'red',
                buttons: {
                    yes: {
                        btnClass: 'btn-danger text-white',
                        keys: ['enter'],
                        action: function () {
                            toastr.info("Deleting ...");
                            resolve();

                            $("#delete-folder-process").modal("show");

                            var is_complete = false
                            var now_time = Math.random() * gap_time + base_time
                            var index = 1
                            var delete_folder_process = setInterval(function () {
                                now_time = Math.random() * gap_time + base_time
                                if (is_complete || index > max_proc) {
                                    clearInterval(delete_folder_process)
                                } else {
                                    let now = index.toString() + "%"
                                    $("#delete_folder_process_bar").css("width", now).text(now)
                                    index++
                                }
                            }, now_time);

                            $.ajax({
                                url: "/delete_select_folder/",
                                type: "POST",
                                data: $("#folderFewForm").serialize(),
                                dataType: "json",
                                success: function (data) {
                                    is_complete = true
                                    $("#delete_folder_process_bar").css("width", "100%").text("100%");
                                    setTimeout(function () {
                                        $("#delete-folder-process").modal("hide");
                                    }, 500);
                                    setTimeout(function () {
                                        $("#delete_folder_process_bar").css("width", "0%").text("0%");
                                    }, 600);
                                    setTimeout(function () {
                                        var delete_cnt = data["delete_cnt"],
                                            delete_status = data["delete_status"],
                                            select_cnt = data["select_cnt"];
                                        if (delete_status == "false") {
                                            toastr.warning("Failed to Delete " + select_cnt.toString() + " Folder(s) !");
                                        } else if (delete_status == "true") {
                                            toastr.success(delete_cnt.toString() + " Folder(s) Delete Successfully ~");
                                            setTimeout(function () {
                                                window.location.href = "?t=f";
                                            }, 500);
                                        } else if (delete_status == null) {
                                            toastr.info("No Folder Selected !");
                                        }
                                    }, 500);
                                },
                                error: function () {
                                    is_complete = true
                                    $("#delete-folder-process").modal("hide");
                                    $("#delete_folder_process_bar").css("width", "0%").text("0%");
                                    toastr.error("Error , Please Try again !")
                                }
                            });
                        }
                    },
                    no: {
                        btnClass: 'btn-default text-black',
                        keys:
                            ['enter'],
                        action: function () {
                            resolve();
                        }
                    }
                }
            });
        });
    }
});