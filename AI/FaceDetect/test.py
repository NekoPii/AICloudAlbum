from FaceDetect import FaceDetection, FaceRecognition, \
    FaceRecognitionWithPreprocCode, MakeCodeForFaceData, AddToExistingFace
from VisualizeDetect import VisualizeBlocks
import os


def faceRecog(filepath):
    result = FaceDetection(filepath)
    names = FaceRecognition(filepath, 'ExistingFace', result)
    AddToExistingFace(filepath, result, names, 'ExistingFace')
    print(result)
    print(names)
    VisualizeBlocks(filepath, result)

def prepareFaceData():
    MakeCodeForFaceData('ExistingFace', 'ExistingFaceCode')


# 使用这个函数检测人脸
# 如isCodePrepared为真，则直接使用事先准备好的面部编码数据
# 返回[face_locations, recognized_faces]分别为面部识别框和识别出的图片名
def faceRecogPrepared(filepath, isCodePrepared=False):
    face_data_path='ExistingFace'
    face_code_path='ExistingFaceCode'
    if isCodePrepared == False:
        MakeCodeForFaceData(face_data_path, face_code_path)
    result = FaceDetection(filepath)
    names = FaceRecognitionWithPreprocCode(filepath, face_code_path, result)
    AddToExistingFace(filepath, result, names, face_data_path,face_code_path)
    #展示结果
    print(result)
    print(names)
    VisualizeBlocks(filepath, result)
    return [result, names]


filepath = "images/person3.jpg"
faceRecogPrepared(filepath,True)


