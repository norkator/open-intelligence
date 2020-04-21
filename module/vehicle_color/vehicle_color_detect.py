import numpy as np
import cv2
from keras.models import load_model
import tensorflow as tf
from module import fileutils
import os

labels = ['black', 'blue', 'brown', 'green', 'pink', 'red', 'silver', 'white', 'yellow']

# Set Keras TensorFlow session config
config = tf.compat.v1.ConfigProto()
config.gpu_options.allow_growth = True
tf_session = tf.compat.v1.Session(config=config)
tf.compat.v1.keras.backend.set_session(tf_session)


def detect_color(input_image_path_label_file_name):
    try:
        # init of keras model for color recognition
        model = load_model(os.getcwd() + '/models/color_model.h5')  # color_weights.hdf5

        # Load image
        input_image = cv2.imread(input_image_path_label_file_name)

        # Process image
        img = cv2.resize(input_image, (224, 224))
        x = np.expand_dims(img, axis=0)

        classes = model.predict(x, batch_size=1)
        # noinspection PyTypeChecker
        color_label = labels[np.argmax(classes)]
        print('Detected color: ' + color_label)
        return color_label
    except Exception as e:
        return ''


# For testing
def detect_colors_from_folder(input_image_folder):
    # init of keras model for color recognition
    model = load_model(os.getcwd() + '/models/color_model.h5')  # color_weights.hdf5

    files = fileutils.get_camera_image_names(input_image_folder)

    for file in files:
        # Load image
        input_image = cv2.imread(input_image_folder + file)

        # Process image
        img = cv2.resize(input_image, (224, 224))
        x = np.expand_dims(img, axis=0)

        classes = model.predict(x, batch_size=1)
        # noinspection PyTypeChecker
        color_label = labels[np.argmax(classes)]
        print('Detected color: ' + color_label)
