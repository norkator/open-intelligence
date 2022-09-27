"""
Origin: https://github.com/kuba-siekierzynski/CarL-CNN
Model: car_CNN_13AUGM_CMCMCMCMF.h5py ( http://u.42.pl/GEt0_model_weights )
Summary: results not currently suitable for OI
maybe best way to get working would be, brand segmentation, super resolution image from segment
and then feeding it to this model
"""
import os
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers.convolutional import Conv2D, MaxPooling2D
from keras.regularizers import l2
from keras.initializers import VarianceScaling
from PIL import Image
import numpy as np

cars = ['Alfa Romeo', 'Audi', 'BMW', 'Chevrolet', 'Citroen', 'Dacia', 'Daewoo', 'Dodge',
        'Ferrari', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 'Lada',
        'Lancia', 'Land Rover', 'Lexus', 'Maserati', 'Mazda', 'Mercedes', 'Mitsubishi',
        'Nissan', 'Opel', 'Peugeot', 'Porsche', 'Renault', 'Rover', 'Saab', 'Seat',
        'Skoda', 'Subaru', 'Suzuki', 'Tata', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo']

img_x = 50
img_y = 50
n_channels = 3


def image_convert(n, i):
    im_ex = i.reshape(n, img_x, img_y, 3)
    im_ex = im_ex.astype('float32') / 255
    im_ex = np.subtract(im_ex, 0.5)
    im_ex = np.multiply(im_ex, 2.0)
    return im_ex


def detect_vehicle_brand():
    model = Sequential()
    model.add(Conv2D(32, (3, 3),
                     input_shape=(img_x, img_y, n_channels),
                     padding='valid',
                     bias_initializer='glorot_uniform',
                     kernel_regularizer=l2(0.00004),
                     kernel_initializer=VarianceScaling(scale=2.0, mode='fan_in', distribution='normal', seed=None),
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(64, (3, 3),
                     padding='valid',
                     bias_initializer='glorot_uniform',
                     kernel_regularizer=l2(0.00004),
                     kernel_initializer=VarianceScaling(scale=2.0, mode='fan_in', distribution='normal', seed=None),
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(128, (3, 3),
                     padding='valid',
                     bias_initializer='glorot_uniform',
                     kernel_regularizer=l2(0.00004),
                     kernel_initializer=VarianceScaling(scale=2.0, mode='fan_in', distribution='normal', seed=None),
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(256, (3, 3),
                     padding='valid',
                     bias_initializer='glorot_uniform',
                     kernel_regularizer=l2(0.00004),
                     kernel_initializer=VarianceScaling(scale=2.0, mode='fan_in', distribution='normal', seed=None),
                     activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Flatten())

    model.add(Dense(4096, activation='relu', bias_initializer='glorot_uniform'))
    model.add(Dropout(0.5))

    model.add(Dense(4096, activation='relu', bias_initializer='glorot_uniform'))
    model.add(Dropout(0.5))

    # final activation is softmax, tuned to the number of classes/labels possible
    model.add(Dense(len(cars), activation='softmax'))

    model.load_weights(os.getcwd() + '/models/car_CNN_13AUGM_CMCMCMCMF.h5py')

    im = Image.open(os.getcwd() + '/images/test.jpg').convert("RGB")
    new_im = np.array(im.resize((50, 50))).flatten()

    m = int(model.predict_classes(image_convert(1, new_im), verbose=0))

    print('Predicted brand: ' + cars[m])
    return cars[m]
