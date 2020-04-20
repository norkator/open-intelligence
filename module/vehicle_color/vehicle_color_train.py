"""
Origin: https://github.com/Spectra456/Color-Recognition-CNN
Origin author?: https://github.com/beerboaa/Color-Classification-CNN
Based on paper: https://arxiv.org/pdf/1510.07391.pdf
Summary: Modified code to be suitable for OI, later will be able to train with OI gathered data.
Training would happen from UI.
"""
from keras.models import Model
from keras.optimizers import SGD
from keras.layers import BatchNormalization, Lambda, Input, Dense, Convolution2D, MaxPooling2D, Dropout, Flatten
from keras.layers.merge import Concatenate
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import ModelCheckpoint, TensorBoard
from pathlib import Path
import math
import os

# Paths
logs_path = os.getcwd() + '/logs'
train_plugins_profile_path = os.getcwd() + '/logs/train/plugins/profile/'


def color_net(num_classes):
    # placeholder for input image
    input_image = Input(shape=(224, 224, 3))
    # ============================================= TOP BRANCH ===================================================
    # first top convolution layer
    top_conv1 = Convolution2D(filters=48, kernel_size=(11, 11), strides=(4, 4),
                              input_shape=(224, 224, 3), activation='relu')(input_image)
    top_conv1 = BatchNormalization()(top_conv1)
    top_conv1 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(top_conv1)

    # second top convolution layer
    # split feature map by half
    top_top_conv2 = Lambda(lambda x: x[:, :, :, :24])(top_conv1)
    top_bot_conv2 = Lambda(lambda x: x[:, :, :, 24:])(top_conv1)

    top_top_conv2 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_top_conv2)
    top_top_conv2 = BatchNormalization()(top_top_conv2)
    top_top_conv2 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(top_top_conv2)

    top_bot_conv2 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_bot_conv2)
    top_bot_conv2 = BatchNormalization()(top_bot_conv2)
    top_bot_conv2 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(top_bot_conv2)

    # third top convolution layer
    # concat 2 feature map
    top_conv3 = Concatenate()([top_top_conv2, top_bot_conv2])
    top_conv3 = Convolution2D(filters=192, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_conv3)

    # fourth top convolution layer
    # split feature map by half
    top_top_conv4 = Lambda(lambda x: x[:, :, :, :96])(top_conv3)
    top_bot_conv4 = Lambda(lambda x: x[:, :, :, 96:])(top_conv3)

    top_top_conv4 = Convolution2D(filters=96, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_top_conv4)
    top_bot_conv4 = Convolution2D(filters=96, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_bot_conv4)

    # fifth top convolution layer
    top_top_conv5 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_top_conv4)
    top_top_conv5 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(top_top_conv5)

    top_bot_conv5 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        top_bot_conv4)
    top_bot_conv5 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(top_bot_conv5)

    # ============================================= TOP BOTTOM ===================================================
    # first bottom convolution layer
    bottom_conv1 = Convolution2D(filters=48, kernel_size=(11, 11), strides=(4, 4),
                                 input_shape=(227, 227, 3), activation='relu')(input_image)
    bottom_conv1 = BatchNormalization()(bottom_conv1)
    bottom_conv1 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(bottom_conv1)

    # second bottom convolution layer
    # split feature map by half
    bottom_top_conv2 = Lambda(lambda x: x[:, :, :, :24])(bottom_conv1)
    bottom_bot_conv2 = Lambda(lambda x: x[:, :, :, 24:])(bottom_conv1)

    bottom_top_conv2 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_top_conv2)
    bottom_top_conv2 = BatchNormalization()(bottom_top_conv2)
    bottom_top_conv2 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(bottom_top_conv2)

    bottom_bot_conv2 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_bot_conv2)
    bottom_bot_conv2 = BatchNormalization()(bottom_bot_conv2)
    bottom_bot_conv2 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(bottom_bot_conv2)

    # third bottom convolution layer
    # concat 2 feature map
    bottom_conv3 = Concatenate()([bottom_top_conv2, bottom_bot_conv2])
    bottom_conv3 = Convolution2D(filters=192, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_conv3)

    # fourth bottom convolution layer
    # split feature map by half
    bottom_top_conv4 = Lambda(lambda x: x[:, :, :, :96])(bottom_conv3)
    bottom_bot_conv4 = Lambda(lambda x: x[:, :, :, 96:])(bottom_conv3)

    bottom_top_conv4 = Convolution2D(filters=96, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_top_conv4)
    bottom_bot_conv4 = Convolution2D(filters=96, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_bot_conv4)

    # fifth bottom convolution layer
    bottom_top_conv5 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_top_conv4)
    bottom_top_conv5 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(bottom_top_conv5)

    bottom_bot_conv5 = Convolution2D(filters=64, kernel_size=(3, 3), strides=(1, 1), activation='relu', padding='same')(
        bottom_bot_conv4)
    bottom_bot_conv5 = MaxPooling2D(pool_size=(3, 3), strides=(2, 2))(bottom_bot_conv5)

    # ======================================== CONCATENATE TOP AND BOTTOM BRANCH =================================
    conv_output = Concatenate()([top_top_conv5, top_bot_conv5, bottom_top_conv5, bottom_bot_conv5])

    # Flatten
    flatten = Flatten()(conv_output)

    # Fully-connected layer
    FC_1 = Dense(units=4096, activation='relu')(flatten)
    FC_1 = Dropout(0.6)(FC_1)
    FC_2 = Dense(units=4096, activation='relu')(FC_1)
    FC_2 = Dropout(0.6)(FC_2)
    output = Dense(units=num_classes, activation='softmax')(FC_2)

    model = Model(inputs=input_image, outputs=output)
    # Note: lr => learning rate
    sgd = SGD(lr=1e-3, decay=1e-6, momentum=0.9, nesterov=True)
    # sgd = SGD(lr=0.01, momentum=0.9, decay=0.0005, nesterov=True)
    model.compile(optimizer=sgd, loss='categorical_crossentropy', metrics=['accuracy'])

    return model


