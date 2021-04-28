var aryFiles = Array();
$('#upload-file').fileinput({
    theme:"fas",
    //language: 'zh',     // 设置中文，需要引入locales/zh.js文件
    uploadUrl: '/att_upload/',     // 上传路径
    maxFileSize: 0,     // 上传文件大小限制，触发 msgSizeTooLarge 提示
    // {name}：将被上传的文件名替换，{size}：将被上传的文件大小替换，{maxSize}：将被maxFileSize参数替换。
    msgSizeTooLarge: '"{name}" ({size} KB) 超过允许的最大上传大小 {maxSize} KB。请重新上传!',
    showPreview: true,  // 展示预览
    showUpload: true,   // 是否显示上传按钮
    showCaption: true,  // 是否显示文字描述
    showClose: false,   // 隐藏右上角×
    uploadAsync: true, // 是否异步上传
    initialPreviewShowDelete: true, // 预览中的删除按钮
    autoReplace: true,  // 达到最大上传数时，自动替换之前的附件
    //uploadExtraData: function () {  // uploadExtraData携带附加参数，上传时携带csrftoken
    //    return {csrfmiddlewaretoken: $.cookie('csrftoken'), doc_uuid: $('[name=doc_uuid]').val()}
    //},
    initialPreview: [],　　// 默认预览设置，回显时会用到
    initialPreviewConfig: [],　　// 默认预览的详细配置，回显时会用到
}).on("fileuploaded", function (e, data, previewId, index) {
    // 上传成功后触发的事件
}).on("fileclear", function (e) {
    // 移除按钮触发的事件，用该事件批量删除

    $.ajax({
        url: '/del_all_att/',
        method: 'post',
        dataType: 'json',
        data: {
            'aryFiles': JSON.stringify(aryFiles),
            "csrfmiddlewaretoken": $("[name='csrfmiddlewaretoken']").val()
        },
        success: function (data) {
            alert("Success!")
        }
    })
}).on("filepredelete", function (e, key, jqXHR, data) {
    // 预览中删除按钮，删除上传的文件触发的事件
}).on("fileloaded", function (e, file, previewId) {
    // aryFile.length = 0;
    // 加载预览后触发的事件，将所有文件名添加到全局变量 aryFiles 数组中
    aryFiles.push(file.name);
})