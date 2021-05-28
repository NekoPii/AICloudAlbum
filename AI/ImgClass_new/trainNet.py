import setting
setting.gpu_dynamic_grow()

from tensorflow.keras import layers,models,optimizers,metrics,regularizers
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
from PIL import ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True
tf.keras.backend.set_learning_phase(True)

BATCH_SIZE = 32
IMG_SIZE = (224, 224)
IMG_SHAPE = IMG_SIZE+(3,)
typelist=[]
typesize=[]
base_dir="D:\Entertainment\Entertainment\MechineLearning\Data\pics"
origin_dir="D:\Entertainment\Entertainment\MechineLearning\Data"
train_dir = os.path.join(origin_dir, 'train')
validation_dir = os.path.join(origin_dir, 'validation')
for root, dirs, files in os.walk(base_dir):
    print(root)
    count=0
    for each in files:
        if each.endswith(".jpg"):
            count += 1
    typesize.append(count)
    type=os.path.basename(os.path.normpath(root))
    typelist.append(type)
typelist=typelist[1:]
typesize=typesize[1:]
print(len(typelist))

test_datagen = ImageDataGenerator(
    rescale=1./255,
)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=60,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)
train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=20,
        color_mode='rgb',
        classes=typelist
)

validation_generator = test_datagen.flow_from_directory(
        validation_dir,
        target_size=IMG_SIZE,
        batch_size=20,
        color_mode='rgb',
        classes=typelist
)


def acc_top10(y_true, y_pred):
    return metrics.top_k_categorical_accuracy(y_true, y_pred, k=10)
def acc_top5(y_true, y_pred):
    return metrics.top_k_categorical_accuracy(y_true, y_pred, k=5)

base_learning_rate = 0.0001


conv_base = tf.keras.applications.MobileNetV2(input_shape=IMG_SHAPE,pooling="avg",
                                               include_top=False,
                                               weights='imagenet')
conv_base.summary()
conv_base.trainable=False
model=models.Sequential()
model.add(conv_base)
model.add(layers.Dropout(0.2))
model.add(layers.Flatten())
model.add(layers.Dense(1024,kernel_regularizer=regularizers.l1_l2(l1=0,l2=0),activation='relu'))
model.add(layers.Dense(1024,kernel_regularizer=regularizers.l1_l2(l1=0,l2=0),activation='relu'))
model.add(layers.Dense(512,activation='relu'))
model.add(layers.Dense(units=53,activation='softmax'))

model.compile(loss='categorical_crossentropy',
              optimizer=tf.keras.optimizers.Adam(lr=base_learning_rate),

              metrics=['accuracy',acc_top5,acc_top10])
history = model.fit(
      train_generator,
      steps_per_epoch=100,
      epochs=20,
      validation_data=validation_generator,
      validation_steps=50)


import matplotlib.pyplot as plt

acc = history.history['acc_top10']
val_acc = history.history['val_acc_top10']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(1, len(acc) + 1)

plt.plot(epochs, acc, 'bo', label='Training top10 acc')
plt.plot(epochs, val_acc, 'b', label='Validation top10 acc')
plt.title('Training and validation accuracy')
plt.legend()

plt.figure()

plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validation loss')
plt.title('Training and validation loss')
plt.legend()

plt.show()


#模型收敛后进行微调

conv_base.trainable=True
fine_tune_at = 100
for layer in conv_base.layers[:fine_tune_at]:
  layer.trainable =  False

model.compile(loss='categorical_crossentropy',
              optimizer=tf.keras.optimizers.Adam(lr=base_learning_rate/5),
              metrics=['accuracy'])
model.summary()
historyUP = model.fit(
      train_generator,
      steps_per_epoch=100,
      epochs=40,
      validation_data=validation_generator,
      validation_steps=50)


model.save('MobileNet_ver1.h5')

acc = historyUP.history['accuracy']
val_acc = historyUP.history['val_accuracy']
loss = historyUP.history['loss']
val_loss = historyUP.history['val_loss']

epochs = range(1, len(acc) + 1)

plt.plot(epochs, acc, 'bo', label='Training acc')
plt.plot(epochs, val_acc, 'b', label='Validation acc')
plt.title('UP Training and validation accuracy')
plt.legend()

plt.figure()

plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validation loss')
plt.title('UP Training and validation loss')
plt.legend()

plt.show()