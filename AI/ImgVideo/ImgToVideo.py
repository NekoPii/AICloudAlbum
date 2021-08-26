import platform

import cv2
import numpy as np
import subprocess
import os
import traceback

video_imgs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "video")
logs_filepath = os.path.join(video_imgs_dir, "logs.txt")
if not os.path.exists(video_imgs_dir):
    os.mkdir(video_imgs_dir)


# 输入要生成视频的图片名序列，将其生成固定帧率和大小的视频，存储在给定路径中\
# 可以给定视频文件名，不需要写路径，直接输入名字就行
def GenVideo(image_filepaths, video_name="temp", windows_size=(1280, 720), fps=24):
    user_fake_id = video_name.rsplit("-", 1)[1]
    for now_video_name in os.listdir(video_imgs_dir):
        if user_fake_id in now_video_name and (now_video_name.endswith(".mp4") or now_video_name.endswith(".avi")):
            os.remove(os.path.join(video_imgs_dir, now_video_name))
    # 在此处修改根路径
    video_filepath = os.path.join(video_imgs_dir, video_name + ".avi")
    # 每张图片展示时间
    duration_per_img = 0.5
    # 对于给出的图片，从中截取多少片段
    extract_per_img = 3
    img_list = []
    # 制作图片列表
    for image_filepath in image_filepaths:
        img = cv2.imread(image_filepath)
        img_list.append(img)
        img_list.append(img)
        # 如果图片太小就不截取了
        if img.shape[0] < 500 or img.shape[1] < 500:
            img_list.append(img)
        else:
            extract_list = ExtractFromImage(img, windows_size, extract_per_img)
            for e_img in extract_list:
                img_list.append(e_img)
    GenerateVideoWithImages(img_list, video_filepath, duration_per_img, fps, windows_size)
    # 转换格式
    avi_filepath = video_filepath
    mp4_filepath = video_filepath.rsplit(".", 1)[0] + ".mp4"
    # 删除文件
    if os.path.exists(mp4_filepath):
        os.remove(mp4_filepath)

    logs = open(logs_filepath, "a")
    try:
        convert_avi_to_mp4(avi_filepath, mp4_filepath)
        if os.path.exists(avi_filepath):
            os.remove(avi_filepath)
    except Exception as e:
        logs.write(video_imgs_dir)
        logs.write(traceback.format_exc())
    logs.close()


# 接受一组图片序列，生成视频
def GenerateVideoWithImages(images, video_filepath, duration_per_img, fps, size):
    # 初始化
    prev_img = None
    logs = open(logs_filepath, "a")
    logs.write("ready\n")
    video = None
    try:
        video = cv2.VideoWriter(video_filepath, cv2.VideoWriter_fourcc('I', '4', '2', '0'), fps, size)
    except Exception as e:
        logs.write(traceback.format_exc())
    logs.close()
    # 制作图片列表
    for img in images:
        # img = cv2.imread(image_filepath)
        fit_img = ImageFitScreenSize(img, size)
        if prev_img is None:
            prev_img = fit_img
        else:
            SimpleTransFrame(prev_img, fit_img, 1 * fps, video)
            prev_img = fit_img
        for a in range(int(duration_per_img * fps)):
            video.write(fit_img)
    video.release()
    cv2.destroyAllWindows()


# 输入图像与屏幕尺寸，生成自适应不变形的图像
def ImageFitScreenSize(img, size):
    # 获取图像和屏幕的尺寸
    img_m = img.shape[0]
    img_n = img.shape[1]
    screen_m = size[1]
    screen_n = size[0]
    if screen_n > screen_m:
        # 横型屏幕，让图片的高对齐屏幕
        img_fit_m = screen_m
        img_fit_n = int(img_n * screen_m / img_m)
        if img_fit_n > screen_n:
            # 图像超出屏幕，截取中间部分
            start_n = round((img_fit_n - screen_n) / 2)
            fit_img = cv2.resize(img, (img_fit_n, img_fit_m))[0:screen_m, start_n:start_n + screen_n]
        else:
            # 图像小于屏幕，放在屏幕中间部分
            start_n = round((screen_n - img_fit_n) / 2)
            # 模糊的背景
            fit_img = cv2.GaussianBlur(cv2.resize(img, size), (63, 63), 0)
            fit_img[0:screen_m, start_n:start_n + img_fit_n] = cv2.resize(img, (img_fit_n, img_fit_m))
    else:
        # 竖型屏幕，让图片的宽对齐屏幕
        img_fit_m = int(img_m * screen_n / img_n)
        img_fit_n = screen_n
        if img_fit_m > screen_m:
            # 图像超出屏幕，截取中间部分
            start_m = round((img_fit_m - screen_m) / 2)
            fit_img = cv2.resize(img, (img_fit_n, img_fit_m))[start_m:start_m + screen_m, 0:screen_n]
        else:
            # 图像小于屏幕，放在屏幕中间部分
            start_m = round((screen_m - img_fit_m) / 2)
            # 模糊的背景
            fit_img = cv2.GaussianBlur(cv2.resize(img, size), (63, 63), 0)
            fit_img[start_m:start_m + img_fit_m, 0:screen_n] = cv2.resize(img, (img_fit_n, img_fit_m))
    return fit_img


# 给定两张在视频中邻近出现的图像，在他们之间插入过渡帧
def SimpleTransFrame(img_prev, img_next, frame_num, video):
    for i in range(frame_num):
        t = i / frame_num
        frame = np.zeros(img_prev.shape)
        frame[:, :, :] = img_prev[:, :, :] * (1 - t) + img_next[:, :, :] * t
        frame = frame.astype(np.uint8)
        video.write(frame)


# 给定输入图像，以平移顺序从中截取出几张片段
# ori_img: 原图
# size: 视频窗口大小
# num: 截取几张片段
def ExtractFromImage(ori_img, size, num):
    if num > 1:
        img_m = ori_img.shape[0]
        img_n = ori_img.shape[1]
        screen_m = size[1]
        screen_n = size[0]
        center_m = int(img_m / 2)
        center_n = int(img_n / 2)
        # 截取窗口的大小
        extract_ratio = min(0.75, screen_n / (img_n))
        extract_n = int(extract_ratio * img_n)
        extract_m = min(int(extract_n * screen_m / screen_n), img_m)
        # 起始点
        start_n = int(0.1 * img_n + extract_n / 2)
        # 每次平移像素值
        trans_rate = int(2 * (center_n - start_n) / (num - 1))
        img_list = []
        cur_n = start_n
        cur_m = center_m
        top = int(cur_m - extract_m / 2)
        bottom = int(cur_m + extract_m / 2)
        for i in range(num):
            left = int(cur_n - extract_n / 2)
            right = int(cur_n + extract_n / 2)
            extract_img = ori_img[top:bottom, left:right]
            img_list.append(extract_img)
            cur_n += trans_rate
        return img_list
    else:
        return []


# 转换格式
def convert_avi_to_mp4(avi_file_path, output_name):
    # if platform.system() == "Linux":
    #     avi_file_path = "/home/ubuntu/AICloudAlbum" + avi_file_path[1:]
    #     output_name = "/home/ubuntu/AICloudAlbum" + output_name[1:]
    cmd = os.system(
        "ffmpeg -i {input} -c:v libx264 -crf 19 {output}".format(input=avi_file_path, output=output_name))
