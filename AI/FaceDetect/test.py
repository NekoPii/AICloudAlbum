from FaceDetect import FaceRecogPrepared
from VisualizeDetect import VisualizeBlocks


filepath = "images/person3.jpg"
isFace,face_locations,recognized_faces=FaceRecogPrepared(filepath,True)
# 展示结果
print(face_locations)
print(recognized_faces)
VisualizeBlocks(filepath,face_locations)

