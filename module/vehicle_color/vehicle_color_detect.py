import numpy as np
import cv2
from keras.models import load_model
from keras.optimizers import SGD
import os

labels = ['black', 'blue', 'brown', 'green', 'pink', 'red', 'silver', 'white', 'yellow']


def detect_color(input_image_path_label_file_name):
    # init of keras model for color recognition
    sgd = SGD(lr=1e-3, decay=1e-6, momentum=0.9, nesterov=True)
    model = load_model(os.getcwd() + '/models/color_weights.hdf5')
    model.compile(optimizer=sgd, loss='categorical_crossentropy', metrics=['accuracy'])

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
