$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        xhr.setRequestHeader("X-CSRFtoken", $.cookie("csrftoken"))
    }
});

$("#input_folder_mod_name").on("keypress", function (event) {
    if (event.keyCode == 13) {
        $(this).focus();
        var input_name = $(this).val();
        var now_select = $("#folder_names").val();
        var ori_select = $("#folder_names option:first").val()
        input_name = input_name.trim()
        if (now_select != ori_select) {
            if (input_name && input_name != "") {
                $.ajax({
                    url: "/modify_folder/" + now_select + "/",
                    type: "POST",
                    data: $("#modifyFolderForm").serialize(),
                    dataType: "json",
                    success: function (data) {
                        var mod_status = data["mod_status"],
                            is_same_name = data["is_same_name"];
                        if (mod_status == "false" && is_same_name == "true"
                        ) {
                            toastr.warning("Folder with the same name exists !")
                            $("#input_folder_mod_name").focus()
                        } else if (mod_status == "false") {
                            toastr.warning("Failed to Add \"" + input_name + "\" Folder");
                        } else if (mod_status == "true") {
                            toastr.success("\"" + now_select + "\" Folder Modify Successfully ~");
                            setTimeout(function () {
                                window.location.href = "?t=f";
                                //$("#folder-tab-tabs-above").click();
                            }, 400);
                        }
                    },
                    error: function () {
                        toastr.error("Error , Please Try again !")
                    }
                });
            } else {
                toastr.error("Folder Name can't be empty !");
                $("#input_folder_mod_name").focus();
            }
        } else {
            toastr.info("Please Select Folder to Modify ~");
        }
    }
});

$("#modal_modify_ok").click(function () {
    var input_name = $("#input_folder_mod_name").val();
    var now_select = $("#folder_names").val();
    var ori_select = $("#folder_names option:first").val()
    input_name = input_name.trim()

    if (now_select != ori_select) {
        if (input_name && input_name != "") {
            $.ajax({
                url: "/modify_folder/" + now_select + "/",
                type: "POST",
                data: $("#modifyFolderForm").serialize(),
                dataType: "json",
                success: function (data) {
                    var mod_status = data["mod_status"],
                        is_same_name = data["is_same_name"];
                    if (mod_status == "false" && is_same_name == "true"
                    ) {
                        toastr.warning("Folder with the same name exists !")
                        $("#input_folder_mod_name").focus()
                    } else if (mod_status == "false") {
                        toastr.warning("Failed to Modify \"" + input_name + "\" Folder");
                    } else if (mod_status == "true") {
                        toastr.success("\"" + now_select + "\" Folder Modify Successfully ~");
                        setTimeout(function () {
                            window.location.href = "?t=f";
                            //$("#folder-tab-tabs-above").click();
                        }, 400);
                    }
                },
                error: function () {
                    toastr.error("Error , Please Try again !");
                }
            });
        } else {
            toastr.error("Folder Name can't be empty !");
            $("#input_folder_mod_name").focus();
        }
    } else {
        toastr.info("Please Select Folder to Modify ~");
    }
});

$("#modal_modify_close").click(function () {
    $("#input_folder_mod_name").val("")
    var ori_select = $("#folder_names option:first").val()
    $(".selectpicker").selectpicker("val", ori_select)
});