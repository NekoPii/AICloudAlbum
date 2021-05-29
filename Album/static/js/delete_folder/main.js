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
});

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
                            var delete_folder_process = setInterval(function () {
                                $.getJSON("/show_delete_folder_process/", function (res) {
                                    $("#delete_folder_process_bar").css("width", res["now_delete_folder_process"]).text(res["now_delete_folder_process"]);
                                    if (res["delete_folder_process_val"] === 1) {
                                        clearInterval(delete_folder_process);
                                        setTimeout(function () {
                                            $("#delete-folder-process").modal("hide");
                                        }, 500);
                                        setTimeout(function () {
                                            $("#delete_folder_process_bar").css("width", "0%").text("0%");
                                        }, 600);
                                    }
                                })
                            }, 100);

                            $.ajax({
                                url: "/delete_select_folder/",
                                type: "POST",
                                data: $("#folderFewForm").serialize(),
                                dataType: "json",
                                success: function (data) {
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
                                    clearInterval(delete_folder_process);
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