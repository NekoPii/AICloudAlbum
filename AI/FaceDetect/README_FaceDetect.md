# 环境配置

需要配置三个包：CMake、dlib以及face_recognition
pip --default-timeout=1000 install --index-url https://mirrors.aliyun.com/pypi/simple CMake
pip --default-timeout=1000 install --index-url https://mirrors.aliyun.com/pypi/simple dlib
pip --default-timeout=1000 install --index-url https://mirrors.aliyun.com/pypi/simple face_recognition

# 使用方法

如test.py所示:
FaceRecogPrepared(filepath, isCodePrepared=False)
这个函数集成了检测人脸的函数，直接调用即可
如果存放面部数据集的文件夹路径有变，需要进入修改
如isCodePrepared为真，则直接使用事先准备好的面部编码数据,否则将根据面部数据集中的照片生成
返回[isFace, face_locations, recognized_faces]
分别为是否检测出人脸、面部识别框位置和识别出的图片名

## 以下是FaceRecogPrepared中调用的函数介绍

定位人脸
FaceDetection(filename)
返回一个数组[(y1,x2,y2,x1),....],(x1,y1)，(x2,y2)为其左上，右下点

识别人脸
FaceRecognition(filename, face_data_path, known_face_locations=None)
将要识别的人脸数据集放在face_data_path下
known_face_locations为上一步检测出的识别框，可以不填
返回一个数组[name1,....]分别为上一步识别出的识别框对应的人脸图片名。

为face_data_path下的所有图片制作编码数据集，放在face_code_path路径中
MakeCodeForFaceData(face_data_path, face_code_path)

将要识别的人脸编码数据集放在face_code_path下
使用预加载的数据识别
def FaceRecognitionWithPreprocCode(filename, face_code_path, known_face_locations=None)

显示人脸和识别框
VisualizeBlocks(filename, blocks)