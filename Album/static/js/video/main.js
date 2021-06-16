$(function () {
    $("#progress").css("background", "none");
    $("#progress-container").css("background", "none");
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
        "hideMethod": "fadeOut",
        "onclick": null,
    };
    //视频
	jsModern.video("#video");
	//播放视频
	$(".VideoBtn").click(function () {
		var video = document.getElementById("videoShow");
		video.play();
		$('.VideoBtn').hide();
	})
	//监听视频的播放状态
	var video = document.getElementById("videoShow");
	video.oncanplay = function () {
		$(".VideoBtn").show();
		//$("#video").attr("poster","");
	}
	//视频播放事件
	video.onplay = function () {
		$("#videoShow").attr("poster", "");
		$(".VideoBtn").hide();
	};
	video.onplaying = function () {
		$(".VideoBtn").hide();
	};

	//视频暂停事件
	video.onpause = function () {
		$(".VideoBtn").show();
	};
	//点击视频周围暂停播放图片出现
	video.onclick = function () {
		if (video.paused) {
			$(".VideoBtn").hide();
			video.play();
		} else {
			$(".VideoBtn").show();
			video.pause();
		}
	};
});


var video_name = $("#video_name").val(),
    video_src = $("#video_src").val();

var mp = new MuiPlayer({
    container: '#mui-player',
    title: video_name,
    src: video_src,
    preload: true,
    width: "1024",
    height: "576",
    themeColor: '#40c4ff',
});

mp.on("ready", function () {
    toastr.success("Video Loading Complete")
})
