from argparse import ArgumentParser
from tensorflow import keras
import numpy as np
import cv2
import os

parser = ArgumentParser()
parser.add_argument('--image_dir', type=str, help='Directory where images are kept.')
parser.add_argument('--output_dir', type=str, help='Directory where to output high res images.')


def main(image_dir, output_dir, model_path_file_name):
    # Get all image paths
    image_paths = [os.path.join(image_dir, x) for x in os.listdir(image_dir)]

    # Change model input shape to accept all size inputs
    model = keras.models.load_model(model_path_file_name, compile=False)
    inputs = keras.Input((None, None, 3))
    output = model(inputs)
    model = keras.models.Model(inputs, output)

    # Loop over all images
    for image_path in image_paths:
        # Read image
        low_res = cv2.imread(image_path, 1)

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
        cv2.imwrite(os.path.join(output_dir, os.path.basename(image_path)), sr)


if __name__ == '__main__':
    args = parser.parse_args()
    model_path = 'models/generator.h5'
    main(args.image_dir, args.output_dir, model_path)


def process_super_resolution_images(model_path_file_name, sr_image_objects):
    # Change model input shape to accept all size inputs
    model = keras.models.load_model(model_path_file_name, compile=False)
    inputs = keras.Input((None, None, 3))
    output = model(inputs)
    model = keras.models.Model(inputs, output)

    # Loop over all images
    # Input and output image is full path + filename including extension
    for sr_image_object in sr_image_objects:
        # print(sr_image_object.output_image)
        # print(os.path.basename(sr_image_object.input_image))

        # We may not have image available at all, pass
        try:
            # Read image
            low_res = cv2.imread(sr_image_object.input_image, 1)

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

        except Exception as e:
            pass

    return sr_image_objects
