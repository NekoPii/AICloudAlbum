import os
import face_recognition


def FaceDetection(filename):
    img = face_recognition.load_image_file(filename)
    face_locations = face_recognition.face_locations(img)
    return face_locations


def FaceRecognition(filename, face_data_path, known_face_locations=None):
    # 制作所有可用图像的列表
    images = os.listdir(face_data_path)
    # 加载图像
    image_to_be_matched = face_recognition.load_image_file(filename)
    # 将加载图像编码为特征向量，有多个
    image_codes = face_recognition.face_encodings(image_to_be_matched, known_face_locations)
    # 对应识别框的识别结果
    names = []
    for i in range(len(image_codes)):
        names.append("Not matched")
    # 遍历每张图像
    for image in images:
        # 加载图像
        current_image = face_recognition.load_image_file(face_data_path + "/" + image.__str__())
        # 将加载图像编码为特征向量
        cur_img_code = face_recognition.face_encodings(current_image)[0]
        # 将你的图像和图像对比，看是否为同一人
        compare_results = face_recognition.compare_faces(image_codes, cur_img_code)
        for i in range(len(image_codes)):
            if compare_results[i]:
                names[i] = image
    return names
