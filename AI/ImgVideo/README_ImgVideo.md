# 环境配置
python依赖：opencv
需要安装ffmpeg工具，它的作用主要是把avi文件压缩为mp4文件
安装请参考：
https://jingyan.baidu.com/article/86f4a73e5d273476d752696b.html

# 使用
如test.py中所示，调用GenVideo(image_filepaths, video_name="temp", windows_size=(1280, 720), fps=12)
+ image_filepaths 图片路径数组
+ video_name 直接输入视频名字，默认为temp。
视频会被保存至videos文件夹中，请预先创建一个该文件夹。并前往ImgToVideo.py中修改videos文件夹所在绝对路径。
+ windows_size，fps使用默认数值即可，主要是为了减小体积。如果有高要求可以提高一些。