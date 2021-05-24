from FaceDetect import FaceRecogPrepared
from VisualizeDetect import VisualizeBlocks
import os
upload_imgs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "upload_imgs")

filepath = os.path.join(upload_imgs_dir,"WIN_20210524_19_25_30_Pro.jpg")
isFace,face_locations,recognized_faces=FaceRecogPrepared(filepath,True)
# 展示结果
print("isFace="+str(isFace))
print(face_locations)
print(recognized_faces)
VisualizeBlocks(filepath,face_locations)

