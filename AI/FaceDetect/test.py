from FaceDetect import FaceDetection, FaceRecognition
from VisualizeDetect import VisualizeBlocks

filepath = "images/person6.jpg"
result = FaceDetection(filepath)
names = FaceRecognition(filepath, 'ExistingFace', result)
print(result)
print(names)
VisualizeBlocks(filepath, result)
