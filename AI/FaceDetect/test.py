from FaceDetect import FaceDetection, FaceRecognition, \
    FaceRecognitionWithPreprocCode, MakeCodeForFaceData
from VisualizeDetect import VisualizeBlocks


def func1(filepath):
    result = FaceDetection(filepath)
    names = FaceRecognition(filepath, 'ExistingFace', result)
    print(result)
    print(names)
    VisualizeBlocks(filepath, result)


def func2():
    MakeCodeForFaceData('ExistingFace', 'ExistingFaceCode')


def func3(filepath):
    result = FaceDetection(filepath)
    names = FaceRecognitionWithPreprocCode(filepath, 'ExistingFaceCode', result)
    print(result)
    print(names)
    VisualizeBlocks(filepath, result)


filepath = "images/person1.jpg"
func3(filepath)


