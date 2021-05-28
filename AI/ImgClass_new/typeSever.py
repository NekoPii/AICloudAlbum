import tensorflow as tf
from tensorflow.keras import layers,models,metrics,regularizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import ImageFile
import sys


def acc_top10(y_true, y_pred):
    return metrics.top_k_categorical_accuracy(y_true, y_pred, k=10)
def acc_top5(y_true, y_pred):
    return metrics.top_k_categorical_accuracy(y_true, y_pred, k=5)




class typeSever:

    def __init__(self):
        self.gpu_dynamic_grow()
        ImageFile.LOAD_TRUNCATED_IMAGES = True
        tf.keras.backend.set_learning_phase(True) # environment settings

        self.typelist=[]
        self.origin_dir = "./trainImages"
        self.train_dir = os.path.join(self.origin_dir, 'train')
        self.validation_dir = os.path.join(self.origin_dir, 'validation')
        self.base_learning_rate = 0.0001
        self.BATCH_SIZE = 32
        self.TRAIN_EPOCHS = 25
        self.IMG_SIZE = (224, 224)
        self.IMG_SHAPE = self.IMG_SIZE + (3,)
        self.lastTypeNum = 0
        self.typeNum=0
        self.lastVer = 0
        self.getMetadata()
        path=os.path.join(os.path.dirname(__file__), "model/MobileNet_ver1.h5")
        self.model = tf.keras.models.load_model(path)

       # self.trainv2()
       # self.trainv1()
       # self.model.summary()

    def gpu_dynamic_grow(self):
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                # Currently, memory growth needs to be the same across GPUs
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logical_gpus = tf.config.experimental.list_logical_devices('GPU')
                print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
            except RuntimeError as e:
                # Memory growth must be set before GPUs have been initialized
                print(e)

    def getMetadata(self):
        # get the tags
        path=os.path.join(os.path.dirname(__file__),"config/tags.txt")
        f0 = open(path, 'r')
        while True:
            str1 = f0.readline()
            if not str1:
                break
            self.typelist.append(str1[:-1])
        self.typeNum=len(self.typelist)
        self.lastTypeNum=self.typeNum
        f0.close()

        # get the version
        path = os.path.join(os.path.dirname(__file__), "config/ver.txt")
        f1=open(path,'r')
        ver=[]
        while True:
            str1=f1.readline()
            if not str1:
                break
            ver.append(int(str1[:-1]))
        self.lastVer = ver[-1]
        f1.close()

    def pd(self , predict_dir):
        images = []
        img = image.load_img(predict_dir, target_size=(224, 224), color_mode='rgb')
        xs = image.img_to_array(img) / 255
        xs = np.expand_dims(xs, axis=0)
        images.append(xs)
        pre_y = self.model.predict(images)
        types = np.argsort(-pre_y)
        top3 = types[0][:3]
        topType=[]
        #print("\nTags")
        for i in range(len(top3)):
            topType.append(self.typelist[top3[i]])
            #print(self.typelist[top3[i]])
        return topType

    def plot(self,history,kinds=0):
        import matplotlib.pyplot as plt
        topT=['accuracy','acc_top5', 'acc_top10']
        topV=['val_accuracy', 'val_acc_top5', 'val_acc_top10']
        if(kinds==1|kinds==0|kinds==2):
           acc = history.history[topT[kinds]]
           val_acc = history.history[topV[kinds]]
           loss = history.history['loss']
           val_loss = history.history['val_loss']

           epochs = range(1, len(acc) + 1)
           plt.plot(epochs, acc, 'bo', label='Training acc')
           plt.plot(epochs, val_acc, 'b', label='Validation acc')
           plt.title('Training and validation accuracy')
           plt.legend()

           plt.figure()

           plt.plot(epochs, loss, 'bo', label='Training loss')
           plt.plot(epochs, val_loss, 'b', label='Validation loss')
           plt.title('Training and validation loss')
           plt.legend()
           plt.show()

    def verPlus(self):
        self.lastVer+=1
        f2 = open("./config/ver.txt", 'a')
        f2.write(str(self.lastVer) + '\n')
        f2.close()

    def typePlus(self):
        self.lastTypeNum=self.typeNum
        f2 = open("./config/typenum.txt", 'a')
        f2.write(str(self.lastTypeNum) + '\n')
        f2.close()

    def trainv1(self):
        if (self.typeNum != self.lastTypeNum):
            return
        train_datagen = ImageDataGenerator(
            rescale=1. / 255,
            rotation_range=60,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        train_generator = train_datagen.flow_from_directory(
            self.train_dir,
            target_size=self.IMG_SIZE,
            batch_size=20,
            color_mode='rgb',
            classes=self.typelist
        )
      #  self.model.get_layer(name='dense')(kernel_regularizer=regularizers.l1_l2(l1=0.001, l2=0))
      #  self.model.get_layer(name='dense_1')(kernel_regularizer=regularizers.l1_l2(l1=0.001, l2=0))
        self.model.compile(loss='categorical_crossentropy',
                      optimizer=tf.keras.optimizers.Adam(lr=self.base_learning_rate/5),
                      metrics=['accuracy']) # add acc_top5 or acc_top10 for test

        history = self.model.fit(
            train_generator,
            steps_per_epoch=100,
            epochs=self.TRAIN_EPOCHS)

        self.verPlus()
        self.model.save('model/MobileNet_ver{}.h5'.format(str(self.lastVer)))

        # self.plot(history) for debug

    def trainv2(self):
      #  if(self.typeNum==self.lastTypeNum):
        #    return
       # self.typePlus()

        test_datagen = ImageDataGenerator(
            rescale=1. / 255,
        )
        train_datagen = ImageDataGenerator(
            rescale=1. / 255,
            rotation_range=60,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        train_generator = train_datagen.flow_from_directory(
            self.train_dir,
            target_size=self.IMG_SIZE,
            batch_size=20,
            color_mode='rgb',
            classes=self.typelist
        )

        validation_generator = test_datagen.flow_from_directory(
            self.validation_dir,
            target_size=self.IMG_SIZE,
            batch_size=20,
            color_mode='rgb',
            classes=self.typelist
        )
        conv_base=self.model.get_layer(name='mobilenetv2_1.00_224')

        conv_base.trainable = False

        model = models.Sequential()
        model.add(conv_base)
        model.add(layers.Dropout(0.2))
        model.add(layers.Flatten())
        model.add(layers.Dense(1024, kernel_regularizer=regularizers.l1_l2(l1=0.001, l2=0), activation='relu'))
        model.add(layers.Dense(1024, kernel_regularizer=regularizers.l1_l2(l1=0.001, l2=0), activation='relu'))
        model.add(layers.Dense(512, activation='relu'))
        model.add(layers.Dense(units=self.typeNum, activation='softmax'))

        model.compile(loss='categorical_crossentropy',
                      optimizer=tf.keras.optimizers.Adam(lr=self.base_learning_rate),
                      metrics=['accuracy']) # add acc_top5 or acc_top10 for test
        model.summary()
        history = model.fit(
            train_generator,
            steps_per_epoch=100,
            epochs=20,
            validation_data=validation_generator,
            validation_steps=50) # train with validation
        self.plot(history)

        conv_base.trainable = True # Un-freeze the top layers of the model for fine tuning
        fine_tune_at = 100
        for layer in conv_base.layers[:fine_tune_at]:
            layer.trainable = False
        model.compile(loss='categorical_crossentropy',
                      optimizer=tf.keras.optimizers.Adam(lr=self.base_learning_rate/5),
                      metrics=['accuracy']) # add acc_top5 or acc_top10 for test
        model.summary()
        history = model.fit(
            train_generator,
            steps_per_epoch=100,
            epochs=self.TRAIN_EPOCHS,
            validation_data=validation_generator,
            validation_steps=50)
        self.plot(history)
        self.verPlus()
        self.model=model
        self.model.save('model/MobileNet_ver{}.h5'.format(str(self.lastVer)))

        # self.plot(history) for debug



if __name__=="__main__":
    i=0