def train_color_net():
    Path(logs_path).mkdir(parents=True, exist_ok=True)
    Path(train_plugins_profile_path).mkdir(parents=True, exist_ok=True)

    img_rows, img_cols = 224, 224
    num_classes = 9
    batch_size = 48  # Note: (image_x * image_y * 3) * batch_size  => (3 = num. of channels) GPU OOM?
    nb_epoch = 75

    # initialise model
    model = color_net(num_classes)

    filepath = os.getcwd() + '/color_weights.hdf5'
    checkpoint = ModelCheckpoint(filepath, monitor='val_acc', verbose=1, save_best_only=True, mode='max')
    tensor_board = TensorBoard(log_dir='./logs', histogram_freq=0, batch_size=32, write_graph=True, write_grads=False,
                               write_images=False, embeddings_freq=0, embeddings_layer_names=None,
                               embeddings_metadata=None,
                               embeddings_data=None, update_freq='batch')
    callbacks_list = [checkpoint, tensor_board]

    train_datagen = ImageDataGenerator(
        rescale=1. / 255,
        shear_range=0.2,
        zoom_range=0.3,
        horizontal_flip=True,
        dtype='float32')

    test_datagen = ImageDataGenerator(rescale=1. / 255, dtype='float32')

    training_set = train_datagen.flow_from_directory(
        os.getcwd() + '/output/' + 'dataset/train/',
        target_size=(img_rows, img_cols),
        batch_size=batch_size,
        class_mode='categorical')

    test_set = test_datagen.flow_from_directory(
        os.getcwd() + '/output/' + 'dataset/test/',
        target_size=(img_rows, img_cols),
        batch_size=batch_size,
        class_mode='categorical')
    label_map = test_set.class_indices

    print('[INFO] Label map: ' + str(label_map))

    model.fit_generator(
        training_set,
        steps_per_epoch=math.ceil((len(training_set.filenames)) / batch_size),  # Original: 2892
        epochs=nb_epoch,
        validation_data=test_set,
        validation_steps=math.ceil((len(test_set.filenames)) / batch_size),  # Original: 665
        callbacks=callbacks_list)

    model.save('color_model.h5')

    print('[INFO] done!')
