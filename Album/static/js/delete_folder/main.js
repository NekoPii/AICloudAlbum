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
    if ($("#select_cnt").text() == "0") {
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
                            $.ajax({
                                url: "/delete_select_folder/",
                                type: "POST",
                                data: $("#folderFewForm").serialize(),
                                dataType: "json",
                                success: function (data) {
                                    var delete_cnt = data["delete_cnt"],
                                        delete_status = data["delete_status"],
                                        select_cnt = data["select_cnt"];
                                    if (delete_status == "false") {
                                        toastr.warning("Failed to Delete " + select_cnt.toString() + " Folder(s) !");
                                    } else if (delete_status == "true") {
                                        toastr.success(delete_cnt.toString() + " Folder(s) Delete Successfully ~");
                                        setTimeout(function () {
                                            window.location.href="?t=f";
                                        }, 500);
                                    } else if (delete_status == null) {
                                        toastr.info("No Folder Selected !");
                                    }
                                },
                                error: function () {
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