import numpy as np
from tensorflow.keras.applications import resnet50
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.imagenet_utils import decode_predictions
import matplotlib.pyplot as plt
import json
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# 返回值 result = [class ,detailed_class, possibility]
def ImageClassification(filename):
    debug_mode = False
    # 加载模型
    resnet_model = resnet50.ResNet50(weights='imagenet')
    # 将图片输入到网络之前执行预处理
    # 1. 加载图像，load_img
    # 2. 将图像从PIL格式转换为Numpy格式，image_to_array
    # 3. 将图像形成批次，Numpy的expand_dims

    # 以PIL格式加载图像
    if not os.path.exists(filename):
        raise Exception("Path not exist")
    origin_img = load_img(path=filename, target_size=(224, 224))
    # 展示图像信息
    if debug_mode:
        print('PIL image size', origin_img.size)
        plt.imshow(origin_img)
        plt.show()

    # 将输入图像从PIL格式转换为Numpy格式
    # PIL格式为（width, height, channel）
    # Numpy格式为（height, width, channel）
    numpy_image = img_to_array(origin_img)
    # 展示图像信息
    if debug_mode:
        plt.imshow(np.uint8(numpy_image))
        plt.show()
        print('numpy array size', numpy_image.size)

    # 将图像转换为批量格式
    # expand_dims将为特定轴上的数据添加额外的维度
    # 网络的输入矩阵具有形式（batchSz,width, height, channel）
    # 因此，将额外的维度添加到轴0。
    image_batch = np.expand_dims(numpy_image, axis=0)
    if debug_mode:
        print('image batch size', image_batch.shape)
        plt.imshow(np.uint8(image_batch[0]))

    # 使用网络进行预测
    # 通过从批处理中的图像的每个通道中减去平均值来预处理输入。
    # 平均值是通过从ImageNet获得的所有图像的R，G，B像素的平均值获得的三个元素的阵列
    # 获得每个类的发生概率
    # 将概率转换为人类可读的标签

    # ResNet50网络模型
    # 对输入到ResNet50模型的图像进行预处理
    processed_image = resnet50.preprocess_input(image_batch.copy())
    # 获取预测得到的属于各个类别的概率
    predictions = resnet_model.predict(processed_image)
    # 将概率转换为类标签
    # 如果要查看前n个预测，可以使用top参数指定它
    label = decode_predictions(predictions, top=predictions.shape[1])
    # 大致分类
    rough_class = getImageClass(label[0][0][0])
    # 输出结果
    if debug_mode:
        print("ResNet50: {}, {:.2f}".format(label[0][0][1], label[0][0][2]))
        print(label)
    # 返回给调用者
    result = [rough_class, label[0][0][1], label[0][0][2]]
    return result


def getImageClass(class_code):
    now_path=os.path.dirname(__file__)
    load_f = open(os.path.join(now_path,"image_class.json"), 'r')
    load_dict = json.load(load_f)
    load_f.close()
    for diction in load_dict:
        if diction['Code'] == class_code:
            return diction['Class']
    return "Invalid code"
