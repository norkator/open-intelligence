from argparse import ArgumentParser
import tensorflow as tf
from tensorflow import keras
import numpy as np
import cv2
import os

parser = ArgumentParser()
parser.add_argument('--image_dir', type=str, help='Directory where images are kept.')
parser.add_argument('--output_dir', type=str, help='Directory where to output high res images.')

# Model path
model_path_file_name = os.getcwd() + '/libraries/fast_srgan/models/generator.h5'

# Set Keras TensorFlow session config
config = tf.compat.v1.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction = 0.4
config.gpu_options.allow_growth = True
tf_session = tf.compat.v1.Session(config=config)
tf.compat.v1.keras.backend.set_session(tf_session)


def process_super_resolution_images(sr_image_objects):
    # Load model to memory
    # Change model input shape to accept all size inputs
    model = keras.models.load_model(model_path_file_name, compile=False)
    inputs = keras.Input((None, None, 3))
    output = model(inputs)
    model = keras.models.Model(inputs, output)

    # Loop over all images
    # Input and output image is full path + filename including extension
    for sr_image_object in sr_image_objects:
        # print(sr_image_object.output_image)
        print('Processing file: ' + os.path.basename(sr_image_object.input_image))

        # We may not have image available at all, pass
        try:
            # Read image
            low_res = cv2.imread(sr_image_object.input_image, 1)

            # Get image size details
            original_h, original_w, original_c = low_res.shape
            print('Sr processing img size: ' + str(original_h) + ':' + str(original_w))

            # Check if image is not too big
            if original_w < 1200 and original_h < 1200:
                # Convert to RGB (opencv uses BGR as default)
                low_res = cv2.cvtColor(low_res, cv2.COLOR_BGR2RGB)

                # Rescale to 0-1.
                low_res = low_res / 255.0

                # Get super resolution image
                sr = model.predict(np.expand_dims(low_res, axis=0))[0]

                # Rescale values in range 0-255
                sr = ((sr + 1) / 2.) * 255

                # Convert back to BGR for opencv
                sr = cv2.cvtColor(sr, cv2.COLOR_RGB2BGR)

                # Save the results:
                cv2.imwrite(sr_image_object.output_image, sr)

                # Save sr image data to object
                sr_image_object.set_sr_image_data(sr)

                # Clear sr object
                sr = None
            else:
                # Save original image
                sr_image_object.set_sr_image_data(low_res)

        except Exception as e:
            print(e)

    # Clear model
    model = None

    return sr_image_objects
